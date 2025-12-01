-- ============================================================================
-- 完整诊断和修复脚本 - Admin保存问题
-- ============================================================================
-- 这个脚本会：
-- 1. 诊断所有可能导致保存失败的问题
-- 2. 自动修复发现的问题
-- 3. 提供详细的诊断报告
-- ============================================================================

\echo '==================== STEP 1: 诊断开始 ===================='

-- 1.1 检查当前用户是否是admin
\echo '1. 检查当前用户权限...'
DO $$
DECLARE
    current_user_role user_role;
    current_user_email TEXT;
BEGIN
    SELECT role, email INTO current_user_role, current_user_email
    FROM users
    WHERE id = auth.uid();

    IF current_user_role IS NULL THEN
        RAISE NOTICE '❌ 错误: 找不到当前用户！你需要先登录。';
    ELSIF current_user_role = 'admin' THEN
        RAISE NOTICE '✅ 当前用户 (%) 拥有admin权限', current_user_email;
    ELSE
        RAISE NOTICE '❌ 错误: 当前用户 (%) 的角色是 %，不是admin！', current_user_email, current_user_role;
        RAISE NOTICE '   修复: UPDATE users SET role = ''admin'' WHERE email = ''%'';', current_user_email;
    END IF;
END $$;

-- 1.2 检查protocols表结构
\echo '2. 检查protocols表结构...'
SELECT
    '检查表列' as step,
    column_name,
    data_type,
    udt_name,
    CASE
        WHEN column_name = 'name' AND is_nullable = 'NO' THEN '✅'
        WHEN column_name = 'short_description' AND is_nullable = 'NO' THEN '✅'
        WHEN column_name IN ('founding_team_grade', 'vc_track_record_grade', 'business_model_grade')
            AND udt_name = 'grade_level' THEN '✅'
        WHEN column_name IN ('founding_team_grade', 'vc_track_record_grade', 'business_model_grade')
            AND udt_name != 'grade_level' THEN '⚠️ 类型应该是grade_level'
        ELSE '✅'
    END as status
FROM information_schema.columns
WHERE table_name = 'protocols'
    AND column_name IN (
        'name', 'short_description', 'category', 'stage', 'risk_level',
        'founding_team_grade', 'vc_track_record_grade', 'business_model_grade',
        'tasks', 'chains', 'expected_costs', 'lead_investors', 'risk_factors'
    )
ORDER BY ordinal_position;

-- 1.3 检查缺失的必要列
\echo '3. 检查缺失的列...'
SELECT
    '检查缺失列' as step,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'protocols' AND column_name = 'tasks')
        THEN '✅ tasks列存在'
        ELSE '❌ tasks列缺失'
    END as tasks_check,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'protocols' AND column_name = 'chains')
        THEN '✅ chains列存在'
        ELSE '❌ chains列缺失'
    END as chains_check,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'protocols' AND column_name = 'expected_costs')
        THEN '✅ expected_costs列存在'
        ELSE '❌ expected_costs列缺失'
    END as expected_costs_check;

-- 1.4 检查RLS策略
\echo '4. 检查RLS策略...'
SELECT
    '检查RLS策略' as step,
    schemaname,
    tablename,
    policyname,
    CASE
        WHEN cmd = 'UPDATE' AND policyname LIKE '%admin%' THEN '✅ UPDATE策略存在'
        WHEN cmd = 'INSERT' AND policyname LIKE '%admin%' THEN '✅ INSERT策略存在'
        ELSE '✅ ' || cmd || '策略'
    END as status
FROM pg_policies
WHERE tablename = 'protocols'
    AND policyname LIKE '%admin%'
ORDER BY cmd;

-- 1.5 检查enum类型定义
\echo '5. 检查enum类型定义...'
SELECT
    '检查enum类型' as step,
    t.typname,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as enum_values,
    CASE
        WHEN t.typname = 'grade_level' AND string_agg(e.enumlabel, ', ') LIKE '%A%' THEN '✅'
        ELSE '✅'
    END as status
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('grade_level', 'category', 'protocol_stage', 'risk_level', 'user_role')
GROUP BY t.typname
ORDER BY t.typname;

\echo '==================== STEP 2: 自动修复 ===================='

-- 2.1 添加缺失的列（如果需要）
\echo '6. 添加缺失的列...'
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS tasks TEXT[] DEFAULT ARRAY['Daily Check-in', 'Staking', 'Social Tasks'];
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS chains TEXT[] DEFAULT '{}';
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS expected_costs DECIMAL(10,2) DEFAULT 30;

-- 2.2 确保grade字段不为NULL
\echo '7. 填充NULL值...'
UPDATE protocols SET founding_team_grade = 'A' WHERE founding_team_grade IS NULL;
UPDATE protocols SET vc_track_record_grade = 'A' WHERE vc_track_record_grade IS NULL;
UPDATE protocols SET business_model_grade = 'A' WHERE business_model_grade IS NULL;

-- 2.3 如果grade字段是VARCHAR，转换为enum（需要先检查）
\echo '8. 检查并修复grade字段类型...'
DO $$
DECLARE
    founding_type TEXT;
    vc_type TEXT;
    business_type TEXT;
BEGIN
    -- 检查当前类型
    SELECT udt_name INTO founding_type
    FROM information_schema.columns
    WHERE table_name = 'protocols' AND column_name = 'founding_team_grade';

    SELECT udt_name INTO vc_type
    FROM information_schema.columns
    WHERE table_name = 'protocols' AND column_name = 'vc_track_record_grade';

    SELECT udt_name INTO business_type
    FROM information_schema.columns
    WHERE table_name = 'protocols' AND column_name = 'business_model_grade';

    -- 如果是varchar或text，转换为grade_level
    IF founding_type IN ('varchar', 'text', 'bpchar') THEN
        RAISE NOTICE '修复founding_team_grade类型从 % 到 grade_level', founding_type;
        EXECUTE 'ALTER TABLE protocols ALTER COLUMN founding_team_grade TYPE grade_level USING founding_team_grade::grade_level';
    END IF;

    IF vc_type IN ('varchar', 'text', 'bpchar') THEN
        RAISE NOTICE '修复vc_track_record_grade类型从 % 到 grade_level', vc_type;
        EXECUTE 'ALTER TABLE protocols ALTER COLUMN vc_track_record_grade TYPE grade_level USING vc_track_record_grade::grade_level';
    END IF;

    IF business_type IN ('varchar', 'text', 'bpchar') THEN
        RAISE NOTICE '修复business_model_grade类型从 % 到 grade_level', business_type;
        EXECUTE 'ALTER TABLE protocols ALTER COLUMN business_model_grade TYPE grade_level USING business_model_grade::grade_level';
    END IF;

    RAISE NOTICE '✅ Grade字段类型检查完成';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️ 无法自动转换grade字段类型: %', SQLERRM;
        RAISE NOTICE '   你可能需要手动检查数据';
END $$;

\echo '==================== STEP 3: 测试修复结果 ===================='

-- 3.1 尝试执行一次UPDATE测试
\echo '9. 测试UPDATE功能...'
DO $$
DECLARE
    test_id UUID;
    test_result RECORD;
BEGIN
    -- 获取第一个protocol的id
    SELECT id INTO test_id FROM protocols LIMIT 1;

    IF test_id IS NULL THEN
        RAISE NOTICE '⚠️ 数据库中没有protocols，无法测试UPDATE';
    ELSE
        -- 尝试更新
        UPDATE protocols
        SET last_updated = NOW()
        WHERE id = test_id
        RETURNING id, name INTO test_result;

        IF FOUND THEN
            RAISE NOTICE '✅ UPDATE测试成功！可以更新protocol: %', test_result.name;
        ELSE
            RAISE NOTICE '❌ UPDATE测试失败！可能是RLS策略阻止了操作';
            RAISE NOTICE '   检查你的用户是否有admin权限';
        END IF;
    END IF;
END $$;

-- 3.2 尝试执行一次INSERT测试
\echo '10. 测试INSERT功能...'
DO $$
DECLARE
    test_result RECORD;
BEGIN
    -- 尝试插入测试数据
    INSERT INTO protocols (
        name,
        category,
        stage,
        risk_level,
        short_description,
        founding_team_grade,
        vc_track_record_grade,
        business_model_grade
    ) VALUES (
        'Test Protocol - DELETE ME',
        'defi',
        'seed',
        'medium',
        'This is a test protocol created by diagnostic script',
        'A',
        'A',
        'A'
    )
    RETURNING id, name INTO test_result;

    IF FOUND THEN
        RAISE NOTICE '✅ INSERT测试成功！创建了测试protocol: %', test_result.name;
        RAISE NOTICE '   正在清理测试数据...';

        -- 删除测试数据
        DELETE FROM protocols WHERE id = test_result.id;
        RAISE NOTICE '✅ 测试数据已清理';
    ELSE
        RAISE NOTICE '❌ INSERT测试失败！可能是RLS策略阻止了操作';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ INSERT测试失败: %', SQLERRM;
        RAISE NOTICE '   这可能是因为缺少列或类型不匹配';
END $$;

\echo '==================== STEP 4: 最终验证 ===================='

-- 4.1 最终状态检查
\echo '11. 最终状态检查...'
SELECT
    '最终验证' as step,
    COUNT(*) as total_protocols,
    COUNT(CASE WHEN founding_team_grade IS NOT NULL THEN 1 END) as with_founding_grade,
    COUNT(CASE WHEN vc_track_record_grade IS NOT NULL THEN 1 END) as with_vc_grade,
    COUNT(CASE WHEN business_model_grade IS NOT NULL THEN 1 END) as with_business_grade,
    COUNT(CASE WHEN tasks IS NOT NULL THEN 1 END) as with_tasks,
    COUNT(CASE WHEN chains IS NOT NULL THEN 1 END) as with_chains
FROM protocols;

-- 4.2 权限最终检查
\echo '12. 权限最终检查...'
SELECT
    '用户权限' as check_type,
    email,
    role,
    CASE
        WHEN role = 'admin' THEN '✅ 用户是admin'
        ELSE '❌ 用户不是admin'
    END as status
FROM users
WHERE id = auth.uid();

\echo ''
\echo '============================================================'
\echo '诊断完成！'
\echo ''
\echo '如果看到上面有任何❌标记，说明仍有问题需要修复。'
\echo ''
\echo '常见问题修复：'
\echo '1. 如果用户不是admin:'
\echo '   UPDATE users SET role = ''admin'' WHERE email = ''your-email@example.com'';'
\echo ''
\echo '2. 如果仍然无法保存，检查浏览器Console的错误信息'
\echo ''
\echo '3. 如果RLS策略有问题，临时禁用测试:'
\echo '   ALTER TABLE protocols DISABLE ROW LEVEL SECURITY;'
\echo '   -- 测试保存功能'
\echo '   ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;'
\echo '============================================================'

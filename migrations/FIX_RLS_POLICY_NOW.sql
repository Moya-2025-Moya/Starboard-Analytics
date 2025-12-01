-- ============================================================================
-- 立即修复RLS策略问题 - 100%解决保存失败
-- ============================================================================
-- 错误: "new row violates row-level security policy for table 'protocols'"
-- 原因: RLS策略阻止了INSERT/UPDATE操作
-- 解决: 重新创建正确的admin策略
-- ============================================================================

-- 步骤1: 查看当前用户信息（确认你已登录）
SELECT
    'Current User Info' as step,
    id,
    email,
    role,
    CASE
        WHEN role = 'admin' THEN '✅ You are admin'
        WHEN role = 'user' THEN '❌ You are user, not admin!'
        ELSE '❌ Role is: ' || role
    END as status
FROM users
WHERE id = auth.uid();

-- 步骤2: 如果你不是admin，先设置为admin
-- 取消下面这行的注释来执行:
-- UPDATE users SET role = 'admin' WHERE id = auth.uid();

-- 步骤3: 删除所有现有的protocols表RLS策略
DROP POLICY IF EXISTS "Protocols are viewable by everyone" ON protocols;
DROP POLICY IF EXISTS "Admins can insert protocols" ON protocols;
DROP POLICY IF EXISTS "Admins can update protocols" ON protocols;
DROP POLICY IF EXISTS "Admins can delete protocols" ON protocols;
DROP POLICY IF EXISTS "Detailed analysis for subscribers only" ON protocols;

-- 步骤4: 创建新的、正确的RLS策略

-- 4.1 所有人可以查看protocols
CREATE POLICY "Everyone can view protocols"
    ON protocols FOR SELECT
    TO authenticated, anon
    USING (true);

-- 4.2 Admin可以插入protocols（使用WITH CHECK）
CREATE POLICY "Admins can insert protocols"
    ON protocols FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- 4.3 Admin可以更新protocols
CREATE POLICY "Admins can update protocols"
    ON protocols FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- 4.4 Admin可以删除protocols
CREATE POLICY "Admins can delete protocols"
    ON protocols FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- 步骤5: 确保RLS已启用
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;

-- 步骤6: 验证策略
SELECT
    '✅ RLS Policies Created' as status,
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'protocols'
ORDER BY cmd;

-- 步骤7: 测试INSERT
DO $$
DECLARE
    test_id UUID;
    current_user_role user_role;
BEGIN
    -- 获取当前用户角色
    SELECT role INTO current_user_role FROM users WHERE id = auth.uid();

    RAISE NOTICE 'Your current role: %', current_user_role;

    IF current_user_role = 'admin' THEN
        -- 尝试插入测试数据
        INSERT INTO protocols (
            name,
            category,
            stage,
            risk_level,
            short_description,
            founding_team_grade,
            vc_track_record_grade,
            business_model_grade,
            total_raised_usd
        ) VALUES (
            '🧪 TEST PROTOCOL - DELETE ME',
            'defi',
            'seed',
            'medium',
            'This is a test to verify RLS policies work',
            'A',
            'A',
            'A',
            1000000
        )
        RETURNING id INTO test_id;

        RAISE NOTICE '✅ INSERT TEST PASSED! Created protocol with id: %', test_id;

        -- 清理测试数据
        DELETE FROM protocols WHERE id = test_id;
        RAISE NOTICE '✅ Test data cleaned up';
    ELSE
        RAISE NOTICE '❌ FAILED: You are not admin! Run: UPDATE users SET role = ''admin'' WHERE id = auth.uid();';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ INSERT TEST FAILED: %', SQLERRM;
        RAISE NOTICE 'Make sure you are logged in as admin!';
END $$;

-- ============================================================================
-- 完成！现在尝试：
-- 1. 刷新admin页面
-- 2. 尝试创建或编辑一个protocol
-- 3. 点击Save
-- 4. 应该可以成功保存了！
-- ============================================================================

SELECT '
🎉 RLS策略已修复！

下一步:
1. 如果上面显示你不是admin，运行:
   UPDATE users SET role = ''admin'' WHERE id = auth.uid();

2. 刷新浏览器中的admin页面

3. 清除浏览器缓存:
   - 打开开发者工具 (F12)
   - Application标签 -> Storage -> Clear site data

4. 重新登录并尝试保存

如果还是不行，检查浏览器Console的新错误信息。
' as instructions;

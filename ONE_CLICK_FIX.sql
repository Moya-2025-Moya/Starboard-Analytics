-- ============================================================================
-- 🚀 一键修复 - 复制全部到Supabase SQL Editor并运行
-- ============================================================================

-- 1️⃣ 设置你为admin（如果还不是）
UPDATE users SET role = 'admin' WHERE id = auth.uid();

-- 2️⃣ 删除所有旧的RLS策略
DROP POLICY IF EXISTS "Protocols are viewable by everyone" ON protocols;
DROP POLICY IF EXISTS "Admins can insert protocols" ON protocols;
DROP POLICY IF EXISTS "Admins can update protocols" ON protocols;
DROP POLICY IF EXISTS "Admins can delete protocols" ON protocols;
DROP POLICY IF EXISTS "Detailed analysis for subscribers only" ON protocols;

-- 3️⃣ 创建新的RLS策略（正确的）
CREATE POLICY "Everyone can view protocols"
    ON protocols FOR SELECT
    TO authenticated, anon
    USING (true);

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

-- 4️⃣ 启用RLS
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;

-- 5️⃣ 添加可能缺失的列
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS tasks TEXT[] DEFAULT ARRAY['Daily Check-in', 'Staking', 'Social Tasks'];
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS chains TEXT[] DEFAULT '{}';
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS expected_costs DECIMAL(10,2) DEFAULT 30;

-- 6️⃣ 验证修复
SELECT
    '✅ FIX COMPLETE!' as status,
    email as your_email,
    role as your_role,
    CASE
        WHEN role = 'admin' THEN '✅ You are now admin - Save should work!'
        ELSE '❌ Role update failed - check permissions'
    END as result
FROM users
WHERE id = auth.uid();

-- ============================================================================
-- 完成！现在：
-- 1. 刷新admin页面 (Ctrl+Shift+R 或 Cmd+Shift+R)
-- 2. 清除浏览器缓存
-- 3. 重新登录
-- 4. 尝试保存 - 应该可以了！
-- ============================================================================

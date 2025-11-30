# 认证问题故障排查指南

## 问题：注册/登录后没有反应，Supabase users表没有更新

### 可能的原因和解决方案

#### 1. 邮箱确认设置问题

**检查步骤**：
1. 进入 Supabase Dashboard
2. 点击 **Authentication** → **Settings** → **Email Auth**
3. 查看 **Email Confirmation** 设置

**解决方案A**：关闭邮箱确认（开发环境推荐）
```
在 Email Auth 设置中:
- 取消勾选 "Enable email confirmations"
- 点击 Save
```

**解决方案B**：保持邮箱确认开启（生产环境推荐）
- 注册后需要检查邮箱
- 点击确认链接后才能登录
- 在开发环境可以在 Supabase Dashboard → Authentication → Users 中手动确认用户

#### 2. 触发器没有创建

**检查触发器是否存在**：
在 Supabase SQL Editor 运行：
```sql
SELECT
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

如果返回空，说明触发器不存在。

**修复方法**：
运行 `migrations/fix_auth_trigger.sql` 文件中的SQL

#### 3. 权限问题

**检查 RLS 策略**：
```sql
-- 查看 users 表的策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';
```

**临时关闭 RLS 用于测试**（仅开发环境）：
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

测试完后记得重新开启：
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

#### 4. 环境变量配置错误

**检查 `.env.local` 文件**：
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**验证方法**：
1. 确认 URL 和 Key 正确
2. 确认没有多余的空格或引号
3. 重启开发服务器

### 调试步骤

#### 1. 查看浏览器控制台

打开浏览器开发者工具（F12），查看：
- Console 标签页的错误信息
- Network 标签页的网络请求

成功的注册应该会看到：
```
Auth response: { data: {...}, error: null }
```

#### 2. 查看 Supabase Dashboard

**检查 Authentication → Users**：
- 新用户应该出现在列表中
- 检查 Email Confirmed 状态

**检查 Table Editor → users**：
- 确认有新记录被创建
- 检查 role 字段是否为 'user'
- 检查 is_subscribed 是否为 false

#### 3. 手动创建测试用户

如果自动创建失败，可以手动创建：

**步骤1**：在 Authentication → Users 创建用户
- 点击 "Add user"
- 输入 Email 和 Password
- Auto Confirm User 打勾

**步骤2**：在 Table Editor → users 添加记录
```sql
INSERT INTO users (id, email, is_subscribed, subscription_tier, role)
VALUES (
    '从 auth.users 中复制的 user id',
    'test@example.com',
    false,
    'free',
    'user'
);
```

### 常见错误信息

#### "User already registered"
- 邮箱已经被使用
- 检查 Authentication → Users
- 删除或使用不同邮箱

#### "Email not confirmed"
- 需要确认邮箱
- 在 Supabase Dashboard 手动确认
- 或关闭邮箱确认功能

#### "Invalid login credentials"
- 密码错误
- 用户不存在
- 邮箱未确认

### 成功指标

注册成功后应该看到：
- ✅ 浏览器控制台显示 "Auth response" 日志
- ✅ 成功消息：Account created! Please check your email...
- ✅ Supabase Authentication → Users 中有新用户
- ✅ Supabase Table Editor → users 中有新记录
- ✅ 用户可以登录

### 快速修复脚本

在 Supabase SQL Editor 运行：

```sql
-- 1. 确保触发器函数存在
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, is_subscribed, subscription_tier, role, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        false,
        'free',
        'user',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 确保触发器存在
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. 为已存在的 auth.users 创建 users 记录
INSERT INTO public.users (id, email, is_subscribed, subscription_tier, role, created_at, updated_at)
SELECT
    id,
    email,
    false,
    'free',
    'user',
    created_at,
    NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- 4. 验证
SELECT
    a.email AS auth_email,
    u.email AS users_email,
    u.role,
    u.is_subscribed
FROM auth.users a
LEFT JOIN public.users u ON a.id = u.id;
```

### 联系支持

如果以上方法都无效：
1. 检查 Supabase 项目日志（Settings → Logs）
2. 查看 Next.js 开发服务器终端输出
3. 提供错误截图和日志

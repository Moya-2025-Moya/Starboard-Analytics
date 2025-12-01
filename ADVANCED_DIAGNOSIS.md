# 🔬 高级诊断：发现真正的问题

这个指南会帮你发现Save不工作的确切原因。

---

## 🎯 完整诊断流程

### 第1步：检查你的Supabase数据库的确切状态

在Supabase SQL Editor中，**一个一个**运行这些查询。记录每个的结果。

**查询 1.1：列出protocols表的所有列**

```sql
SELECT
    ordinal_position,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'protocols'
ORDER BY ordinal_position;
```

**预期看到：**
- ✅ `founding_team_grade` (character varying)
- ✅ `vc_track_record_grade` (character varying)
- ✅ `business_model_grade` (character varying)
- ✅ `total_raised_usd` (bigint)
- ✅ 其他协议字段

**如果缺少grade列：** → 你的数据库没有更新！需要运行 `COMPLETE_FIX.sql`

---

**查询 1.2：检查是否还有旧列**

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'protocols'
AND column_name IN (
    'ranking_score',
    'founding_team_score',
    'vc_track_record_score',
    'business_model_score',
    'airdrop_probability',
    'listed_days'
);
```

**预期结果：** 0行（没有结果）

**如果看到旧列名：** → 迁移不完整！需要运行 `COMPLETE_FIX.sql`

---

**查询 1.3：检查protocols表中的数据**

```sql
SELECT
    id,
    name,
    founding_team_grade,
    vc_track_record_grade,
    business_model_grade,
    created_at
FROM protocols
LIMIT 10;
```

**预期看到：**
- 至少1条协议数据
- grade列有值（A、B、C等）或NULL（需要填充）
- 没有数字分数值

**如果：**
- 看不到任何数据 → 数据库是空的
- grade值都是NULL → 需要填充默认值
- 还能看到数字分数 → 旧列还没删除

---

**查询 1.4：检查RLS策略**

```sql
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'protocols'
ORDER BY policyname;
```

**预期看到这些策略：**
- `Admins can insert protocols`
- `Admins can update protocols`
- `Admins can delete protocols`
- `Protocols are viewable by everyone`

**如果缺少 UPDATE 策略：** → 无法更新！需要创建RLS策略

---

**查询 1.5：检查当前用户角色**

```sql
-- 查看当前登录用户的角色
SELECT
    id,
    email,
    role,
    is_subscribed
FROM users
WHERE email = auth.email()
LIMIT 1;
```

**预期看到：**
- `role = 'admin'` （最重要！）

**如果不是admin：** → 无法更新！需要更新角色：

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

---

### 第2步：测试UPDATE操作

运行这个测试来确认UPDATE权限：

```sql
-- 测试1：简单UPDATE
UPDATE protocols
SET name = name
WHERE id IS NOT NULL
LIMIT 1
RETURNING 'Test 1: Simple UPDATE - SUCCESS' as result;
```

**预期：** `Test 1: Simple UPDATE - SUCCESS`

如果失败，你会看到错误如：
- `violates row-level security policy` → 用户不是admin
- `permission denied` → 没有UPDATE权限

---

```sql
-- 测试2：Grade UPDATE
UPDATE protocols
SET founding_team_grade = 'B'
WHERE id IS NOT NULL
LIMIT 1
RETURNING 'Test 2: Grade UPDATE - SUCCESS' as result;
```

**预期：** `Test 2: Grade UPDATE - SUCCESS`

---

```sql
-- 测试3：多字段UPDATE
UPDATE protocols
SET
  founding_team_grade = 'C',
  vc_track_record_grade = 'B',
  business_model_grade = 'A',
  short_description = short_description
WHERE id IS NOT NULL
LIMIT 1
RETURNING 'Test 3: Multi-field UPDATE - SUCCESS' as result;
```

**预期：** `Test 3: Multi-field UPDATE - SUCCESS`

---

### 第3步：检查代码和数据库的匹配

在你的项目中，打开 `types/index.ts`：

```typescript
export type GradeLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface Protocol {
  // ... 其他字段
  founding_team_grade: GradeLevel
  vc_track_record_grade: GradeLevel
  business_model_grade: GradeLevel
  // ❌ 不应该有：
  // ranking_score: number
  // founding_team_score: number
  // 等等
}
```

**检查：**
- ✅ 有`GradeLevel`类型定义
- ✅ Protocol接口有3个grade字段
- ❌ 没有引用旧的分数字段

---

打开 `components/admin/ProtocolEditor.tsx`：

```typescript
const [formData, setFormData] = useState<Partial<Protocol>>({
  // ...
  founding_team_grade: 'A',
  vc_track_record_grade: 'A',
  business_model_grade: 'A',
  // ❌ 不应该有旧字段
})
```

**检查：**
- ✅ 初始化了3个grade字段
- ❌ 没有初始化旧的分数字段

---

### 第4步：浏览器级别的诊断

1. 打开 http://localhost:3000/admin
2. 按 **F12** 打开DevTools
3. 切换到 **Console** 标签
4. 编辑一个协议，改变Grade字段为"B"
5. 点击Save

**在Console中查看输出。应该看到：**

```
Updating protocol with data: {
  name: "...",
  founding_team_grade: "B",
  vc_track_record_grade: "...",
  business_model_grade: "...",
  // ... 其他字段
}
Update response: [{
  id: "...",
  name: "...",
  founding_team_grade: "B",
  // ... 返回的数据
}]
```

**可能的错误信息：**

| 错误 | 含义 | 解决方案 |
|------|------|--------|
| `column "founding_team_grade" does not exist` | 数据库没有这个列 | 运行 COMPLETE_FIX.sql |
| `violates row-level security policy` | 用户不是admin | 更新用户角色 |
| `violates check constraint` | Grade值无效 | 确保只用A-F |
| `undefined is not an object` | formData有问题 | 检查代码 |

---

## 🔍 诊断决策树

```
开始测试Save
│
├─ 看到成功消息？
│  ├─ 是 → 继续
│  └─ 否 → 查看错误消息，告诉我
│
├─ 刷新页面后改动还在吗？
│  ├─ 是 → ✅ Save工作了！
│  └─ 否 → 数据未被保存 → 继续诊断
│
├─ 运行诊断查询 1.1
│  ├─ 看到grade列 → 继续
│  └─ 看不到 → ❌ 数据库缺少列，运行 COMPLETE_FIX.sql
│
├─ 运行诊断查询 1.4
│  ├─ 有UPDATE策略 → 继续
│  └─ 没有 → ❌ RLS策略缺失，需要重新配置
│
├─ 运行诊断查询 1.5
│  ├─ role = 'admin' → 继续
│  └─ role != 'admin' → ❌ 用户不是admin，更新角色
│
├─ 运行UPDATE测试
│  ├─ 成功 → ❌ 数据库可以更新，问题在代码
│  └─ 失败 → ❌ 数据库不能更新，RLS或权限问题
│
└─ 查看浏览器Console
   ├─ 有错误 → 告诉我错误信息
   └─ 没有错误 → 告诉我Console输出内容
```

---

## 🧪 最终验证脚本

当你觉得已经修复了，运行这个：

```sql
-- 最终验证 - 一次性检查所有内容

WITH checks AS (
  SELECT
    'Column founding_team_grade exists' as check_name,
    CASE WHEN EXISTS(
      SELECT 1 FROM information_schema.columns
      WHERE table_name='protocols' AND column_name='founding_team_grade'
    ) THEN '✅ PASS' ELSE '❌ FAIL' END as result
  UNION ALL
  SELECT
    'Old columns removed',
    CASE WHEN NOT EXISTS(
      SELECT 1 FROM information_schema.columns
      WHERE table_name='protocols' AND column_name IN
        ('ranking_score','founding_team_score','vc_track_record_score',
         'business_model_score','airdrop_probability','listed_days')
    ) THEN '✅ PASS' ELSE '❌ FAIL' END
  UNION ALL
  SELECT
    'Protocols have data',
    CASE WHEN (SELECT COUNT(*) FROM protocols) > 0 THEN '✅ PASS' ELSE '❌ FAIL' END
  UNION ALL
  SELECT
    'Grades are not NULL',
    CASE WHEN (SELECT COUNT(*) FROM protocols WHERE founding_team_grade IS NULL) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
  UNION ALL
  SELECT
    'UPDATE permission works',
    '⏳ Manual test required'
  UNION ALL
  SELECT
    'User is admin',
    CASE WHEN (SELECT role FROM users WHERE email = auth.email()) = 'admin' THEN '✅ PASS' ELSE '❌ FAIL' END
)
SELECT * FROM checks;
```

**所有项都应该是 ✅ PASS**

---

## 📝 诊断报告模板

如果仍然失败，复制这个并告诉我结果：

```
=== 诊断报告 ===

1. Protocols表中有founding_team_grade列吗？
   答：

2. Protocols表中还有ranking_score列吗？
   答：

3. 当前用户的角色是什么？
   答：

4. UPDATE测试成功了吗？
   答：

5. 浏览器Console中看到什么？
   答：

6. 你运行的是哪个修复脚本？
   答：
```

---

## 🚀 完成诊断后

- 如果所有测试都通过 → Save应该正常工作
- 如果有任何失败 → 告诉我失败的具体项目和错误信息

我会帮你100%解决！


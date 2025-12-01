# Supabase数据库诊断指南

这个指南会帮你确认你的Supabase数据库与代码是否完全同步。

## 🔍 完整诊断检查表

### 第1步：检查protocols表的现有字段

在Supabase SQL Editor中运行：

```sql
-- 查看protocols表的所有列
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'protocols'
ORDER BY ordinal_position;
```

**预期结果应该包含：**
- ✅ `founding_team_grade` (character varying or similar)
- ✅ `vc_track_record_grade` (character varying or similar)
- ✅ `business_model_grade` (character varying or similar)
- ✅ `total_raised_usd` (bigint)
- ✅ `lead_investors` (ARRAY)
- ❌ NOT `ranking_score` (如果还有，说明迁移未完全执行)
- ❌ NOT `founding_team_score` (如果还有，说明迁移未完全执行)
- ❌ NOT `vc_track_record_score`
- ❌ NOT `business_model_score`
- ❌ NOT `airdrop_probability`
- ❌ NOT `listed_days`

### 第2步：验证协议数据

运行：

```sql
-- 查看protocols表中的数据样本
SELECT
    id,
    name,
    founding_team_grade,
    vc_track_record_grade,
    business_model_grade,
    total_raised_usd,
    created_at
FROM protocols
LIMIT 5;
```

**预期结果：**
- 应该看到3个示例协议（Aethir Network, Berachain, Initia）
- 每个都有A-F等级值（如'A'、'B'、'C'等）
- 没有NULL值（应该有默认值'A'）

### 第3步：验证RLS策略

运行：

```sql
-- 查看protocols表的RLS策略
SELECT policy_name, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'protocols'
ORDER BY policy_name;
```

**预期结果应该包含：**
- ✅ "Protocols are viewable by everyone" (SELECT)
- ✅ "Admins can insert protocols" (INSERT)
- ✅ "Admins can update protocols" (UPDATE)
- ✅ "Admins can delete protocols" (DELETE)

### 第4步：验证enum类型

运行：

```sql
-- 查看grade_level enum
SELECT enum_range(NULL::grade_level);
```

**预期结果：**
```
{A,B,C,D,E,F}
```

### 第5步：测试UPDATE操作（重要！）

运行：

```sql
-- 测试更新一个协议
UPDATE protocols
SET vc_track_record_grade = 'B', founding_team_grade = 'C'
WHERE name = 'Aethir Network'
RETURNING id, name, founding_team_grade, vc_track_record_grade;
```

**预期结果：**
```
id: (some UUID)
name: Aethir Network
founding_team_grade: C
vc_track_record_grade: B
```

然后运行来验证数据已保存：

```sql
SELECT name, founding_team_grade, vc_track_record_grade
FROM protocols
WHERE name = 'Aethir Network';
```

应该显示更新后的值。

---

## 🚨 如果发现问题

### 问题1：还能看到old score columns (ranking_score, founding_team_score等)

**原因：** 迁移脚本未执行或执行失败

**解决方案：**
1. 在SQL Editor中运行完整的 `migrations/update_protocol_grades.sql`
2. 运行上面的诊断检查来确认

### 问题2：看不到grade columns (founding_team_grade等)

**原因：** 迁移脚本的前半部分（ADD COLUMN）未执行

**解决方案：**
```sql
-- 手动添加缺失的列
ALTER TABLE protocols
ADD COLUMN IF NOT EXISTS founding_team_grade VARCHAR(1) DEFAULT 'A',
ADD COLUMN IF NOT EXISTS vc_track_record_grade VARCHAR(1) DEFAULT 'A',
ADD COLUMN IF NOT EXISTS business_model_grade VARCHAR(1) DEFAULT 'A';

-- 更新NULL值为默认值
UPDATE protocols
SET
  founding_team_grade = 'A',
  vc_track_record_grade = 'A',
  business_model_grade = 'A'
WHERE founding_team_grade IS NULL;
```

### 问题3：grade值全是NULL

**原因：** 列被添加但未填充数据

**解决方案：**
```sql
-- 填充NULL值
UPDATE protocols
SET
  founding_team_grade = COALESCE(founding_team_grade, 'A'),
  vc_track_record_grade = COALESCE(vc_track_record_grade, 'A'),
  business_model_grade = COALESCE(business_model_grade, 'A')
WHERE founding_team_grade IS NULL OR vc_track_record_grade IS NULL OR business_model_grade IS NULL;
```

### 问题4：UPDATE测试失败（"column not found"错误）

**原因：** 代码中某些字段名不正确

**解决方案：**
检查是否有typo。运行诊断第1步确认确切的列名。

### 问题5：RLS策略阻止UPDATE

**错误信息：** "new row violates row-level security policy"

**原因：** 当前登录的用户不是admin

**解决方案：**
1. 确保你使用的是admin账户登录
2. 在Supabase Dashboard的Users标签中验证角色
3. 如果需要，手动更新角色：
```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

---

## ✅ 完全诊断清单

运行以下SQL脚本来一次性验证所有内容：

```sql
-- 综合诊断脚本
-- 1. 检查列
SELECT 'Step 1: Checking columns...' as step;
SELECT COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'protocols'
AND column_name IN ('founding_team_grade', 'vc_track_record_grade', 'business_model_grade');

-- 2. 检查数据
SELECT 'Step 2: Checking data...' as step;
SELECT COUNT(*) as protocol_count,
       COUNT(CASE WHEN founding_team_grade IS NOT NULL THEN 1 END) as grade_filled
FROM protocols;

-- 3. 检查旧列是否已删除
SELECT 'Step 3: Checking old columns removed...' as step;
SELECT COUNT(*) as old_columns_remaining
FROM information_schema.columns
WHERE table_name = 'protocols'
AND column_name IN ('ranking_score', 'founding_team_score', 'vc_track_record_score', 'business_model_score', 'airdrop_probability', 'listed_days');

-- 4. 测试UPDATE
SELECT 'Step 4: Testing UPDATE...' as step;
-- (会输出一个测试协议的更新结果)
```

---

## 🎯 验证Save功能的完整流程

### 步骤A：确保数据库正确

1. 运行所有诊断检查
2. 确认所有列都存在且有正确的数据
3. 运行UPDATE测试脚本

### 步骤B：确保代码与数据库匹配

检查以下内容是否一致：

**文件：** `types/index.ts`
```typescript
export type GradeLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface Protocol {
  founding_team_grade: GradeLevel
  vc_track_record_grade: GradeLevel
  business_model_grade: GradeLevel
  // 不应该有: ranking_score, founding_team_score, 等等
}
```

**文件：** `components/admin/ProtocolEditor.tsx`
```typescript
const [formData, setFormData] = useState<Partial<Protocol>>({
  founding_team_grade: 'A',
  vc_track_record_grade: 'A',
  business_model_grade: 'A',
  // 不应该有: ranking_score等等
})
```

### 步骤C：测试Save功能

1. 打开Admin面板 (http://localhost:3000/admin)
2. 点击编辑一个协议
3. 改变"Founding Team Grade"字段为"B"
4. 改变"VC Track Record Grade"字段为"C"
5. 点击"Save Protocol"
6. 应该看到成功消息
7. **关键测试：** 刷新页面
8. 重新编辑同一个协议
9. **验证：** Grade字段仍然显示B和C ✅

如果最后一步成功，说明Save功能正常工作！

---

## 📊 调试技巧

### 如果Save失败

**检查浏览器Console：**
1. 打开DevTools (F12)
2. 切换到Console标签
3. 重新尝试Save
4. 查看具体的错误消息

**常见错误和含义：**

| 错误 | 原因 | 解决方案 |
|------|------|--------|
| `column "founding_team_grade" does not exist` | 数据库未更新 | 运行迁移脚本 |
| `violates row-level security` | 用户不是admin | 检查用户角色 |
| `violates check constraint` | Grade值无效 | 确保只使用A-F |
| `timeout` | 查询太慢 | 检查Supabase状态 |

### 检查Supabase服务日志

在Supabase Dashboard中：
1. 进入"Logs"部分
2. 选择"Postgres"日志
3. 刷新并重新Save
4. 查看SQL查询日志

---

## 🏁 最终确认

当你完成所有诊断后，填写这个清单：

- [ ] 第1步诊断：protocols表有3个grade列
- [ ] 第2步诊断：有3个示例协议数据
- [ ] 第3步诊断：RLS策略正确
- [ ] 第4步诊断：grade_level enum存在
- [ ] 第5步诊断：UPDATE测试成功
- [ ] 数据库中没有旧的分数列
- [ ] 代码中没有引用旧的分数字段
- [ ] Admin面板可以编辑和Save协议
- [ ] 页面刷新后改动仍然存在

**如果所有项都✅，那么Save功能是100%正常的！**

---

**最后提醒：** 如果一次诊断失败了，停下来并解决它，然后再进行下一项。不要跳过！


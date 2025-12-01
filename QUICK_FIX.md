# 快速修复指南 ⚡

## 问题：协议编辑后保存失败

## 解决方案 (5分钟内完成)

### 步骤 1️⃣: 登录 Supabase

1. 访问 https://supabase.com/dashboard
2. 选择你的项目
3. 在左侧菜单找到 "SQL Editor"

### 步骤 2️⃣: 复制并执行迁移脚本

1. 打开文件：`migrations/update_protocol_grades.sql`
2. 复制全部内容
3. 粘贴到Supabase SQL Editor
4. 点击 "Run" 按钮

### 步骤 3️⃣: 验证修复

1. 回到Starboard Analytics的admin面板
2. 编辑一个协议
3. 改变一个字段（比如改类别）
4. 点击"Save Protocol"
5. **应该看到：** "Protocol saved successfully!"
6. 关闭modal后，刷新页面
7. **验证：** 改动仍然存在 ✅

---

## 如果出现错误

### ❌ Error: "column does not exist"

**原因:** 迁移脚本部分执行失败

**修复:**
1. 重新完整执行 `migrations/update_protocol_grades.sql`
2. 或清空protocols表后重新执行

### ❌ 仍然显示"保存失败"

**检查步骤:**
1. 打开浏览器F12 (DevTools)
2. 切换到"Console"标签
3. 重新尝试保存
4. 查看具体错误信息
5. 参考 `FIX_SUMMARY.md` 中的故障排除表

### ❌ 错误："enum type 'grade_level' does not exist"

**原因:** 完全重建数据库

**修复:**
```sql
-- 在SQL Editor中先删除旧的：
DROP TABLE IF EXISTS protocols CASCADE;
DROP TYPE IF EXISTS grade_level CASCADE;

-- 然后执行：supabase-schema.sql 全部内容
```

---

## 文件位置参考

```
Starboard-Analytics/
├── migrations/
│   └── update_protocol_grades.sql    ← 迁移脚本
├── MIGRATION_INSTRUCTIONS.md         ← 详细说明
├── FIX_SUMMARY.md                    ← 修复原因分析
├── QUICK_FIX.md                      ← 本文件
├── supabase-schema.sql               ← 完整schema（可选）
└── ...
```

---

## 三个选项，选择一个：

### 选项 A (推荐): 保留现有数据

**步骤：**
1. 在Supabase SQL Editor中执行 `migrations/update_protocol_grades.sql`
2. 完成！旧数据会自动转换为等级

**时间：** 1分钟
**风险：** ⭐ 低（自动转换）

---

### 选项 B: 完全重建（新项目）

**步骤：**
1. 在SQL Editor中执行：`supabase-schema.sql`
2. 完成！会插入3个示例协议

**时间：** 2分钟
**风险：** ⭐⭐⭐ 高（清除所有现有数据）

---

### 选项 C: 手动修复（专家用户）

如果你知道SQL：
1. 手动添加3个新的grade列
2. 手动更新数据（或使用转换语句）
3. 手动删除旧的数字分数列

**时间：** 5-10分钟
**风险：** ⭐⭐⭐ 很高

---

## ✅ 修复成功标志

修复完成后，你应该能够：

- ✅ 编辑admin面板中的协议
- ✅ 改变任何字段
- ✅ 点击Save看到成功消息
- ✅ 刷新页面，改动仍然存在
- ✅ 在DetailPanel中看到A-F等级而非数字分数

---

## 🆘 需要帮助？

1. **查看浏览器console**
   - F12 > Console标签 > 重新保存
   - 会显示具体错误

2. **查看Supabase Logs**
   - Supabase Dashboard > Logs
   - 查看"Error"标签页

3. **参考完整文档**
   - `FIX_SUMMARY.md` - 详细原因分析
   - `MIGRATION_INSTRUCTIONS.md` - 详细步骤

---

**最后提示：** 在执行SQL前一定要备份数据！

---

🚀 **现在就修复吧！**

只需5分钟，你的协议编辑就会正常工作。

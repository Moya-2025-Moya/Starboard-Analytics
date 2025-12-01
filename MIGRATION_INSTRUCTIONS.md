# Database Migration Instructions

## Issue Fixed
协议编辑后保存失败 - 数据库schema与代码不同步

## Root Cause
- 代码已更新为使用A-F等级（`founding_team_grade`, `vc_track_record_grade`, `business_model_grade`）
- 但数据库表仍然使用旧的数字分数字段
- Supabase接收新字段但无法保存（字段不存在），显示成功但实际未保存

## 迁移步骤

### 选项1：如果有现有数据需要保留

1. **备份数据** (在Supabase Dashboard中)
   - 在"SQL Editor"中选择所有protocols表数据
   - 导出为CSV或JSON

2. **运行迁移脚本**
   ```bash
   # 在Supabase SQL Editor中运行：
   migrations/update_protocol_grades.sql
   ```

3. **验证迁移**
   - 检查新的等级列是否被正确填充
   - 检查旧数据是否正确转换

### 选项2：从头开始（推荐用于新项目）

1. **删除旧table**
   ```sql
   DROP TABLE IF EXISTS protocols CASCADE;
   ```

2. **运行新的schema**
   ```bash
   # 在Supabase SQL Editor中运行：
   supabase-schema.sql
   ```

3. **插入新数据**
   - 样本数据会自动插入
   - 在admin面板中添加新的协议

## 验证修复

1. 打开管理面板 (`/admin`)
2. 编辑一个协议
3. 修改一个字段（例如改变category）
4. 点击"Save Protocol"按钮
5. 页面应该显示"Protocol saved successfully!"
6. 刷新页面，验证更改已被保存

## 关键变化

### 移除的字段
- `ranking_score` (DECIMAL)
- `founding_team_score` (DECIMAL)
- `vc_track_record_score` (DECIMAL)
- `business_model_score` (DECIMAL)
- `airdrop_probability` (DECIMAL)
- `listed_days` (INTEGER)

### 新增的字段
- `founding_team_grade` (ENUM: A-F)
- `vc_track_record_grade` (ENUM: A-F)
- `business_model_grade` (ENUM: A-F)

## 代码更新

以下文件已更新以支持新的schema：

- ✅ `types/index.ts` - Protocol interface已更新
- ✅ `components/admin/ProtocolEditor.tsx` - 表单字段已更新
- ✅ `components/DetailPanel.tsx` - 显示逻辑已更新
- ✅ `components/ProtocolCard.tsx` - 显示逻辑已更新
- ✅ `components/admin/ProtocolList.tsx` - 表格列已更新
- ✅ `lib/hooks/useProtocols.ts` - 查询排序已更新

## 如果迁移失败

### 常见错误

**Error: column "founding_team_grade" does not exist**
- 原因：迁移脚本未成功运行
- 解决：再次运行迁移脚本或使用Option 2从头开始

**Error: enum type "grade_level" does not exist**
- 原因：enum类型未创建
- 解决：确保首先运行 `CREATE TYPE grade_level AS ENUM...` 命令

**保存仍然失败**
- 检查Supabase RLS策略是否允许admin更新
- 检查浏览器console中的错误消息
- 在Supabase Logs中查看详细的错误信息

## 生产部署

1. 先在开发环境测试迁移
2. 备份生产数据库
3. 在低流量时段运行迁移
4. 逐步验证数据完整性
5. 部署代码更新

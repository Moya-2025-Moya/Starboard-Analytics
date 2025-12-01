# 数据库迁移指南

## 添加新字段到现有数据库

如果你已经有一个运行中的Supabase数据库，需要添加新字段，请按照以下步骤操作：

### 方法1：使用迁移文件（推荐）

1. 打开Supabase Dashboard
2. 进入 **SQL Editor**
3. 打开文件 `migrations/add_chains_field.sql`
4. 复制所有SQL内容
5. 粘贴到SQL Editor并点击 **Run**

### 方法2：手动执行SQL

在Supabase SQL Editor中运行以下命令：

```sql
-- 添加 chains 字段
ALTER TABLE protocols
ADD COLUMN IF NOT EXISTS chains TEXT[] DEFAULT '{}';
```

### 验证迁移

运行以下查询确认字段已添加：

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'protocols'
ORDER BY ordinal_position;
```

你应该看到 `chains` 字段，类型为 `ARRAY`，默认值为 `{}`。

## 新字段列表

以下字段已添加到 `protocols` 表（如果你从头创建数据库，这些都已包含在 `supabase-schema.sql` 中）：

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `expected_costs` | DECIMAL(10,2) | 30 | 预期参与成本（美元） |
| `listed_days` | INTEGER | 3 | 项目上线天数 |
| `tasks` | TEXT[] | ['Daily Check-in', 'Staking', 'Social Tasks'] | 任务列表 |
| `chains` | TEXT[] | {} | 部署的区块链列表 |

## 示例数据

添加字段后，你可以通过Admin面板（`/admin`）编辑现有协议，或使用SQL添加示例数据：

```sql
-- 为现有协议添加chains
UPDATE protocols
SET chains = ARRAY['Ethereum', 'BSC', 'Polygon']
WHERE name = 'Aethir Network';

-- 为现有协议添加tasks
UPDATE protocols
SET tasks = ARRAY['Daily Check-in', 'Staking', 'Social Tasks', 'Referral']
WHERE name = 'Aethir Network';

-- 为现有协议设置expected_costs和listed_days
UPDATE protocols
SET
  expected_costs = 50,
  listed_days = 7
WHERE name = 'Aethir Network';
```

## 完整字段列表

完整的 `protocols` 表结构：

```sql
CREATE TABLE protocols (
    -- 基本信息
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    category category NOT NULL,
    stage protocol_stage NOT NULL,

    -- 风险和评分
    risk_level risk_level NOT NULL,
    ranking_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    founding_team_score DECIMAL(5,2) DEFAULT 0,
    vc_track_record_score DECIMAL(5,2) DEFAULT 0,
    business_model_score DECIMAL(5,2) DEFAULT 0,

    -- 融资信息
    total_raised_usd BIGINT DEFAULT 0,
    lead_investors TEXT[] DEFAULT '{}',

    -- 项目指标
    airdrop_probability DECIMAL(5,2) DEFAULT 0,
    expected_tge_date DATE,

    -- 链接
    website_url TEXT,
    twitter_url TEXT,
    discord_url TEXT,

    -- 描述和分析
    short_description TEXT NOT NULL,
    detailed_analysis TEXT,
    strategy_forecast TEXT,
    entry_strategy TEXT,
    exit_strategy TEXT,
    risk_factors TEXT[],

    -- 其他
    key_metrics JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,

    -- 新增字段（你的设计）
    expected_costs DECIMAL(10,2) DEFAULT 30,
    listed_days INTEGER DEFAULT 3,
    tasks TEXT[] DEFAULT ARRAY['Daily Check-in', 'Staking', 'Social Tasks'],
    chains TEXT[] DEFAULT '{}',

    -- 时间戳
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 回滚（如果需要）

如果需要移除新字段：

```sql
ALTER TABLE protocols DROP COLUMN IF EXISTS chains;
ALTER TABLE protocols DROP COLUMN IF EXISTS tasks;
ALTER TABLE protocols DROP COLUMN IF EXISTS listed_days;
ALTER TABLE protocols DROP COLUMN IF EXISTS expected_costs;
```

⚠️ **警告**：回滚操作会永久删除这些列中的所有数据！

## 常见问题

### Q: 迁移后现有数据会丢失吗？
A: 不会。`ALTER TABLE ADD COLUMN` 操作只会添加新列，不会影响现有数据。

### Q: 新字段的默认值会自动填充吗？
A: 是的。对于现有行，新字段会使用定义的默认值。

### Q: 我需要重启应用吗？
A: 不需要。前端代码已经处理了这些字段可能不存在的情况（使用 `?.` 可选链）。

### Q: 如何批量更新现有协议的chains？
A: 使用SQL更新：
```sql
UPDATE protocols
SET chains = ARRAY['Ethereum', 'BSC']
WHERE id IN (
  SELECT id FROM protocols WHERE chains = '{}'
);
```

---

**创建日期**: 2025-11-30
**最后更新**: 2025-11-30

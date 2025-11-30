# 设计更新 - 基于草图

## 更新内容

根据你提供的草图，我已经完成以下更新：

### 1. 卡片布局 ✅

#### 保留Logo
- 左上角显示项目Logo (如果有logo_url)
- 如果没有Logo URL，显示项目名称首字母
- Logo尺寸：48x48px，圆角

#### 头部布局
```
[Logo] [项目名称]              [网站图标] [Twitter图标]
       [类别]
```

### 2. 卡片信息字段 ✅

根据你的草图，卡片现在包含：

#### 第一行数据（2列网格）
- **Raised** (融资金额): $25.0M
- **Stage** (阶段): Series A

#### 第二行数据（2列网格）
- **Expected Costs** (预期成本): $30
- **Listed For** (上线时长): 3 Days

#### What to do (任务列表)
- Daily Check-in
- Staking
- Social Tasks
- (可通过admin编辑添加更多任务)

#### Lead Investors (领投机构)
- Framework Ventures
- Hashkey Capital
- (显示所有投资者)

### 3. 数据库更新 ✅

新增字段到 `protocols` 表:

```sql
expected_costs DECIMAL(10,2) DEFAULT 30,
listed_days INTEGER DEFAULT 3,
tasks TEXT[] DEFAULT ARRAY['Daily Check-in', 'Staking', 'Social Tasks']
```

### 4. TypeScript类型更新 ✅

```typescript
export interface Protocol {
  // ... 原有字段
  expected_costs?: number      // 预期成本
  listed_days?: number          // 上线天数
  tasks?: string[]              // 任务列表
}
```

### 5. Admin编辑器更新 ✅

新增表单字段：

1. **Logo URL** - 输入项目Logo地址
2. **Expected Costs** - 输入预期成本（美元）
3. **Listed For (Days)** - 输入上线天数
4. **What to do (Tasks)** - 动态添加/删除任务列表

## 如何使用

### 1. 更新数据库

在Supabase SQL Editor中运行更新后的 `supabase-schema.sql`

### 2. 编辑项目

访问 `/admin` 进入管理后台：

1. 选择或创建项目
2. 填写基本信息：
   - Protocol Name (必填)
   - Logo URL (选填 - 留空显示首字母)
   - Category, Stage等
3. 填写指标：
   - Raised: 融资金额
   - Expected Costs: 预期参与成本
   - Listed For: 项目上线天数
4. 添加任务（What to do）：
   - 输入任务名称
   - 点击"Add"添加
   - 点击X删除任务
5. 添加Lead Investors
6. 预览效果后保存

### 3. 卡片展示效果

```
┌─────────────────────────────────┐
│ [A] Aethir Network    [🔗] [🐦] │
│     INFRASTRUCTURE              │
│                                 │
│ Decentralized GPU cloud...      │
│                                 │
│ $ Raised: $25.0M  📅 Stage: A  │
│ $ Expected: $30   📅 Listed: 3 │
│                                 │
│ What to do:                     │
│ [Daily Check-in] [Staking]      │
│ [Social Tasks]                  │
│                                 │
│ Lead Investors:                 │
│ [Framework Ventures]            │
│ [Hashkey Capital]               │
└─────────────────────────────────┘
```

## 与原设计的对应关系

| 草图字段 | 实现字段 | 位置 |
|---------|---------|------|
| Logo + Name | logo_url + name | 左上角 |
| Category | category | 名称下方 |
| 官网/Twitter图标 | website_url / twitter_url | 右上角 |
| Raised $25.0M | total_raised_usd | 第1行左 |
| Stage Series A | stage | 第1行右 |
| Expected Costs $30 | expected_costs | 第2行左 |
| Listed For 3 Days | listed_days | 第2行右 |
| What to do 任务 | tasks[] | 中间区域 |
| Lead Investors | lead_investors[] | 底部 |

## 默认值

如果不填写，系统会使用以下默认值：

- `expected_costs`: 30 (美元)
- `listed_days`: 3 (天)
- `tasks`: ['Daily Check-in', 'Staking', 'Social Tasks']

## 示例数据

```sql
INSERT INTO protocols (
    name,
    logo_url,
    category,
    stage,
    total_raised_usd,
    expected_costs,
    listed_days,
    tasks,
    lead_investors,
    short_description,
    website_url,
    twitter_url
) VALUES (
    'Aethir Network',
    'https://example.com/aethir-logo.png',
    'infrastructure',
    'series-a',
    25000000,
    30,
    3,
    ARRAY['Daily Check-in', 'Staking', 'Social Tasks'],
    ARRAY['Framework Ventures', 'Hashkey Capital'],
    'Decentralized GPU cloud computing infrastructure for AI and gaming',
    'https://aethir.com',
    'https://twitter.com/aethirnetwork'
);
```

## 注意事项

1. **Logo URL**:
   - 支持 https:// 链接
   - 推荐尺寸：256x256px 或更大
   - 格式：PNG, JPG, SVG
   - 留空会显示项目名称首字母

2. **任务列表**:
   - 可以添加任意数量的任务
   - 建议3-5个任务为最佳
   - 任务名称简短清晰

3. **显示优化**:
   - 移动端会自动调整布局
   - 卡片hover效果已优化
   - 所有字段都可在admin编辑

---

**更新日期**: 2025-11-30
**版本**: 2.1 (基于草图设计)

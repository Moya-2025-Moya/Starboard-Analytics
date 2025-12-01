# 项目文件结构说明

## 📂 根目录文件

### 核心文档（必读）
- **README.md** - 项目概览和快速开始
- **使用说明书.md** - 完整中文使用手册（推荐首次阅读）
- **SETUP.md** - 详细设置说明

### 问题修复（重要！）
- **ONE_CLICK_FIX.sql** ⭐ - 一键修复admin保存问题（最常用）
- **QUICK_FIX_GUIDE.md** - 完整故障排除指南

### 数据库
- **supabase-schema.sql** - 完整数据库Schema（首次设置时运行）

## 📁 主要文件夹

### /app
Next.js 14应用目录
```
app/
├── admin/
│   └── page.tsx        # Admin管理面板
├── layout.tsx          # 根布局
├── page.tsx            # 首页
└── globals.css         # 全局样式
```

### /components
React组件
```
components/
├── admin/              # Admin专用组件
│   ├── ProtocolEditor.tsx   # 协议编辑器
│   ├── ProtocolList.tsx     # 协议列表
│   ├── DatabaseView.tsx     # 数据库视图
│   └── UserManagement.tsx   # 用户管理
├── ProtocolCard.tsx    # 协议卡片
├── DetailPanel.tsx     # 详情面板
├── Header.tsx          # 导航栏
└── AuthModal.tsx       # 认证模态框
```

### /lib
工具库和Hooks
```
lib/
├── supabase/
│   ├── client.ts       # 客户端Supabase实例
│   └── server.ts       # 服务端Supabase实例
└── hooks/
    ├── useAuth.ts      # 认证Hook
    └── useProtocols.ts # 协议数据Hook
```

### /types
TypeScript类型定义
```
types/
└── index.ts            # 所有类型定义
```

### /migrations
数据库迁移文件
```
migrations/
├── FIX_RLS_POLICY_NOW.sql        # RLS策略修复（详细版）
└── add_role_to_users.sql         # 添加用户角色字段
```

### /docs
文档归档
```
docs/
├── archive/            # 旧版文档
│   ├── CHANGELOG.md
│   ├── CHANGES_SUMMARY.md
│   ├── DATABASE_MIGRATION.md
│   ├── DEPLOYMENT.md
│   └── VERCEL_DEPLOYMENT.md
└── fixes/              # 历史修复记录
    └── SAVE_ISSUE_DIAGNOSTIC.md
```

## 🗑️ 已删除的冗余文件

以下文件已被删除（内容已整合到核心文档）：
- ADMIN_GUIDE.md
- ADVANCED_DIAGNOSIS.md
- AUTH_TROUBLESHOOTING.md
- DATABASE_DIAGNOSTIC.md
- FIX_SUMMARY.md
- GUARANTEED_FIX.md
- IMPLEMENTATION_SUMMARY.md
- MIGRATION_INSTRUCTIONS.md
- QUICK_FIX.md
- START_HERE.md
- migrations/COMPLETE_FIX.sql
- migrations/DIAGNOSE_AND_FIX_SAVE.sql
- migrations/add_chains_field.sql
- migrations/fix_auth_trigger.sql
- migrations/update_protocol_grades.sql

## 📖 推荐阅读顺序

### 首次使用
1. README.md（快速了解项目）
2. 使用说明书.md（详细使用指南）
3. SETUP.md（如果需要部署）

### 遇到问题
1. QUICK_FIX_GUIDE.md（故障排除）
2. ONE_CLICK_FIX.sql（一键修复）

### 开发者
1. README.md（项目结构）
2. /types/index.ts（类型系统）
3. /lib/supabase/client.ts（API调用）
4. supabase-schema.sql（数据库结构）

## 🔍 快速查找

| 我想... | 查看这个文件 |
|---------|-------------|
| 快速开始项目 | README.md |
| 了解详细使用方法 | 使用说明书.md |
| 修复admin保存问题 | ONE_CLICK_FIX.sql |
| 诊断其他问题 | QUICK_FIX_GUIDE.md |
| 设置Supabase | SETUP.md, supabase-schema.sql |
| 了解项目结构 | 本文件 (PROJECT_STRUCTURE.md) |
| 查看数据库Schema | supabase-schema.sql |
| 修改组件 | /components/ |
| 添加新页面 | /app/ |
| 修改类型定义 | /types/index.ts |
| 查看旧文档 | /docs/archive/ |

## 📝 文件命名规范

- **大写.md** - 重要文档（README, SETUP等）
- **小写.md** - 一般文档
- **中文.md** - 中文文档（使用说明书.md）
- **.sql** - SQL脚本
- **.tsx/.ts** - TypeScript/React文件

## 🎯 核心文件（请勿删除）

### 必需
- README.md
- package.json
- .env.local（你自己创建）
- supabase-schema.sql

### 推荐保留
- ONE_CLICK_FIX.sql
- QUICK_FIX_GUIDE.md
- 使用说明书.md
- SETUP.md

### 可选
- docs/（归档，可删除）
- PROJECT_STRUCTURE.md（本文件）

---

**更新日期**: 2025-12-01
**维护者**: Claude Code

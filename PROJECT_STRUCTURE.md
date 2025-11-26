# 项目文件结构完整说明

## 📁 所有创建的文件

### 根目录配置文件
```
starboard-analytics/
├── package.json                # 项目依赖和脚本
├── tsconfig.json              # TypeScript 配置
├── next.config.js             # Next.js 配置
├── tailwind.config.ts         # Tailwind CSS 配置
├── postcss.config.js          # PostCSS 配置
├── .gitignore                 # Git 忽略文件
├── .env.local                 # 环境变量 (需要配置)
├── .env.local.example         # 环境变量示例
└── supabase-schema.sql        # Supabase 数据库 Schema
```

### 文档文件
```
├── README.md                  # 完整项目文档
├── DEPLOYMENT.md             # 详细部署指南 (中文)
├── QUICKSTART.md             # 快速启动指南 (中文)
└── PROJECT_STRUCTURE.md      # 本文件
```

### 应用代码 - app/ 目录
```
app/
├── layout.tsx                # 根布局组件
├── page.tsx                  # 首页 (Dashboard)
└── globals.css              # 全局样式
```

### React 组件 - components/ 目录
```
components/
├── Header.tsx                # 顶部导航栏
├── ProtocolCard.tsx          # 协议卡片组件
├── DetailPanel.tsx           # 协议详情侧边栏
└── AuthModal.tsx             # 登录/注册模态框
```

### 库和工具 - lib/ 目录
```
lib/
├── supabase/
│   ├── client.ts            # 客户端 Supabase 实例
│   └── server.ts            # 服务端 Supabase 实例
└── hooks/
    ├── useProtocols.ts      # 协议数据获取 Hook
    └── useAuth.ts           # 认证 Hook
```

### TypeScript 类型 - types/ 目录
```
types/
└── index.ts                 # 所有类型定义
```

## 🔧 各文件作用详解

### 核心配置文件

**package.json**
- 定义项目依赖
- Next.js, React, Supabase, Tailwind CSS
- Lucide icons, Framer Motion

**tsconfig.json**
- TypeScript 编译配置
- 路径别名 `@/` 指向根目录

**tailwind.config.ts**
- 自定义颜色主题
- 深色背景 (#0A0E1A)
- 主色调: 蓝色 (primary), 绿色 (accent)

**next.config.js**
- Next.js 配置
- 图片域名白名单

**.env.local** ⚠️ 需要配置
```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase密钥
```

### 数据库文件

**supabase-schema.sql**
- 创建 3 个表: protocols, users, subscriptions
- 设置行级安全策略 (RLS)
- 插入 3 个示例协议数据
- 创建自动触发器

表结构:
- `protocols`: 协议信息和分析数据
- `users`: 用户资料和订阅状态
- `subscriptions`: 订阅管理

### 应用页面

**app/layout.tsx**
- 根布局
- 设置 HTML 元数据
- 引入全局样式

**app/page.tsx**
- 主页面/仪表板
- 显示协议列表
- 处理用户交互
- 管理模态框状态

**app/globals.css**
- Tailwind CSS 指令
- 自定义全局样式
- 动画定义
- 滚动条样式

### React 组件

**components/Header.tsx**
输入属性:
- `isSubscribed: boolean` - 用户订阅状态
- `onAuthClick: () => void` - 点击登录按钮回调

显示:
- Logo 和网站名称
- 导航链接
- 订阅/登录按钮

---

**components/ProtocolCard.tsx**
输入属性:
- `protocol: Protocol` - 协议数据
- `onClick: () => void` - 点击卡片回调

显示:
- 协议 Logo 和名称
- 排名分数、风险等级
- 融资金额、阶段
- 空投概率进度条
- 主要投资机构

---

**components/DetailPanel.tsx**
输入属性:
- `protocol: Protocol` - 协议详细数据
- `onClose: () => void` - 关闭面板回调

显示:
- 完整协议分析
- 尽职调查评分
- 进入/退出策略
- 风险因素
- 外部链接

---

**components/AuthModal.tsx**
输入属性:
- `onClose: () => void` - 关闭模态框
- `onSuccess: () => void` - 认证成功回调

功能:
- 登录/注册表单
- Email + 密码认证
- 显示 Premium 功能列表
- 错误处理

### 库和工具

**lib/supabase/client.ts**
- 创建浏览器端 Supabase 客户端
- 启用会话持久化
- 自动令牌刷新

**lib/supabase/server.ts**
- 创建服务器端 Supabase 客户端
- 使用 Service Role Key (谨慎使用)

**lib/hooks/useProtocols.ts**
返回:
- `protocols: Protocol[]` - 协议列表
- `loading: boolean` - 加载状态
- `error: string | null` - 错误信息
- `refetch: () => void` - 重新获取

**lib/hooks/useAuth.ts**
返回:
- `user: User | null` - 当前用户
- `loading: boolean` - 加载状态
- `isSubscribed: boolean` - 订阅状态
- `signIn()` - 登录函数
- `signUp()` - 注册函数
- `signOut()` - 登出函数

### TypeScript 类型

**types/index.ts**

类型定义:
```typescript
Protocol          # 协议完整信息
User              # 用户信息
Subscription      # 订阅信息
RiskLevel         # 'low' | 'medium' | 'high'
ProtocolStage     # 'seed' | 'series-a' | ...
Category          # 'defi' | 'infrastructure' | ...
```

## 🎨 样式系统

### Tailwind 自定义颜色
- `background`: 深色背景 (#0A0E1A)
- `surface`: 卡片背景 (#131824)
- `surface-light`: 浅色卡片 (#1A2030)
- `primary`: 主蓝色 (#3B82F6)
- `accent`: 绿色 (#10B981)
- `accent-orange`: 橙色 (#F59E0B)
- `text`: 主文字 (#E5E7EB)
- `text-secondary`: 次要文字 (#9CA3AF)
- `border`: 边框 (#1F2937)

### 常用工具类
- `glass`: 玻璃态效果 (背景模糊)
- `card-hover`: 卡片悬停效果
- `animate-slide-in`: 滑入动画
- `animate-fade-in`: 淡入动画

## 🔄 数据流

```
用户访问
  ↓
app/page.tsx
  ↓
useProtocols() Hook
  ↓
lib/supabase/client.ts
  ↓
Supabase Database
  ↓
返回协议数据
  ↓
ProtocolCard 组件渲染
  ↓
用户点击卡片
  ↓
检查订阅状态
  ↓
未订阅 → AuthModal
订阅 → DetailPanel
```

## 📦 依赖说明

### 核心框架
- `next`: 14.1.0 - React 框架
- `react`: ^18 - UI 库
- `typescript`: ^5 - 类型系统

### 数据和认证
- `@supabase/supabase-js`: ^2.39.3 - Supabase 客户端
- `@supabase/ssr`: ^0.1.0 - 服务端渲染支持

### UI 和样式
- `tailwindcss`: ^3.3.0 - CSS 框架
- `lucide-react`: ^0.312.0 - 图标库
- `framer-motion`: ^10.18.0 - 动画库 (可选)

## 🚀 npm 脚本

```bash
npm run dev      # 开发服务器 (http://localhost:3000)
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # 代码检查
```

## 🔐 安全性

### 环境变量安全
- `.env.local` 已添加到 `.gitignore`
- 永远不要提交密钥到 Git
- Vercel 部署时单独配置

### Supabase RLS (行级安全)
- 所有人可查看基本协议信息
- 只有订阅用户能看详细分析
- 用户只能访问自己的数据

### 认证
- 使用 Supabase Auth
- Email + 密码认证
- 会话令牌自动刷新

## 📝 后续开发

### 添加新页面
1. 在 `app/` 下创建新文件夹
2. 添加 `page.tsx`
3. Next.js 自动处理路由

### 添加新组件
1. 在 `components/` 创建新文件
2. 导出 React 组件
3. 在页面中导入使用

### 修改数据库
1. 编辑 `supabase-schema.sql`
2. 在 Supabase SQL Editor 运行
3. 更新 TypeScript 类型

### 添加 API 路由
1. 创建 `app/api/your-route/route.ts`
2. 导出 GET/POST 函数
3. 使用 server-side Supabase

## 🎯 总结

所有文件已创建完成!项目结构清晰,代码组织良好。

接下来只需:
1. 配置 Supabase
2. 更新 `.env.local`
3. 运行 `npm run dev`
4. 部署到 Vercel

就可以上线运行了!

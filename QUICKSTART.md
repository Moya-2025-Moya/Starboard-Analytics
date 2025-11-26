# 快速启动指南

## ✅ 项目已创建完成!

所有文件已经生成完毕。现在跟随以下步骤完成设置和部署:

## 📋 下一步操作

### 第一步: 设置 Supabase 数据库

1. **访问 Supabase**: 打开 [supabase.com](https://supabase.com)

2. **创建新项目**:
   - 点击 "New Project"
   - 项目名称: `starboard-analytics`
   - 设置数据库密码 (记住这个密码!)
   - 选择区域 (推荐: Southeast Asia - Singapore)
   - 点击 "Create new project"
   - 等待 2-3 分钟让数据库初始化

3. **运行数据库 Schema**:
   - 在 Supabase Dashboard 左侧,点击 **SQL Editor**
   - 打开本项目的 `supabase-schema.sql` 文件
   - 复制所有 SQL 代码
   - 粘贴到 Supabase SQL Editor
   - 点击 **Run** (或按 Ctrl/Cmd + Enter)
   - 应该看到 "Success. No rows returned"

4. **获取 API 密钥**:
   - 点击左侧 **Project Settings** (齿轮图标)
   - 点击 **API** 标签
   - 复制以下内容:
     - **Project URL**: `https://xxxxxx.supabase.co`
     - **anon public key**: `eyJhbG...` (很长的字符串)

### 第二步: 配置环境变量

编辑 `.env.local` 文件,替换为你的 Supabase 信息:

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
```

### 第三步: 启动开发服务器

```bash
npm run dev
```

打开浏览器访问: [http://localhost:3000](http://localhost:3000)

你应该能看到:
- ✅ 3 个示例协议卡片 (Aethir Network, Berachain, Initia)
- ✅ 排行榜界面
- ✅ 点击协议弹出登录窗口

### 第四步: 测试功能

1. **注册账号**:
   - 点击任意协议卡片
   - 在弹出窗口点击 "Sign Up"
   - 输入邮箱和密码 (至少 6 位)
   - 点击 "Create Account"

2. **设置订阅状态** (临时测试):
   - 进入 Supabase Dashboard
   - 点击 **Table Editor**
   - 选择 `users` 表
   - 找到你注册的用户
   - 双击 `is_subscribed` 列,改为 `true`
   - 保存

3. **查看详细分析**:
   - 刷新网页
   - 重新登录
   - 点击协议卡片
   - 现在应该能看到完整的详细分析面板!

### 第五步: 部署到 Vercel

#### 方法 A: 通过 GitHub (推荐)

1. **推送到 GitHub**:
```bash
git init
git add .
git commit -m "Initial commit - Starboard Analytics"
git branch -M main
git remote add origin https://github.com/你的用户名/starboard-analytics.git
git push -u origin main
```

2. **连接 Vercel**:
   - 访问 [vercel.com](https://vercel.com)
   - 登录/注册
   - 点击 "Add New" → "Project"
   - 导入你的 GitHub 仓库
   - 添加环境变量:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 点击 "Deploy"
   - 等待 2-3 分钟

3. **获取网站链接**:
   - 部署成功后,你会得到一个链接
   - 例如: `https://starboard-analytics.vercel.app`

#### 方法 B: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 添加环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 生产部署
vercel --prod
```

## 🎨 自定义和优化

### 修改颜色主题
编辑 `tailwind.config.ts`:
```typescript
colors: {
  background: '#你的颜色',
  primary: '#你的颜色',
  accent: '#你的颜色',
}
```

### 添加新协议
在 Supabase Dashboard:
1. Table Editor → protocols
2. Insert row
3. 填写协议信息

### 添加协议 Logo
1. 上传图片到 Supabase Storage 或 Cloudinary
2. 复制图片 URL
3. 在协议数据的 `logo_url` 字段填入 URL

## 📁 项目文件说明

```
├── app/
│   ├── globals.css      # 全局样式 (修改这里改样式)
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── components/          # UI 组件
│   ├── Header.tsx       # 顶部导航
│   ├── ProtocolCard.tsx # 协议卡片
│   ├── DetailPanel.tsx  # 详情面板
│   └── AuthModal.tsx    # 登录/注册窗口
├── lib/
│   ├── supabase/        # Supabase 配置
│   └── hooks/           # React Hooks
├── types/               # TypeScript 类型定义
├── supabase-schema.sql  # 数据库表结构
└── .env.local          # 环境变量 (不要提交到 Git!)
```

## ❓ 常见问题

### 看不到协议数据?
- 检查 `.env.local` 配置是否正确
- 确认 Supabase SQL schema 已运行成功
- 检查浏览器控制台是否有错误

### 注册后看不到详细分析?
- 在 Supabase 的 `users` 表中将 `is_subscribed` 设为 `true`

### 部署后样式不对?
- 确保 Vercel 上的环境变量已添加
- 尝试重新部署: `vercel --prod --force`

## 📚 扩展功能建议

- [ ] 集成 Stripe 支付
- [ ] 添加协议搜索和筛选
- [ ] 添加用户个人仪表板
- [ ] 邮件通知功能
- [ ] 协议对比功能
- [ ] 移动端优化

## 🎉 完成!

现在你有了一个完整的 Starboard Analytics 网站!

需要帮助?查看:
- [README.md](./README.md) - 完整文档
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 详细部署指南

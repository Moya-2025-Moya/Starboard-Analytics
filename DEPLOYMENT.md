# 部署指南 (Deployment Guide)

## 步骤 1: Supabase 设置

### 1.1 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 点击 "New Project"
3. 填写项目信息:
   - Name: starboard-analytics
   - Database Password: (保存好这个密码)
   - Region: 选择离你最近的区域
4. 等待数据库创建完成 (大约 2 分钟)

### 1.2 运行数据库 Schema
1. 在 Supabase Dashboard 中,点击左侧 "SQL Editor"
2. 打开项目中的 `supabase-schema.sql` 文件
3. 复制所有内容
4. 粘贴到 SQL Editor 中
5. 点击 "Run" 运行 SQL
6. 确认看到 "Success" 消息

### 1.3 获取 API 密钥
1. 点击左侧 "Project Settings" (齿轮图标)
2. 点击 "API"
3. 复制以下信息:
   - Project URL: `https://xxxxx.supabase.co`
   - anon/public key: `eyJhbG...` (很长的一串)

## 步骤 2: 本地开发设置

### 2.1 安装依赖
```bash
cd "Starboard Analytics"
npm install
```

### 2.2 配置环境变量
1. 编辑 `.env.local` 文件
2. 替换为你的 Supabase 信息:

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
```

### 2.3 运行开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站

## 步骤 3: 部署到 Vercel

### 3.1 方法一: 通过 Vercel Dashboard (推荐)

1. 访问 [vercel.com](https://vercel.com)
2. 登录/注册账号
3. 点击 "Add New" > "Project"
4. 导入你的 Git 仓库 (需要先推送到 GitHub)

   如果还没有推送到 GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/starboard-analytics.git
   git push -u origin main
   ```

5. 在 Vercel 中配置环境变量:
   - 点击 "Environment Variables"
   - 添加:
     - `NEXT_PUBLIC_SUPABASE_URL` = 你的 Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = 你的 anon key
6. 点击 "Deploy"
7. 等待部署完成 (1-2 分钟)
8. 获得你的网站 URL: `https://你的项目名.vercel.app`

### 3.2 方法二: 通过 Vercel CLI

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

## 步骤 4: 验证部署

1. 访问你的 Vercel URL
2. 应该能看到 3 个示例协议 (Aethir Network, Berachain, Initia)
3. 点击任意协议卡片
4. 应该弹出登录/注册窗口
5. 注册一个账号测试

## 添加更多协议数据

### 在 Supabase 中添加:
1. 进入 Supabase Dashboard
2. 点击 "Table Editor"
3. 选择 "protocols" 表
4. 点击 "Insert row"
5. 填写协议信息:
   - name: 协议名称
   - category: defi / infrastructure / gaming 等
   - stage: seed / series-a / series-b / pre-tge / tge
   - risk_level: low / medium / high
   - ranking_score: 0-100
   - total_raised_usd: 融资金额 (美元)
   - lead_investors: ['VC1', 'VC2']
   - short_description: 简短描述
   - detailed_analysis: 详细分析 (Premium内容)
   - 等等...

## 常见问题

### Q: 页面显示 "Loading protocols..." 不消失
A: 检查:
1. `.env.local` 文件中的 Supabase 凭据是否正确
2. Supabase SQL schema 是否成功运行
3. 浏览器控制台是否有错误

### Q: 注册后无法看到详细分析
A: 需要在 Supabase 中手动设置用户为订阅用户:
1. Table Editor > users
2. 找到你的用户
3. 将 `is_subscribed` 设置为 `true`

### Q: 如何更改网站样式?
A: 编辑以下文件:
- 颜色: `tailwind.config.ts`
- 全局样式: `app/globals.css`
- 组件样式: 各个 `.tsx` 文件中的 className

### Q: 如何添加支付功能?
A: 推荐集成 Stripe:
1. 创建 Stripe 账号
2. 安装 `@stripe/stripe-js`
3. 创建支付 API 路由
4. 更新订阅状态到 Supabase

## 下一步优化

- [ ] 添加协议搜索和筛选功能
- [ ] 添加用户仪表板
- [ ] 集成支付系统 (Stripe)
- [ ] 添加邮件通知 (新协议提醒)
- [ ] 添加协议对比功能
- [ ] 移动端优化
- [ ] SEO 优化

## 技术支持

遇到问题?检查以下资源:
- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Vercel 文档](https://vercel.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

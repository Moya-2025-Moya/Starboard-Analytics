# ✅ Starboard Analytics - 部署检查清单

## 📋 立即需要做的事情

### ✅ 第一步: Supabase 设置 (15分钟)

- [ ] 1. 打开 [supabase.com](https://supabase.com) 并登录
- [ ] 2. 点击 "New Project"
- [ ] 3. 填写:
  - 项目名: `starboard-analytics`
  - 数据库密码: `________` (记在这里!)
  - 区域: Southeast Asia (Singapore)
- [ ] 4. 等待项目创建完成 (2-3 分钟)
- [ ] 5. 点击左侧 "SQL Editor"
- [ ] 6. 打开本地的 `supabase-schema.sql` 文件
- [ ] 7. 复制全部内容并粘贴到 SQL Editor
- [ ] 8. 点击 "Run" 运行 SQL
- [ ] 9. 确认看到 "Success" 消息
- [ ] 10. 点击 "Project Settings" → "API"
- [ ] 11. 复制 Project URL: `________________`
- [ ] 12. 复制 anon public key: `________________`

### ✅ 第二步: 配置环境变量 (2分钟)

- [ ] 1. 打开 `.env.local` 文件
- [ ] 2. 替换 `NEXT_PUBLIC_SUPABASE_URL` 为你的 Project URL
- [ ] 3. 替换 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 为你的 anon key
- [ ] 4. 保存文件

### ✅ 第三步: 本地测试 (5分钟)

- [ ] 1. 打开终端,进入项目目录
- [ ] 2. 运行: `npm run dev`
- [ ] 3. 打开浏览器访问: http://localhost:3000
- [ ] 4. 确认看到 3 个协议卡片
- [ ] 5. 点击任意卡片
- [ ] 6. 确认弹出登录窗口
- [ ] 7. 注册一个测试账号
- [ ] 8. 进入 Supabase → Table Editor → users
- [ ] 9. 找到你的用户,设置 `is_subscribed = true`
- [ ] 10. 刷新网页,重新登录
- [ ] 11. 点击协议卡片
- [ ] 12. 确认看到完整的详情面板

### ✅ 第四步: 部署到 Vercel (10分钟)

#### 如果使用 GitHub (推荐):

- [ ] 1. 在 GitHub 创建新仓库 `starboard-analytics`
- [ ] 2. 在本地运行:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/你的用户名/starboard-analytics.git
  git push -u origin main
  ```
- [ ] 3. 访问 [vercel.com](https://vercel.com)
- [ ] 4. 点击 "Add New" → "Project"
- [ ] 5. 导入你的 GitHub 仓库
- [ ] 6. 添加环境变量:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 7. 点击 "Deploy"
- [ ] 8. 等待部署完成
- [ ] 9. 复制部署链接: `________________`
- [ ] 10. 访问链接测试网站

#### 如果使用 Vercel CLI:

- [ ] 1. 安装: `npm install -g vercel`
- [ ] 2. 登录: `vercel login`
- [ ] 3. 部署: `vercel`
- [ ] 4. 添加环境变量:
  ```bash
  vercel env add NEXT_PUBLIC_SUPABASE_URL
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
  ```
- [ ] 5. 生产部署: `vercel --prod`

## 🎉 完成后的验证

- [ ] 网站可以访问
- [ ] 可以看到协议列表
- [ ] 可以注册/登录
- [ ] 订阅用户可以查看详细分析
- [ ] 所有链接正常工作
- [ ] 移动端显示正常

## 📊 添加更多协议数据

- [ ] 进入 Supabase Dashboard
- [ ] Table Editor → protocols
- [ ] Insert row
- [ ] 填写协议信息 (参考示例数据)

## 🎨 可选: 自定义设置

- [ ] 修改颜色主题 (编辑 `tailwind.config.ts`)
- [ ] 上传 Logo 图片到 Supabase Storage
- [ ] 修改网站标题和描述 (编辑 `app/layout.tsx`)
- [ ] 添加 Google Analytics
- [ ] 设置自定义域名

## ⚠️ 重要提醒

- [ ] ✅ `.env.local` 已添加到 `.gitignore` (不会被提交)
- [ ] ✅ 永远不要在代码中硬编码密钥
- [ ] ✅ Vercel 环境变量已单独配置
- [ ] ✅ Supabase RLS 策略已启用

## 📚 有用的链接

- Supabase Dashboard: https://app.supabase.com
- Vercel Dashboard: https://vercel.com/dashboard
- Next.js 文档: https://nextjs.org/docs
- Tailwind CSS 文档: https://tailwindcss.com/docs

## 🆘 遇到问题?

### 看不到协议数据
1. 检查 `.env.local` 是否配置正确
2. 确认 Supabase SQL schema 已运行
3. 查看浏览器控制台错误

### 注册后看不到详情
1. 在 Supabase users 表设置 `is_subscribed = true`

### 部署后样式不对
1. 确认 Vercel 环境变量已添加
2. 重新部署: `vercel --prod --force`

## 📝 下一步优化建议

- [ ] 集成支付系统 (Stripe)
- [ ] 添加协议搜索功能
- [ ] 添加用户仪表板
- [ ] 邮件通知功能
- [ ] SEO 优化
- [ ] 移动端 App

---

## ✨ 恭喜!

完成所有步骤后,你就有了一个完整的 Starboard Analytics 网站!

🚀 现在开始添加更多协议数据,让你的平台变得更有价值!

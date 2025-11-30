# Vercel部署调试指南

## 常见部署错误和解决方案

### 1. 环境变量配置错误

**错误信息**:
```
Error: Missing environment variables
```

**解决方案**:

1. 在Vercel Dashboard中添加环境变量：
   - 进入 Settings → Environment Variables
   - 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. 本地验证：
```bash
cat .env.local
# 应该包含上述两个变量
```

3. 重新部署：
```bash
git push origin main
```

### 2. TypeScript 编译错误

**错误信息**:
```
error TS7006: Parameter 'x' implicitly has an 'any' type
```

**解决方案**:

检查以下文件中的类型注释：

1. **app/page.tsx** - 检查 `maskEmail()` 函数的参数类型
2. **components/AuthModal.tsx** - 检查回调函数参数
3. **components/ProtocolCard.tsx** - 确保所有props都有类型

```bash
# 本地验证build
npm run build

# 如果失败，查看错误信息并修复
```

### 3. 图片优化错误

**错误信息**:
```
Image Optimization Error: Invalid URL
```

**解决方案**:

在 `next.config.js` 中配置允许的图片域名：

```javascript
const nextConfig = {
  images: {
    domains: [
      'your-supabase-project.supabase.co',
      'localhost',
      // 添加任何其他CDN或图片源
    ],
  },
}
```

### 4. Supabase 连接问题

**错误信息**:
```
Failed to fetch from Supabase
```

**解决方案**:

1. 验证环境变量：
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

2. 检查Supabase项目：
   - 项目是否处于"Active"状态
   - API密钥是否有效
   - Row Level Security策略是否正确

3. 测试连接：
```bash
# 在浏览器开发工具中测试
fetch('https://your-project.supabase.co/rest/v1/protocols?limit=1')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### 5. 模块未找到错误

**错误信息**:
```
Module not found: Can't resolve '@/components/Toast'
```

**解决方案**:

1. 检查文件是否存在：
```bash
ls -la components/Toast.tsx
```

2. 检查import路径：
```typescript
// 正确
import { Toast } from '@/components/Toast'

// 错误
import { Toast } from './components/Toast'
```

3. 确保 `tsconfig.json` 的paths配置正确：
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 6. API路由问题

如果使用了API路由，检查：
- API路由文件位置：`app/api/route.ts`
- 方法导出：`export { GET, POST, etc }`
- 正确的请求处理

### 7. 构建时间超时

**解决方案**:

1. 减少包大小：
```bash
# 分析包大小
npm run build

# 检查 .next 文件夹大小
du -sh .next
```

2. 优化dependencies：
   - 移除未使用的包
   - 检查 package.json 中的版本号

3. 在Vercel中增加构建超时时间：
   - 进入 Settings → Build & Development Settings
   - 增加 Build Timeout（最多不超过3600秒）

## 本地验证清单

### 构建验证

```bash
# 1. 清理之前的构建
rm -rf .next node_modules

# 2. 安装依赖
npm install

# 3. 运行构建
npm run build

# 4. 启动生产服务器
npm start

# 5. 测试页面
# 访问 http://localhost:3000
```

### 功能验证

- [ ] 主页加载正常
- [ ] 协议卡片显示正确
- [ ] 登录/注册模态框打开
- [ ] Toast通知显示
- [ ] 网络请求成功（检查DevTools Network）

## Vercel特定配置

### 1. 创建 `vercel.json`

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm ci",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

### 2. 配置环境变量引用

在Vercel Dashboard中：
1. 创建 `.env.local.example` 或 `.env.example`
2. 在Vercel Settings中链接到GitHub环境变量

### 3. Preview部署测试

- 每次PR都会创建Preview部署
- 检查Preview URL是否能正常加载
- 测试与main分支的差异功能

## 部署前检查清单

```bash
# 1. 验证所有文件格式
npm run lint

# 2. 检查TypeScript类型
npm run build

# 3. 本地测试
npm run dev
# 访问 http://localhost:3000

# 4. 验证环境变量
cat .env.local

# 5. 提交所有更改
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 部署后验证

1. **检查Vercel部署日志**:
   - 进入 Vercel Dashboard
   - 点击最新部署
   - 查看 "Logs" 标签页
   - 寻找任何错误或警告

2. **测试部署的应用**:
   - 访问Production URL
   - 测试所有主要功能
   - 检查Network标签页中的API调用

3. **设置监控**:
   - 启用 Vercel Analytics
   - 监控 Core Web Vitals
   - 设置失败告警

## 常见问题

### Q: 为什么本地工作但Vercel上不工作？
A: 通常是环境变量问题。确认：
- 所有必需的环境变量都已添加
- 变量值完全正确（包括protocol和尾部斜杠）
- 已重新部署（不仅仅是redeploy，要推送新代码）

### Q: 如何调试Vercel上的错误？
A:
1. 检查Vercel Logs（实时查看错误）
2. 检查浏览器DevTools（客户端错误）
3. 检查Network标签（API调用失败）
4. 使用 `console.log` 和 Vercel Edge Logs

### Q: 如何从Vercel回滚？
A:
1. 进入Vercel Dashboard
2. 选择要回滚到的部署
3. 点击"Promote to Production"

## 性能优化建议

1. **启用Image Optimization**:
   - 使用 `next/image` 而不是 `<img>`
   - 设置合适的图片尺寸

2. **启用Code Splitting**:
   - Next.js自动进行代码分割
   - 使用动态导入处理大组件：
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

3. **优化包大小**:
   - 移除未使用的依赖
   - 使用Tree-shaking友好的库

4. **启用缓存**:
   - 使用Vercel Edge Caching
   - 配置ISR（Incremental Static Regeneration）

## 联系支持

如果以上步骤都无法解决问题：

1. 收集信息：
   - Vercel部署日志的完整输出
   - package.json和tsconfig.json
   - .env.example（不包含实际密钥）

2. 检查：
   - Vercel Status页面（status.vercel.com）
   - GitHub Actions日志
   - Supabase状态

3. 提交问题：
   - Vercel Support: https://vercel.com/support
   - Supabase Support: https://supabase.com/support

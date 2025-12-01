# Starboard Analytics

> 加密货币空投协议分析平台 | Crypto Airdrop Protocol Analytics Platform

Primary-market coverage platform for early-stage crypto protocols. Track projects from seed fundraising through TGE for maximum airdrop returns.

## 📚 快速导航 Quick Links

- **🚨 Admin保存问题?** → 立即查看 [ONE_CLICK_FIX.sql](ONE_CLICK_FIX.sql)
- **📖 详细指南** → [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md)
- **🇨🇳 中文说明** → [使用说明书.md](使用说明书.md)
- **⚙️ 首次设置** → [SETUP.md](SETUP.md)

## Features

- **Protocol Ranking Dashboard**: Browse and rank early-stage protocols by comprehensive scores
- **Deep Dive Analysis**: Detailed insights on founding teams, VC track records, and business models (Premium)
- **Risk Assessment**: Multi-factor risk analysis for informed decision-making
- **Entry/Exit Strategies**: Actionable farming strategies for each protocol (Premium)
- **Real-time Updates**: Stay ahead with the latest protocol developments
- **Admin Panel**: Full protocol management with WYSIWYG editor

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Vercel
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

#### A. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

#### B. Set Up Database Schema
1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL in the editor
4. This will create all tables, policies, and sample data

#### C. Get Your API Keys
1. Go to Project Settings > API
2. Copy your project URL and anon/public key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel

#### A. Connect to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy
vercel
```

#### B. Configure Environment Variables on Vercel
1. Go to your project on Vercel dashboard
2. Settings > Environment Variables
3. Add the same variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### C. Redeploy
```bash
vercel --prod
```

## Project Structure

```
starboard-analytics/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── ProtocolCard.tsx   # Protocol card component
│   ├── DetailPanel.tsx    # Protocol detail panel
│   └── AuthModal.tsx      # Authentication modal
├── lib/                   # Utilities and hooks
│   ├── supabase/         # Supabase clients
│   │   ├── client.ts     # Client-side Supabase
│   │   └── server.ts     # Server-side Supabase
│   └── hooks/            # Custom React hooks
│       ├── useProtocols.ts
│       └── useAuth.ts
├── types/                 # TypeScript types
│   └── index.ts
├── supabase-schema.sql   # Database schema
└── package.json          # Dependencies
```

## Database Schema

### Tables

- **protocols**: Stores protocol information, analysis, and scores
- **users**: User profiles and subscription status
- **subscriptions**: Subscription management

### Row Level Security (RLS)

- All users can view basic protocol information
- Only premium subscribers can access detailed analysis
- Users can only view/update their own data

## Adding New Protocols

You can add protocols directly in Supabase:

1. Go to Supabase Dashboard > Table Editor > protocols
2. Click "Insert row"
3. Fill in the required fields:
   - name, category, stage, risk_level
   - ranking_score, total_raised_usd, lead_investors
   - short_description, detailed_analysis (premium content)
   - founding_team_score, vc_track_record_score, business_model_score
   - airdrop_probability

## Authentication Flow

1. Users land on the dashboard (free view)
2. Click on a protocol → prompted to subscribe (if not authenticated)
3. Sign up/Sign in with email/password
4. Access premium insights and detailed analysis

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
- `background`: Main background color
- `primary`: Primary brand color
- `accent`: Accent colors for highlights

### Adding Features
- Create new components in `components/`
- Add new pages in `app/`
- Extend database schema in Supabase SQL Editor

## 🚨 Admin保存失败？立即修复！

如果在admin面板无法保存protocol，显示 "new row violates row-level security policy"：

1. 打开 Supabase Dashboard → SQL Editor
2. 复制粘贴 [ONE_CLICK_FIX.sql](ONE_CLICK_FIX.sql) 的所有内容
3. 点击 Run
4. 刷新浏览器页面
5. 完成！

详细诊断：[QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md)

## 📁 项目文档

### 核心文档
- [README.md](README.md) - 本文件，项目概览
- [使用说明书.md](使用说明书.md) - 完整中文使用手册
- [SETUP.md](SETUP.md) - 详细设置说明

### 问题修复
- [ONE_CLICK_FIX.sql](ONE_CLICK_FIX.sql) - 一键修复admin保存问题
- [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md) - 完整故障排除指南
- [migrations/FIX_RLS_POLICY_NOW.sql](migrations/FIX_RLS_POLICY_NOW.sql) - RLS策略修复

### 数据库
- [supabase-schema.sql](supabase-schema.sql) - 完整数据库Schema

### 归档文档
- `docs/archive/` - 旧版文档
- `docs/fixes/` - 历史修复记录

## Support

For issues or questions:
- **Admin无法保存** → 运行 [ONE_CLICK_FIX.sql](ONE_CLICK_FIX.sql)
- **其他问题** → 查看 [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md)
- Supabase文档: [docs.supabase.com](https://supabase.com/docs)
- Next.js文档: [nextjs.org/docs](https://nextjs.org/docs)

## License

MIT

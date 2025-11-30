# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Wait for the database to be provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Run the SQL to create all tables, policies, and triggers

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
- **Project Settings** → **API** in your Supabase dashboard

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 5. Create Your First Admin User

1. Sign up through the website UI at `/` (or your deployed URL)
2. After signing up, go to your Supabase dashboard
3. Navigate to **SQL Editor**
4. Run this query (replace with your email):

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

5. Now you can access the admin panel at `/admin`

### 6. Add Your First Protocol

1. Go to `/admin`
2. Click **"New Protocol"**
3. Fill in the form:
   - Protocol name
   - Category
   - Stage
   - Short description
   - Metrics (scores, raised amount, etc.)
   - Links (website, Twitter)
   - Lead investors
4. Toggle **"Show Preview"** to see how it looks
5. Click **"Save Protocol"**

## What's New in Version 2.0

### Design Updates
- ✨ Digital typography (Orbitron + Space Mono fonts)
- 🎨 Minimalist card design (no logos)
- 🔗 Link icons in card top-right (website, Twitter)
- 📅 Auto-updating "Last Update" date
- 📏 Resizable side panel (drag to adjust width)

### Admin Features
- 📝 Full protocol editor with live preview
- 👥 User management (edit roles, subscriptions)
- 📊 Database statistics dashboard
- 🔒 Role-based access control (admin/user)

### Technical Improvements
- 🗄️ Enhanced database schema with triggers
- 🔐 Row Level Security policies for admins
- ⚡ Auto-updating timestamps
- 🎯 Better type safety with TypeScript

## Project Structure

```
starboard-analytics/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── page.tsx               # Main homepage
│   ├── layout.tsx             # Root layout with fonts
│   └── globals.css            # Global styles
├── components/
│   ├── admin/
│   │   ├── ProtocolEditor.tsx # Protocol create/edit form
│   │   ├── ProtocolList.tsx   # Protocol table view
│   │   ├── DatabaseView.tsx   # Database stats
│   │   └── UserManagement.tsx # User table
│   ├── ProtocolCard.tsx       # Updated card component
│   ├── DetailPanel.tsx        # Resizable side panel
│   ├── Header.tsx
│   └── AuthModal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── hooks/
│       ├── useProtocols.ts
│       └── useAuth.ts
├── types/
│   └── index.ts               # Updated TypeScript types
├── supabase-schema.sql        # Complete database schema
├── ADMIN_GUIDE.md             # Detailed admin documentation
└── SETUP.md                   # This file
```

## Common Issues

### Can't see protocols on homepage

**Check**:
1. Are there any protocols in the database?
2. Run this query in Supabase SQL Editor:
   ```sql
   SELECT * FROM protocols;
   ```
3. If empty, create a protocol in the admin panel

### Can't access admin panel

**Check**:
1. Are you logged in?
2. Is your user role set to 'admin'?
3. Run this query:
   ```sql
   SELECT email, role FROM users WHERE email = 'your-email@example.com';
   ```
4. If role is 'user', update it:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### Last Update date not showing

**Check**:
1. Are there protocols in the database?
2. Do they have `last_updated` timestamps?
3. The date will show once protocols are loaded

### Fonts not loading

**Check**:
1. Fonts are loaded from Google Fonts automatically
2. If offline, fonts will fallback to system fonts
3. Check browser console for errors

## Next Steps

1. ✅ Complete basic setup
2. ✅ Create admin user
3. ✅ Add first protocol
4. 📱 Customize design colors in `tailwind.config.ts`
5. 🚀 Deploy to Vercel (see main README.md)
6. 📊 Add more protocols via admin panel
7. 👥 Manage users and subscriptions

## Support

- **Admin Features**: See [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- **Deployment**: See [README.md](README.md)
- **Supabase Docs**: [docs.supabase.com](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Version**: 2.0
**Last Updated**: 2025-11-30

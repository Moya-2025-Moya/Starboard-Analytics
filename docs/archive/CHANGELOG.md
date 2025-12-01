# Changelog

## Version 2.0 - 2025-11-30

### 🎨 Design Overhaul

#### Typography
- **Added** Orbitron font for headings and titles (digital/tech aesthetic)
- **Added** Space Mono font for metrics and data points
- **Updated** All text styling to use new font hierarchy
- **Enhanced** Visual hierarchy with display fonts for headings

#### Layout & Components
- **Redesigned** Protocol cards with minimalist approach
- **Removed** Project logos from cards for cleaner look
- **Added** Website and Twitter link icons in card top-right corner
- **Updated** Card metrics to use monospace font for better readability
- **Improved** Spacing and padding for more compact design
- **Added** "Last Update" date badge on homepage
- **Enhanced** Card hover effects and transitions

#### Resizable Side Panel
- **Added** Drag-to-resize functionality on detail panel
- **Implemented** 30-70% width constraints
- **Added** Visual resize handle with grip icon
- **Updated** Grid layout to respond to panel state
- **Added** Smooth animations for panel transitions

### 🔧 Admin Panel (NEW)

#### Protocol Management
- **Created** Full-featured protocol editor with form validation
- **Added** Live preview mode for protocols
- **Implemented** Create, Read, Update, Delete operations
- **Added** Rich form with all protocol fields:
  - Basic information (name, category, stage, descriptions)
  - Metrics and scores (ranking, risk, funding, team scores)
  - Links (website, Twitter, Discord)
  - Lead investors (dynamic array)
  - Risk factors (dynamic array)
  - Entry/exit strategies
- **Added** Protocol list view with table layout
- **Implemented** Quick actions (edit, delete, preview)

#### Database Management
- **Created** Database statistics dashboard
- **Added** Real-time counts for protocols, users, subscriptions
- **Implemented** Schema visualization
- **Added** Connection information display
- **Included** Last update timestamps

#### User Management
- **Created** User management interface
- **Added** Inline editing for user details
- **Implemented** Role management (user/admin)
- **Added** Subscription status controls
- **Included** User statistics overview
- **Added** Quick filters and search capabilities

### 🗄️ Database Updates

#### Schema Changes
- **Added** `role` field to users table (user/admin)
- **Added** `updated_at` field to users table
- **Created** Auto-update triggers for `last_updated` fields
- **Added** Row Level Security policies for admin operations
- **Implemented** Admin-only CRUD policies for protocols
- **Added** Admin access to all user and subscription data

#### Security
- **Enhanced** Row Level Security policies
- **Added** Admin role verification for sensitive operations
- **Implemented** Separate policies for admin vs regular users
- **Maintained** Public read access for basic protocol info
- **Protected** Detailed analysis for subscribers only

### 📝 Documentation

- **Created** ADMIN_GUIDE.md - Comprehensive admin documentation
- **Created** SETUP.md - Quick setup instructions
- **Created** CHANGELOG.md - This file
- **Updated** README.md with new features

### 🔄 Auto-Updates

- **Implemented** Automatic `last_updated` timestamp on protocol changes
- **Added** Database triggers for timestamp updates
- **Created** Dynamic last update calculation on homepage
- **Ensured** Real-time reflection of database changes

### 🐛 Bug Fixes

- **Fixed** Panel width calculation for better responsiveness
- **Improved** Mobile layout for protocol cards
- **Enhanced** Type safety across all components
- **Optimized** Database queries for better performance

### 🚀 Performance Improvements

- **Optimized** Font loading with variable fonts
- **Improved** Component re-rendering with proper React hooks
- **Enhanced** Database query efficiency
- **Added** Proper loading states throughout application

---

## Version 1.0 - Initial Release

### Features
- Protocol browsing and filtering
- Detailed protocol analysis
- User authentication
- Subscription system
- Basic admin capabilities
- Responsive design

---

## Migration Guide (v1.0 → v2.0)

### Database Migration

1. **Backup your data** before running any migrations
2. Run the updated `supabase-schema.sql` in your Supabase SQL Editor
3. The new schema will:
   - Add new columns to existing tables
   - Create new indexes
   - Add triggers for auto-updates
   - Create new RLS policies
4. No data will be lost - only schema additions

### Code Updates

If you've customized the codebase:

1. **Typography**: Update any custom fonts in `tailwind.config.ts`
2. **Components**: Review changes to `ProtocolCard.tsx` and `DetailPanel.tsx`
3. **Types**: Check `types/index.ts` for new User fields
4. **Imports**: Ensure all new admin components are accessible

### Environment Variables

No changes required - same env vars as v1.0:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Roadmap

### Planned for v2.1
- [ ] Bulk protocol import/export
- [ ] Advanced filtering and search
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Protocol comparison view

### Under Consideration
- [ ] Dark/light theme toggle
- [ ] Protocol versioning
- [ ] Collaborative editing
- [ ] API for third-party integrations
- [ ] Mobile app

---

**Maintained by**: Starboard Analytics Team
**License**: MIT

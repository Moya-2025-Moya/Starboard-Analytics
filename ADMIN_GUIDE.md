# Starboard Analytics - Admin Guide

## Overview

This guide covers the new admin features and updated design for Starboard Analytics.

## Design Updates

### 1. Typography
- **Display Font**: Orbitron - Used for headings and titles for a futuristic, digital feel
- **Body Font**: Inter - Clean, readable font for body text
- **Monospace Font**: Space Mono - Used for data, metrics, and technical information

### 2. Layout Changes
- **Minimalist Design**: Removed project logos from cards for a cleaner look
- **Compact Layout**: Reduced padding and spacing for more efficient use of space
- **Digital Aesthetic**: Monospaced fonts for metrics and data points

### 3. Card Updates
- **Link Icons**: Official website and Twitter links appear as icons in the top-right corner of each card
- **No Logo**: Cards now feature only the project name without logo imagery
- **Improved Hierarchy**: Better visual separation between different sections

### 4. Resizable Side Panel
- **Dynamic Width**: Click and drag the left edge of the detail panel to resize it (30-70% of screen width)
- **Responsive Grid**: Card grid automatically adjusts when the panel is open
- **Smooth Transitions**: Animated panel opening/closing and resizing

### 5. Auto-Updating Date
- The "Last Update" date on the homepage automatically shows the current date
- In the database, `last_updated` timestamps are automatically updated when protocols are modified

## Admin Panel

### Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. You must be logged in with an admin account
3. If you don't have admin access, you'll be redirected to the homepage

### Creating an Admin User

Run this SQL in your Supabase SQL Editor after a user signs up:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## Admin Features

### 1. Protocol Management

#### Creating a New Protocol

1. Go to **Admin Panel** → **Protocols** tab
2. Click **"New Protocol"** button
3. Fill in the form with protocol details:
   - **Basic Information**: Name, category, stage, descriptions
   - **Metrics & Scores**: Ranking score, risk level, raised amount, team scores
   - **Links**: Website URL, Twitter URL, Discord URL
   - **Lead Investors**: Add investors one by one
   - **Risk Factors**: Add risk factors one by one
   - **Strategy**: Entry and exit strategies
4. Toggle **"Show Preview"** to see how the card will look
5. Click **"Save Protocol"** to publish

#### Editing an Existing Protocol

1. Go to **Admin Panel** → **Protocols** tab
2. Find the protocol in the list
3. Click the **Edit** icon (pencil)
4. Modify any fields
5. Use **"Show Preview"** to verify changes
6. Click **"Save Protocol"** to update

#### Deleting a Protocol

1. While editing a protocol, click the **"Delete"** button at the bottom-left
2. Confirm the deletion
3. The protocol will be permanently removed

### 2. Database View

The Database tab provides:
- **Statistics**: Total protocols, users, and subscriptions
- **Schema Information**: Overview of database tables and fields
- **Connection Details**: Supabase connection information
- **Last Update Times**: When data was last modified

### 3. User Management

#### Viewing Users

The Users tab shows:
- Total users, admins, subscribed users, and premium members
- User table with email, role, subscription status, and join date

#### Editing User Details

1. Find the user in the table
2. Click the **Edit** icon
3. Modify:
   - **Role**: User or Admin
   - **Subscription Tier**: Free or Premium
   - **Subscription Status**: Active or Inactive
4. Click **Save** to apply changes

## Database Schema

### Updated Tables

#### `protocols`
- All existing fields
- `last_updated` automatically updates on modification (trigger)

#### `users`
- Added `role` field: 'user' or 'admin'
- Added `updated_at` field with auto-update trigger

#### `subscriptions`
- No changes (existing structure maintained)

### Row Level Security (RLS)

New policies added:
- **Admins can insert protocols**: Only admin users can create protocols
- **Admins can update protocols**: Only admin users can modify protocols
- **Admins can delete protocols**: Only admin users can remove protocols
- **Admins can view all users**: Admin users can see all user data
- **Admins can update all users**: Admin users can modify user details
- **Admins can view all subscriptions**: Admin users can see all subscription data

## Features Summary

### ✅ Completed Features

1. ✅ Updated typography to digital/tech style (Orbitron, Space Mono)
2. ✅ Optimized minimalist layout (removed logos from cards)
3. ✅ Added editable link icons (website, Twitter) to card top-right
4. ✅ Implemented auto-updating "Last Update" date
5. ✅ Created resizable side panel (30-70% width, drag to resize)
6. ✅ Built comprehensive admin page
7. ✅ Created preview & edit mode for protocols
8. ✅ Added database management page with stats
9. ✅ Implemented user management system
10. ✅ Updated database schema with admin roles and policies

### Admin Page Components

- **ProtocolEditor**: Full-featured form with preview mode
- **ProtocolList**: Table view of all protocols with quick actions
- **DatabaseView**: Database statistics and schema overview
- **UserManagement**: User table with inline editing

## Environment Setup

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deploying Schema Updates

To apply the updated database schema:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and run the SQL
5. Verify all tables, policies, and triggers were created

## Tips for Content Editing

### Best Practices

1. **Protocol Names**: Use official capitalization
2. **Descriptions**: Keep short descriptions under 100 characters for better card display
3. **Scores**: Use realistic ranges (0-100) for all score fields
4. **Links**: Always include `https://` in URLs
5. **Investors**: Add well-known VCs first (shown on cards)
6. **Risk Factors**: Be specific and actionable

### Preview Before Publishing

Always use the **"Show Preview"** feature to verify:
- Card layout and spacing
- Link icons appear correctly
- Metrics display properly
- Text doesn't overflow

## Troubleshooting

### Can't Access Admin Panel

**Issue**: Redirected to homepage when accessing `/admin`

**Solution**:
1. Verify you're logged in
2. Check your user role in the database:
   ```sql
   SELECT email, role FROM users WHERE email = 'your-email@example.com';
   ```
3. Update role to admin if needed (see "Creating an Admin User" above)

### Links Not Working on Cards

**Issue**: Website/Twitter icons don't appear

**Solution**: Ensure URLs include the protocol (e.g., `https://twitter.com/...` not `twitter.com/...`)

### Preview Not Updating

**Issue**: Preview doesn't reflect form changes

**Solution**: Click "Hide Preview" then "Show Preview" again, or scroll to trigger a re-render

### Can't Resize Side Panel

**Issue**: Resize handle doesn't work

**Solution**: Click and hold the thin vertical line on the left edge of the panel, then drag left/right

## Support

For issues or questions:
- Check the main [README.md](README.md) for setup instructions
- Review Supabase documentation for database questions
- Check browser console for error messages

---

**Last Updated**: 2025-11-30
**Version**: 2.0

# Supabase Setup Guide

This guide will help you set up Supabase for your inventory management application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm/yarn installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: Your project name
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region
4. Click "Create new project" and wait for it to be ready

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. You'll find:
   - **Project URL**: Copy this value
   - **anon public key**: Copy this value

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env` (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=your_actual_project_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

   Example:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Run the SQL Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents of `schema.sql`
5. Paste it into the SQL Editor
6. Click "Run" to execute the SQL

This will create:
- `inventory_items` table
- `stock_transactions` table
- Indexes for better performance
- Row Level Security (RLS) policies
- Helper functions and views

## Step 5: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see two tables:
   - `inventory_items`
   - `stock_transactions`

## Step 6: Install Dependencies (if not already installed)

The project already includes the necessary dependencies:
- `@supabase/supabase-js`
- `@tanstack/react-query`

If you need to install them:
```bash
npm install
```

## Step 7: Start the Development Server

```bash
npm run dev
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure your `.env` file exists in the root directory
- Verify that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Restart your development server after changing `.env` file

### Error: "relation does not exist"
- Make sure you've run the SQL schema in Step 4
- Check that the tables were created in the Table Editor

### RLS Policy Errors
- The default RLS policies allow all operations
- If you need to restrict access, modify the policies in the SQL schema
- For production, consider implementing proper authentication

## Next Steps

- The application is now connected to Supabase
- All inventory operations will be saved to the database
- You can view and manage data through the Supabase dashboard

## Database Schema Overview

### inventory_items
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `category` (VARCHAR)
- `unit` (VARCHAR)
- `current_stock` (DECIMAL)
- `min_stock` (DECIMAL)
- `price` (DECIMAL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### stock_transactions
- `id` (UUID, Primary Key)
- `item_id` (UUID, Foreign Key to inventory_items)
- `item_name` (VARCHAR, denormalized)
- `type` ('in' or 'out')
- `quantity` (DECIMAL)
- `notes` (TEXT)
- `date` (TIMESTAMP)
- `created_by` (VARCHAR)
- `created_at` (TIMESTAMP)



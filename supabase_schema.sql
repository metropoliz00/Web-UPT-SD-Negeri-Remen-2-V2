-- SCHEMA SETUP FOR SUPABASE
-- Run this in your Supabase SQL Editor to set up the necessary tables for UPT SD Negeri Remen 2 Tuban.

-- 1. Create cms_content table
CREATE TABLE IF NOT EXISTS cms_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create stats table (for Visitor Counter)
CREATE TABLE IF NOT EXISTS stats (
  id TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create pendaftaran table (PPDB/SPMB Registrations)
CREATE TABLE IF NOT EXISTS pendaftaran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "studentName" TEXT NOT NULL,
  nisn TEXT,
  nik TEXT NOT NULL,
  "birthPlace" TEXT NOT NULL,
  "birthDate" TEXT NOT NULL,
  "parentName" TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  track TEXT DEFAULT 'Zonasi' NOT NULL,
  "prevSchool" TEXT,
  status TEXT DEFAULT 'Pending' NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create suara_komunitas table (Visitor testimonials)
CREATE TABLE IF NOT EXISTS suara_komunitas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  relation TEXT DEFAULT 'Warga Sekolah' NOT NULL,
  role TEXT DEFAULT 'Umum' NOT NULL,
  content TEXT NOT NULL,
  avatar TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: In Supabase, Row Level Security (RLS) is enabled by default for new tables.
-- To allow the client application to read/write, you should disable RLS, or add policies.
-- Option A: Disable RLS for simple operation (Recommended for AI Studio previews)
ALTER TABLE cms_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE pendaftaran DISABLE ROW LEVEL SECURITY;
ALTER TABLE suara_komunitas DISABLE ROW LEVEL SECURITY;

-- Option B: Or keep RLS enabled and create public policies (Uncomment if preferred):
-- CREATE POLICY "Allow public read" ON cms_content FOR SELECT USING (true);
-- CREATE POLICY "Allow public update" ON cms_content FOR UPDATE USING (true);
-- CREATE POLICY "Allow public insert" ON cms_content FOR INSERT WITH CHECK (true);
-- ...

-- 5. Create agenda table
CREATE TABLE IF NOT EXISTS agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE agenda DISABLE ROW LEVEL SECURITY;

-- 6. Admin Accounts (Simple Username/Password)
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial Admin Account (username: admin, password: admin123)
INSERT INTO admin_accounts (username, password)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

ALTER TABLE admin_accounts DISABLE ROW LEVEL SECURITY;

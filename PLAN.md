# NSS Unit Website — CEG, Anna University
## Complete Build Plan

---

## PHASE 1: Project Setup

### Step 1 — Initialize Next.js 14 Project
```bash
cd NSS_WEBSITE
npx create-next-app@14 nss-website --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd nss-website
```

### Step 2 — Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install swiper
npm install lucide-react
npm install date-fns
npm install react-hot-toast
```

---

## PHASE 2: Supabase Setup

### Step 3 — Create Supabase Project
1. Go to https://supabase.com → New Project
2. Name: `nss-ceg-website`
3. Copy your `Project URL` and `anon public key`

### Step 4 — Run SQL in Supabase SQL Editor
```sql
-- Activities table
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

-- Admin table (simple password auth)
CREATE TABLE admin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Insert default admin
INSERT INTO admin (username, password) VALUES ('nss_admin', 'nss@ceg2024');

-- Enable RLS but allow all for now
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON activities FOR ALL USING (true);
CREATE POLICY "Allow all" ON photos FOR ALL USING (true);
```

### Step 5 — Create Storage Bucket
1. Supabase → Storage → New Bucket
2. Name: `nss-photos`
3. Make it **Public**
4. Add policy: Allow all uploads

---

## PHASE 3: Environment Variables

### Step 6 — Create .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_ADMIN_USERNAME=nss_admin
NEXT_PUBLIC_ADMIN_PASSWORD=nss@ceg2024
```

---

## PHASE 4: File Structure

```
nss-website/
├── app/
│   ├── layout.tsx           ← Root layout (Navbar + Footer + Chatbot)
│   ├── page.tsx             ← Home page
│   ├── activities/
│   │   └── page.tsx         ← Activities listing
│   ├── gallery/
│   │   └── page.tsx         ← Photo gallery (Swiper)
│   └── admin/
│       ├── login/
│       │   └── page.tsx     ← Admin login
│       └── dashboard/
│           └── page.tsx     ← Admin dashboard
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Chatbot.tsx
│   ├── ActivityCard.tsx
│   └── GalleryCarousel.tsx
├── lib/
│   └── supabase.ts
├── types/
│   └── index.ts
└── .env.local
```

---

## PHASE 5: Vercel Deployment

### Step 7 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial NSS website"
git remote add origin your_github_repo_url
git push -u origin main
```

### Step 8 — Deploy on Vercel
1. Go to https://vercel.com → Import Project
2. Select your GitHub repo
3. Add Environment Variables (same as .env.local)
4. Click Deploy ✅

---

## Color Palette
- Primary Green: `#2d6a4f`
- Accent Maroon: `#800020`
- Light Grey: `#f5f5f5`
- Dark Grey: `#333333`
- White: `#ffffff`
- Blue Accent: `#1a4a8a`

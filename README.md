# 🌿 NSS Unit Website — College of Engineering, Guindy

> National Service Scheme · CEG · Anna University, Chennai

Built with **Next.js 14** · **Tailwind CSS** · **Supabase** · **Vercel**

---

## 📁 Project Structure

```
nss-website/
├── app/
│   ├── layout.tsx              ← Root layout (Navbar + Footer + Chatbot)
│   ├── globals.css             ← Global styles + Tailwind
│   ├── page.tsx                ← Home page (Hero, About, Objectives, CTA)
│   ├── activities/
│   │   └── page.tsx            ← Dynamic activities from Supabase
│   ├── gallery/
│   │   └── page.tsx            ← Swiper carousel + masonry grid
│   └── admin/
│       ├── login/
│       │   └── page.tsx        ← Admin login
│       └── dashboard/
│           └── page.tsx        ← Add / delete activities + upload photos
├── components/
│   ├── Navbar.tsx              ← Sticky transparent → solid navbar
│   ├── Footer.tsx              ← Footer with links + contact
│   ├── Chatbot.tsx             ← Rule-based NSS chatbot widget
│   └── ActivityCard.tsx        ← Reusable activity card
├── lib/
│   └── supabase.ts             ← All Supabase queries + storage helpers
├── types/
│   └── index.ts                ← TypeScript interfaces
├── .env.local.example          ← Copy → .env.local and fill in values
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## ⚡ Quick Start (Local Development)

### Step 1 — Copy files into your project

Inside your `NSS_WEBSITE` folder:

```bash
# If you haven't already, create the Next.js app:
npx create-next-app@14 nss-website --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd nss-website
```

Now **copy all the files** provided into this folder, replacing any defaults.

### Step 2 — Install dependencies

```bash
npm install @supabase/supabase-js swiper lucide-react date-fns react-hot-toast
```

### Step 3 — Set up Supabase

#### 3a. Create a Supabase project
1. Go to [https://supabase.com](https://supabase.com) → **New Project**
2. Name it: `nss-ceg-website`
3. Note your **Project URL** and **anon public key** from:
   `Settings → API`

#### 3b. Run this SQL in Supabase SQL Editor
Go to your project → **SQL Editor** → paste and run:

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

-- RLS Policies (allow all for simplicity)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on activities" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on photos" ON photos FOR ALL USING (true) WITH CHECK (true);
```

#### 3c. Create Storage Bucket
1. Supabase → **Storage** → **New Bucket**
2. Name: `nss-photos`
3. Toggle **Public** → ON
4. Go to **Policies** → Add policy → For **All operations**, select **Allow** → Save

### Step 4 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_ADMIN_USERNAME=nss_admin
NEXT_PUBLIC_ADMIN_PASSWORD=nss@ceg2024
```

### Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗂️ Adding Your Images (NSS_WEBSITE/Images folder)

To seed your gallery with existing photos:
1. Log in to Admin → `/admin/login`
2. Create an activity (e.g. "Past Events")
3. Upload your images from the `Images` folder
4. They'll appear in **Gallery** page automatically

---

## 🔐 Admin Access

| Field     | Default Value  |
|-----------|----------------|
| Username  | `nss_admin`    |
| Password  | `nss@ceg2024`  |

> ⚠️ Change these in `.env.local` before deploying!

**URL:** `/admin/login`

Admin can:
- ✅ Add new activity posts (title, description, date)
- ✅ Upload multiple photos per activity
- ✅ Delete activities (photos cascade-delete from DB)
- ✅ View stats (total activities, photos, this year)

---

## 🌐 Deploy on Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "NSS CEG website initial commit"
```

Create a repo on [github.com](https://github.com) then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nss-ceg-website.git
git branch -M main
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [https://vercel.com](https://vercel.com) → **Add New Project**
2. **Import** your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** → add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_USERNAME`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
5. Click **Deploy** ✅

Your site is live in ~2 minutes!

---

## 🤖 Chatbot Topics

The rule-based chatbot on the bottom-right answers:

| Topic | Trigger words |
|---|---|
| Greeting | hi, hello, hey |
| What is NSS | "what is nss", "full form", "about nss" |
| Motto | "motto", "slogan" |
| Objectives | "objective", "goal", "aim" |
| How to join | "volunteer", "join", "enroll" |
| Activities | "activities", "events", "camp" |
| Contact | "contact", "email", "phone" |
| College info | "ceg", "anna university", "guindy" |
| Certificate | "certificate", "benefit", "advantage" |
| Gallery | "gallery", "photo", "image" |
| Farewell | "thank", "bye" |

---

## 🎨 Color Palette

| Name | Hex |
|------|-----|
| NSS Green | `#2d6a4f` |
| Green Light | `#40916c` |
| Maroon | `#800020` |
| Navy Blue | `#1a4a8a` |
| Light Grey | `#f5f7fa` |
| Dark Grey | `#333333` |

---

## 🔧 Troubleshooting

**Images not showing?**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct in `.env.local`
- Ensure the `nss-photos` bucket is set to **Public**
- Verify `next.config.mjs` has the Supabase hostname in `remotePatterns`

**Admin login fails?**
- Make sure `.env.local` has `NEXT_PUBLIC_ADMIN_USERNAME` and `NEXT_PUBLIC_ADMIN_PASSWORD`
- Restart the dev server after editing `.env.local`

**Activities not loading?**
- Check RLS policies in Supabase → both tables should have "Allow all" policy
- Check browser console for Supabase errors

**Swiper not rendering?**
- Make sure `swiper` is installed: `npm install swiper`
- The Gallery page is a Client Component (`'use client'`) — this is required

---

## 📞 Contact

NSS Unit · College of Engineering, Guindy  
Anna University, Chennai – 600 025  
📧 nss@ceg.annauniv.edu  
📱 +91 44 2235 8101

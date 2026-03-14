/**
 * NSS Bulk Image Uploader — Windows-compatible version
 * Uses Node's built-in https module instead of fetch
 */

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── PASTE YOUR VALUES HERE ───────────────────────────────────────────────────
const SUPABASE_URL    = 'YOUR_SUPABASE_URL';        // e.g. https://xxxx.supabase.co
const SUPABASE_KEY    = 'YOUR_SERVICE_ROLE_KEY';    // Settings → API → service_role
const BUCKET          = 'nss-photos';
// ─────────────────────────────────────────────────────────────────────────────

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '../../Images');
const HOST       = new URL(SUPABASE_URL).hostname;

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const MIME = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif' };

// ── Low-level HTTPS helper ────────────────────────────────────────────────────
function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, hostname: HOST, rejectUnauthorized: false }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        resolve({ status: res.statusCode, body: raw });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ── REST helpers ─────────────────────────────────────────────────────────────
function authHeaders(extra = {}) {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    ...extra,
  };
}

async function dbInsert(table, payload) {
  const body = JSON.stringify(payload);
  const res = await httpsRequest({
    path: `/rest/v1/${table}?select=*`,
    method: 'POST',
    headers: {
      ...authHeaders({ 'Content-Type': 'application/json', 'Prefer': 'return=representation' }),
      'Content-Length': Buffer.byteLength(body),
    },
  }, body);

  if (res.status >= 300) throw new Error(`DB error ${res.status}: ${res.body}`);
  return JSON.parse(res.body)[0];
}

async function storageUpload(storagePath, fileBuffer, mimeType) {
  const res = await httpsRequest({
    path: `/storage/v1/object/${BUCKET}/${storagePath}`,
    method: 'POST',
    headers: {
      ...authHeaders({ 'Content-Type': mimeType }),
      'Content-Length': fileBuffer.length,
    },
  }, fileBuffer);

  if (res.status >= 300) throw new Error(`Storage error ${res.status}: ${res.body}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function uploadAll() {
  console.log('\n🌿 NSS Bulk Image Uploader (Windows-compatible)');
  console.log('══════════════════════════════════════\n');

  // Validate config
  if (SUPABASE_URL.includes('YOUR_') || SUPABASE_KEY.includes('YOUR_')) {
    console.error('❌ Please fill in SUPABASE_URL and SUPABASE_KEY at the top of this script!');
    process.exit(1);
  }

  // Quick connectivity test
  process.stdout.write('🔌 Testing connection to Supabase ... ');
  try {
    const test = await httpsRequest({
      path: '/rest/v1/',
      method: 'GET',
      headers: authHeaders(),
    });
    if (test.status === 200 || test.status === 401 || test.status === 400) {
      console.log('✅ Connected!\n');
    } else {
      console.log(`⚠️  Unexpected status ${test.status} — proceeding anyway\n`);
    }
  } catch (e) {
    console.log(`❌ Cannot reach Supabase: ${e.message}`);
    console.log('   Check your SUPABASE_URL and internet connection.\n');
    process.exit(1);
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images folder not found at:\n   ${IMAGES_DIR}\n`);
    process.exit(1);
  }

  const eventFolders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  if (eventFolders.length === 0) {
    console.error('❌ No subfolders found inside Images/');
    process.exit(1);
  }

  console.log(`📁 Found ${eventFolders.length} event folder(s):\n`);
  eventFolders.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
  console.log();

  let totalPhotos = 0, totalEvents = 0;

  for (const folderName of eventFolders) {
    const folderPath = path.join(IMAGES_DIR, folderName);
    const files = fs.readdirSync(folderPath)
      .filter((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));

    if (files.length === 0) {
      console.log(`⚠️  Skipping "${folderName}" — no images found\n`);
      continue;
    }

    console.log(`\n📂 Processing: "${folderName}" (${files.length} photos)`);
    console.log('─────────────────────────────────────');

    // Create activity
    let activity;
    try {
      activity = await dbInsert('activities', {
        title: folderName,
        description: `Photos from the NSS event: ${folderName}.`,
        date: new Date().toISOString().split('T')[0],
        is_gallery_only: true,
      });
      console.log(`   ✅ Activity created (id: ${activity.id})`);
    } catch (e) {
      if (e.message.includes('23505') || e.message.includes('duplicate')) {
        console.log(`   ⏭️  Already exists — skipping\n`);
      } else {
        console.log(`   ❌ Failed: ${e.message}\n`);
      }
      continue;
    }

    let uploaded = 0;
    for (const filename of files) {
      const ext  = path.extname(filename).toLowerCase();
      const mime = MIME[ext] || 'image/jpeg';
      const buf  = fs.readFileSync(path.join(folderPath, filename));
      const safe = folderName.replace(/[^a-zA-Z0-9\-_]/g, '_');
      const storagePath = `${safe}/${Date.now()}_${filename}`;

      process.stdout.write(`   📸 ${filename} ... `);
      try {
        const publicUrl = await storageUpload(storagePath, buf, mime);
        await dbInsert('photos', { activity_id: activity.id, image_url: publicUrl });
        console.log('✅');
        uploaded++;
      } catch (e) {
        console.log(`❌ ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 150));
    }

    console.log(`\n   🎉 ${uploaded}/${files.length} photos uploaded for "${folderName}"\n`);
    totalPhotos  += uploaded;
    totalEvents++;
  }

  console.log('══════════════════════════════════════');
  console.log(`✅ All done!`);
  console.log(`   • ${totalEvents} event(s) created`);
  console.log(`   • ${totalPhotos} photo(s) uploaded`);
  console.log(`\n🌐 Visit /gallery to see your photos!`);
  console.log('══════════════════════════════════════\n');
}

uploadAll().catch((e) => { console.error('❌ Fatal:', e.message); process.exit(1); });

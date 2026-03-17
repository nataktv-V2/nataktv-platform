/**
 * AI Thumbnail Pipeline for Natak TV
 *
 * FLUX generates scene → Sharp overlays title text in IMPACT style
 *
 * Format: Vertical thumbnail with chatpati Indian aurat biting pallu,
 *         drama title in IMPACT font, attractive diverse colors
 *
 * Usage:
 *   HF_TOKEN=xxx node scripts/generate-thumbnails.cjs
 *
 * Options:
 *   --skip-download  (skip downloading originals)
 *   --video-id=xxx   (process only one video by DB id)
 *   --force          (regenerate even if already exists)
 */

const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'generated');
const ORIGINALS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'originals');
const TEMP_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'temp');

// Parse CLI args
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const SKIP_DOWNLOAD = hasFlag('skip-download');
const SINGLE_VIDEO_ID = getArg('video-id');
const FORCE = hasFlag('force');
const TEXT_ONLY = hasFlag('text-only'); // Re-overlay text on existing scene images

// Just uppercase the DB title (already short & catchy after update-titles.cjs)
function getShorterTitle(originalTitle) {
  return originalTitle.toUpperCase();
}

// Color palettes for diverse attractive backgrounds
const COLOR_PALETTES = [
  { bg: 'deep red and gold', accent: '#FF1744' },
  { bg: 'electric purple and magenta', accent: '#D500F9' },
  { bg: 'teal and turquoise', accent: '#00BFA5' },
  { bg: 'sunset orange and pink', accent: '#FF6D00' },
  { bg: 'royal blue and cyan', accent: '#2979FF' },
  { bg: 'emerald green and lime', accent: '#00C853' },
  { bg: 'hot pink and coral', accent: '#FF4081' },
  { bg: 'indigo and violet', accent: '#651FFF' },
  { bg: 'crimson and amber', accent: '#FF3D00' },
  { bg: 'dark teal and gold', accent: '#FFD600' },
];

// ─── Unique scene descriptions per video (based on title context) ───
// Each video gets a distinct pose, setting, outfit, and mood so NO two thumbnails look alike
const SCENE_VARIANTS = {
  'Plus Minus': { pose: 'leaning against a chalkboard with math equations', outfit: 'fitted white shirt and pencil skirt', setting: 'classroom with dramatic moody lighting', mood: 'playful teasing smirk' },
  'Chutney': { pose: 'licking her finger seductively near a kitchen counter', outfit: 'traditional saree with bare midriff', setting: 'rustic Indian kitchen with spice jars and warm light', mood: 'mischievous flirty expression' },
  'School Bag': { pose: 'sitting on a desk holding a strap over her shoulder', outfit: 'short kurti with jeans', setting: 'college hallway with lockers', mood: 'innocent yet tempting gaze' },
  'Us Raat Ke Baad': { pose: 'lying on silk sheets looking over her shoulder', outfit: 'red silk nightgown', setting: 'dimly lit luxurious bedroom with candles', mood: 'mysterious longing eyes' },
  'Cafe Night': { pose: 'sipping coffee leaning forward across a table', outfit: 'off-shoulder black top with statement earrings', setting: 'cozy candlelit cafe with bokeh city lights outside', mood: 'intimate alluring stare' },
  'Khujli': { pose: 'scratching her back with one hand looking back teasingly', outfit: 'backless blouse with silk saree', setting: 'ornate haveli courtyard', mood: 'naughty playful wink' },
  'Devi': { pose: 'standing powerfully with hands on hips', outfit: 'royal gold and red traditional lehenga', setting: 'grand temple entrance with golden light', mood: 'fierce goddess-like confidence' },
  'Emotion': { pose: 'single tear running down cheek with slight smile', outfit: 'white chiffon dupatta draped elegantly', setting: 'rain-streaked window with blue moody light', mood: 'vulnerable yet beautiful sadness' },
  'Masala': { pose: 'tossing spices in air with both hands', outfit: 'colorful Rajasthani mirror-work choli', setting: 'vibrant spice market with turmeric and chili heaps', mood: 'fiery passionate energy' },
  'Paath': { pose: 'reading an old book by lamplight with glasses on nose', outfit: 'cotton salwar kameez with dupatta on shoulder', setting: 'traditional study room with oil lamp and old books', mood: 'studious yet sensual' },
  'Desires': { pose: 'running fingers through wet hair eyes closed', outfit: 'drenched white saree clinging to body', setting: 'rain pouring on rooftop terrace at night', mood: 'raw passionate desire' },
  'Badi Bhabhi': { pose: 'standing at doorway with one arm raised on doorframe', outfit: 'heavy bridal red saree with gold jewelry', setting: 'grand haveli door with marigold decorations', mood: 'commanding sensual authority' },
  'Do Biwi': { pose: 'two women back to back with arms crossed', outfit: 'one in red saree one in green saree contrasting', setting: 'split background half warm half cool tones', mood: 'rivalry and jealousy' },
  'North vs South': { pose: 'woman in half Punjabi half South Indian outfit looking fierce', outfit: 'half salwar kameez half silk saree fusion', setting: 'split scene North Indian wheat fields and South Indian temple', mood: 'cultural clash fierce stare' },
  'Samarthya': { pose: 'flexing arm confidently with determined look', outfit: 'power blazer over saree blouse', setting: 'modern office with city skyline behind', mood: 'powerful ambitious determination' },
  'Love Guru': { pose: 'winking while making heart sign with hands', outfit: 'bohemian crop top with flowing skirt and bindis', setting: 'colorful love-themed backdrop with hearts and roses', mood: 'playful love expert vibe' },
  'Harichum': { pose: 'dancing with arms raised gracefully', outfit: 'white Kerala kasavu saree with gold border', setting: 'lush green Kerala backwaters with coconut palms', mood: 'graceful ethereal beauty' },
  'Hurry Burry': { pose: 'running with dupatta flying behind her', outfit: 'casual kurta with jeans and flying dupatta', setting: 'busy Indian market street with motion blur', mood: 'panicked urgency mixed with excitement' },
  'Connection': { pose: 'reaching out hand toward camera with intense eye contact', outfit: 'modern Indo-western fusion dress', setting: 'tech-themed background with soft neon glows', mood: 'deep emotional connection yearning' },
  'Love Delivery': { pose: 'holding gift box behind her back with coy smile', outfit: 'cute short kurti with palazzo pants', setting: 'romantic doorstep with rose petals scattered', mood: 'sweet surprise anticipation' },
  'Bumblinga': { pose: 'covering mouth giggling with embarrassed blush', outfit: 'quirky printed dress with mismatched accessories', setting: 'clumsy scene with things falling in background', mood: 'adorably awkward bumbling charm' },
  'Ghat Ka Paani': { pose: 'sitting at river ghat with feet in water looking over shoulder', outfit: 'wet cotton saree with flowers in hair', setting: 'ancient Varanasi ghat at sunset with diyas floating', mood: 'serene mystical beauty' },
  'False Affair': { pose: 'hiding behind door peeking through crack with one fearful eye visible and finger on lips', outfit: 'messy hair and wrinkled silk nightgown', setting: 'dark hallway with harsh light through door crack and man shadow visible on opposite wall', mood: 'caught in act paranoid guilty thriller' },
  'Gaon Ki Biwi': { pose: 'carrying water pot on head walking through fields', outfit: 'village-style bright lehenga choli with heavy silver jewelry', setting: 'golden wheat field at sunset rural India', mood: 'rustic earthy village beauty' },
  'Shikaaru': { pose: 'aiming bow and arrow with fierce hunter look', outfit: 'tribal-inspired leather and fabric outfit', setting: 'dense jungle with dramatic light rays through trees', mood: 'fierce predatory huntress' },
  'Hot Saali': { pose: 'leaning on kitchen counter eating something with attitude', outfit: 'modern crop top with traditional ghagra', setting: 'colorful festive Indian home during celebration', mood: 'bratty confident sass' },
  'Jeth Ji': { pose: 'serving chai with lowered eyes and shy smile', outfit: 'traditional Rajasthani ghoonghat saree', setting: 'ornate royal Rajasthani room with jharokha window', mood: 'demure shy respect with hidden desire' },
  'Khet Mein Maje': { pose: 'lying in tall grass looking up at sky with bliss', outfit: 'simple cotton saree with earthy tones', setting: 'lush green sugarcane field with golden sunlight', mood: 'carefree rural bliss and abandon' },
  'Bedroom Raaz': { pose: 'sitting on red velvet bed gripping silk sheets with wide suspicious eyes', outfit: 'deep burgundy satin robe with lace trim', setting: 'opulent bedroom entirely in RED tones, crimson curtains, red chandelier, red satin sheets', mood: 'dark paranoid seductive thriller' },
  'Sasur Bahu': { pose: 'standing by old haveli pillar with conflicted expression', outfit: 'heavy traditional saree with sindoor and mangalsutra', setting: 'ancient ancestral haveli with dramatic shadows', mood: 'torn between duty and desire' },
  'Shikari': { pose: 'crouching with intense predator eyes', outfit: 'dark fitted kurta with wild hair', setting: 'moonlit forest clearing with fog', mood: 'dangerous huntress stalking prey' },
  'LSD': { pose: 'head tilted back laughing wildly with colorful paint splattered on face and body', outfit: 'neon tie-dye crop top with glow-in-dark accessories', setting: 'UV blacklight party room with fluorescent graffiti walls and purple neon tubes everywhere', mood: 'wild psychedelic rave euphoria' },
  'Sasur Ki Hawas': { pose: 'backing against wall clutching dupatta with terrified wide eyes looking sideways', outfit: 'plain yellow cotton saree with small bindi and sindoor', setting: 'dark narrow old house corridor with single swinging yellow bulb casting harsh shadows on peeling walls', mood: 'horror thriller vulnerable trapped fear' },
  'Mobile Bhaiya': { pose: 'leaning on glass counter full of phones winking at camera with phone in hand', outfit: 'tight modern kurti with ripped jeans and nose pin', setting: 'bright fluorescent mobile phone shop with colorful phone cases on wall and LED price boards', mood: 'street-smart flirty tech girl' },
  'Doctor Ki Hawas': { pose: 'sitting on hospital desk crossing legs with stethoscope dangling from neck and clipboard', outfit: 'tight white doctor lab coat over low-cut blouse with name badge and red lipstick', setting: 'bright white hospital cabin with blue medical charts on wall and examination table', mood: 'seductive authority medical temptation' },
  'Peythozhiyathe': { pose: 'standing in heavy monsoon rain face up to sky eyes closed arms spread wide', outfit: 'completely drenched green Kerala churidar clinging to body with loose wet hair', setting: 'dramatic monsoon downpour on empty road with banana trees bending in wind and gray sky', mood: 'emotional cathartic freedom in storm' },
  'Mangalyam': { pose: 'touching mangalsutra at neck with closed eyes', outfit: 'grand South Indian bridal silk saree with temple jewelry', setting: 'decorated mandapam with flowers and lamps', mood: 'sacred bridal devotion and beauty' },
  'Kadhal': { pose: 'hugging herself with dreamy faraway look', outfit: 'half-saree pattu pavadai in bright colors', setting: 'Tamil Nadu temple town with gopuram backdrop', mood: 'first love innocent dreaming' },
  'Swapnangal': { pose: 'floating in water eyes closed with flower petals around her', outfit: 'sheer ivory fabric floating in water', setting: 'crystal blue swimming pool filled with pink and white rose petals, underwater fairy lights', mood: 'serene floating dream fantasy' },
  'Mahalakshmi': { pose: 'standing like goddess statue with four arms holding lotus and gold coins raining down', outfit: 'heavy pure gold temple saree with massive gold temple jewelry crown and nose ring', setting: 'blazing golden temple sanctum with oil lamps everywhere and golden lotus pond', mood: 'divine powerful radiant goddess aura' },
  'Archana LLB': { pose: 'pointing finger aggressively at camera like in heated argument', outfit: 'crisp black formal blazer over white shirt with lawyer neck band and rectangular glasses', setting: 'bright white fluorescent lit modern courtroom with Indian flag and Ashoka emblem on wall', mood: 'angry fierce legal confrontation' },
  'Hey Leela': { pose: 'mid-dance spin with skirt fanning out, arms in classical Bharatanatyam pose', outfit: 'bright parrot green and magenta ghagra choli with heavy silver oxidized jewelry and anklets', setting: 'colorful Rajasthani puppet market with hanging puppets and bright fabric everywhere', mood: 'joyful spinning dance celebration' },
  'Sweet & Salt': { pose: 'biting into bright red chili pepper with tears streaming down face while holding ice cream cone', outfit: 'bubblegum pink crop top with yellow high-waisted skirt', setting: 'bright pastel candy shop counter with colorful jars of Indian mithai and lollipops', mood: 'hilarious sweet and spicy contrast reaction' },
  'Dohra': { pose: 'dramatic split face one half in golden light smiling one half in blue shadow scowling', outfit: 'split outfit half bridal red saree half ripped black western clothes', setting: 'split frame exactly half warm golden room half cold dark alley with mirror crack down center', mood: 'schizophrenic two-faced duality thriller' },
  'Hridayam': { pose: 'sitting alone on hilltop hugging knees looking at orange sunset with wind blowing hair', outfit: 'warm brown woolen shawl over simple white kurta', setting: 'mountain hilltop at golden hour with vast valley below and orange sky with clouds', mood: 'bittersweet nostalgic sunset melancholy' },
  'AI Marumakal': { pose: 'standing perfectly still with glowing electric blue eyes and metallic skin sheen like android', outfit: 'silver metallic futuristic saree with blue LED strip accents and circuit board patterns', setting: 'white futuristic smart home with floating holographic screens and blue ambient LED lighting everywhere', mood: 'creepy uncanny valley beautiful robot bride' },
  'Uppum Mulakum': { pose: 'screaming while pot boils over and kitchen smoke everywhere with exaggerated panicked face', outfit: 'messy housewife cotton saree tucked up with flour on face and apron', setting: 'chaotic colorful Kerala kitchen with pots boiling over stove fire high and spice jars falling', mood: 'slapstick comedy kitchen disaster chaos' },
  'Thatteem': { pose: 'leaning over compound wall gossiping with exaggerated shocked expression and hand over mouth', outfit: 'casual Kerala cotton saree with big round bindi and flowers in braid', setting: 'bright sunny Kerala neighborhood with banana trees and red laterite compound wall', mood: 'comedic nosy aunty gossip shock' },
};

// Fallback generic variants for videos without specific mapping
const GENERIC_VARIANTS = [
  { pose: 'leaning on vintage car', outfit: 'retro Bollywood style chiffon saree', setting: 'Mumbai Marine Drive sunset', mood: 'vintage Bollywood glamour' },
  { pose: 'twirling in rain', outfit: 'soaked white salwar', setting: 'monsoon street with puddles reflecting neon', mood: 'wild freedom in rain' },
  { pose: 'applying lipstick in mirror', outfit: 'glamorous party dress', setting: 'vanity mirror with bulb lights', mood: 'getting ready confidence' },
  { pose: 'sitting on swing in garden', outfit: 'floral anarkali', setting: 'blooming rose garden', mood: 'romantic dreamy innocence' },
  { pose: 'walking through mustard field', outfit: 'yellow Punjabi suit', setting: 'endless mustard field golden hour', mood: 'iconic DDLJ romance' },
];

// ─── Download YouTube Thumbnail ───
async function downloadThumbnail(youtubeId, outputPath) {
  const urls = [
    `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > 5000) {
          fs.writeFileSync(outputPath, buffer);
          return true;
        }
      }
    } catch (e) {
      continue;
    }
  }
  return false;
}

// ─── Generate AI Scene with FLUX (unique per video) ───
async function generateScene(outputPath, videoTitle, colorIndex) {
  const token = process.env.HF_TOKEN;
  if (!token) throw new Error('HF_TOKEN not set');

  const palette = COLOR_PALETTES[colorIndex % COLOR_PALETTES.length];

  // Get unique scene variant based on video title
  const variant = SCENE_VARIANTS[videoTitle] || GENERIC_VARIANTS[colorIndex % GENERIC_VARIANTS.length];

  const prompt = `vertical portrait 9:16 ultra realistic photograph, stunning gorgeous Indian woman ${variant.pose}, ${variant.outfit}, ${variant.setting}, ${variant.mood}, smoky kajal eyes, glossy lips, flawless skin, ${palette.bg} color tones, Bollywood movie poster style, professional fashion photography, cinematic dramatic lighting, shallow depth of field, attractive vibrant colors, high contrast, photorealistic 8k detail, no text no letters no words`;

  const res = await fetch(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { width: 720, height: 1280 },
      }),
    }
  );

  if (res.status === 503) {
    const data = await res.json().catch(() => ({}));
    const waitTime = Math.min(data.estimated_time || 30, 60);
    process.stdout.write(` loading(${waitTime}s)...`);
    await new Promise(r => setTimeout(r, waitTime * 1000));
    const retryRes = await fetch(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: prompt, parameters: { width: 720, height: 1280 } }),
      }
    );
    if (!retryRes.ok) throw new Error(`HF retry failed (${retryRes.status})`);
    const buf = Buffer.from(await retryRes.arrayBuffer());
    fs.writeFileSync(outputPath, buf);
    return;
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HF error (${res.status}): ${errText.slice(0, 300)}`);
  }

  const resultBuffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, resultBuffer);
}

// ─── Overlay Title Text with Sharp (IMPACT style — TOP position, big & readable) ───
async function overlayTitle(scenePath, outputPath, title, accentColor) {
  const WIDTH = 720;
  const HEIGHT = 1280;

  // BIG font — readable even in small cards
  let fontSize = 90;
  if (title.length > 10) fontSize = 80;
  if (title.length > 14) fontSize = 68;
  if (title.length > 18) fontSize = 56;

  const strokeWidth = 6;
  const lineHeight = fontSize * 1.15;

  // Word wrap
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > 10 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Position at TOP — start below a small top margin
  const textStartY = 80;

  // Build SVG text elements — bright WHITE with thick black stroke
  const textElements = lines.map((line, i) => {
    const y = textStartY + (i * lineHeight) + fontSize;
    return `
      <text x="${WIDTH / 2}" y="${y}" text-anchor="middle"
        font-family="Impact, 'Arial Black', 'Bebas Neue', sans-serif"
        font-size="${fontSize}" font-weight="900" letter-spacing="4"
        stroke="black" stroke-width="${strokeWidth}" fill="white"
        paint-order="stroke fill"
        filter="url(#shadow)">
        ${escapeXml(line)}
      </text>
    `;
  }).join('');

  // Decorative accent line under the title
  const totalTextHeight = lines.length * lineHeight;
  const lineY = textStartY + totalTextHeight + fontSize * 0.2;
  const decorLine = `
    <line x1="${WIDTH * 0.15}" y1="${lineY}" x2="${WIDTH * 0.85}" y2="${lineY}"
      stroke="${accentColor}" stroke-width="4" opacity="0.9"/>
  `;

  // "NATAK TV" branding — bottom-left corner
  const brandingSvg = `
    <rect x="20" y="${HEIGHT - 60}" width="140" height="40" rx="8" fill="black" opacity="0.7"/>
    <text x="90" y="${HEIGHT - 33}" text-anchor="middle"
      font-family="Impact, 'Arial Black', sans-serif"
      font-size="22" font-weight="900" fill="#f97316" letter-spacing="2">
      NATAK TV
    </text>
  `;

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="black" flood-opacity="0.9"/>
        </filter>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="0.35">
          <stop offset="0%" stop-color="black" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="black" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Top gradient for text readability -->
      <rect width="${WIDTH}" height="${HEIGHT * 0.35}" fill="url(#topFade)"/>

      ${textElements}
      ${decorLine}
      ${brandingSvg}
    </svg>
  `;

  await sharp(scenePath)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .composite([
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// ─── Main Pipeline ───
async function main() {
  const prisma = new PrismaClient();

  try {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
    fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    const where = SINGLE_VIDEO_ID ? { id: SINGLE_VIDEO_ID } : {};
    const videos = await prisma.video.findMany({
      where,
      select: { id: true, youtubeId: true, title: true, thumbnailUrl: true, generatedThumbnailUrl: true },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`\n🎬 Natak TV Thumbnail Pipeline — Chatpati Indian Style`);
    console.log(`   Videos: ${videos.length} | Format: Indian aurat + IMPACT title`);
    console.log('');

    let generated = 0, skipped = 0, failed = 0;

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const originalPath = path.join(ORIGINALS_DIR, `${video.id}.jpg`);
      const tempScenePath = path.join(TEMP_DIR, `${video.id}_scene.jpg`);
      const generatedPath = path.join(THUMBNAILS_DIR, `${video.id}.jpg`);
      const progress = `[${i + 1}/${videos.length}]`;

      // Skip if already generated (unless --force)
      if (!FORCE && video.generatedThumbnailUrl && fs.existsSync(generatedPath)) {
        console.log(`${progress} SKIP ${video.title} (already generated)`);
        skipped++;
        continue;
      }

      // Download original if needed
      if (!SKIP_DOWNLOAD || !fs.existsSync(originalPath)) {
        await downloadThumbnail(video.youtubeId, originalPath);
      }

      const shorterTitle = getShorterTitle(video.title);
      const palette = COLOR_PALETTES[i % COLOR_PALETTES.length];

      process.stdout.write(`${progress} ${video.title} → "${shorterTitle}"...`);

      try {
        if (TEXT_ONLY) {
          // Re-overlay text on existing generated image (use it as the scene)
          const sceneSrc = fs.existsSync(generatedPath) ? generatedPath : originalPath;
          // Copy to temp first so we don't read+write same file
          const tmpCopy = tempScenePath;
          fs.copyFileSync(sceneSrc, tmpCopy);
          await overlayTitle(tmpCopy, generatedPath, shorterTitle, palette.accent);
          console.log(' DONE (text-only)');
        } else {
          // Step 1: Generate AI scene
          await generateScene(tempScenePath, video.title, i);
          process.stdout.write(' scene OK...');

          // Step 2: Overlay IMPACT title text
          await overlayTitle(tempScenePath, generatedPath, shorterTitle, palette.accent);
          console.log(' DONE');
        }

        // Step 3: Update database
        const generatedUrl = `/thumbnails/generated/${video.id}.jpg`;
        await prisma.video.update({
          where: { id: video.id },
          data: { generatedThumbnailUrl: generatedUrl },
        });

        generated++;

        // Rate limit
        if (i < videos.length - 1) {
          await new Promise(r => setTimeout(r, 1000));
        }

      } catch (e) {
        console.log(` FAILED: ${e.message}`);
        failed++;
      }
    }

    // Clean temp
    try { fs.rmSync(TEMP_DIR, { recursive: true }); } catch {}

    console.log(`\n=== RESULTS ===`);
    console.log(`Generated: ${generated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Failed: ${failed}`);
    console.log(`\nSaved to: ${THUMBNAILS_DIR}`);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});

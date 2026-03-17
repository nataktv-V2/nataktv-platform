// Regenerate only the duplicate-looking thumbnails
const { execSync } = require('child_process');

const ids = [
  'cmmrwzpuc002bkrp0j6uoqq0m', // False Affair
  'cmmrwzpuc0029krp0x3cebhed', // Bedroom Raaz
  'cmmrwzpuc002dkrp0nzdpvdr9', // LSD
  'cmmrwzpuc002ekrp0ql821g2e', // Sasur Ki Hawas
  'cmmrwzpuc002fkrp0eesp00pn', // Mobile Bhaiya
  'cmmrwzpuc002gkrp072gzufh9', // Doctor Ki Hawas
  'cmmrwzpud002vkrp08gdx1ll9', // Uppum Mulakum
  'cmmrwzpud002wkrp0mmcnb20i', // Thatteem
  'cmmrwzpud002xkrp0mkoyzp14', // Peythozhiyathe
  'cmmrwzpue002zkrp0dl6sgjq7', // Swapnangal
  'cmmrwzpue0030krp0vnvwamny', // Mahalakshmi
  'cmmrwzpue0031krp0exm9555u', // Archana LLB
  'cmmrwzpue0033krp018idk9zl', // Hey Leela
  'cmmrwzpue0034krp0w8it3e5v', // Sweet & Salt
  'cmmrwzpue0035krp0zobx4hbz', // Dohra
  'cmmrwzpud002ukrp008lcgbfa', // Hridayam
  'cmmrwzpud002skrp02ucgpvue', // AI Marumakal
];

let ok = 0, fail = 0;
for (let i = 0; i < ids.length; i++) {
  console.log(`\n[${i+1}/${ids.length}] Regenerating ${ids[i]}...`);
  try {
    const out = execSync(
      `node scripts/generate-thumbnails.cjs --force --skip-download --video-id=${ids[i]}`,
      { env: { ...process.env, HF_TOKEN: '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' }, timeout: 120000 }
    ).toString();
    console.log(out.trim());
    ok++;
  } catch (e) {
    console.log('FAILED:', e.message.slice(0, 200));
    fail++;
  }
}
console.log(`\n=== DONE: ${ok} ok, ${fail} failed ===`);

const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'C:\\Users\\Administrator\\Desktop\\大号内容生成\\PPT动画流\\smoke_test_0906';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'shell',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--no-first-run', '--no-default-browser-check', '--window-size=1080,1920'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  for (let i = 1; i <= 6; i++) {
    const no = String(i).padStart(2, '0');
    const html = path.join(BASE, `slide_${no}.html`).replace(/\\/g, '/');
    await page.goto('file:///' + html, { waitUntil: 'networkidle0', timeout: 30000 });
    const out = path.join(BASE, 'png', `page_${no}.png`);
    await page.screenshot({ path: out, type: 'png' });
    console.log(`[${i}/6] page_${no}.png OK`);
  }
  await browser.close();
  console.log('ALL OK');
})().catch(e => { console.error('ERROR', e); process.exit(1); });
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmlPath = join(__dirname, 'guide-template.html');
const outputPath = join(__dirname, '..', '..', 'Guide-Resilience-Familiale-72h.pdf');

const html = readFileSync(htmlPath, 'utf-8');

console.log('Launching browser...');
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

console.log('Loading HTML content...');
await page.setContent(html, {
  waitUntil: 'networkidle0',
});

// Give fonts and layout a moment to settle
await new Promise(r => setTimeout(r, 1000));

console.log('Generating PDF...');
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: false,
});

await browser.close();

console.log(`\nPDF generated successfully:\n  ${outputPath}\n`);

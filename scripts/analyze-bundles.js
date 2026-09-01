import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const distDir = path.join(frontendDir, 'dist', 'assets');

console.log('\n================================================================');
console.log(' 🔬 Frontend Bundle Analysis & Code Splitting Auditor');
console.log('================================================================\n');
console.log('⏳ Running production Vite build to analyze generated chunks...\n');

try {
  execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Build failed:', err.message);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  console.error(`❌ Dist directory not found at ${distDir}`);
  process.exit(1);
}

const files = fs.readdirSync(distDir);
const jsFiles = files.filter((f) => f.endsWith('.js'));
const cssFiles = files.filter((f) => f.endsWith('.css'));

const fileStats = jsFiles.map((file) => {
  const fullPath = path.join(distDir, file);
  const content = fs.readFileSync(fullPath);
  const sizeBytes = content.length;
  const gzipBytes = zlib.gzipSync(content).length;
  const isEntry = file.startsWith('index-');

  let type = 'Lazy Route / Component Chunk';
  if (isEntry) type = '⭐ Main Entry Bundle (Initial Load)';
  else if (file.includes('page-') || file.includes('detail-')) type = '📄 Route Chunk (On-Demand)';
  else if (file.includes('modal-') || file.includes('widget-') || file.includes('report-')) type = '🧩 Component Chunk (On-Demand)';
  else type = '📦 Shared Utility Chunk';

  return {
    file,
    type,
    sizeKb: (sizeBytes / 1024).toFixed(2),
    gzipKb: (gzipBytes / 1024).toFixed(2),
    isEntry,
  };
});

// Sort with entry first, then descending size
fileStats.sort((a, b) => {
  if (a.isEntry) return -1;
  if (b.isEntry) return 1;
  return parseFloat(b.sizeKb) - parseFloat(a.sizeKb);
});

console.log('\n----------------------------------------------------------------');
console.log('📊 PRODUCTION CHUNK BREAKDOWN & SIZES');
console.log('----------------------------------------------------------------');
console.log(
  'Chunk Filename'.padEnd(38) +
  'Raw Size'.padEnd(12) +
  'Gzip Size'.padEnd(12) +
  'Classification'
);
console.log(''.padEnd(95, '-'));

let totalRaw = 0;
let totalGzip = 0;

for (const stat of fileStats) {
  totalRaw += parseFloat(stat.sizeKb);
  totalGzip += parseFloat(stat.gzipKb);
  console.log(
    stat.file.padEnd(38) +
    `${stat.sizeKb} kB`.padEnd(12) +
    `${stat.gzipKb} kB`.padEnd(12) +
    stat.type
  );
}

console.log(''.padEnd(95, '-'));
console.log(
  'TOTAL BUNDLE ASSETS:'.padEnd(38) +
  `${totalRaw.toFixed(2)} kB`.padEnd(12) +
  `${totalGzip.toFixed(2)} kB`
);
console.log('----------------------------------------------------------------\n');

const entryChunk = fileStats.find((s) => s.isEntry);
const lazyChunks = fileStats.filter((s) => !s.isEntry);

console.log('💡 ARCHITECTURAL SUMMARY:');
if (entryChunk) {
  console.log(`   🚀 Initial JavaScript Footprint: ${entryChunk.sizeKb} kB (Gzip: ${entryChunk.gzipKb} kB)`);
}
console.log(`   📦 Number of Lazy-Loaded Chunks: ${lazyChunks.length}`);
console.log(`   🎯 Network Efficiency: Initial page visitors save downloading ${lazyChunks.reduce((acc, c) => acc + parseFloat(c.sizeKb), 0).toFixed(2)} kB of unvisited routes & modals!`);
console.log('================================================================\n');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const configFilePath = path.join(rootDir, 'backend', 'src', 'config', 'performance.config.js');

function getCurrentMode() {
  if (!fs.existsSync(configFilePath)) {
    return 'optimized';
  }
  const content = fs.readFileSync(configFilePath, 'utf8');
  if (content.includes("mode: 'unoptimized'")) {
    return 'unoptimized';
  }
  return 'optimized';
}

function switchBackendMode(targetMode) {
  const currentMode = getCurrentMode();
  let modeToSet = (targetMode || 'toggle').toLowerCase();

  if (modeToSet === 'optimized' || modeToSet === 'opt' || modeToSet === 'on' || modeToSet === 'fast') {
    modeToSet = 'optimized';
  } else if (modeToSet === 'unoptimized' || modeToSet === 'unopt' || modeToSet === 'off' || modeToSet === 'slow') {
    modeToSet = 'unoptimized';
  } else if (modeToSet === 'toggle') {
    modeToSet = currentMode === 'optimized' ? 'unoptimized' : 'optimized';
  }

  const updatedConfigContent = `/**
 * Backend Node.js / PostgreSQL Architecture Mode Configuration
 *
 * Mode: 'optimized' | 'unoptimized'
 *
 * 🚀 OPTIMIZED MODE:
 *   1. Single atomic SQL queries with indexed JOINs & lean column projections (attributes).
 *   2. Server-side database aggregation (COUNT, GROUP BY) instead of memory-heavy JS array operations.
 *   3. Zero main-thread CPU blocking on Node.js single-threaded event loop.
 *   4. Sub-25ms response times.
 *
 * 💥 UNOPTIMIZED MODE:
 *   1. Classic N+1 Database Query Anti-Pattern: Queries tasks, then fires individual SELECT queries
 *      in a loop for every row over PostgreSQL pool.
 *   2. In-Memory Aggregation: Over-fetches entire tables into Node.js heap memory to count/group with JS.
 *   3. Synchronous Event Loop Blocking: Runs CPU-heavy blocking loops on the main thread, choking concurrent HTTP requests.
 *   4. High latency: 350ms - 500ms.
 */
export const BACKEND_PERF_CONFIG = {
  mode: '${modeToSet}', // 'optimized' | 'unoptimized'
};

export default BACKEND_PERF_CONFIG;
`;

  fs.writeFileSync(configFilePath, updatedConfigContent, 'utf8');

  console.log('\n================================================================');
  console.log(` ⚙️ Node.js & PostgreSQL Backend Performance Switcher`);
  console.log(` Previous Mode: [${currentMode.toUpperCase()}]`);
  console.log(` Active Mode:   [${modeToSet.toUpperCase()}]`);
  console.log('================================================================\n');

  if (modeToSet === 'optimized') {
    console.log(`  ✨ Switched to OPTIMIZED NODE.JS & SQL ARCHITECTURE`);
    console.log(`  📁 Config file: backend/src/config/performance.config.js`);
    console.log('\n----------------------------------------------------------------');
    console.log(`🚀 Active Backend Architecture: SINGLE-QUERY INDEXED SQL & EVENT LOOP EFFICIENCY`);
    console.log(`✨ Key Benefits & Live Demonstration:`);
    console.log(`   1. Single Atomic Query: Eager JOINs with indexed foreign keys (1 SQL query per request).`);
    console.log(`   2. Lean Column Projections: Explicit attributes select only needed columns.`);
    console.log(`   3. Database Aggregation: SQL COUNT/GROUP BY instead of pulling raw records into JS heap.`);
    console.log(`   4. Non-Blocking Event Loop: Zero synchronous CPU blocks on Node's main thread.`);
    console.log(`   5. Response Latency: ~15ms - 25ms.`);
    console.log('----------------------------------------------------------------\n');
  } else {
    console.log(`  ⚠️ Switched to UNOPTIMIZED NODE.JS & SQL ANTI-PATTERNS`);
    console.log(`  📁 Config file: backend/src/config/performance.config.js`);
    console.log('\n----------------------------------------------------------------');
    console.log(`💥 Active Backend Anti-Patterns: N+1 QUERIES & EVENT LOOP BLOCKING`);
    console.log(`📊 Demonstrates:`);
    console.log(`   1. Classic N+1 Query Anti-Pattern: Fires hundreds of individual SELECT round-trips over DB pool.`);
    console.log(`   2. In-Memory Array Filtering: Pulls entire unindexed table into Node.js RAM to filter in JS.`);
    console.log(`   3. Event Loop Thrashing: Synchronous CPU loops block concurrent user HTTP requests.`);
    console.log(`   4. Response Latency: ~350ms - 500ms (Visible in floating Telemetry Overlay HUD).`);
    console.log('----------------------------------------------------------------\n');
  }
}

const target = process.argv[2] || 'toggle';
switchBackendMode(target);

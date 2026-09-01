import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const configFilePath = path.join(rootDir, 'frontend', 'src', 'config', 'debounce.config.js');

function getCurrentConfig() {
  if (!fs.existsSync(configFilePath)) {
    return { enabled: true, delayMs: 600 };
  }
  const content = fs.readFileSync(configFilePath, 'utf8');
  const isEnabled = content.includes('enabled: true');
  const delayMatch = content.match(/delayMs:\s*(\d+)/);
  const delayMs = delayMatch ? parseInt(delayMatch[1], 10) : 600;
  return { enabled: isEnabled, delayMs };
}

function switchDebounce(targetAction) {
  const current = getCurrentConfig();
  let action = (targetAction || 'toggle').toLowerCase();

  let nextEnabled = current.enabled;
  if (action === 'on' || action === 'enable' || action === 'true' || action === '1') {
    nextEnabled = true;
  } else if (action === 'off' || action === 'disable' || action === 'false' || action === '0') {
    nextEnabled = false;
  } else if (action === 'toggle') {
    nextEnabled = !current.enabled;
  }

  const updatedConfigContent = `/**
 * Global Search Debounce Configuration for Tech Talk Demonstrations.
 *
 * - enabled: true  => Debounced auto-search (waits delayMs) + manual Apply button.
 * - enabled: false => Zero debounce (fires API request on EVERY keystroke to demo input jank and rapid server traffic).
 */
export const DEBOUNCE_CONFIG = {
  enabled: ${nextEnabled},
  delayMs: ${current.delayMs},
};

export default DEBOUNCE_CONFIG;
`;

  fs.writeFileSync(configFilePath, updatedConfigContent, 'utf8');

  console.log('\n================================================================');
  console.log(` ⏱️ Search Debounce Switcher`);
  console.log(` Previous Status: [${current.enabled ? 'ENABLED (' + current.delayMs + 'ms)' : 'DISABLED (0ms Immediate)'}]`);
  console.log(` New Status:      [${nextEnabled ? 'ENABLED (' + current.delayMs + 'ms)' : 'DISABLED (0ms Immediate)'}]`);
  console.log('================================================================\n');

  if (nextEnabled) {
    console.log(`  ✨ Search Debounce is now ENABLED (${current.delayMs}ms delay)`);
    console.log(`  📁 Config file: frontend/src/config/debounce.config.js`);
    console.log('\n----------------------------------------------------------------');
    console.log(`🚀 Demonstrates:`);
    console.log(`   1. Network Traffic Reduction: Only 1 API call made after user pauses typing.`);
    console.log(`   2. Explicit Apply / Enter Trigger: Instant search on demand.`);
    console.log(`   3. 60 FPS Smooth UI: No dropped frames or typing stutter.`);
    console.log('----------------------------------------------------------------\n');
  } else {
    console.log(`  ⚠️ Search Debounce is now DISABLED (0ms Immediate Keystrokes)`);
    console.log(`  📁 Config file: frontend/src/config/debounce.config.js`);
    console.log('\n----------------------------------------------------------------');
    console.log(`💥 Demonstrates (Anti-Pattern):`);
    console.log(`   1. Severe Network Overhead: 1 HTTP API call fired per single keystroke.`);
    console.log(`   2. Race Conditions: Fast typists cause out-of-order network responses.`);
    console.log(`   3. Main-Thread Jank: Repeated DOM recalculations on every character.`);
    console.log('----------------------------------------------------------------\n');
  }
}

const target = process.argv[2] || 'toggle';
switchDebounce(target);

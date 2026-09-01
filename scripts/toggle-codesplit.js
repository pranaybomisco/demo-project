import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appRouterPath = path.join(rootDir, 'frontend', 'src', 'routers', 'approuter.jsx');

const LAZY_IMPORT = "import { LazyRouter as RouterImplementation } from './lazyrouter.jsx';";
const EAGER_IMPORT = "import { EagerRouter as RouterImplementation } from './eagerrouter.jsx';";

function getCurrentMode() {
  if (!fs.existsSync(appRouterPath)) {
    throw new Error(`Cannot find ${appRouterPath}`);
  }
  const content = fs.readFileSync(appRouterPath, 'utf8');
  if (content.includes('lazyrouter.jsx')) {
    return 'lazy';
  }
  if (content.includes('eagerrouter.jsx')) {
    return 'eager';
  }
  return 'unknown';
}

function switchCodeSplitMode(targetMode) {
  const currentMode = getCurrentMode();
  let modeToSet = targetMode.toLowerCase();

  // Normalize aliases
  if (modeToSet === 'codesplit' || modeToSet === 'optimized' || modeToSet === 'split') {
    modeToSet = 'lazy';
  } else if (modeToSet === 'no-codesplit' || modeToSet === 'unoptimized' || modeToSet === 'monolithic' || modeToSet === 'sync') {
    modeToSet = 'eager';
  } else if (modeToSet === 'toggle') {
    modeToSet = currentMode === 'lazy' ? 'eager' : 'lazy';
  }

  console.log('\n================================================================');
  console.log(` 📦 Code Splitting Architecture Switcher`);
  console.log(` Current Router Mode: [${currentMode.toUpperCase()}]`);
  console.log(` Target Router Mode:  [${modeToSet.toUpperCase()}]`);
  console.log('================================================================\n');

  let content = fs.readFileSync(appRouterPath, 'utf8');

  if (modeToSet === 'lazy') {
    content = content.replace(EAGER_IMPORT, LAZY_IMPORT);
    fs.writeFileSync(appRouterPath, content, 'utf8');

    console.log(`  ✨ Switched to OPTIMIZED CODE SPLITTING (LazyRouter)`);
    console.log(`  📁 Router target: frontend/src/routers/lazyrouter.jsx`);
    console.log('\n----------------------------------------------------------------');
    console.log(`🚀 Active Architecture: ROUTE-LEVEL & COMPONENT-LEVEL CODE SPLITTING`);
    console.log(`✨ Key Benefits & Live Demonstration:`);
    console.log(`   1. Dynamic Imports (React.lazy + Suspense): Pages load only when visited.`);
    console.log(`   2. Reduced Initial Bundle Size: Entry bundle does not include unvisited pages.`);
    console.log(`   3. Lower Total Blocking Time (TBT) & Faster Largest Contentful Paint (LCP).`);
    console.log(`   4. Smooth Shimmer Transition: Suspense fallback renders RouteSkeleton.`);
    console.log(`   🔍 DevTools Verification: Open Chrome DevTools > Network tab (Filter: JS).`);
    console.log(`      Click between Dashboard, Projects, Tasks, Profile to watch individual`);
    console.log(`      chunks (*.js) downloaded on-demand over the wire!`);
    console.log('----------------------------------------------------------------\n');
  } else if (modeToSet === 'eager') {
    content = content.replace(LAZY_IMPORT, EAGER_IMPORT);
    fs.writeFileSync(appRouterPath, content, 'utf8');

    console.log(`  💥 Switched to UNOPTIMIZED MONOLITHIC BUNDLE (EagerRouter)`);
    console.log(`  📁 Router target: frontend/src/routers/eagerrouter.jsx`);
    console.log('\n----------------------------------------------------------------');
    console.log(`💥 Active Architecture: MONOLITHIC EAGER LOADING (NO CODE SPLITTING)`);
    console.log(`⚠️ Bottlenecks & Anti-Patterns Demonstrated:`);
    console.log(`   1. All pages, modals, and views are statically imported at the root.`);
    console.log(`   2. Single massive JavaScript payload downloaded upfront during initial paint.`);
    console.log(`   3. Unvisited routes (e.g. Profile, Auth, Modals) waste network bandwidth and memory.`);
    console.log(`   4. Increased JavaScript parse & compilation time blocking the main thread.`);
    console.log(`   🔍 DevTools Verification: In Network tab, all code arrives in a single huge bundle.`);
    console.log(`      Navigating between routes triggers ZERO additional chunk downloads.`);
    console.log('----------------------------------------------------------------\n');
  } else {
    console.error(`Invalid argument: ${targetMode}. Use 'lazy' (codesplit), 'eager' (no-codesplit), or 'toggle'.`);
    process.exit(1);
  }
}

const requestedArg = (process.argv[2] || 'toggle').toLowerCase();
switchCodeSplitMode(requestedArg);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'frontend', 'src', 'pages');

const ALL_PAGES = [
  {
    file: path.join(pagesDir, 'taskspage.jsx'),
    name: 'TasksPage',
    optimized: "import { TasksView } from '../views/tasks/tasksview.jsx';",
    noQueryParams: "import { UnoptimizedTasksLocalView as TasksView } from '../unoptimized/views/tasks/unoptimizedtaskslocalview.jsx';",
    unoptimized: "import { UnoptimizedTasksView as TasksView } from '../unoptimized/views/tasks/unoptimizedtasksview.jsx';",
  },
  {
    file: path.join(pagesDir, 'projectspage.jsx'),
    name: 'ProjectsPage',
    optimized: "import { ProjectsView } from '../views/projects/projectsview.jsx';",
    noQueryParams: "import { UnoptimizedProjectsLocalView as ProjectsView } from '../unoptimized/views/projects/unoptimizedprojectslocalview.jsx';",
    unoptimized: "import { UnoptimizedProjectsView as ProjectsView } from '../unoptimized/views/projects/unoptimizedprojectsview.jsx';",
  },
  {
    file: path.join(pagesDir, 'dashboardpage.jsx'),
    name: 'DashboardPage',
    optimized: "import { DashboardView } from '../views/dashboard/dashboardview.jsx';",
    noQueryParams: "import { DashboardView } from '../views/dashboard/dashboardview.jsx';",
    unoptimized: "import { UnoptimizedDashboardView as DashboardView } from '../unoptimized/views/dashboard/unoptimizeddashboardview.jsx';",
  },
  {
    file: path.join(pagesDir, 'projectdetailpage.jsx'),
    name: 'ProjectDetailPage',
    optimized: "import { ProjectDetailView } from '../views/projects/projectdetailview.jsx';",
    noQueryParams: "import { ProjectDetailView } from '../views/projects/projectdetailview.jsx';",
    unoptimized: "import { UnoptimizedProjectDetailView as ProjectDetailView } from '../unoptimized/views/projects/unoptimizedprojectdetailview.jsx';",
  },
  {
    file: path.join(pagesDir, 'profilepage.jsx'),
    name: 'ProfilePage',
    optimized: "import { ProfileView } from '../views/profile/profileview.jsx';",
    noQueryParams: "import { ProfileView } from '../views/profile/profileview.jsx';",
    unoptimized: "import { UnoptimizedProfileView as ProfileView } from '../unoptimized/views/profile/unoptimizedprofileview.jsx';",
  },
  {
    file: path.join(pagesDir, 'loginpage.jsx'),
    name: 'LoginPage',
    optimized: "import { LoginView } from '../views/auth/loginview.jsx';",
    noQueryParams: "import { LoginView } from '../views/auth/loginview.jsx';",
    unoptimized: "import { UnoptimizedLoginView as LoginView } from '../unoptimized/views/auth/unoptimizedloginview.jsx';",
  },
  {
    file: path.join(pagesDir, 'registerpage.jsx'),
    name: 'RegisterPage',
    optimized: "import { RegisterView } from '../views/auth/registerview.jsx';",
    noQueryParams: "import { RegisterView } from '../views/auth/registerview.jsx';",
    unoptimized: "import { UnoptimizedRegisterView as RegisterView } from '../unoptimized/views/auth/unoptimizedregisterview.jsx';",
  },
  {
    file: path.join(pagesDir, 'notfoundpage.jsx'),
    name: 'NotFoundPage',
    optimized: "import { NotFoundView } from '../views/layout/notfoundview.jsx';",
    noQueryParams: "import { NotFoundView } from '../views/layout/notfoundview.jsx';",
    unoptimized: "import { UnoptimizedNotFoundView as NotFoundView } from '../unoptimized/views/layout/unoptimizednotfoundview.jsx';",
  },
];

function getCurrentMode() {
  const taskPageContent = fs.readFileSync(ALL_PAGES[0].file, 'utf8');
  if (taskPageContent.includes('unoptimizedtaskslocalview')) {
    return 'no-query-params';
  }
  if (taskPageContent.includes('unoptimizedtasksview')) {
    return 'unoptimized';
  }
  return 'optimized';
}

function switchMode(targetMode) {
  const currentMode = getCurrentMode();
  let modeToSet = targetMode;

  if (targetMode === 'toggle') {
    if (currentMode === 'optimized') modeToSet = 'no-query-params';
    else if (currentMode === 'no-query-params') modeToSet = 'unoptimized';
    else modeToSet = 'optimized';
  }

  // Alias support
  if (modeToSet === 'local-state') modeToSet = 'no-query-params';

  console.log('\n================================================================');
  console.log(` 🔄 Full Application Performance & Architecture Switcher`);
  console.log(` Current Mode: [${currentMode.toUpperCase()}]`);
  console.log(` Target Mode:  [${modeToSet.toUpperCase()}]`);
  console.log('================================================================\n');

  let updatedCount = 0;

  for (const page of ALL_PAGES) {
    if (!fs.existsSync(page.file)) {
      console.warn(`⚠️ Warning: ${page.file} does not exist.`);
      continue;
    }

    let content = fs.readFileSync(page.file, 'utf8');

    // Remove any existing import pattern
    content = content
      .replace(page.optimized, '%%IMPORT_PLACEHOLDER%%')
      .replace(page.noQueryParams, '%%IMPORT_PLACEHOLDER%%')
      .replace(page.unoptimized, '%%IMPORT_PLACEHOLDER%%');

    let replacement = page.optimized;
    let label = '✨ OPTIMIZED (Full URL Sync & Clean Architecture)';

    if (modeToSet === 'no-query-params') {
      replacement = page.noQueryParams;
      label = page.noQueryParams !== page.optimized
        ? '⚠️ NO-QUERY-PARAMS (Local State Only Pagination)'
        : '✨ OPTIMIZED';
    } else if (modeToSet === 'unoptimized') {
      replacement = page.unoptimized;
      label = '💥 UNOPTIMIZED (In-Render Work & 1,000 DOM Rows)';
    }

    if (content.includes('%%IMPORT_PLACEHOLDER%%')) {
      content = content.replace('%%IMPORT_PLACEHOLDER%%', replacement);
      fs.writeFileSync(page.file, content, 'utf8');
      console.log(`  🔹 ${page.name.padEnd(20)} -> ${label}`);
      updatedCount++;
    } else {
      console.log(`  ℹ️ ${page.name.padEnd(20)} unchanged.`);
    }
  }

  console.log('\n----------------------------------------------------------------');
  if (modeToSet === 'no-query-params') {
    console.log(`⚠️ Active Mode: NO-QUERY-PARAMS (LOCAL STATE ONLY PAGINATION)`);
    console.log(`📊 Demonstrates:`);
    console.log(`   - Pagination & filters exist, but are stored in local useState without URL search params.`);
    console.log(`   - Refreshing page (F5) or sharing URLs wipes pagination back to Page 1.`);
    console.log(`   - Browser back/forward buttons do not restore filters or pages.`);
  } else if (modeToSet === 'unoptimized') {
    console.log(`💥 Active Mode: UNOPTIMIZED HEAVY LOAD`);
    console.log(`📊 Demonstrates:`);
    console.log(`   - 1,000 un-virtualized DOM rows & cards rendered simultaneously.`);
    console.log(`   - In-render CPU blocking loops on every keystroke and render.`);
    console.log(`   - Immediate non-debounced typing lag.`);
  } else {
    console.log(`🚀 Active Mode: FULLY OPTIMIZED CLEAN ARCHITECTURE`);
    console.log(`✨ Demonstrates:`);
    console.log(`   - Server-side pagination synchronized with URL query params (?page=, ?limit=).`);
    console.log(`   - Generic DataTable with column sorting & shimmer skeletons.`);
    console.log(`   - Generic FilterBar with 300ms debounced search & view toggles.`);
    console.log(`   - 60 FPS performance and shareable / bookmarkable URLs.`);
  }
  console.log('----------------------------------------------------------------\n');
}

const requestedArg = (process.argv[2] || 'toggle').toLowerCase();

if (!['optimized', 'unoptimized', 'no-query-params', 'local-state', 'toggle'].includes(requestedArg)) {
  console.error(`Invalid argument: ${requestedArg}. Use 'optimized', 'no-query-params', 'unoptimized', or 'toggle'.`);
  process.exit(1);
}

switchMode(requestedArg);

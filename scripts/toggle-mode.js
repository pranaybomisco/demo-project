import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'frontend', 'src', 'pages');

const ALL_PAGES = [
  {
    file: path.join(pagesDir, 'loginpage.jsx'),
    name: 'LoginPage',
    optimized: "import { LoginView } from '../views/auth/loginview.jsx';",
    unoptimized: "import { UnoptimizedLoginView as LoginView } from '../unoptimized/views/auth/unoptimizedloginview.jsx';",
  },
  {
    file: path.join(pagesDir, 'registerpage.jsx'),
    name: 'RegisterPage',
    optimized: "import { RegisterView } from '../views/auth/registerview.jsx';",
    unoptimized: "import { UnoptimizedRegisterView as RegisterView } from '../unoptimized/views/auth/unoptimizedregisterview.jsx';",
  },
  {
    file: path.join(pagesDir, 'dashboardpage.jsx'),
    name: 'DashboardPage',
    optimized: "import { DashboardView } from '../views/dashboard/dashboardview.jsx';",
    unoptimized: "import { UnoptimizedDashboardView as DashboardView } from '../unoptimized/views/dashboard/unoptimizeddashboardview.jsx';",
  },
  {
    file: path.join(pagesDir, 'projectspage.jsx'),
    name: 'ProjectsPage',
    optimized: "import { ProjectsView } from '../views/projects/projectsview.jsx';",
    unoptimized: "import { UnoptimizedProjectsView as ProjectsView } from '../unoptimized/views/projects/unoptimizedprojectsview.jsx';",
  },
  {
    file: path.join(pagesDir, 'projectdetailpage.jsx'),
    name: 'ProjectDetailPage',
    optimized: "import { ProjectDetailView } from '../views/projects/projectdetailview.jsx';",
    unoptimized: "import { UnoptimizedProjectDetailView as ProjectDetailView } from '../unoptimized/views/projects/unoptimizedprojectdetailview.jsx';",
  },
  {
    file: path.join(pagesDir, 'taskspage.jsx'),
    name: 'TasksPage',
    optimized: "import { TasksView } from '../views/tasks/tasksview.jsx';",
    unoptimized: "import { UnoptimizedTasksView as TasksView } from '../unoptimized/views/tasks/unoptimizedtasksview.jsx';",
  },
  {
    file: path.join(pagesDir, 'profilepage.jsx'),
    name: 'ProfilePage',
    optimized: "import { ProfileView } from '../views/profile/profileview.jsx';",
    unoptimized: "import { UnoptimizedProfileView as ProfileView } from '../unoptimized/views/profile/unoptimizedprofileview.jsx';",
  },
  {
    file: path.join(pagesDir, 'notfoundpage.jsx'),
    name: 'NotFoundPage',
    optimized: "import { NotFoundView } from '../views/layout/notfoundview.jsx';",
    unoptimized: "import { UnoptimizedNotFoundView as NotFoundView } from '../unoptimized/views/layout/unoptimizednotfoundview.jsx';",
  },
];

function getCurrentMode() {
  const taskPageContent = fs.readFileSync(ALL_PAGES[5].file, 'utf8');
  if (taskPageContent.includes('unoptimized')) {
    return 'unoptimized';
  }
  return 'optimized';
}

function switchMode(targetMode) {
  const currentMode = getCurrentMode();
  let modeToSet = targetMode;

  if (targetMode === 'toggle') {
    modeToSet = currentMode === 'optimized' ? 'unoptimized' : 'optimized';
  }

  console.log('\n================================================================');
  console.log(` 🔄 Full Application Performance Architecture Switcher`);
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

    if (modeToSet === 'unoptimized') {
      if (content.includes(page.optimized)) {
        content = content.replace(page.optimized, page.unoptimized);
        fs.writeFileSync(page.file, content, 'utf8');
        console.log(`  🔻 ${page.name.padEnd(20)} -> ⚠️ UNOPTIMIZED (Laggy Demo Mode)`);
        updatedCount++;
      } else {
        console.log(`  ℹ️ ${page.name.padEnd(20)} is already UNOPTIMIZED.`);
      }
    } else {
      if (content.includes(page.unoptimized)) {
        content = content.replace(page.unoptimized, page.optimized);
        fs.writeFileSync(page.file, content, 'utf8');
        console.log(`  🚀 ${page.name.padEnd(20)} -> ✨ OPTIMIZED (Clean High-Performance)`);
        updatedCount++;
      } else {
        console.log(`  ℹ️ ${page.name.padEnd(20)} is already OPTIMIZED.`);
      }
    }
  }

  console.log('\n----------------------------------------------------------------');
  if (modeToSet === 'unoptimized') {
    console.log(`⚠️ Active Mode: UNOPTIMIZED ACROSS ENTIRE APPLICATION`);
    console.log(`📊 Demonstrates:`);
    console.log(`   - In-render CPU blocking loops on keystrokes and renders`);
    console.log(`   - 1,000 un-virtualized DOM table rows and cards simultaneously`);
    console.log(`   - Non-debounced search inputs causing typing jank`);
    console.log(`   - 3x full-array scans on Kanban columns and interval memory leaks`);
  } else {
    console.log(`🚀 Active Mode: OPTIMIZED CLEAN ARCHITECTURE`);
    console.log(`✨ Demonstrates:`);
    console.log(`   - Server-side pagination & URL search param synchronization`);
    console.log(`   - Reusable generic DataTable with sortable headers & skeleton rows`);
    console.log(`   - Reusable FilterBar with 300ms debounced search & view switcher`);
    console.log(`   - FormModal dialogs and 60 FPS responsive interactions`);
  }
  console.log('----------------------------------------------------------------\n');
}

const requestedArg = (process.argv[2] || 'toggle').toLowerCase();

if (!['optimized', 'unoptimized', 'toggle'].includes(requestedArg)) {
  console.error(`Invalid argument: ${requestedArg}. Use 'optimized', 'unoptimized', or 'toggle'.`);
  process.exit(1);
}

switchMode(requestedArg);

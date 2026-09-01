import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'frontend', 'src', 'pages');

const PAGE_MAPPINGS = [
  {
    file: path.join(pagesDir, 'taskspage.jsx'),
    name: 'TasksPage',
    optimized: "import { TasksView } from '../views/tasks/tasksview.jsx';",
    unoptimized: "import { UnoptimizedTasksView as TasksView } from '../unoptimized/views/tasks/unoptimizedtasksview.jsx';",
  },
  {
    file: path.join(pagesDir, 'projectspage.jsx'),
    name: 'ProjectsPage',
    optimized: "import { ProjectsView } from '../views/projects/projectsview.jsx';",
    unoptimized: "import { UnoptimizedProjectsView as ProjectsView } from '../unoptimized/views/projects/unoptimizedprojectsview.jsx';",
  },
  {
    file: path.join(pagesDir, 'dashboardpage.jsx'),
    name: 'DashboardPage',
    optimized: "import { DashboardView } from '../views/dashboard/dashboardview.jsx';",
    unoptimized: "import { UnoptimizedDashboardView as DashboardView } from '../unoptimized/views/dashboard/unoptimizeddashboardview.jsx';",
  },
  {
    file: path.join(pagesDir, 'profilepage.jsx'),
    name: 'ProfilePage',
    optimized: "import { ProfileView } from '../views/profile/profileview.jsx';",
    unoptimized: "import { UnoptimizedProfileView as ProfileView } from '../unoptimized/views/profile/unoptimizedprofileview.jsx';",
  },
];

function getCurrentMode() {
  const taskPageContent = fs.readFileSync(PAGE_MAPPINGS[0].file, 'utf8');
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

  console.log('\n======================================================');
  console.log(` 🔄 React Architecture Performance Switcher`);
  console.log(` Current Mode: [${currentMode.toUpperCase()}]`);
  console.log(` Target Mode:  [${modeToSet.toUpperCase()}]`);
  console.log('======================================================\n');

  let updatedCount = 0;

  for (const page of PAGE_MAPPINGS) {
    if (!fs.existsSync(page.file)) {
      console.warn(`⚠️ Warning: ${page.file} does not exist.`);
      continue;
    }

    let content = fs.readFileSync(page.file, 'utf8');

    if (modeToSet === 'unoptimized') {
      if (content.includes(page.optimized)) {
        content = content.replace(page.optimized, page.unoptimized);
        fs.writeFileSync(page.file, content, 'utf8');
        console.log(`  🔻 Switched ${page.name} -> ⚠️ UNOPTIMIZED (Laggy Demo Mode)`);
        updatedCount++;
      } else {
        console.log(`  ℹ️ ${page.name} is already using UNOPTIMIZED imports.`);
      }
    } else {
      if (content.includes(page.unoptimized)) {
        content = content.replace(page.unoptimized, page.optimized);
        fs.writeFileSync(page.file, content, 'utf8');
        console.log(`  🚀 Switched ${page.name} -> ✨ OPTIMIZED (Fast Clean Mode)`);
        updatedCount++;
      } else {
        console.log(`  ℹ️ ${page.name} is already using OPTIMIZED imports.`);
      }
    }
  }

  console.log('\n------------------------------------------------------');
  if (modeToSet === 'unoptimized') {
    console.log(`⚠️ Active Mode: UNOPTIMIZED`);
    console.log(`📊 Demonstrating in-render blocking loops, un-virtualized 1000 DOM nodes, and non-debounced inputs.`);
  } else {
    console.log(`🚀 Active Mode: OPTIMIZED`);
    console.log(`✨ Demonstrating paginated DataTable, debounced FilterBar, table skeletons, and 60 FPS performance.`);
  }
  console.log('------------------------------------------------------\n');
}

// Read CLI argument (optimized | unoptimized | toggle)
const requestedArg = (process.argv[2] || 'toggle').toLowerCase();

if (!['optimized', 'unoptimized', 'toggle'].includes(requestedArg)) {
  console.error(`Invalid argument: ${requestedArg}. Use 'optimized', 'unoptimized', or 'toggle'.`);
  process.exit(1);
}

switchMode(requestedArg);

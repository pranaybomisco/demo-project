import { sequelize, User, Project, ProjectMember, Task } from './index.js';
import { hashPassword } from '../utils/password.util.js';
import { ROLES, TASK_STATUS, TASK_PRIORITY, SERVER_MESSAGES } from '../constants/index.js';
import { logger } from '../config/logger.js';

export async function seed() {
  logger.info(SERVER_MESSAGES.SEED_START);
  await sequelize.sync({ force: true });

  const passwordHash = await hashPassword('Password123!');

  // 1. Core Demo Users + Team Members
  const coreUsersData = [
    { email: 'admin@example.com', passwordHash, name: 'Sarah Admin', role: ROLES.ADMIN },
    { email: 'manager@example.com', passwordHash, name: 'Michael Manager', role: ROLES.MANAGER },
    { email: 'member@example.com', passwordHash, name: 'Emily Member', role: ROLES.MEMBER },
  ];

  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Logan', 'Cameron',
    'Dakota', 'Reese', 'Skyler', 'Kendall', 'Quinn', 'Harper', 'Rowan', 'Finley', 'River', 'Sage',
    'Devon', 'Kai', 'Hayden', 'Peyton', 'Ellis', 'Amari', 'Rory', 'Shiloh', 'Lennon', 'Milan'
  ];

  const lastNames = [
    'Chen', 'Patel', 'Smith', 'Johnson', 'Williams', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
  ];

  const additionalUsersData = [];
  for (let i = 0; i < 25; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3 + 7) % lastNames.length];
    const role = i % 5 === 0 ? ROLES.MANAGER : ROLES.MEMBER;
    additionalUsersData.push({
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i + 1}@example.com`,
      passwordHash,
      name: `${fName} ${lName}`,
      role,
    });
  }

  const createdUsers = await User.bulkCreate([...coreUsersData, ...additionalUsersData], { returning: true });
  logger.info(`Users seeded: ${createdUsers.length} total users (admin@example.com, manager@example.com, member@example.com)`);

  const admin = createdUsers.find((u) => u.email === 'admin@example.com');
  const manager = createdUsers.find((u) => u.email === 'manager@example.com');
  const member = createdUsers.find((u) => u.email === 'member@example.com');
  const allUserIds = createdUsers.map((u) => u.id);

  // 2. Projects Data (~50 Realistic Engineering Projects)
  const projectTemplates = [
    {
      name: 'Cloud Infrastructure Modernization',
      description: 'Migrating legacy monolithic backend services into scalable Kubernetes microservices with Terraform IaC.',
    },
    {
      name: 'Mobile App Redesign v2',
      description: 'Revamping mobile application UI/UX with smooth transitions, dark mode, and offline cache synchronization.',
    },
    {
      name: 'Zero-Trust Service Mesh Security',
      description: 'Implementing Istio mTLS and fine-grained authorization policies across all production clusters.',
    },
    {
      name: 'Real-time Analytics Engine',
      description: 'High-throughput telemetry ingestion pipeline using Apache Kafka, ClickHouse, and Grafana dashboards.',
    },
    {
      name: 'Design System & Component Library v3',
      description: 'Accessible WCAG 2.1 AA compliant UI kit built with modern tokens, CSS variables, and Storybook docs.',
    },
    {
      name: 'AI-Powered Search & Recommendations',
      description: 'Vector embeddings with pgvector and semantic search integration for fast document retrieval.',
    },
    {
      name: 'GraphQL Federation Gateway',
      description: 'Consolidating REST microservices into a unified GraphQL subgraph schema with Apollo Router.',
    },
    {
      name: 'Automated CI/CD Pipeline Overhaul',
      description: 'Standardizing GitHub Actions workflows with Docker build caching, SAST security scans, and preview deployments.',
    },
    {
      name: 'SOC2 Type II Compliance & Audit Readiness',
      description: 'Implementing automated audit logs, secret rotation in Vault, and comprehensive access control policies.',
    },
    {
      name: 'High-Performance Caching & PgBouncer',
      description: 'Optimizing PostgreSQL query execution and connection pooling under 10k concurrent req/sec peak loads.',
    },
    {
      name: 'Customer Billing & Subscription Engine',
      description: 'Stripe webhook idempotent processing, usage metering, and enterprise tier invoice generation.',
    },
    {
      name: 'Web Performance & Core Web Vitals',
      description: 'LCP/FID/CLS optimization, code splitting, edge SSR caching, and image modern format delivery.',
    },
    {
      name: 'Developer Experience (DevEx) Toolkit',
      description: 'Local development environment containerization, fast mock servers, and automated lint tooling.',
    },
    {
      name: 'Multi-Region Disaster Recovery Automation',
      description: 'Active-passive AWS and GCP cross-cloud automated failover orchestration and database replication.',
    },
    {
      name: 'Notification Hub & Event Dispatcher',
      description: 'Unified push, email, SMS, and webhook delivery engine with exponential backoff retries.',
    },
    {
      name: 'Role-Based Access Control (RBAC) 2.0',
      description: 'Fine-grained resource permissions, organizational hierarchy, and session token rotation.',
    },
    {
      name: 'Edge API Gateway & Rate Limiting',
      description: 'Distributed token bucket rate limiting with Redis and Cloudflare edge workers integration.',
    },
    {
      name: 'Data Lake & ETL Pipeline Migration',
      description: 'Migrating legacy batch jobs into Apache Spark streaming pipelines and Parquet formatted storage.',
    },
    {
      name: 'Public Developer API & SDK Release',
      description: 'OpenAPI 3.1 specifications, rate-limited API keys, and auto-generated TypeScript and Python SDKs.',
    },
    {
      name: 'Internal Admin Backoffice Portal',
      description: 'Audit trails, user impersonation for customer support, and system feature flag management.',
    },
  ];

  const projectCreationList = [];
  for (let i = 0; i < 45; i++) {
    const template = projectTemplates[i % projectTemplates.length];
    const suffix = i >= projectTemplates.length ? ` Phase ${Math.floor(i / projectTemplates.length) + 1}` : '';
    const ownerId = i % 3 === 0 ? manager.id : i % 3 === 1 ? admin.id : createdUsers[i % createdUsers.length].id;

    projectCreationList.push({
      name: `${template.name}${suffix}`,
      description: template.description,
      ownerId,
    });
  }

  const createdProjects = await Project.bulkCreate(projectCreationList, { returning: true });
  logger.info(`Projects created: ${createdProjects.length} total projects`);

  // 3. Project Memberships
  const membersList = [];
  for (const proj of createdProjects) {
    // Ensure admin, manager, member are on each project
    membersList.push({ projectId: proj.id, userId: proj.ownerId, role: ROLES.ADMIN });
    if (proj.ownerId !== admin.id) membersList.push({ projectId: proj.id, userId: admin.id, role: ROLES.ADMIN });
    if (proj.ownerId !== manager.id) membersList.push({ projectId: proj.id, userId: manager.id, role: ROLES.MANAGER });
    if (proj.ownerId !== member.id) membersList.push({ projectId: proj.id, userId: member.id, role: ROLES.MEMBER });

    // Add 3-6 other random team members
    for (let m = 0; m < 4; m++) {
      const randomUser = createdUsers[(proj.id.charCodeAt(0) + m * 5) % createdUsers.length];
      if (!membersList.some((entry) => entry.projectId === proj.id && entry.userId === randomUser.id)) {
        membersList.push({ projectId: proj.id, userId: randomUser.id, role: ROLES.MEMBER });
      }
    }
  }

  await ProjectMember.bulkCreate(membersList, { ignoreDuplicates: true });
  logger.info('Project memberships assigned');

  // 4. Generate ~1000 Realistic Tasks
  const taskActionVerbs = [
    'Implement', 'Refactor', 'Configure', 'Audit', 'Optimize', 'Migrate', 'Design', 'Deploy',
    'Fix', 'Benchmark', 'Automate', 'Document', 'Integrate', 'Validate', 'Investigate', 'Monitor'
  ];

  const taskDomains = [
    'OAuth2 Refresh Token Rotation with PKCE',
    'PostgreSQL Query Plan for Composite Index',
    'Redis Cache Invalidation Strategy',
    'Kubernetes Horizontal Pod Autoscaler (HPA)',
    'GraphQL Subgraph Schema Resolution',
    'Docker Multi-Stage Build Layer Optimization',
    'Terraform S3 State Lock with DynamoDB',
    'WCAG 2.1 Contrast & Accessibility Testing',
    'Kafka Consumer Group Rebalance Handling',
    'Rate Limiter Token Bucket Algorithm',
    'API Response Compression with Brotli/Gzip',
    'Zero-Downtime Database Migration Script',
    'OpenTelemetry Distributed Tracing Spans',
    'Stripe Webhook Signature Verification',
    'Dark/Light Theme CSS Variables Sync',
    'JWT Payload Expiry & Revocation List',
    'WebSocket Reconnection Exponential Backoff',
    'CI/CD Pipeline SAST Code Vulnerability Scan',
    'ClickHouse Partition Pruning Performance',
    'Client-side State Hydration with Redux Toolkit',
    'Micro-frontend Module Federation Config',
    'Session Inactivity Timeout & Warning Modal',
    'Automated Playwright End-to-End Test Suite',
    'Cloudflare DNS & SSL Edge Certificate Renewal',
    'Nginx Reverse Proxy Keep-Alive Connection Pool',
    'Elasticsearch Shard Rebalancing Strategy',
    'Content Security Policy (CSP) Nonce Headers',
    'Swagger OpenAPI 3.0 Documentation Endpoint',
    'Blob Storage Presigned Upload URL Generation',
    'Data Export CSV Streaming Memory Optimization'
  ];

  const taskDetails = [
    'Ensure comprehensive test coverage with unit and integration tests.',
    'Benchmark latency under high concurrency and document performance metrics.',
    'Verify acceptance criteria with stakeholders and update technical specifications.',
    'Implement backward-compatible schema changes to avoid breaking downstream consumers.',
    'Add structured logging and custom Prometheus metrics for operational observability.',
    'Configure fallback mechanisms and graceful degradation when dependent services fail.',
    'Audit security permissions to adhere to the principle of least privilege.'
  ];

  const statuses = [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE];
  const priorities = [TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH, TASK_PRIORITY.CRITICAL];

  const now = Date.now();
  const tasksToCreate = [];
  const TOTAL_TASKS_TARGET = 1000;

  for (let i = 0; i < TOTAL_TASKS_TARGET; i++) {
    const verb = taskActionVerbs[i % taskActionVerbs.length];
    const domain = taskDomains[(i * 3 + 5) % taskDomains.length];
    const detail = taskDetails[i % taskDetails.length];
    const project = createdProjects[i % createdProjects.length];

    const status = statuses[i % 3 === 0 ? 2 : i % 3 === 1 ? 1 : 0];
    const priority = priorities[(i * 7) % priorities.length];

    // Dates spread from 30 days ago to 30 days in the future
    const dayOffset = (i % 60) - 20; // some overdue (negative offset), some future
    const dueDate = new Date(now + dayOffset * 24 * 60 * 60 * 1000);
    const createdAt = new Date(now - (Math.abs(dayOffset) + 5) * 24 * 60 * 60 * 1000);

    const creatorId = i % 4 === 0 ? manager.id : i % 4 === 1 ? admin.id : member.id;
    const assigneeId = allUserIds[(i * 2 + 1) % allUserIds.length];

    tasksToCreate.push({
      title: `${verb} ${domain}`,
      description: `${verb} ${domain} across the platform. ${detail}`,
      status,
      priority,
      dueDate,
      createdAt,
      updatedAt: createdAt,
      projectId: project.id,
      creatorId,
      assigneeId,
    });
  }

  // Chunk create for optimal database batch performance
  const chunkSize = 250;
  for (let i = 0; i < tasksToCreate.length; i += chunkSize) {
    const chunk = tasksToCreate.slice(i, i + chunkSize);
    await Task.bulkCreate(chunk);
  }

  logger.info(`Tasks seeded: ${tasksToCreate.length} tasks generated across ${createdProjects.length} projects`);
  logger.info(SERVER_MESSAGES.SEED_COMPLETE);
}

if (process.argv[1]?.includes('seed.js')) {
  seed().then(() => process.exit(0)).catch((err) => {
    logger.error(SERVER_MESSAGES.SEED_ERROR, { error: err.message, stack: err.stack });
    process.exit(1);
  });
}

/**
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
  mode: 'optimized', // 'optimized' | 'unoptimized'
};

export default BACKEND_PERF_CONFIG;

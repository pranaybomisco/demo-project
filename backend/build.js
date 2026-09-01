import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { SERVER_MESSAGES } from './src/constants/messages.constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  console.log(SERVER_MESSAGES.STARTING_BACKEND_BUILD);

  // Ensure output directory exists
  const distDir = path.resolve(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy swagger docs to dist
  const swaggerSrc = path.resolve(__dirname, 'src/swagger/swagger.yaml');
  const swaggerDestDir = path.resolve(__dirname, 'dist/swagger');
  if (!fs.existsSync(swaggerDestDir)) {
    fs.mkdirSync(swaggerDestDir, { recursive: true });
  }
  fs.copyFileSync(swaggerSrc, path.resolve(swaggerDestDir, 'swagger.yaml'));

  await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'src/server.js')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    outfile: path.resolve(__dirname, 'dist/server.bundle.js'),
    sourcemap: true,
    banner: {
      js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
    },
    external: [
      'pg-native',
      'bcryptjs',
      'pg',
      'pg-hstore',
      'sequelize',
      'yamljs',
      'swagger-ui-express',
    ],
  });

  console.log(SERVER_MESSAGES.BUILD_SUCCESS);
}

build().catch((err) => {
  console.error(SERVER_MESSAGES.BUILD_FAILED, err);
  process.exit(1);
});

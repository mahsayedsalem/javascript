import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { CONFIG_FILE } from '../utils/getConfiguration.js';
import { getCLIRoot } from '../utils/getMonorepoRoot.js';

/**
 * Performs one-time machine-level configuration tasks such as creating a blank config file.
 */
export async function init() {
  const cliRoot = getCLIRoot();

  /** @type import('../utils/getConfiguration.js').Configuration */
  const configuration = {
    $schema: join(cliRoot, 'packages', 'dev', 'schema.json'),
    root: null,
    activeInstance: 'default',
    instances: {
      default: {
        secretKey: 'sk_REPLACE_WITH_SECRET_KEY',
        publishableKey: 'pk_REPLACE_WITH_PUBLISHABLE_KEY',
        fapiUrl: 'REPLACE_WITH_FAPI_URL',
        bapiUrl: 'https://api.clerk.com',
      },
    },
  };

  await writeFile(CONFIG_FILE, JSON.stringify(configuration, null, 2), 'utf-8');

  if (process.env.VISUAL) {
    spawn(process.env.VISUAL, [CONFIG_FILE], {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
    });
    console.log(`Configuration file written to ${CONFIG_FILE}.`);
  } else if (process.env.EDITOR) {
    spawn(process.env.EDITOR, [CONFIG_FILE], {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
    });
    console.log(`Configuration file written to ${CONFIG_FILE}.`);
  } else {
    console.log(`Configuration file written to ${CONFIG_FILE}. Replace with your values.`);
  }
}

import 'dotenv/config';
import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID. Set it before running Sanity CLI commands.'
  );
}

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: 'd25tnupyrahf7u2zi7wgareh',
  },
});

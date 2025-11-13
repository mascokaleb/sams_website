import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemaTypes';
import { singletonTypeNames, structure } from './structure';

if (typeof window === 'undefined') {
  await import('dotenv/config');
}

const env =
  (typeof process !== 'undefined' && process.env) ||
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (typeof import.meta !== 'undefined' ? (import.meta as { env?: Record<string, string> }).env : {}) ||
  {};

const projectId = env.SANITY_STUDIO_PROJECT_ID;
const dataset = env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID. Set it in sanity/.env before running the Studio.'
  );
}

const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'samuel-masco-studio',
  title: 'Samuel Masco CMS',
  projectId,
  dataset,
  plugins: [
    deskTool({
      structure: (S, context) => structure(S, context),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'structure') {
        return prev.filter(
          (templateItem) => !singletonTypeNames.includes(templateItem.templateId)
        );
      }
      return prev;
    },
    actions: (prev, { schemaType }) =>
      singletonTypeNames.includes(schemaType)
        ? prev.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : prev,
  },
});

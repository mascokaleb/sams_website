import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemaTypes';
import { singletonTypeNames, structure } from './structure';

// Env vars are loaded by `sanity.cli.ts` (which does a synchronous
// `import 'dotenv/config'`) for CLI commands, and by Vite's build-time
// substitution for the browser bundle. We intentionally do NOT load dotenv
// from this file — the Sanity manifest extractor evaluates this config in
// an isolated context that can't reliably handle top-level await or dynamic
// dotenv imports, and those failures surfaced as manifest warnings during
// `sanity deploy`. Missing env vars are still caught cleanly by the throw in
// sanity.cli.ts before any CLI command is actually executed.
const env =
  (typeof process !== 'undefined' && process.env) ||
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (typeof import.meta !== 'undefined' ? (import.meta as { env?: Record<string, string> }).env : {}) ||
  {};

// During manifest extraction the projectId may be absent because dotenv was
// never loaded — Sanity only needs the shape of this config there, not live
// values. Fall back to a labelled placeholder so a mis-configured runtime
// still produces a recognisable error rather than an opaque crash.
const projectId = env.SANITY_STUDIO_PROJECT_ID || 'missing-sanity-project-id';
const dataset = env.SANITY_STUDIO_DATASET || 'production';

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

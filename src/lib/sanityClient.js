import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion =
  import.meta.env.VITE_SANITY_API_VERSION || new Date().toISOString().split('T')[0];

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null;

export async function fetchSitePreview() {
  if (!sanityClient) {
    console.warn(
      'Sanity client not initialized. Set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET to enable CMS data.'
    );
    return null;
  }

  try {
    const query = `{
      "site": *[_type == "siteSettings"][0]{siteTitle, tagline, seoDescription},
      "hero": *[_type == "heroSection"][0]{headline, tagline, "metrics": metrics[]{label, value}}
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Failed to fetch Sanity preview data', error);
    return null;
  }
}

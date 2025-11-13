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

const siteContentQuery = `{
  "site": *[_type == "siteSettings"][0]{siteTitle, tagline, seoDescription},
  "hero": *[_type == "heroSection"][0]{
    tagline,
    headline,
    subheadline,
    bio,
    photoCaption,
    primaryCta,
    secondaryCta,
    "headshot": headshot{
      alt,
      "url": asset->url
    },
    "metrics": metrics[]{label, value}
  },
  "about": *[_type == "aboutSection"][0]{
    heading,
    subheading,
    profileCardTitle,
    profileFacts,
    mindsetTitle,
    mindsetBody,
    quickHitsTitle,
    quickHits
  },
  "resume": *[_type == "resumeSection"][0]{
    heading,
    subheading,
    performanceTitle,
    performanceStats,
    trainingTitle,
    trainingBody,
    experienceTitle,
    experienceList
  },
  "academics": *[_type == "academicsSection"][0]{
    heading,
    subheading,
    schoolCardTitle,
    gpa,
    honors,
    apCourses,
    transcriptLabel,
    transcriptUrl,
    interestsTitle,
    interestsBody
  },
  "highlightsSection": *[_type == "highlightsSection"][0]{heading, subheading, maxItems},
  "highlightEvents": *[_type == "highlightEvent" && (defined(featured) ? featured : true)]|order(coalesce(manualOrder, 9999) asc, eventDate desc){
    title,
    eventDate,
    dateLabel,
    summary,
    results[]{description}
  },
  "videosSection": *[_type == "videosSection"][0]{heading, subheading, maxItems},
  "videos": *[_type == "videoHighlight"]|order(coalesce(manualOrder, 9999) asc, _createdAt desc){
    title,
    youtubeId,
    description,
    ctaLabel,
    "thumbnailUrl": thumbnail.asset->url,
    "thumbnailAlt": thumbnail.alt
  },
  "dualSport": *[_type == "dualSportSection"][0]{heading, subheading, cards},
  "contact": *[_type == "contactSection"][0]{heading, subheading, cards}
}`;

export async function fetchSiteContent() {
  if (!sanityClient) {
    console.warn(
      'Sanity client not initialized. Set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET to enable CMS data.'
    );
    return null;
  }

  try {
    return await sanityClient.fetch(siteContentQuery);
  } catch (error) {
    console.error('Failed to fetch Sanity content', error);
    return null;
  }
}

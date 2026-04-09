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
  "site": *[_type == "siteSettings"][0]{
    siteTitle,
    tagline,
    seoDescription,
    brandMarkInitials,
    "brandMarkImage": brandMarkImage{
      alt,
      "url": asset->url,
      focalPoint,
      hotspot
    }
  },
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
      "url": asset->url,
      focalPoint,
      hotspot
    },
    "metrics": metrics[]{label, value}
  },
  "coachSnapshot": *[_type == "coachSnapshot"][0]{
    eyebrow,
    heading,
    subheading,
    classYear,
    gpaUnweighted,
    gpaWeighted,
    satScore,
    actScore,
    ncaaId,
    ncaaStatus,
    transcriptLabel,
    transcriptUrl,
    parentName,
    parentRole,
    parentEmail,
    parentPhone,
    clubCoachName,
    clubCoachOrg,
    clubCoachEmail,
    clubCoachPhone,
    hsCoachName,
    hsCoachEmail,
    hsCoachPhone,
    verifiedAt
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
    clubYardagesTitle,
    clubYardages,
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
  "upcomingTournamentsSection": *[_type == "upcomingTournamentsSection"][0]{heading, subheading, maxItems},
  "upcomingTournaments": *[_type == "upcomingTournament"]|order(eventDate asc, _createdAt asc){
    _id,
    course,
    location,
    eventDate,
    endDate,
    yardage,
    _createdAt
  },
  "highlightEvents": *[_type == "highlightEvent"]|order(eventDate desc, _createdAt desc){
    _id,
    title,
    eventDate,
    endDate,
    summary,
    days[]{
      label,
      score,
      yardage,
      rankingPosition,
      rankingOutOf,
      notes
    },
    featured,
    showOnHomePage,
    pinToTop,
    _createdAt
  },
  "videosSection": *[_type == "videosSection"][0]{heading, subheading, maxItems},
  "videos": *[_type == "videoHighlight"]|order(eventDate desc, _createdAt desc){
    title,
    youtubeId,
    youtubeUrl,
    description,
    tags,
    "tournament": tournament->{
      _id,
      title
    },
    eventDate,
    featured,
    showOnHomePage,
    pinToTop,
    _createdAt,
    "thumbnailUrl": thumbnail.asset->url,
    "thumbnailAlt": thumbnail.alt,
    "thumbnailFocalPoint": thumbnail.focalPoint,
    "thumbnailHotspot": thumbnail.hotspot,
    "thumbnailCrop": thumbnail.crop
  },
  "gallerySection": *[_type == "gallerySection"][0]{heading, subheading, maxItems, ctaLabel},
  "galleryPhotos": *[_type == "galleryPhoto"]|order(shotDate desc, _createdAt desc){
    title,
    description,
    shotDate,
    location,
    "tournament": tournament->{
      _id,
      title
    },
    photographer,
    tags,
    featured,
    showOnHomePage,
    pinToTop,
    _createdAt,
    "image": photo{
      alt,
      "url": asset->url,
      focalPoint,
      hotspot,
      crop
    }
  },
  "dualSport": *[_type == "dualSportSection"][0]{
    heading,
    subheading,
    cards[]{
      title,
      body,
      bulletPoints,
      "image": image{
        alt,
        "url": asset->url,
        focalPoint,
        hotspot,
        crop
      }
    }
  },
  "contact": *[_type == "contactSection"][0]{heading, subheading, cards}
}`;

export async function fetchSiteContent() {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const devData = await fetchViaDevProxy();
    if (devData) {
      return devData;
    }
  }

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

async function fetchViaDevProxy() {
  try {
    const base = window.location.origin.replace(/\/$/, '');
    const proxyUrl = `${base}/sanity-proxy/v${apiVersion}/data/query/${dataset}`;
    const params = new URLSearchParams({
      perspective: 'published',
      query: siteContentQuery,
      returnQuery: 'false',
    });
    const response = await fetch(`${proxyUrl}?${params.toString()}`);
    if (!response.ok) {
      console.warn('Sanity proxy request failed', response.status, response.statusText);
      return null;
    }
    const payload = await response.json();
    return payload?.result ?? null;
  } catch (error) {
    console.warn('Sanity proxy request error', error);
    return null;
  }
}

import type { StructureResolver } from 'sanity/desk';

const singletonDocs = [
  { title: 'Site Settings', type: 'siteSettings', id: 'siteSettings' },
  { title: 'Hero', type: 'heroSection', id: 'heroSection' },
  { title: 'Coach Snapshot', type: 'coachSnapshot', id: 'coachSnapshot' },
  { title: 'About', type: 'aboutSection', id: 'aboutSection' },
  { title: 'Golf Resume', type: 'resumeSection', id: 'resumeSection' },
  { title: 'Academics', type: 'academicsSection', id: 'academicsSection' },
  { title: 'Tournaments Section', type: 'highlightsSection', id: 'highlightsSection' },
  {
    title: 'Upcoming Tournaments Section',
    type: 'upcomingTournamentsSection',
    id: 'upcomingTournamentsSection',
  },
  { title: 'Videos Section', type: 'videosSection', id: 'videosSection' },
  { title: 'Gallery Section', type: 'gallerySection', id: 'gallerySection' },
  { title: 'Dual-Sport', type: 'dualSportSection', id: 'dualSportSection' },
  { title: 'Contact', type: 'contactSection', id: 'contactSection' },
  { title: 'Footer', type: 'footerSection', id: 'footerSection' },
];

export const singletonTypeNames = singletonDocs.map((item) => item.type);

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      ...singletonDocs.map(({ title, type, id }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(type).documentId(type))
      ),
      S.divider(),
      S.listItem()
        .title('Tournament Highlights')
        .schemaType('highlightEvent')
        .child(S.documentTypeList('highlightEvent').title('Tournament Highlights')),
      S.listItem()
        .title('Upcoming Tournaments')
        .schemaType('upcomingTournament')
        .child(
          S.documentTypeList('upcomingTournament')
            .title('Upcoming Tournaments')
            .defaultOrdering([{ field: 'eventDate', direction: 'asc' }])
        ),
      S.listItem()
        .title('Video Highlights')
        .schemaType('videoHighlight')
        .child(S.documentTypeList('videoHighlight').title('Video Highlights')),
      S.listItem()
        .title('Photo Gallery')
        .schemaType('galleryPhoto')
        .child(S.documentTypeList('galleryPhoto').title('Photo Gallery')),
    ]);

import type { StructureResolver } from 'sanity/desk';

const singletonDocs = [
  { title: 'Site Settings', type: 'siteSettings', id: 'siteSettings' },
  { title: 'Hero', type: 'heroSection', id: 'heroSection' },
  { title: 'About', type: 'aboutSection', id: 'aboutSection' },
  { title: 'Golf Resume', type: 'resumeSection', id: 'resumeSection' },
  { title: 'Academics', type: 'academicsSection', id: 'academicsSection' },
  { title: 'Highlights Section Copy', type: 'highlightsSection', id: 'highlightsSection' },
  { title: 'Videos Section Copy', type: 'videosSection', id: 'videosSection' },
  { title: 'Dual-Sport', type: 'dualSportSection', id: 'dualSportSection' },
  { title: 'Contact', type: 'contactSection', id: 'contactSection' },
];

export const singletonTypeNames = singletonDocs.map((item) => item.type);

export const structure: StructureResolver = (S) =>
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
      S.documentTypeListItem('highlightEvent').title('Tournament Highlights'),
      S.documentTypeListItem('videoHighlight').title('Video Highlights'),
    ]);

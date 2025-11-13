import type { StructureResolver } from 'sanity/desk';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

const singletonDocs = [
  { title: 'Site Settings', type: 'siteSettings', id: 'siteSettings' },
  { title: 'Hero', type: 'heroSection', id: 'heroSection' },
  { title: 'About', type: 'aboutSection', id: 'aboutSection' },
  { title: 'Golf Resume', type: 'resumeSection', id: 'resumeSection' },
  { title: 'Academics', type: 'academicsSection', id: 'academicsSection' },
  { title: 'Highlights Section', type: 'highlightsSection', id: 'highlightsSection' },
  { title: 'Videos Section', type: 'videosSection', id: 'videosSection' },
  { title: 'Dual-Sport', type: 'dualSportSection', id: 'dualSportSection' },
  { title: 'Contact', type: 'contactSection', id: 'contactSection' },
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
      orderableDocumentListDeskItem({
        S,
        context,
        type: 'highlightEvent',
        title: 'Tournament Highlights',
      }),
      orderableDocumentListDeskItem({
        S,
        context,
        type: 'videoHighlight',
        title: 'Video Highlights',
      }),
    ]);

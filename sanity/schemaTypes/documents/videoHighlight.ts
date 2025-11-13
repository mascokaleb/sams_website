import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

export const videoHighlight = defineType({
  name: 'videoHighlight',
  title: 'Video Highlight',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeId',
      type: 'string',
      title: 'YouTube Video ID',
      description: 'Only paste the ID (e.g., M7lc1UVf-VE).',
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-zA-Z0-9_-]{11}$/, {
            name: 'YouTube ID',
            invert: false,
          })
          .error('Must be a valid 11-character YouTube video ID.'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      title: 'Description',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Custom Thumbnail',
      description: 'Optional — defaults to the YouTube thumbnail.',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      title: 'Button Label',
      initialValue: 'Play Highlight',
    }),
    orderRankField({ type: 'videoHighlight' }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'title',
      subtitle: 'youtubeId',
      media: 'thumbnail',
    },
  },
});

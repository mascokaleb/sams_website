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
      description: 'Only paste the ID (e.g., M7lc1UVf-VE). Optional if the full link is provided below.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) {
            return true;
          }

          return /^[a-zA-Z0-9_-]{11}$/.test(value)
            ? true
            : 'Must be a valid 11-character YouTube video ID.';
        }),
    }),
    defineField({
      name: 'youtubeUrl',
      type: 'string',
      title: 'YouTube Video Link',
      description: 'Paste the full YouTube URL (https://youtu.be/... or https://youtube.com/watch?v=...).',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) {
            return true;
          }

          const trimmed = value.trim();
          if (!trimmed) {
            return true;
          }

          const isYouTubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(trimmed);
          return isYouTubeUrl ? true : 'Enter a valid YouTube URL.';
        }),
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
  validation: (Rule) =>
    Rule.custom((doc) => {
      if (doc?.youtubeId || doc?.youtubeUrl) {
        return true;
      }
      return 'Add a YouTube video ID or paste the full link.';
    }),
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'title',
      youtubeId: 'youtubeId',
      youtubeUrl: 'youtubeUrl',
      media: 'thumbnail',
    },
    prepare(selection) {
      const { title, youtubeId, youtubeUrl, media } = selection;
      return {
        title,
        subtitle: youtubeId || youtubeUrl || 'Missing YouTube reference',
        media,
      };
    },
  },
});

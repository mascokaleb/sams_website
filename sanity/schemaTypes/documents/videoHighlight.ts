import { defineField, defineType } from 'sanity';

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
      name: 'eventDate',
      type: 'date',
      title: 'Highlight Date',
      description: 'Used for chronological sorting and filtering.',
      options: {
        dateFormat: 'MMM DD, YYYY',
      },
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
      name: 'tournament',
      type: 'reference',
      title: 'Tournament',
      description: 'Link this clip to a tournament highlight that already exists.',
      to: [{ type: 'highlightEvent' }],
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
    defineField({
      name: 'showOnHomePage',
      type: 'boolean',
      title: 'Show on home page',
      description: 'Disable to keep this clip off the homepage video grid.',
      initialValue: true,
    }),
    defineField({
      name: 'pinToTop',
      type: 'boolean',
      title: 'Featured clip',
      description: 'Featured clips float to the top of the video gallery with an accent treatment.',
      initialValue: false,
    }),
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((doc) => {
      if (doc?.youtubeId || doc?.youtubeUrl) {
        return true;
      }
      return 'Add a YouTube video ID or paste the full link.';
    }),
  orderings: [],
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

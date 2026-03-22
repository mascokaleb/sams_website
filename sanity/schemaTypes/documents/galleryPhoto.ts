import { defineField, defineType } from 'sanity';
import { SiteFocusImageInput } from '../components/SiteFocusImageInput';

export const galleryPhoto = defineType({
  name: 'galleryPhoto',
  title: 'Gallery Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shotDate',
      type: 'date',
      title: 'When was this captured?',
      description: 'Used for chronological sorting and filters.',
      options: { dateFormat: 'MMM DD, YYYY' },
    }),
    defineField({
      name: 'tournament',
      type: 'reference',
      title: 'Tournament',
      description: 'Link this photo to a tournament highlight that already exists.',
      to: [{ type: 'highlightEvent' }],
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      title: 'Caption',
    }),
    defineField({
      name: 'photo',
      type: 'image',
      title: 'Photo',
      components: {
        input: SiteFocusImageInput,
      },
      options: {
        hotspot: true,
      },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({
          name: 'focalPoint',
          type: 'focalPoint',
          hidden: true,
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photographer',
      type: 'string',
      title: 'Photo Credit',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured photo',
      description: 'Featured photos float to the top of the gallery and get accent styling.',
      initialValue: false,
    }),
    defineField({
      name: 'showOnHomePage',
      type: 'boolean',
      title: 'Show on home page',
      description: 'Disable to keep this image off the homepage gallery preview.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'photo',
      subtitle: 'tournament',
      date: 'shotDate',
    },
    prepare(selection) {
      const { title, media, subtitle, date } = selection;
      const dateText = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      const summary = [subtitle, dateText].filter(Boolean).join(' • ');
      return {
        title,
        media,
        subtitle: summary || 'Gallery asset',
      };
    },
  },
});

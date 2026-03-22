import { defineField, defineType } from 'sanity';
import { SiteFocusImageInput } from '../components/SiteFocusImageInput';

export const dualCard = defineType({
  name: 'dualCard',
  title: 'Dual-Sport Card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Card Image',
      description: 'Optional image shown at the top of the card.',
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
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Body',
      rows: 3,
    }),
    defineField({
      name: 'bulletPoints',
      type: 'array',
      title: 'Bullet Points',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'body',
      media: 'image',
    },
  },
});

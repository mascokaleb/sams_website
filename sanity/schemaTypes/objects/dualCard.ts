import { defineType } from 'sanity';

export const dualCard = defineType({
  name: 'dualCard',
  title: 'Dual-Sport Card',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      type: 'text',
      title: 'Body',
      rows: 3,
    },
    {
      name: 'bulletPoints',
      type: 'array',
      title: 'Bullet Points',
      of: [{ type: 'string' }],
    },
  ],
});

import { defineField, defineType } from 'sanity';

export const dualSportSection = defineType({
  name: 'dualSportSection',
  title: 'Dual-Sport Athlete',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      type: 'text',
      rows: 3,
      title: 'Intro Copy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cards',
      type: 'array',
      title: 'Cards',
      of: [{ type: 'dualCard' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});

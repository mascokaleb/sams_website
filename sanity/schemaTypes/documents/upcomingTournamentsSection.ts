import { defineField, defineType } from 'sanity';

export const upcomingTournamentsSection = defineType({
  name: 'upcomingTournamentsSection',
  title: 'Upcoming Tournaments Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      initialValue: 'Upcoming Tournaments',
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
      name: 'maxItems',
      type: 'number',
      title: 'Max Entries To Display',
      initialValue: 8,
    }),
  ],
});

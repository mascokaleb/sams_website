import { defineField, defineType } from 'sanity';

export const highlightsSection = defineType({
  name: 'highlightsSection',
  title: 'Tournament Highlights Section',
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
      name: 'maxItems',
      type: 'number',
      title: 'Max Events To Display',
      initialValue: 5,
    }),
  ],
});

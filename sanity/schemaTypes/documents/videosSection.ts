import { defineField, defineType } from 'sanity';

export const videosSection = defineType({
  name: 'videosSection',
  title: 'Video Section',
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
      title: 'Max Videos To Display',
      initialValue: 3,
    }),
  ],
});

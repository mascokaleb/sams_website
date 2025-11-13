import { defineField, defineType } from 'sanity';

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact',
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
      of: [{ type: 'contactCard' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});

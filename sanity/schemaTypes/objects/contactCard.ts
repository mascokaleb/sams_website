import { defineType } from 'sanity';

export const contactCard = defineType({
  name: 'contactCard',
  title: 'Contact Card',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'entries',
      type: 'array',
      title: 'Entries',
      of: [{ type: 'contactEntry' }],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
});

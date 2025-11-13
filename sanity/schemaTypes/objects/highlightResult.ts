import { defineType } from 'sanity';

export const highlightResult = defineType({
  name: 'highlightResult',
  title: 'Result Detail',
  type: 'object',
  fields: [
    {
      name: 'description',
      type: 'string',
      title: 'Description',
      validation: (Rule) => Rule.required(),
    },
  ],
});

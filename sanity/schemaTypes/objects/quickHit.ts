import { defineType } from 'sanity';

export const quickHit = defineType({
  name: 'quickHit',
  title: 'Quick Hit',
  type: 'object',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Label',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'value',
      type: 'string',
      title: 'Value',
      validation: (Rule) => Rule.required(),
    },
  ],
});

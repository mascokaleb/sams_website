import { defineType } from 'sanity';

export const statItem = defineType({
  name: 'statItem',
  title: 'Stat Item',
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

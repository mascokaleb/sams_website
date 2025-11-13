import { defineType } from 'sanity';

export const metric = defineType({
  name: 'metric',
  title: 'Metric',
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

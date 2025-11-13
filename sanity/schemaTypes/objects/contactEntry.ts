import { defineType } from 'sanity';

export const contactEntry = defineType({
  name: 'contactEntry',
  title: 'Contact Entry',
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
    {
      name: 'link',
      type: 'url',
      title: 'Link (optional)',
      description: 'Use for tel:, mailto:, or https links.',
    },
    {
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {
        list: [
          { title: 'Phone', value: 'phone' },
          { title: 'Email', value: 'email' },
          { title: 'Address', value: 'address' },
          { title: 'Social', value: 'social' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    },
  ],
});

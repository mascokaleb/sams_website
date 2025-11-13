import { defineType } from 'sanity';

export const profileFact = defineType({
  name: 'profileFact',
  title: 'Profile Fact',
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

import { defineField, defineType } from 'sanity';

export const focalPoint = defineType({
  name: 'focalPoint',
  title: 'Site Focus Point',
  type: 'object',
  fields: [
    defineField({
      name: 'x',
      type: 'number',
      hidden: true,
    }),
    defineField({
      name: 'y',
      type: 'number',
      hidden: true,
    }),
  ],
});

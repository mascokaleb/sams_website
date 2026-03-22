import { defineField, defineType } from 'sanity';
import { FocalPointInput } from '../components/FocalPointInput';

export const focalPoint = defineType({
  name: 'focalPoint',
  title: 'Center Point',
  type: 'object',
  components: {
    input: FocalPointInput,
  },
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

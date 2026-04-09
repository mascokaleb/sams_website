import { defineField, defineType } from 'sanity';

export const clubYardage = defineType({
  name: 'clubYardage',
  title: 'Club Yardage',
  type: 'object',
  fields: [
    defineField({
      name: 'club',
      type: 'string',
      title: 'Club',
      description: 'Club name (e.g., Driver, 3-Wood, 7-Iron, Sand Wedge).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'yardage',
      type: 'string',
      title: 'Yardage',
      description: 'Typical carry/total yardage (e.g., "250", "210 yds").',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'club',
      subtitle: 'yardage',
    },
  },
});

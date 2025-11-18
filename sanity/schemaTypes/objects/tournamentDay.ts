import { defineField, defineType } from 'sanity';

export const tournamentDay = defineType({
  name: 'tournamentDay',
  title: 'Tournament Day',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Day label',
      description: 'Optional label such as "Day 1".',
    }),
    defineField({
      name: 'score',
      type: 'number',
      title: 'Score',
      description: 'Enter the numeric score for the day.',
    }),
    defineField({
      name: 'yardage',
      type: 'number',
      title: 'Yardage (yards)',
    }),
    defineField({
      name: 'rankingPosition',
      type: 'number',
      title: 'Ranking position',
    }),
    defineField({
      name: 'rankingOutOf',
      type: 'number',
      title: 'Field size',
    }),
    defineField({
      name: 'rankingLabel',
      type: 'string',
      title: 'Ranking label',
      description: 'Optional text when ranking cannot be expressed numerically.',
    }),
    defineField({
      name: 'notes',
      type: 'text',
      rows: 2,
      title: 'Notes',
    }),
  ],
});

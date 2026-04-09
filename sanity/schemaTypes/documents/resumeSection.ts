import { defineField, defineType } from 'sanity';

export const resumeSection = defineType({
  name: 'resumeSection',
  title: 'Golf Resume',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      type: 'text',
      rows: 3,
      title: 'Intro Copy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'performanceTitle',
      type: 'string',
      title: 'Performance Panel Title',
      initialValue: 'Performance Snapshot',
    }),
    defineField({
      name: 'performanceStats',
      type: 'array',
      title: 'Performance Stats',
      of: [{ type: 'statItem' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'clubYardagesTitle',
      type: 'string',
      title: 'Club Yardages Title',
      initialValue: 'Club Yardages',
    }),
    defineField({
      name: 'clubYardages',
      type: 'array',
      title: 'Club Yardages',
      description: 'List of clubs with typical yardages, shown as bullet points in the Performance Snapshot panel.',
      of: [{ type: 'clubYardage' }],
    }),
    defineField({
      name: 'trainingTitle',
      type: 'string',
      title: 'Training Panel Title',
      initialValue: 'Training Routine',
    }),
    defineField({
      name: 'trainingBody',
      type: 'blockContent',
      title: 'Training Copy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'experienceTitle',
      type: 'string',
      title: 'Experience Panel Title',
      initialValue: 'Playing Experience',
    }),
    defineField({
      name: 'experienceList',
      type: 'array',
      title: 'Experience List',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});

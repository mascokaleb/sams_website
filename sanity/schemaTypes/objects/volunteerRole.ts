import { defineField, defineType } from 'sanity';

export const volunteerRole = defineType({
  name: 'volunteerRole',
  title: 'Volunteer Role',
  type: 'object',
  fields: [
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role',
      description: 'e.g. "Volunteer Junior Golf Coach"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      type: 'string',
      title: 'Organization',
      description: 'e.g. "Hiwan Golf Club"',
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      description: 'e.g. "Evergreen, Colorado"',
    }),
    defineField({
      name: 'timeframe',
      type: 'string',
      title: 'Timeframe',
      description: 'e.g. "May – July 2025"',
    }),
    defineField({
      name: 'program',
      type: 'string',
      title: 'Program',
      description: 'e.g. "PGA Jr. League & Developmental Program"',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      title: 'Description',
      description: 'e.g. "Assisted with coaching golf for children ages 6-13."',
    }),
    defineField({
      name: 'hours',
      type: 'string',
      title: 'Hours Completed',
      description:
        'e.g. "40". Leave blank until you have the total — the hours line stays hidden until this is filled in, and you can update it any time.',
    }),
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'organization',
    },
  },
});

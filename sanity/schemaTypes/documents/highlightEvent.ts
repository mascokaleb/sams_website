import { defineField, defineType } from 'sanity';

export const highlightEvent = defineType({
  name: 'highlightEvent',
  title: 'Tournament Highlight',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Event Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      type: 'date',
      title: 'Event Date',
      options: {
        dateFormat: 'MMM DD, YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location / Course',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      title: 'Summary',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'results',
      type: 'array',
      title: 'Result Details',
      of: [{ type: 'highlightResult' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
      initialValue: true,
    }),
    defineField({
      name: 'manualOrder',
      type: 'number',
      title: 'Manual Order (lower = first)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eventDate',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date set',
      };
    },
  },
});

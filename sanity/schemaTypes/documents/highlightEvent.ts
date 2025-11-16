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
      name: 'dateLabel',
      type: 'string',
      title: 'Date Label Override',
      description: 'Optional custom text such as "Oct 18–19, 2025"; defaults to the formatted event date.',
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
      name: 'showOnHomePage',
      type: 'boolean',
      title: 'Show on home page',
      description: 'Disable to hide this highlight from the main highlights timeline.',
      initialValue: true,
    }),
    defineField({
      name: 'pinToTop',
      type: 'boolean',
      title: 'Featured highlight',
      description: 'Featured highlights float to the top of the timeline with a special accent.',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'manualOrder',
      type: 'number',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [],
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

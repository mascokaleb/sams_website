import { defineField, defineType } from 'sanity';

export const upcomingTournament = defineType({
  name: 'upcomingTournament',
  title: 'Upcoming Tournament',
  type: 'document',
  fields: [
    defineField({
      name: 'course',
      type: 'string',
      title: 'Golf Course',
      description: 'Name of the golf course hosting the tournament.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      description: 'City (and state if helpful), e.g., "Denver, CO".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      type: 'date',
      title: 'Start Date',
      options: {
        dateFormat: 'MMM DD, YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      title: 'End Date',
      description: 'Optional end date for multi-day tournaments.',
      options: {
        dateFormat: 'MMM DD, YYYY',
      },
    }),
    defineField({
      name: 'yardage',
      type: 'string',
      title: 'Yardage',
      description: 'Total course yardage (e.g., "6,750" or "6750 yds").',
    }),
  ],
  orderings: [
    {
      title: 'Event Date, Earliest First',
      name: 'eventDateAsc',
      by: [{ field: 'eventDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'course',
      subtitle: 'eventDate',
      location: 'location',
    },
    prepare(selection) {
      const { title, subtitle, location } = selection;
      const dateLabel = subtitle ? new Date(subtitle).toLocaleDateString() : 'No date set';
      const locationLabel = location ? ` • ${location}` : '';
      return {
        title: title || 'Upcoming tournament',
        subtitle: `${dateLabel}${locationLabel}`,
      };
    },
  },
});

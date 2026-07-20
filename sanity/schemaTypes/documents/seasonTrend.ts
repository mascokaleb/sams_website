import { defineField, defineType } from 'sanity';

/**
 * Season Trend — one document per season for the "Score Trends" chart on the
 * Tournament Highlights page.
 *
 * Seasons that already have tournaments in the library (2025 onward) are
 * CALCULATED AUTOMATICALLY from each tournament's day scores, so no document
 * is needed for them. Create documents only for seasons that predate the
 * tournament library (e.g. 2023, 2024). If a document exists for a season
 * that also has live data, the document's numbers win.
 */
export const seasonTrend = defineType({
  name: 'seasonTrend',
  title: 'Season Score Trend',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      type: 'string',
      title: 'Season (year)',
      description: 'e.g. "2023". Only needed for seasons with no tournaments in the library — newer seasons chart themselves automatically.',
      validation: (Rule) =>
        Rule.required().regex(/^\d{4}$/, { name: 'four-digit year', invert: false }),
    }),
    defineField({
      name: 'highScore',
      type: 'number',
      title: 'High Score (18 holes)',
      description: 'Highest tournament round of the season.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lowScore',
      type: 'number',
      title: 'Low Score (18 holes)',
      description: 'Lowest (best) tournament round of the season.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'averageScore',
      type: 'number',
      title: 'Average Score',
      description: 'Average tournament round for the season. One decimal is fine, e.g. 92.4.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'note',
      type: 'string',
      title: 'Note',
      description: 'Optional footnote for this season, e.g. "Partial season".',
    }),
  ],
  preview: {
    select: {
      title: 'year',
      high: 'highScore',
      low: 'lowScore',
      avg: 'averageScore',
    },
    prepare({ title, high, low, avg }) {
      const parts = [
        low != null ? `low ${low}` : null,
        avg != null ? `avg ${avg}` : null,
        high != null ? `high ${high}` : null,
      ].filter(Boolean);
      return {
        title: title || 'Season',
        subtitle: parts.join(' · '),
      };
    },
  },
});

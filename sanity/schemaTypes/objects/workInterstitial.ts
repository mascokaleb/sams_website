import { defineField, defineType } from 'sanity';

// The "The Work" stat list sits beside Mindset & Goals: three quiet rows,
// each a number plus a short uppercase label ("10 / years playing",
// "5-6 / days a week training", "34 / tournaments since 2025"). Any row left
// blank is hidden in the renderer; if the whole object is empty the list
// derives real numbers automatically — years/days from the Quick Hits list
// and the tournament count from the tournament library — and if nothing is
// derivable the strip stays hidden entirely.
export const workInterstitial = defineType({
  name: 'workInterstitial',
  title: 'The Work Interstitial',
  type: 'object',
  fields: [
    defineField({
      name: 'kicker',
      type: 'string',
      title: 'Kicker',
      description: 'Small uppercase label above the numbers.',
      initialValue: 'The Work',
    }),
    defineField({
      name: 'lineOneNumber',
      type: 'string',
      title: 'Line 1 — Number',
      description: 'Big display number for the first row (e.g. "9").',
    }),
    defineField({
      name: 'lineOneUnit',
      type: 'string',
      title: 'Line 1 — Unit',
      description: 'Label beside the first number (e.g. "years playing").',
    }),
    defineField({
      name: 'lineTwoNumber',
      type: 'string',
      title: 'Line 2 — Number',
      description: 'Big display number for the second row (e.g. "5-6").',
    }),
    defineField({
      name: 'lineTwoUnit',
      type: 'string',
      title: 'Line 2 — Unit',
      description: 'Label beside the second number (e.g. "days a week training").',
    }),
    defineField({
      name: 'lineThreeNumber',
      type: 'string',
      title: 'Line 3 — Number',
      description:
        'Number for the third row. Leave blank (with the whole section blank) to show the live tournament count automatically.',
    }),
    defineField({
      name: 'lineThreeUnit',
      type: 'string',
      title: 'Line 3 — Unit',
      description: 'Label beside the third number (e.g. "tournaments since 2025").',
    }),
  ],
  preview: {
    select: {
      kicker: 'kicker',
      one: 'lineOneNumber',
      two: 'lineTwoNumber',
      three: 'lineThreeNumber',
    },
    prepare({ kicker, one, two, three }) {
      const numbers = [one, two, three].filter(Boolean).join(' · ');
      return {
        title: kicker || 'The Work',
        subtitle: numbers || 'No numbers set',
      };
    },
  },
});

import { defineField, defineType } from 'sanity';

// The "The Work" interstitial is the dark full-bleed band between the About
// cards and the Golf Resume. Three rows, each with a big display number and a
// short italic unit ("9 / years", "5-6 / days a week", "1 / goal."). Any row
// left blank is hidden in the renderer; if the whole object is empty the
// interstitial falls back to deriving years/days from the Quick Hits list,
// and if neither is present the strip stays hidden entirely.
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
      description: 'Italic unit beside the first number (e.g. "years").',
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
      description: 'Italic unit beside the second number (e.g. "days a week").',
    }),
    defineField({
      name: 'lineThreeNumber',
      type: 'string',
      title: 'Line 3 — Number',
      description: 'Big display number for the third row (e.g. "1").',
    }),
    defineField({
      name: 'lineThreeUnit',
      type: 'string',
      title: 'Line 3 — Unit',
      description: 'Italic unit beside the third number (e.g. "goal.").',
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

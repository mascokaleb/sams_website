import { defineField, defineType } from 'sanity';

// The footer is the dark full-bleed "Let's Talk." closing moment. Everything
// here is optional — the renderer falls back to sensible defaults if the
// singleton is missing so the page never renders a broken footer.
export const footerSection = defineType({
  name: 'footerSection',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'kicker',
      type: 'string',
      title: 'Kicker',
      description: 'Small label above the headline (e.g. "05 — Open For Recruiting").',
      initialValue: '05 — Open For Recruiting',
    }),
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      description:
        'Big serif closing moment. Use a line break if you want it stacked (e.g. "Let\'s|Talk.").',
      initialValue: 'Let\u2019s|Talk.',
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      title: 'CTA Label',
      description: 'Text for the Get in touch button beneath the headline.',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'playerLabel',
      type: 'string',
      title: 'Player column label',
      initialValue: 'Player',
    }),
    defineField({
      name: 'playerName',
      type: 'string',
      title: 'Player name',
      initialValue: 'Samuel Masco',
    }),
    defineField({
      name: 'playerClassYear',
      type: 'string',
      title: 'Class year',
      initialValue: 'Class of 2029',
    }),
    defineField({
      name: 'playerLocation',
      type: 'string',
      title: 'Location',
      initialValue: 'Evergreen, Colorado',
    }),
    defineField({
      name: 'exploreLabel',
      type: 'string',
      title: 'Explore column label',
      initialValue: 'Explore',
    }),
    defineField({
      name: 'exploreLinks',
      type: 'array',
      title: 'Explore links',
      description: 'Jump links shown in the middle footer column.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({
              name: 'href',
              type: 'string',
              title: 'Target',
              description: 'An in-page anchor (e.g. "#highlights") or a full URL.',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'directLabel',
      type: 'string',
      title: 'Direct column label',
      initialValue: 'Direct',
    }),
    defineField({
      name: 'baseLine',
      type: 'string',
      title: 'Base line',
      description: 'Small mono text at the very bottom of the footer.',
      initialValue: 'Built with care for the recruiting journey of Samuel Masco · Class of 2029.',
    }),
    defineField({
      name: 'copyrightName',
      type: 'string',
      title: 'Copyright holder',
      description: 'Name used in the © line alongside the current year.',
      initialValue: 'Samuel Masco',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'kicker' },
    prepare({ title, subtitle }) {
      const cleaned = typeof title === 'string' ? title.replace(/\|/g, ' / ') : 'Footer';
      return { title: cleaned, subtitle: subtitle || '' };
    },
  },
});

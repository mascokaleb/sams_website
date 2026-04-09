import { defineField, defineType } from 'sanity';

export const aboutSection = defineType({
  name: 'aboutSection',
  title: 'About',
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
      name: 'profileCardTitle',
      type: 'string',
      title: 'Profile Card Title',
      initialValue: 'Profile',
    }),
    defineField({
      name: 'profileFacts',
      type: 'array',
      title: 'Profile Facts',
      of: [{ type: 'profileFact' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'mindsetTitle',
      type: 'string',
      title: 'Mindset Card Title',
      initialValue: 'Mindset & Goals',
    }),
    defineField({
      name: 'mindsetBody',
      type: 'blockContent',
      title: 'Mindset Copy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quickHitsTitle',
      type: 'string',
      title: 'Quick Hits Title',
      initialValue: 'Quick Hits',
    }),
    defineField({
      name: 'quickHits',
      type: 'array',
      title: 'Quick Hit Rows',
      of: [{ type: 'quickHit' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'workInterstitial',
      type: 'workInterstitial',
      title: 'The Work Interstitial',
      description:
        'Dark full-bleed strip between About and the Golf Resume. Leave empty to auto-derive years/days from Quick Hits.',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'subheading' },
  },
});

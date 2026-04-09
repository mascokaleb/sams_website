import { defineField, defineType } from 'sanity';
import { SiteFocusImageInput } from '../components/SiteFocusImageInput';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      type: 'string',
      title: 'Tagline',
      description: 'Short descriptor shown above the main headline.',
    }),
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheadline',
      type: 'text',
      rows: 3,
      title: 'Supporting Copy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 4,
      title: 'Intro Paragraph',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCta',
      type: 'cta',
      title: 'Primary CTA',
    }),
    defineField({
      name: 'secondaryCta',
      type: 'cta',
      title: 'Secondary CTA',
    }),
    defineField({
      name: 'headshot',
      type: 'image',
      title: 'Hero Photo',
      components: {
        input: SiteFocusImageInput,
      },
      options: {
        hotspot: true,
      },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({
          name: 'focalPoint',
          type: 'focalPoint',
          hidden: true,
        }),
      ],
    }),
    defineField({
      name: 'photoCaption',
      type: 'string',
      title: 'Photo Caption',
    }),
    defineField({
      name: 'metrics',
      type: 'array',
      title: 'Key Metrics',
      of: [{ type: 'metric' }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'accolades',
      type: 'array',
      title: 'Accolades Marquee',
      description:
        'Short phrases that scroll across the dark ticker below the hero (e.g. "Rookie of the Year 2025"). Keep each item under ~40 characters. If left empty, the marquee auto-parses the Playing Experience list in the Resume section.',
      of: [
        {
          type: 'string',
          validation: (Rule) => Rule.max(80),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'tagline',
      media: 'headshot',
    },
  },
});

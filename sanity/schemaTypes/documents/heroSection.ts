import { defineField, defineType } from 'sanity';

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
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
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
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'tagline',
      media: 'headshot',
    },
  },
});

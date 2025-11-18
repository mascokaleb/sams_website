import { defineField, defineType } from 'sanity';

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Gallery Section',
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
      title: 'Intro Copy',
      rows: 3,
    }),
    defineField({
      name: 'maxItems',
      type: 'number',
      title: 'Max Photos To Display On Home',
      description: 'Controls how many images render on the homepage grid.',
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(12),
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      title: 'Gallery Button Label',
      initialValue: 'Explore the full gallery',
    }),
    defineField({
      name: 'ctaHref',
      type: 'string',
      title: 'Gallery Button Link',
      description: 'Use a relative path (gallery.html) or full URL.',
      initialValue: 'gallery.html',
    }),
  ],
});

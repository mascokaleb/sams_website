import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      type: 'string',
      title: 'Site Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      title: 'Site Tagline',
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      rows: 3,
      title: 'SEO Description',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ogImage',
      type: 'image',
      title: 'Default Open Graph Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
  ],
});

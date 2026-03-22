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
      name: 'brandMarkInitials',
      type: 'string',
      title: 'Brand Mark Initials',
      description: 'Fallback letters shown in the nav logo when no image is provided.',
    }),
    defineField({
      name: 'brandMarkImage',
      type: 'image',
      title: 'Navigation Logo',
      description: 'Optional logo that replaces the “SM” circle.',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({
          name: 'focalPoint',
          type: 'focalPoint',
          title: 'Center Point',
        }),
      ],
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
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({
          name: 'focalPoint',
          type: 'focalPoint',
          title: 'Center Point',
        }),
      ],
    }),
  ],
});

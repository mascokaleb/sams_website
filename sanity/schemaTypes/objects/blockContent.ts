import { defineField, defineType } from 'sanity';
import { SiteFocusImageInput } from '../components/SiteFocusImageInput';

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.required().uri({
                    allowRelative: false,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab?',
              },
            ],
          },
        ],
      },
    },
    defineField({
      type: 'image',
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
  ],
});

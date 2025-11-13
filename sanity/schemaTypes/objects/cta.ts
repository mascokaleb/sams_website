import { defineType } from 'sanity';

export const cta = defineType({
  name: 'cta',
  title: 'Call To Action',
  type: 'object',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Button Label',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'href',
      type: 'string',
      title: 'URL or Anchor',
      description: 'Accepts absolute URLs, mailto/tel links, or on-page anchors (e.g., #contact).',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) {
            return 'A destination is required.';
          }
          const allowedProtocols = ['http://', 'https://', 'mailto:', 'tel:'];
          const isAnchor = value.startsWith('#');
          const isRelative = value.startsWith('/');
          const hasAllowedProtocol = allowedProtocols.some((prefix) => value.startsWith(prefix));

          if (isAnchor || isRelative || hasAllowedProtocol) {
            return true;
          }
          return 'Enter an absolute URL, mailto/tel link, relative path, or anchor link.';
        }),
    },
    {
      name: 'style',
      type: 'string',
      title: 'Style',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Ghost', value: 'ghost' },
          { title: 'Subtle', value: 'subtle' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    },
  ],
});

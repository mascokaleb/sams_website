import { defineField, defineType } from 'sanity';

export const academicsSection = defineType({
  name: 'academicsSection',
  title: 'Academics',
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
      name: 'schoolCardTitle',
      type: 'string',
      title: 'School Card Title',
      initialValue: 'Evergreen High School',
    }),
    defineField({
      name: 'gpa',
      type: 'string',
      title: 'GPA',
    }),
    defineField({
      name: 'honors',
      type: 'string',
      title: 'Honors / AP',
    }),
    defineField({
      name: 'apCourses',
      type: 'string',
      title: 'AP / IB Status',
    }),
    defineField({
      name: 'transcriptLabel',
      type: 'string',
      title: 'Transcript Button Label',
      initialValue: 'Transcript (available upon request)',
    }),
    defineField({
      name: 'transcriptUrl',
      type: 'url',
      title: 'Transcript URL',
      description: 'Leave blank to render a disabled button.',
    }),
    defineField({
      name: 'interestsTitle',
      type: 'string',
      title: 'Academic Interests Title',
      initialValue: 'Academic Interests',
    }),
    defineField({
      name: 'interestsBody',
      type: 'blockContent',
      title: 'Academic Interests Body',
      validation: (Rule) => Rule.required(),
    }),
  ],
});

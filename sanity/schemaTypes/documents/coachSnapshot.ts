import { defineField, defineType } from 'sanity';

/**
 * Coach Snapshot — the scannable recruiting one-pager that sits at the top
 * of the home page. Every field is optional so editors can populate it over
 * time; the front-end hides any row whose value is missing.
 */
export const coachSnapshot = defineType({
  name: 'coachSnapshot',
  title: 'Coach Snapshot',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      title: 'Eyebrow',
      description: 'Small uppercase label above the section heading.',
      initialValue: 'Coach Snapshot',
    }),
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      initialValue: 'The 30-second read',
    }),
    defineField({
      name: 'subheading',
      type: 'text',
      rows: 2,
      title: 'Intro Copy',
      description: 'One-line context for the coach. Optional.',
    }),

    // --- Academic identity ---
    defineField({
      name: 'classYear',
      type: 'string',
      title: 'Class Year',
      description: 'e.g. "Class of 2029"',
    }),
    defineField({
      name: 'gpaUnweighted',
      type: 'string',
      title: 'GPA (Unweighted)',
    }),
    defineField({
      name: 'gpaWeighted',
      type: 'string',
      title: 'GPA (Weighted)',
    }),
    defineField({
      name: 'satScore',
      type: 'string',
      title: 'SAT',
      description: 'Optional. e.g. "1320"',
    }),
    defineField({
      name: 'actScore',
      type: 'string',
      title: 'ACT',
      description: 'Optional. e.g. "29"',
    }),

    // --- NCAA eligibility ---
    defineField({
      name: 'ncaaId',
      type: 'string',
      title: 'NCAA Eligibility Center ID',
    }),
    defineField({
      name: 'ncaaStatus',
      type: 'string',
      title: 'NCAA Status',
      description: 'e.g. "Registered", "Certified", "In Progress"',
    }),

    // --- Transcript ---
    defineField({
      name: 'transcriptLabel',
      type: 'string',
      title: 'Transcript Link Label',
      initialValue: 'Download transcript',
    }),
    defineField({
      name: 'transcriptUrl',
      type: 'url',
      title: 'Transcript URL',
      description: 'Leave blank to hide the transcript button.',
    }),

    // --- Key recruiting contacts ---
    defineField({
      name: 'parentName',
      type: 'string',
      title: 'Parent / Guardian Name',
    }),
    defineField({
      name: 'parentRole',
      type: 'string',
      title: 'Parent / Guardian Relationship',
      description: 'e.g. "Father", "Mother", "Guardian"',
    }),
    defineField({
      name: 'parentEmail',
      type: 'string',
      title: 'Parent / Guardian Email',
    }),
    defineField({
      name: 'parentPhone',
      type: 'string',
      title: 'Parent / Guardian Phone',
    }),

    defineField({
      name: 'clubCoachName',
      type: 'string',
      title: 'Club / Private Coach Name',
    }),
    defineField({
      name: 'clubCoachOrg',
      type: 'string',
      title: 'Club / Private Coach Affiliation',
    }),
    defineField({
      name: 'clubCoachEmail',
      type: 'string',
      title: 'Club / Private Coach Email',
    }),
    defineField({
      name: 'clubCoachPhone',
      type: 'string',
      title: 'Club / Private Coach Phone',
    }),

    defineField({
      name: 'hsCoachName',
      type: 'string',
      title: 'High School Coach Name',
    }),
    defineField({
      name: 'hsCoachEmail',
      type: 'string',
      title: 'High School Coach Email',
    }),
    defineField({
      name: 'hsCoachPhone',
      type: 'string',
      title: 'High School Coach Phone',
    }),

    defineField({
      name: 'verifiedAt',
      type: 'date',
      title: 'Last Verified',
      description: 'Shown as a "Verified" timestamp for coaches.',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'classYear',
    },
  },
});

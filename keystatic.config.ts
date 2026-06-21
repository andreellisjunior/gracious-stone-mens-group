import { collection, config, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER!,
      name: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME!,
    },
  },
  ui: {
    brand: { name: 'Gracious Stone' },
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'data/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        lastmod: fields.date({ label: 'Last Modified' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        authors: fields.array(fields.text({ label: 'Author' }), {
          label: 'Authors',
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),

    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'data/authors/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        avatar: fields.text({ label: 'Avatar URL' }),
        occupation: fields.text({ label: 'Occupation' }),
        company: fields.text({ label: 'Company' }),
        email: fields.text({ label: 'Email' }),
        twitter: fields.text({ label: 'Twitter' }),
        linkedin: fields.text({ label: 'LinkedIn' }),
        github: fields.text({ label: 'GitHub' }),
        content: fields.mdx({ label: 'Bio' }),
      },
    }),

    podcast: collection({
      label: 'Podcast Episodes',
      slugField: 'title',
      path: 'data/podcast/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        spotifyUrl: fields.url({ label: 'Spotify URL' }),
        content: fields.mdx({ label: 'Content (leave blank)' }),
      },
    }),
  },
})

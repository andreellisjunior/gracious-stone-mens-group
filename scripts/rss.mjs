import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs, allPodcastEpisodes } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const tagData = JSON.parse(readFileSync('./app/tag-data.json', 'utf-8'))

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

const generatePodcastItem = (config, episode) => `
  <item>
    <guid>${config.siteUrl}/podcast/${episode.slug}</guid>
    <title>${escape(episode.title)}</title>
    <link>${config.siteUrl}/podcast/${episode.slug}</link>
    ${episode.summary ? `<description>${escape(episode.summary)}</description>` : ''}
    <pubDate>${new Date(episode.date).toUTCString()}</pubDate>
    ${episode.audioUrl ? `<enclosure url="${escape(episode.audioUrl)}" type="audio/mpeg" />` : ''}
  </item>
`

const generatePodcastRss = (config, episodes) => `
  <rss version="2.0">
    <channel>
      <title>${escape(`${config.title} Podcast`)}</title>
      <link>${config.siteUrl}/podcast</link>
      <description>${escape('Latest episodes from Gracious Stone podcast.')}</description>
      <language>${config.language}</language>
      <lastBuildDate>${new Date(episodes[0].date).toUTCString()}</lastBuildDate>
      ${episodes.map((episode) => generatePodcastItem(config, episode)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts))
    writeFileSync(`./public/${page}`, rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = allBlogs.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
      const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
      const rssPath = path.join('public', 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, page), rss)
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)
  const podcastEpisodes = allPodcastEpisodes
    .filter((episode) => episode.draft !== true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  if (podcastEpisodes.length > 0) {
    const podcastFeed = generatePodcastRss(siteMetadata, podcastEpisodes)
    writeFileSync('./public/podcast-feed.xml', podcastFeed)
  }
  console.log('RSS feed generated...')
}
export default rss

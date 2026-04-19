import { MetadataRoute } from 'next'
import { allBlogs, allPodcastEpisodes } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const podcastRoutes = allPodcastEpisodes
    .filter((episode) => !episode.draft)
    .map((episode) => ({
      url: `${siteUrl}/${episode.path}`,
      lastModified: episode.date,
    }))

  const siteRoutes = [
    ...routes,
    { url: `${siteUrl}/podcast`, lastModified: new Date().toISOString().split('T')[0] },
  ]

  return [...siteRoutes, ...blogRoutes, ...podcastRoutes]
}

import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allPodcastEpisodes } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const episodes = allCoreContent(
    allPodcastEpisodes
      .filter((episode) => episode.draft !== true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )
  return <Main posts={posts} episodes={episodes} />
}

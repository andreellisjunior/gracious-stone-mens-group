import 'css/prism.css'
import 'katex/dist/katex.css'

import Link from '@/components/Link'
import { components } from '@/components/MDXComponents'
import SpotifyEmbed from '@/components/SpotifyEmbed'
import siteMetadata from '@/data/siteMetadata'
import { allPodcastEpisodes } from 'contentlayer/generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components.js'

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const episode = allPodcastEpisodes.find((item) => item.slug === slug)
  if (!episode) return

  return {
    title: episode.title,
    description: episode.summary,
    openGraph: {
      title: episode.title,
      description: episode.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date(episode.date).toISOString(),
      images: [episode.coverImage || siteMetadata.socialBanner],
    },
  }
}

export const generateStaticParams = async () => {
  return allPodcastEpisodes.map((episode) => ({ slug: episode.slug.split('/') }))
}

export default async function PodcastEpisodePage({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const episode = allPodcastEpisodes.find((item) => item.slug === slug)
  if (!episode) return notFound()

  return (
    <article className="pb-8">
      <div className="surface-panel p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">
          Podcast episode
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-navy dark:text-white">
          {episode.title}
        </h1>
        <p className="mt-3 text-brand-slate/80 dark:text-gray-300">{episode.summary}</p>
        {episode.spotifyUrl && <SpotifyEmbed url={episode.spotifyUrl} title={episode.title} />}
        <div className="mt-3 text-sm font-semibold text-primary-700 dark:text-primary-300">
          <Link href={episode.spotifyUrl || '/podcast'}>Open in Spotify &rarr;</Link>
        </div>
      </div>
      <div className="prose mt-6 max-w-none dark:prose-invert">
        <MDXLayoutRenderer code={episode.body.code} components={components} toc={episode.toc} />
      </div>
      <div className="mt-6">
        <Link
          href="/podcast"
          className="text-sm font-semibold text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
        >
          &larr; Back to podcast
        </Link>
      </div>
    </article>
  )
}

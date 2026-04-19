import Link from '@/components/Link'
import { allPodcastEpisodes } from 'contentlayer/generated'
import { allCoreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

export const metadata = genPageMetadata({
  title: 'Podcast',
  description: 'Listen to recent episodes from Gracious Stone on Spotify.',
})

export default function PodcastPage() {
  const episodes = allCoreContent(
    allPodcastEpisodes
      .filter((episode) => episode.draft !== true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  return (
    <section className="space-y-6 pb-8">
      <div className="surface-panel p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">Podcast</p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-navy dark:text-white">
          Gracious Stone Men's Group Podcast
        </h1>
        <p className="mt-3 max-w-2xl text-brand-slate/80 dark:text-gray-300">
          Regular conversations on faith, growth, brotherhood, and becoming the man God has called
          you to be.
        </p>
      </div>
      <ul className="grid gap-4">
        {episodes.map((episode) => (
          <li key={episode.slug} className="surface-card">
            <article>
              <time
                className="text-xs font-semibold uppercase tracking-wide text-primary-700"
                dateTime={episode.date}
              >
                {formatDate(episode.date, siteMetadata.locale)}
              </time>
              <h2 className="mt-2 text-2xl font-bold text-brand-navy dark:text-white">
                <Link href={`/podcast/${episode.slug}`}>{episode.title}</Link>
              </h2>
              {episode.duration && (
                <p className="mt-1 text-sm text-brand-slate/70 dark:text-gray-400">
                  Duration: {episode.duration}
                </p>
              )}
              <p className="mt-3 text-brand-slate/80 dark:text-gray-300">{episode.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                <Link
                  href={`/podcast/${episode.slug}`}
                  className="text-primary-700 dark:text-primary-300"
                >
                  Episode details &rarr;
                </Link>
                {episode.spotifyUrl && (
                  <Link
                    href={episode.spotifyUrl}
                    className="text-primary-700 dark:text-primary-300"
                  >
                    Open in Spotify &rarr;
                  </Link>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

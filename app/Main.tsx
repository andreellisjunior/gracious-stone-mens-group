import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 5

export default function Home({ posts, episodes = [] }: { posts: any[], episodes: any[] }) {
  const latestEpisode = episodes[0]

  return (
    <>
      <section className="grid gap-4 pb-10 pt-3 md:grid-cols-3">
        <div className="surface-panel bg-gradient-to-br from-[#122a52] to-[#0f2347] p-8 md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">
            Gracious Stone Men's Group
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Stand firm,
            <br />
            Brother.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-100/80">{siteMetadata.description}</p>
          <div className="mt-6">
            <Link href="/blog" className="cta-button" aria-label="Read recent reflections">
              Read reflections
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <aside className="surface-panel bg-brand-navy p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-200">
            Reflection of the day
          </p>
          <blockquote className="mt-4 text-2xl font-semibold leading-tight">
            "Iron sharpens iron, and one man sharpens another."
          </blockquote>
          <p className="mt-4 text-sm text-primary-100">Proverbs 27:17</p>
        </aside>
      </section>

      <section className="pb-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-3xl font-extrabold text-white">Latest from Gracious Stone</h2>
          <Link
            href="/blog"
            className="text-sm font-semibold text-primary-700 dark:text-primary-300"
          >
            View all articles
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="surface-card">
                <article>
                  <time
                    className="text-xs font-semibold uppercase tracking-wide text-primary-700"
                    dateTime={date}
                  >
                    {formatDate(date, siteMetadata.locale)}
                  </time>
                  <h3 className="mt-2 text-2xl font-bold leading-tight text-white">
                    <Link href={`/blog/${slug}`}>{title}</Link>
                  </h3>
                  <div className="mt-2 flex flex-wrap">
                    {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                  </div>
                  <p className="mt-4 text-gray-300">{summary}</p>
                  <div className="mt-5 text-sm font-semibold text-primary-700 dark:text-primary-300">
                    <Link href={`/blog/${slug}`} aria-label={`Read more: "${title}"`}>
                      Read article &rarr;
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="grid gap-4 pb-8 md:grid-cols-3">
        <div className="surface-card md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">
            Featured podcast
          </p>
          {latestEpisode ? (
            <>
              <h3 className="mt-2 text-3xl font-bold text-white">{latestEpisode.title}</h3>
              <p className="mt-3 text-gray-300">{latestEpisode.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/podcast/${latestEpisode.slug}`} className="cta-button">
                  Listen now
                </Link>
                <Link
                  href={latestEpisode.spotifyUrl || '/podcast'}
                  className="inline-flex items-center rounded-xl border border-primary-800 px-4 py-2 font-semibold text-gray-100"
                >
                  Open in Spotify
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-2 text-gray-300">Podcast episodes will appear here once synced.</p>
          )}
        </div>
        <div className="surface-card">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">Community</p>
          <ul className="mt-4 space-y-3 text-sm text-gray-300">
            <li>Active men online: 1,284</li>
            <li>Saturday brotherhood hike planning board</li>
            <li>Accountability tools and prayer prompts</li>
          </ul>
          <div className="mt-5 text-sm font-semibold text-primary-700 dark:text-primary-300">
            <Link href="/about#dates">View events &rarr;</Link>
          </div>
        </div>
      </section>

      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}

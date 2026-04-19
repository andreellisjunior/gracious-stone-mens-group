import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'podcast', 'generated')
const FEED_URL = process.env.PODCAST_FEED_URL
const MAX_EPISODES = Number(process.env.PODCAST_MAX_EPISODES || 24)

const xmlDecode = (value = '') =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")

const stripCdata = (value = '') =>
  value
    .replace(/^<!\[CDATA\[/i, '')
    .replace(/\]\]>$/i, '')
    .trim()

const readTag = (content, tag) => {
  const match = content.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'))
  return match ? stripCdata(xmlDecode(match[1].trim())) : ''
}

const readAttribute = (content, tag, attribute) => {
  const match = content.match(new RegExp(`<${tag}[^>]*${attribute}="([^"]+)"`, 'i'))
  return match ? xmlDecode(match[1]) : ''
}

const spotifyUrlFromUri = (uri = '') => {
  if (!uri.startsWith('spotify:')) return ''
  const parts = uri.split(':')
  if (parts.length < 3) return ''
  const entityType = parts[1]
  const entityId = parts[2]
  if (!entityType || !entityId) return ''
  return `https://open.spotify.com/${entityType}/${entityId}`
}

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const createFrontmatter = (episode) => {
  const summary = (episode.summary || '').replaceAll('"', '\\"')
  const guests =
    episode.guests.length > 0
      ? `\nguests:\n${episode.guests.map((g) => `  - "${g}"`).join('\n')}`
      : ''
  return `---
title: "${episode.title.replaceAll('"', '\\"')}"
date: ${episode.date}
summary: "${summary}"
spotifyUrl: "${episode.spotifyUrl}"
audioUrl: "${episode.audioUrl}"
duration: "${episode.duration}"${
    episode.episodeNumber ? `\nepisodeNumber: ${episode.episodeNumber}` : ''
  }${episode.season ? `\nseason: ${episode.season}` : ''}${
    episode.coverImage ? `\ncoverImage: "${episode.coverImage}"` : ''
  }${guests}
---
`
}

const createBody = (episode) => `
${episode.summary}

<SpotifyEmbed url="${episode.spotifyUrl}" title="${episode.title.replaceAll('"', '\\"')}" />
`

async function syncPodcast() {
  if (!FEED_URL) {
    console.log('PODCAST_FEED_URL is not set. Skipping podcast sync.')
    return
  }

  const response = await fetch(FEED_URL)
  if (!response.ok) {
    throw new Error(`Podcast sync failed with ${response.status} from ${FEED_URL}`)
  }

  const xml = await response.text()
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || []
  const episodes = itemMatches.slice(0, MAX_EPISODES).map((item, index) => {
    const title = readTag(item, 'title')
    const date = readTag(item, 'pubDate')
    const rawDescription = readTag(item, 'description') || readTag(item, 'itunes:summary')
    const summary = rawDescription
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 240)
    const spotifyUri =
      readTag(item, 'spotify:uri') ||
      readTag(item, 'spotify:episodeUri') ||
      readTag(item, 'spotify:showUri')
    const spotifyUrl = spotifyUrlFromUri(spotifyUri) || readTag(item, 'link')
    const audioUrl = readAttribute(item, 'enclosure', 'url')
    const duration = readTag(item, 'itunes:duration')
    const episodeNumber = Number(readTag(item, 'itunes:episode')) || undefined
    const season = Number(readTag(item, 'itunes:season')) || undefined
    const coverImage = readAttribute(item, 'itunes:image', 'href')
    const guests = []
    const parsedDate = date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    return {
      title: title || `Episode ${index + 1}`,
      date: parsedDate,
      summary: summary || 'Episode summary will be available soon.',
      spotifyUrl,
      audioUrl,
      duration,
      episodeNumber,
      season,
      coverImage,
      guests,
    }
  })

  mkdirSync(OUTPUT_DIR, { recursive: true })
  for (const existingFile of readdirSync(OUTPUT_DIR)) {
    rmSync(path.join(OUTPUT_DIR, existingFile), { force: true })
  }

  episodes.forEach((episode, index) => {
    const fileName = `${String(index + 1).padStart(2, '0')}-${toSlug(episode.title)}.mdx`
    const markdown = `${createFrontmatter(episode)}${createBody(episode)}`
    writeFileSync(path.join(OUTPUT_DIR, fileName), markdown)
  })

  console.log(`Podcast sync generated ${episodes.length} episode files.`)
}

syncPodcast().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

interface SpotifyEmbedProps {
  url?: string
  title?: string
}

const toEmbedUrl = (url?: string) => {
  if (!url) return ''
  if (url.includes('open.spotify.com/embed/')) return url

  if (url.includes('podcasters.spotify.com/') || url.includes('creators.spotify.com/')) {
    const episodeIdMatch = url.match(/-([A-Za-z0-9]{22})(?:\?|$)/)
    const showIdMatch = url.match(/\/pod\/show\/([A-Za-z0-9]{22})(?:\/|\?|$)/)
    const genericEpisodeMatch = url.match(/\/episode\/([A-Za-z0-9]{22})(?:\?|$)/)
    const genericShowMatch = url.match(/\/show\/([A-Za-z0-9]{22})(?:\?|$)/)

    if (episodeIdMatch?.[1]) {
      return `https://open.spotify.com/embed/episode/${episodeIdMatch[1]}`
    }
    if (genericEpisodeMatch?.[1]) {
      return `https://open.spotify.com/embed/episode/${genericEpisodeMatch[1]}`
    }

    if (showIdMatch?.[1]) {
      return `https://open.spotify.com/embed/show/${showIdMatch[1]}`
    }
    if (genericShowMatch?.[1]) {
      return `https://open.spotify.com/embed/show/${genericShowMatch[1]}`
    }
  }

  if (url.includes('open.spotify.com/')) {
    return url.replace('open.spotify.com/', 'open.spotify.com/embed/')
  }

  // Do not iframe unknown Spotify URLs - many creator/account URLs deny framing.
  return ''
}

export default function SpotifyEmbed({ url, title = 'Spotify episode' }: SpotifyEmbedProps) {
  const embedUrl = toEmbedUrl(url)
  if (!embedUrl) return null

  return (
    <div className="surface-panel my-6 overflow-hidden p-3">
      <iframe
        src={embedUrl}
        width="100%"
        height="232"
        allowFullScreen
        loading="lazy"
        title={title}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  )
}

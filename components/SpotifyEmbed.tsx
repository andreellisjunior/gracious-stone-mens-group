interface SpotifyEmbedProps {
  url?: string
  title?: string
}

const SPOTIFY_MEDIA_PATTERN = /open\.spotify\.com\/(?:embed\/)?(episode|show)\/([A-Za-z0-9]{22})/

const toEmbedUrl = (url?: string) => {
  if (!url) return ''
  const match = url.match(SPOTIFY_MEDIA_PATTERN)
  if (!match) return ''
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}`
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

import type { MDXComponents } from 'mdx/types'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm.js'
import Pre from 'pliny/ui/Pre.js'
import TOCInline from 'pliny/ui/TOCInline.js'
import Image from './Image'
import CustomLink from './Link'
import SpotifyEmbed from './SpotifyEmbed'
import TableWrapper from './TableWrapper'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  SpotifyEmbed,
}

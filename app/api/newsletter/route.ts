import siteMetadata from '@/data/siteMetadata'
import { NewsletterAPI } from 'pliny/newsletter/index.js'

const handler = NewsletterAPI({
  // @ts-ignore
  provider: siteMetadata.newsletter.provider,
})

export { handler as GET, handler as POST }

import { useHead } from '@unhead/vue'
import { SITE_NAME, SITE_OG_IMAGE, SITE_ORIGIN } from '@/content/marketing/site'

export function usePageSeo(input: {
  title: string
  description: string
  path: string
}) {
  const path = input.path === '/' ? '/' : input.path
  const url = `${SITE_ORIGIN}${path}`

  useHead({
    title: input.title,
    meta: [
      { name: 'description', content: input.description },
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: SITE_OG_IMAGE },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: input.title },
      { name: 'twitter:description', content: input.description },
      { name: 'twitter:image', content: SITE_OG_IMAGE },
    ],
    link: [{ rel: 'canonical', href: url }],
    script: [
      {
        type: 'application/ld+json',
        // Organization/WebSite live in index.html for crawlers; page graph is route-specific.
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: input.title,
          description: input.description,
          isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
          about: { '@id': `${SITE_ORIGIN}/#organization` },
        }),
      },
    ],
  })
}

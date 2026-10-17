import { useHead } from '@unhead/vue'
import { SITE_NAME, SITE_ORIGIN } from '@/content/marketing/site'

export function usePageSeo(input: {
  title: string
  description: string
  path: string
}) {
  const url = `${SITE_ORIGIN}${input.path === '/' ? '/' : input.path}`
  useHead({
    title: input.title,
    meta: [
      { name: 'description', content: input.description },
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: input.title },
      { name: 'twitter:description', content: input.description },
    ],
    link: [{ rel: 'canonical', href: url }],
  })
}

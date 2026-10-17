import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const origin = 'https://www.audivoice.com'

const featureSlugs = ['live-polls', 'qa', 'quizzes', 'surveys', 'ratings']
const useCaseSlugs = [
  'design-reviews',
  'product-reviews',
  'team-meetings',
  'education',
  'events',
]
const articleSlugs = [
  'how-to-run-a-better-design-review',
  'questions-to-ask-during-a-design-review',
  'how-to-collect-feedback-on-design-concepts',
  'how-to-gather-stakeholder-feedback-on-a-new-feature',
  'live-poll-questions-for-team-meetings',
  'how-to-run-an-interactive-product-demo',
  'how-to-make-team-meetings-more-participatory',
  '25-interactive-presentation-ideas',
  '30-icebreaker-questions-for-team-meetings',
  'how-to-make-classroom-lessons-more-interactive',
  'how-to-collect-feedback-after-a-workshop',
  'live-polls-vs-surveys',
]

const paths = [
  '/',
  '/features/',
  ...featureSlugs.map((s) => `/${s}/`),
  '/use-cases/',
  ...useCaseSlugs.map((s) => `/use-cases/${s}/`),
  '/pricing/',
  '/about/',
  '/contact/',
  '/help/',
  '/blogs/',
  ...articleSlugs.map((s) => `/blogs/${s}/`),
  '/privacy/',
  '/terms/',
  '/cookies/',
]

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${origin}${path === '/' ? '/' : path}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const out = join(__dirname, '..', 'public', 'sitemap.xml')
writeFileSync(out, xml)
console.log(`Wrote ${paths.length} URLs to public/sitemap.xml`)

/**
 * Lightweight marketing prerender: copy the built index.html into each
 * marketing path folder with page-specific title/description injected.
 * Vercel serves these static files before the SPA rewrite.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const origin = 'https://www.audivoice.com'
const ogImage = `${origin}/og-image.png`

const pages = [
  {
    path: '/',
    title: 'Audivoice – Anonymous Feedback, Live Polls, Q&A & Surveys',
    description:
      'Collect feedback without barriers. Audivoice lets teams and audiences join with a QR code or session code to participate in live polls, Q&A, quizzes, surveys, and ratings.',
  },
  {
    path: '/features/',
    title: 'Audivoice Features – Polls, Q&A, Quizzes, Surveys & Ratings',
    description:
      'Explore Audivoice features for collecting feedback and engaging participants through live polls, Q&A, quizzes, surveys, and ratings.',
  },
  {
    path: '/live-polls/',
    title: 'Live Polling Tool for Meetings, Classes & Teams | Audivoice',
    description:
      'Collect opinions during meetings, design reviews, classes, and events with Audivoice live polls.',
  },
  {
    path: '/qa/',
    title: 'Live Q&A for Reviews, Meetings & Events | Audivoice',
    description:
      'Collect questions during product demos, design reviews, meetings, classes, and events with Audivoice Q&A.',
  },
  {
    path: '/quizzes/',
    title: 'Interactive Quiz Tool for Training, Classes & Meetings | Audivoice',
    description:
      'Make learning and training more interactive with Audivoice quizzes for classes, workshops, meetings, and presentations.',
  },
  {
    path: '/surveys/',
    title: 'Survey Tool for Reviews, Meetings & Events | Audivoice',
    description:
      'Gather structured feedback from teams and audiences with Audivoice surveys for design reviews, meetings, classes, workshops, and events.',
  },
  {
    path: '/ratings/',
    title: 'Rating Tool for Design Reviews & Session Feedback | Audivoice',
    description:
      'Collect quick ratings on design concepts, presentations, workshops, and experiences with Audivoice.',
  },
  {
    path: '/use-cases/',
    title: 'Audivoice Use Cases – Design Reviews, Teams, Education & Events',
    description:
      'Explore how Audivoice supports design reviews, product demos, team meetings, education, training, workshops, and events.',
  },
  {
    path: '/use-cases/design-reviews/',
    title: 'Design Review Feedback Tool | Audivoice',
    description:
      'Collect feedback during design reviews with Audivoice. Invite reviewers to respond using a QR code or session code.',
  },
  {
    path: '/use-cases/product-reviews/',
    title: 'Product Review & Demo Feedback Tool | Audivoice',
    description:
      'Gather stakeholder feedback during product demos, feature reviews, and development discussions with Audivoice.',
  },
  {
    path: '/use-cases/team-meetings/',
    title: 'Interactive Team Meeting & Feedback Tool | Audivoice',
    description:
      'Make team meetings more participatory with Audivoice live polls, Q&A, quizzes, surveys, and ratings.',
  },
  {
    path: '/use-cases/education/',
    title: 'Interactive Classroom & Training Tools | Audivoice',
    description:
      'Make lessons and training sessions more interactive with Audivoice live polls, quizzes, Q&A, surveys, and ratings.',
  },
  {
    path: '/use-cases/events/',
    title: 'Audience Engagement Tool for Events & Workshops | Audivoice',
    description:
      'Engage attendees at events, conferences, and workshops with Audivoice live polls, Q&A, quizzes, surveys, and ratings.',
  },
  {
    path: '/pricing/',
    title: 'Audivoice Pricing – Free and Paid Plans',
    description:
      'Explore Audivoice plans for live polls, Q&A, quizzes, surveys, and ratings. Compare available options and choose the right plan for your sessions.',
  },
  {
    path: '/about/',
    title: 'About Audivoice – Making Feedback Easier',
    description:
      'Learn how Audivoice helps teams and audiences participate in reviews, meetings, training, and events through simple feedback activities.',
  },
  {
    path: '/contact/',
    title: 'Contact Audivoice – Product, Support & Business Enquiries',
    description:
      'Contact Audivoice for product questions, account assistance, feedback, or business enquiries.',
  },
  {
    path: '/help/',
    title: 'Audivoice Help Center – Getting Started & FAQs',
    description:
      'Find help using Audivoice, including creating sessions, joining activities, sharing session access, and using available features.',
  },
  {
    path: '/blogs/',
    title: 'Audience Feedback & Engagement Blogs | Audivoice',
    description:
      'Explore practical ideas for design reviews, product feedback, interactive meetings, classroom engagement, workshops, and events.',
  },
  {
    path: '/privacy/',
    title: 'Privacy Policy | Audivoice',
    description: 'How Audivoice collects, uses, and stores information for hosts and participants.',
  },
  {
    path: '/terms/',
    title: 'Terms of Service | Audivoice',
    description: 'Terms governing use of the Audivoice interactive feedback platform.',
  },
  {
    path: '/cookies/',
    title: 'Cookie Policy | Audivoice',
    description: 'How Audivoice uses cookies and similar technologies.',
  },
]

const articlePages = [
  ['how-to-run-a-better-design-review', 'Design Reviews: How to Collect Useful Feedback', 'Learn how to structure a design review, invite useful feedback, and gather opinions from colleagues and stakeholders.'],
  ['questions-to-ask-during-a-design-review', 'Questions to Ask During a Design Review | Audivoice', 'Practical question prompts to guide useful feedback in design review sessions.'],
  ['how-to-collect-feedback-on-design-concepts', 'How to Collect Feedback on Design Concepts | Audivoice', 'Ways to gather structured opinions on design concepts from teams and stakeholders.'],
  ['how-to-gather-stakeholder-feedback-on-a-new-feature', 'How to Gather Stakeholder Feedback on a New Feature | Audivoice', 'Invite stakeholders to share opinions and questions during feature demos and reviews.'],
  ['live-poll-questions-for-team-meetings', 'Live Poll Questions for Team Meetings | Audivoice', 'Ready-to-use live poll prompts that make team meetings more participatory.'],
  ['how-to-run-an-interactive-product-demo', 'How to Run an Interactive Product Demo | Audivoice', 'Make product demos more engaging with questions, polls, and structured feedback.'],
  ['how-to-make-team-meetings-more-participatory', 'How to Make Team Meetings More Participatory | Audivoice', 'Practical ways to invite more voices into team meetings and planning sessions.'],
  ['25-interactive-presentation-ideas', '25 Interactive Presentation Ideas to Engage Your Audience | Audivoice', 'Presentation ideas that use polls, Q&A, quizzes, and feedback activities.'],
  ['30-icebreaker-questions-for-team-meetings', '30 Icebreaker Questions for Team Meetings | Audivoice', 'Icebreaker prompts you can run as live polls or quick questions in team sessions.'],
  ['how-to-make-classroom-lessons-more-interactive', 'How to Make Classroom Lessons More Interactive | Audivoice', 'Ideas for using polls, quizzes, and Q&A to increase classroom participation.'],
  ['how-to-collect-feedback-after-a-workshop', 'How to Collect Feedback After a Workshop | Audivoice', 'Collect useful post-workshop feedback with surveys, ratings, and open questions.'],
  ['live-polls-vs-surveys', 'Live Polls vs. Surveys: When Should You Use Each? | Audivoice', 'Learn when live polls or surveys are the better fit for feedback and engagement.'],
].map(([slug, title, description]) => ({
  path: `/blogs/${slug}/`,
  title,
  description,
}))

const allPages = [...pages, ...articlePages]
const template = readFileSync(join(distDir, 'index.html'), 'utf8')

function setMeta(html, attr, key, content) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`, 'i')
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function setLink(html, rel, href) {
  const re = new RegExp(`<link\\s+rel="${rel}"\\s+href="[^"]*"\\s*/?>`, 'i')
  const tag = `<link rel="${rel}" href="${escapeAttr(href)}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function inject(html, { path, title, description }) {
  const url = `${origin}${path === '/' ? '/' : path}`
  let out = html
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
  out = setMeta(out, 'name', 'description', description)
  out = setLink(out, 'canonical', url)
  out = setMeta(out, 'property', 'og:title', title)
  out = setMeta(out, 'property', 'og:description', description)
  out = setMeta(out, 'property', 'og:url', url)
  out = setMeta(out, 'property', 'og:image', ogImage)
  out = setMeta(out, 'name', 'twitter:title', title)
  out = setMeta(out, 'name', 'twitter:description', description)
  out = setMeta(out, 'name', 'twitter:image', ogImage)

  const webpageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#organization` },
  }
  const ldTag = `<script type="application/ld+json">${JSON.stringify(webpageLd)}</script>`
  // Keep Organization/WebSite from the template; append page-level WebPage.
  out = out.replace('</head>', `    ${ldTag}\n  </head>`)
  return out
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;')
}

for (const page of allPages) {
  const html = inject(template, page)
  if (page.path === '/') {
    writeFileSync(join(distDir, 'index.html'), html)
    continue
  }
  const dir = join(distDir, page.path.replace(/^\//, '').replace(/\/$/, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

console.log(`Prerendered ${allPages.length} marketing pages into dist/`)

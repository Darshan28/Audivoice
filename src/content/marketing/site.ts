/** Preferred host — production redirects apex → www. */
export const SITE_ORIGIN = 'https://www.audivoice.com'
export const SITE_NAME = 'Audivoice'
export const SITE_TAGLINE = 'Give every audience a voice.'
export const SITE_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`

export const navLinks = [
  { label: 'Features', to: '/features/' },
  { label: 'Use Cases', to: '/use-cases/' },
  { label: 'Pricing', to: '/pricing/' },
  { label: 'Blogs', to: '/blogs/' },
  { label: 'About', to: '/about/' },
] as const

export const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features/' },
      { label: 'Live Polls', to: '/live-polls/' },
      { label: 'Q&A', to: '/qa/' },
      { label: 'Quizzes', to: '/quizzes/' },
      { label: 'Surveys', to: '/surveys/' },
      { label: 'Ratings', to: '/ratings/' },
      { label: 'Pricing', to: '/pricing/' },
    ],
  },
  {
    title: 'Use Cases',
    links: [
      { label: 'Design Reviews', to: '/use-cases/design-reviews/' },
      { label: 'Product Reviews', to: '/use-cases/product-reviews/' },
      { label: 'Team Meetings', to: '/use-cases/team-meetings/' },
      { label: 'Education', to: '/use-cases/education/' },
      { label: 'Events', to: '/use-cases/events/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about/' },
      { label: 'Contact', to: '/contact/' },
      { label: 'Help Center', to: '/help/' },
      { label: 'Blogs', to: '/blogs/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy/' },
      { label: 'Terms of Service', to: '/terms/' },
      { label: 'Cookie Policy', to: '/cookies/' },
    ],
  },
] as const

export const startForFreeTo = '/auth?next=/app/sessions/new'
export const joinSessionTo = '/join'

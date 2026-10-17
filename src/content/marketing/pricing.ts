import { startForFreeTo } from './site'

export const pricingSeo = {
  title: 'Audivoice Pricing – Free and Paid Plans',
  description:
    'Explore Audivoice plans for live polls, Q&A, quizzes, surveys, and ratings. Compare available options and choose the right plan for your sessions.',
  path: '/pricing/',
}

export const pricingPage = {
  h1: 'Simple Plans for Better Feedback.',
  intro:
    'Start with Audivoice for free, then choose a paid plan as your needs change. Compare available options and choose what works for your sessions.',
  note: 'Plan prices, limits, and entitlements will be published once confirmed.',
  plans: [
    {
      name: 'Free',
      blurb: 'A simple way to get started.',
      body: 'Try Audivoice activities and explore ways to collect feedback.',
      cta: { label: 'Get started', to: startForFreeTo },
    },
    {
      name: 'Pro',
      blurb: 'For regular sessions and growing needs.',
      body: 'A paid option for people and teams who use audience engagement more often.',
      cta: { label: 'Compare Plans', to: '/contact/?topic=product' },
    },
    {
      name: 'Business',
      blurb: 'For teams and organizations.',
      body: 'A paid option for organizational use.',
      cta: { label: 'Contact Us', to: '/contact/?topic=business' },
    },
  ],
}

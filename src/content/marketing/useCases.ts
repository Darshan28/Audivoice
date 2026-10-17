import type { UseCasePage } from './types'
import { startForFreeTo } from './site'

export const useCasesOverviewSeo = {
  title: 'Audivoice Use Cases – Design Reviews, Teams, Education & Events',
  description:
    'Explore how Audivoice supports design reviews, product demos, team meetings, education, training, workshops, and events.',
  path: '/use-cases/',
}

export const useCasesOverview = {
  h1: 'One Tool. Many Ways to Get Feedback.',
  intro:
    'Explore ways to use Audivoice across design reviews, product reviews, team meetings, education, training, workshops, and events.',
}

export const useCasePages: UseCasePage[] = [
  {
    slug: 'design-reviews',
    path: '/use-cases/design-reviews/',
    title: 'Design Review Feedback Tool | Audivoice',
    description:
      'Collect feedback during design reviews with Audivoice. Invite reviewers to respond using a QR code or session code.',
    h1: 'Make Design Reviews Easier to Participate In.',
    intro:
      'Bring reviewers into the conversation without asking every participant to create an account, where guest access is enabled. Share a QR code or session code and invite people to vote on options, ask questions, complete surveys, or rate concepts.',
    waysTitle: 'Ways to Use Audivoice',
    ways: [
      'Collect preferences on design directions using live polls.',
      'Gather questions during a review.',
      'Use surveys for structured feedback.',
      'Collect quick ratings on concepts or proposed experiences.',
    ],
    whyTitle: 'Why Use Audivoice for Design Reviews?',
    whyBody:
      'Give reviewers a straightforward way to participate and share their opinions during a review session.',
  },
  {
    slug: 'product-reviews',
    path: '/use-cases/product-reviews/',
    title: 'Product Review & Demo Feedback Tool | Audivoice',
    description:
      'Gather stakeholder feedback during product demos, feature reviews, and development discussions with Audivoice.',
    h1: 'Bring Feedback into Product Reviews.',
    intro:
      'Invite stakeholders to share opinions and questions during feature demonstrations, sprint reviews, and product discussions. Use responses to inform the next conversation or decision.',
    waysTitle: 'Ways to Use Audivoice',
    ways: [
      'Ask reviewers to vote on proposed options.',
      'Collect questions during a feature demonstration.',
      'Gather structured feedback after a walkthrough.',
      'Use ratings to collect quick impressions.',
    ],
  },
  {
    slug: 'team-meetings',
    path: '/use-cases/team-meetings/',
    title: 'Interactive Team Meeting & Feedback Tool | Audivoice',
    description:
      'Make team meetings more participatory with Audivoice live polls, Q&A, quizzes, surveys, and ratings.',
    h1: 'Give Everyone a Way to Contribute.',
    intro:
      'Use interactive activities to gather opinions, collect questions, and ask for feedback during team meetings, planning sessions, and workshops.',
    waysTitle: 'Ways to Use Audivoice',
    ways: [
      'Start a discussion with a poll.',
      'Collect questions during a presentation.',
      'Gather feedback after a meeting.',
      'Invite participants to contribute using supported joining options.',
    ],
  },
  {
    slug: 'education',
    path: '/use-cases/education/',
    title: 'Interactive Classroom & Training Tools | Audivoice',
    description:
      'Make lessons and training sessions more interactive with Audivoice live polls, quizzes, Q&A, surveys, and ratings.',
    h1: 'Make Learning More Interactive.',
    intro: 'Give learners more ways to participate throughout a lesson or training session.',
    waysTitle: 'Ways to Use Audivoice',
    ways: [
      'Use polls to gather opinions.',
      'Use quizzes to revisit key concepts.',
      'Invite questions during a lesson.',
      'Collect feedback after training.',
    ],
  },
  {
    slug: 'events',
    path: '/use-cases/events/',
    title: 'Audience Engagement Tool for Events & Workshops | Audivoice',
    description:
      'Engage attendees at events, conferences, and workshops with Audivoice live polls, Q&A, quizzes, surveys, and ratings.',
    h1: 'Turn Event Audiences into Active Participants.',
    intro:
      'Invite attendees to take part during events, conferences, and workshops using simple session access and interactive activities.',
    waysTitle: 'Ways to Use Audivoice',
    ways: [
      'Ask attendees a poll question.',
      'Collect audience questions.',
      'Add a quiz activity to a workshop.',
      'Ask participants to rate or give feedback on a session.',
    ],
  },
]

export const useCaseCards = useCasePages.map((p) => ({
  title: p.h1.replace(/\.$/, ''),
  shortTitle:
    p.slug === 'design-reviews'
      ? 'Design Reviews'
      : p.slug === 'product-reviews'
        ? 'Product Reviews'
        : p.slug === 'team-meetings'
          ? 'Team Meetings'
          : p.slug === 'education'
            ? 'Education & Training'
            : 'Events & Workshops',
  body: p.intro.split('.')[0] + '.',
  to: p.path,
  cta: startForFreeTo,
}))

export function getUseCaseBySlug(slug: string) {
  return useCasePages.find((u) => u.slug === slug)
}

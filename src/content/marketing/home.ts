import type { FaqItem } from './types'
import { startForFreeTo, joinSessionTo } from './site'

export const homeSeo = {
  title: 'Audivoice – Anonymous Feedback, Live Polls, Q&A & Surveys',
  description:
    'Collect feedback without barriers. Audivoice lets teams and audiences join with a QR code or session code to participate in live polls, Q&A, quizzes, surveys, and ratings.',
  path: '/',
}

export const homeHero = {
  brand: 'Audivoice',
  h1: 'Better feedback. No barriers to participation.',
  subhead: 'Collect feedback, share ideas, and make conversations more interactive.',
  body: 'Create a session, share a QR code or session code, and let people join without creating an account when guest access is enabled. Run live polls, collect questions, conduct quizzes, and gather feedback through surveys and ratings.',
  primaryCta: { label: 'Get started', to: startForFreeTo },
  secondaryCta: { label: 'Join a Session', to: joinSessionTo },
}

export const homeEasy = {
  title: 'Feedback Should Be Easy to Give.',
  body: "Whether you're reviewing a design, presenting a new feature, gathering stakeholder opinions, leading a meeting, or hosting an event, Audivoice makes it easier for people to participate.",
  closer: 'Give everyone a simple way to share their thoughts and contribute to the conversation.',
}

export const homeUseCases = {
  title: 'One Platform. Many Ways to Get Feedback.',
  cta: { label: 'Explore Use Cases', to: '/use-cases/' },
  items: [
    {
      title: 'Design Reviews',
      body: 'Gather opinions on design concepts, compare proposed directions, and collect feedback during design reviews.',
      to: '/use-cases/design-reviews/',
    },
    {
      title: 'Product Reviews and Demos',
      body: 'Invite questions, collect reactions, and gather feedback during product demonstrations and review sessions.',
      to: '/use-cases/product-reviews/',
    },
    {
      title: 'Team Meetings',
      body: 'Make discussions more interactive with live polls, Q&A, and quick feedback activities.',
      to: '/use-cases/team-meetings/',
    },
    {
      title: 'Workshops and Training',
      body: 'Encourage participation, check understanding, and collect feedback from participants.',
      to: '/use-cases/education/',
    },
    {
      title: 'Education',
      body: 'Bring learners into the session with quizzes, polls, questions, and feedback activities.',
      to: '/use-cases/education/',
    },
    {
      title: 'Events and Presentations',
      body: 'Give audiences a simple way to ask questions, respond to polls, and share their opinions.',
      to: '/use-cases/events/',
    },
  ],
}

export const homeHowItWorks = {
  title: 'How Audivoice Works',
  steps: [
    {
      title: 'Create a Session',
      body: "Choose the activity that fits your goal, whether it's collecting opinions, asking questions, or gathering feedback.",
    },
    {
      title: 'Share Access',
      body: 'Display a QR code or share a session code, where supported, so participants can access your session.',
    },
    {
      title: 'Collect Responses',
      body: 'Let participants join without logging in when guest access is enabled and submit their responses.',
    },
    {
      title: 'Review Feedback',
      body: 'Use the responses available in your session to inform discussions and decisions.',
    },
  ],
}

export const homeWhy = {
  title: 'Why Audivoice?',
  items: [
    {
      title: 'No Account Needed for Participants',
      body: 'Make participation easier by letting people join without creating an account when guest access is enabled.',
    },
    {
      title: 'Quick Access',
      body: 'Share a QR code or session code so participants can access the session using the available joining options.',
    },
    {
      title: 'Anonymous Feedback Where Enabled',
      body: 'Give participants a way to share feedback without displaying their identity to the host or other participants, where supported by the session settings.',
    },
    {
      title: 'Different Ways to Contribute',
      body: 'Choose from live polls, Q&A, quizzes, surveys, and ratings to match the activity to your session.',
    },
    {
      title: 'Built for Different Situations',
      body: 'Use Audivoice for design reviews, product demos, team meetings, training sessions, presentations, and events.',
    },
  ],
}

export const homePricingTeaser = {
  title: 'Start Free. Grow as Your Needs Change.',
  body: 'Explore Audivoice with a free plan and choose a paid option when you need more.',
  closer: 'Find the plan that works for your sessions and participation needs.',
  cta: { label: 'Explore Pricing', to: '/pricing/' },
}

export const homeFaqs: FaqItem[] = [
  {
    question: 'What is Audivoice?',
    answer:
      'Audivoice is an interactive feedback and engagement platform that helps teams and audiences participate in reviews, meetings, training, and events.',
  },
  {
    question: 'Do participants need an account?',
    answer:
      'Participants can join without creating an account when guest access is enabled. Hosts may need an account to create and manage sessions.',
  },
  {
    question: 'How can participants join a session?',
    answer:
      "Participants can use the QR code or session code shared by the host, according to the session's available access options.",
  },
  {
    question: 'Can feedback be anonymous?',
    answer:
      'Anonymous responses are supported only where the session and product are configured for anonymity. Check the session settings and privacy information for details.',
  },
  {
    question: 'What activities does Audivoice support?',
    answer: 'The confirmed activities are live polls, Q&A, quizzes, surveys, and ratings.',
  },
  {
    question: 'Can Audivoice be used for design reviews?',
    answer:
      'Yes. Teams can use polls, Q&A, surveys, and ratings to collect opinions during design reviews and product demonstrations, within the available feature set.',
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Audivoice is planned to offer a free plan alongside paid plans. Specific limits and entitlements will be published once confirmed.',
  },
]

export const homeFinalCta = {
  title: 'Make Your Next Review More Interactive.',
  body: 'Give people a simple way to ask, answer, respond, and share feedback.',
  cta: { label: 'Get started', to: startForFreeTo },
}

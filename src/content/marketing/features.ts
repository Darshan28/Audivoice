import type { FeaturePage } from './types'
import { startForFreeTo } from './site'

export const featuresOverviewSeo = {
  title: 'Audivoice Features – Polls, Q&A, Quizzes, Surveys & Ratings',
  description:
    'Explore Audivoice features for collecting feedback and engaging participants through live polls, Q&A, quizzes, surveys, and ratings.',
  path: '/features/',
}

export const featuresOverview = {
  h1: 'The Right Activity for Every Feedback Moment.',
  intro:
    'From quick team decisions to structured session feedback, Audivoice gives hosts practical ways to invite participation.',
  cta: { label: 'Get started', to: startForFreeTo },
}

export const featurePages: FeaturePage[] = [
  {
    slug: 'live-polls',
    path: '/live-polls/',
    title: 'Live Polling Tool for Meetings, Classes & Teams | Audivoice',
    description:
      'Collect opinions during meetings, design reviews, classes, and events with Audivoice live polls.',
    h1: 'Make Every Opinion Count.',
    intro:
      'Ask your team or audience a question and invite them to respond during a session. Use live polls to compare options, prompt discussion, or check understanding.',
    waysTitle: 'Ways to Use Live Polls',
    ways: [
      'Vote on design directions or proposed solutions.',
      'Open a discussion with a quick question.',
      'Collect opinions from meeting participants.',
      'Encourage participation during presentations and workshops.',
    ],
    howTitle: 'How It Works',
    how: [
      'Create a session and choose a poll activity.',
      'Prepare your question and available response options.',
      'Share the available QR code or session code.',
      'Invite participants to respond and review the available results.',
    ],
    faqs: [
      {
        question: 'What are live polls useful for?',
        answer:
          'Live polls help collect opinions, prompt discussion, and check audience understanding.',
      },
      {
        question: 'Can teams use polls in design reviews?',
        answer:
          'Teams can use polls to gather preferences during a review, within the available poll options.',
      },
    ],
  },
  {
    slug: 'qa',
    path: '/qa/',
    title: 'Live Q&A for Reviews, Meetings & Events | Audivoice',
    description:
      'Collect questions during product demos, design reviews, meetings, classes, and events with Audivoice Q&A.',
    h1: 'Give Every Question a Place in the Conversation.',
    intro:
      'Give participants a way to submit questions during a session, helping hosts bring important questions into the discussion.',
    waysTitle: 'Ways to Use Q&A',
    ways: [
      'Collect questions during product demonstrations.',
      'Give reviewers a channel to raise questions.',
      'Support discussions during meetings and presentations.',
      'Invite questions during classes, training, and events.',
    ],
    howTitle: 'How It Works',
    how: [
      'Set up a session with Q&A.',
      'Share the available session access details.',
      'Invite participants to submit questions.',
      'Address the questions as part of your session.',
    ],
    faqs: [
      {
        question: 'When should I use Q&A?',
        answer:
          'Use Q&A during sessions where participants may have questions for the host or presenter.',
      },
      {
        question: 'Can Q&A support a product review?',
        answer:
          'Yes. It can provide a way to collect questions during a product demonstration or review.',
      },
    ],
  },
  {
    slug: 'quizzes',
    path: '/quizzes/',
    title: 'Interactive Quiz Tool for Training, Classes & Meetings | Audivoice',
    description:
      'Make learning and training more interactive with Audivoice quizzes for classes, workshops, meetings, and presentations.',
    h1: 'Turn Learning into an Interactive Experience.',
    intro:
      'Add quiz activities to training, lessons, workshops, and presentations to invite participants to respond to questions.',
    waysTitle: 'Ways to Use Quizzes',
    ways: [
      'Revisit key concepts during training.',
      'Add an interactive moment to a presentation.',
      'Invite participants to test their understanding.',
      'Make workshops and learning sessions more participatory.',
    ],
    howTitle: 'How It Works',
    how: [
      'Create a session and select a quiz activity.',
      'Prepare your quiz questions using the available options.',
      'Share the session access details.',
      'Run the quiz and review available responses.',
    ],
    faqs: [
      {
        question: 'Where can I use quizzes?',
        answer: 'Quizzes can support classes, workshops, training, meetings, and presentations.',
      },
      {
        question: 'Are quizzes only for education?',
        answer: 'No. They can also be used in business training and team sessions.',
      },
    ],
  },
  {
    slug: 'surveys',
    path: '/surveys/',
    title: 'Survey Tool for Reviews, Meetings & Events | Audivoice',
    description:
      'Gather structured feedback from teams and audiences with Audivoice surveys for design reviews, meetings, classes, workshops, and events.',
    h1: 'Collect Feedback That Helps You Move Forward.',
    intro:
      'Invite participants to answer structured questions about a design, session, workflow, or experience.',
    waysTitle: 'Ways to Use Surveys',
    ways: [
      'Gather structured feedback on a review or session.',
      'Ask participants what worked and what could improve.',
      'Collect opinions to inform future decisions.',
      'Gather feedback after workshops and training.',
    ],
    howTitle: 'How It Works',
    how: [
      'Create a session and choose a survey activity.',
      'Add the questions you want to ask.',
      'Share the available session access details.',
      'Review the responses available to you.',
    ],
    faqs: [
      {
        question: 'Can surveys be used for design reviews?',
        answer:
          'Yes. Surveys can gather structured feedback about concepts, workflows, or review sessions.',
      },
      {
        question: 'How are surveys different from polls?',
        answer:
          'Polls suit a quick question; surveys are useful when you want to ask a set of questions.',
      },
    ],
  },
  {
    slug: 'ratings',
    path: '/ratings/',
    title: 'Rating Tool for Design Reviews & Session Feedback | Audivoice',
    description:
      'Collect quick ratings on design concepts, presentations, workshops, and experiences with Audivoice.',
    h1: 'Make Feedback Easier to Share.',
    intro:
      'Give participants a quick way to rate a design concept, session, presentation, or experience.',
    waysTitle: 'Ways to Use Ratings',
    ways: [
      'Compare reviewer ratings on proposed directions.',
      'Ask for quick feedback after a demonstration.',
      'Collect session ratings and impressions.',
      'Gather quick reactions to concepts or experiences.',
    ],
    howTitle: 'How It Works',
    how: [
      'Create a session and choose a rating activity.',
      'Set up the rating prompt using available options.',
      'Share the session access details.',
      'Invite participants to rate and review the available responses.',
    ],
    faqs: [
      {
        question: 'Can ratings be used in design reviews?',
        answer:
          'Teams can use rating activities to collect quick reactions to a concept or experience, within the available rating options.',
      },
      {
        question: 'Are ratings the same as surveys?',
        answer:
          'Ratings focus on a quick rating response, while surveys can gather answers to a set of questions.',
      },
    ],
  },
]

export const featureCards = [
  {
    title: 'Live Polls',
    body: 'Ask a question and collect audience responses during a session.',
    to: '/live-polls/',
  },
  {
    title: 'Q&A',
    body: 'Give participants a way to submit questions and bring them into the conversation.',
    to: '/qa/',
  },
  {
    title: 'Quizzes',
    body: 'Add interactive question activities to lessons, workshops, and presentations.',
    to: '/quizzes/',
  },
  {
    title: 'Surveys',
    body: 'Gather structured feedback and opinions from participants.',
    to: '/surveys/',
  },
  {
    title: 'Ratings',
    body: 'Invite participants to rate a session, concept, or experience.',
    to: '/ratings/',
  },
]

export function getFeatureBySlug(slug: string) {
  return featurePages.find((f) => f.slug === slug)
}

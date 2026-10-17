export type LegalPage = {
  slug: 'privacy' | 'terms' | 'cookies'
  path: string
  title: string
  description: string
  h1: string
  updatedNote: string
  sections: { title: string; body: string }[]
}

export const legalPages: LegalPage[] = [
  {
    slug: 'privacy',
    path: '/privacy/',
    title: 'Privacy Policy | Audivoice',
    description: 'How Audivoice collects, uses, and stores information for hosts and participants.',
    h1: 'Privacy Policy',
    updatedNote:
      'This page is a provisional summary aligned to current product behavior. It will be reviewed against actual data flows, retention practices, and applicable law before being treated as final legal advice.',
    sections: [
      {
        title: 'What we collect',
        body: 'Depending on how you use Audivoice, we may collect account details for hosts (such as email), session content you create, participant responses submitted in a session, and basic technical data needed to operate the service (such as connection and device information).',
      },
      {
        title: 'Guest participation and anonymity',
        body: 'When guest access is enabled, participants may join without creating an account. Whether a response is anonymous depends on the session settings and product configuration. Do not assume anonymity unless the session UI indicates it.',
      },
      {
        title: 'How response data is used',
        body: 'Session responses are used to operate the activity for the host and participants, show available results, and improve reliability of the service. We do not sell personal information.',
      },
      {
        title: 'Storage and retention',
        body: 'Session and account data are stored with our infrastructure providers as needed to provide the service. Retention periods will be documented more precisely as product policies are finalized.',
      },
      {
        title: 'Who can access responses',
        body: 'Hosts and authorized session operators can access responses for their sessions. Service operators may access data only as required to run, secure, or support the product.',
      },
      {
        title: 'Third parties',
        body: 'We use infrastructure and authentication providers to run Audivoice. Those providers process data only to provide their services under their agreements with us.',
      },
      {
        title: 'Your rights',
        body: 'Depending on your location, you may have rights to access, correct, or delete personal information. Contact us to make a request.',
      },
      {
        title: 'Contact',
        body: 'For privacy questions, use the Contact page and choose the most relevant enquiry type.',
      },
    ],
  },
  {
    slug: 'terms',
    path: '/terms/',
    title: 'Terms of Service | Audivoice',
    description: 'Terms governing use of the Audivoice interactive feedback platform.',
    h1: 'Terms of Service',
    updatedNote:
      'These terms are a provisional outline for product launch readiness and will be reviewed before being treated as a final binding agreement.',
    sections: [
      {
        title: 'Accounts',
        body: 'Hosts are responsible for maintaining accurate account information and safeguarding access to their accounts.',
      },
      {
        title: 'Acceptable use',
        body: 'You may not use Audivoice to harass others, violate law, distribute malware, attempt unauthorized access, or abuse the service in ways that disrupt other users.',
      },
      {
        title: 'Sessions and content',
        body: 'You are responsible for the content of sessions you create and for how you collect and use participant responses.',
      },
      {
        title: 'Billing',
        body: 'If paid plans are offered, pricing, billing cadence, cancellations, and entitlements will be described on the Pricing page and in checkout flows once confirmed.',
      },
      {
        title: 'Service availability',
        body: 'We aim to keep Audivoice available, but we do not guarantee uninterrupted service. Features may change as the product evolves.',
      },
      {
        title: 'Contact',
        body: 'Questions about these terms can be sent through the Contact page.',
      },
    ],
  },
  {
    slug: 'cookies',
    path: '/cookies/',
    title: 'Cookie Policy | Audivoice',
    description: 'How Audivoice uses cookies and similar technologies.',
    h1: 'Cookie Policy',
    updatedNote:
      'This policy will be updated to list the actual cookies and tracking technologies in use, along with any consent controls required in your region.',
    sections: [
      {
        title: 'Essential cookies',
        body: 'We use essential storage needed for authentication, session continuity, and basic security of the product.',
      },
      {
        title: 'Analytics',
        body: 'If analytics tools are enabled, they may collect aggregated usage information to help us understand product performance. Details will be listed here when confirmed.',
      },
      {
        title: 'Your choices',
        body: 'Browser controls can block or delete cookies. Blocking essential storage may prevent sign-in or session features from working.',
      },
      {
        title: 'Contact',
        body: 'For questions about cookies, use the Contact page.',
      },
    ],
  },
]

export function getLegalBySlug(slug: string) {
  return legalPages.find((p) => p.slug === slug)
}

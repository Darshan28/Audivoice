export const contactSeo = {
  title: 'Contact Audivoice – Product, Support & Business Enquiries',
  description:
    'Contact Audivoice for product questions, account assistance, feedback, or business enquiries.',
  path: '/contact/',
}

export const contactPage = {
  h1: "Let's Talk.",
  intro:
    'Have a question about Audivoice, need help, or want to share feedback? Send us a message and choose the topic that best matches your enquiry.',
  enquiryTypes: [
    'Product Question',
    'Account Support',
    'Feedback',
    'Business Enquiry',
    'Other',
  ] as const,
  /** Interim contact destination until a verified support inbox is published. */
  mailto: 'hello@audivoice.com',
}

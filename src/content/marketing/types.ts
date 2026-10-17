export type SeoMeta = {
  title: string
  description: string
  path: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type CtaLink = {
  label: string
  to: string
  external?: boolean
}

export type ContentSection = {
  title: string
  body: string
  items?: string[]
}

export type FeaturePage = SeoMeta & {
  slug: string
  h1: string
  intro: string
  waysTitle: string
  ways: string[]
  howTitle: string
  how: string[]
  faqs: FaqItem[]
  ctaLabel?: string
}

export type UseCasePage = SeoMeta & {
  slug: string
  h1: string
  intro: string
  waysTitle: string
  ways: string[]
  whyTitle?: string
  whyBody?: string
  ctaLabel?: string
}

export type ArticleStub = SeoMeta & {
  slug: string
  h1: string
  intro: string
  outline: string[]
  richer?: boolean
}

export * from './types'
export * from './site'
export * from './home'
export * from './features'
export * from './useCases'
export * from './pricing'
export * from './about'
export * from './contact'
export * from './help'
export * from './resources'
export * from './legal'

import { homeSeo } from './home'
import { featuresOverviewSeo, featurePages } from './features'
import { useCasesOverviewSeo, useCasePages } from './useCases'
import { pricingSeo } from './pricing'
import { aboutSeo } from './about'
import { contactSeo } from './contact'
import { helpSeo } from './help'
import { resourcesSeo, articles } from './resources'
import { legalPages } from './legal'

/** All public marketing paths for sitemap / prerender. */
export const marketingPaths = [
  homeSeo.path,
  featuresOverviewSeo.path,
  ...featurePages.map((p) => p.path),
  useCasesOverviewSeo.path,
  ...useCasePages.map((p) => p.path),
  pricingSeo.path,
  aboutSeo.path,
  contactSeo.path,
  helpSeo.path,
  resourcesSeo.path,
  ...articles.map((a) => a.path),
  ...legalPages.map((p) => p.path),
]

export const marketingSeoEntries = [
  homeSeo,
  featuresOverviewSeo,
  ...featurePages,
  useCasesOverviewSeo,
  ...useCasePages,
  pricingSeo,
  aboutSeo,
  contactSeo,
  helpSeo,
  resourcesSeo,
  ...articles,
  ...legalPages.map((p) => ({
    title: p.title,
    description: p.description,
    path: p.path,
  })),
]

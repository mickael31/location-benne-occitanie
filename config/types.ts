export type Language = 'fr';

export interface SiteConfig {
  meta: MetaConfig;
  contact: ContactConfig;
  nav: NavItem[];
  home: HomeConfig;
  bennes: BennesConfig;
  servicesPage: ServicesPageConfig;
  aboutPage: AboutPageConfig;
  contactPage: ContactPageConfig;
  privacy: PrivacyConfig;
  admin: AdminConfig;
}

export interface MetaConfig {
  siteName: string;
  tagline?: string;
  description: string;
  language: Language;
  logoUrl?: string;
  socialImageUrl?: string;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  region?: string;
  country: string;
}

export interface ContactConfig {
  phone: string;
  phoneDisplay?: string;
  email: string;
  address: Address;
  openingHours: string[];
  areasServed: string[];
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface NavItem {
  label: string;
  to: string;
}

export interface CtaLink {
  label: string;
  to: string;
}

export interface HomeConfig {
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    primaryCta: CtaLink;
    secondaryCta?: { label: string; type: 'tel' | 'mailto' | 'link'; to?: string };
    imageUrl?: string;
    imageAlt?: string;
  };
  aboutTeaser: {
    kicker?: string;
    title: string;
    body: string;
    cta: CtaLink;
    imageUrl?: string;
    imageAlt?: string;
  };
  servicesTeaser: {
    kicker?: string;
    title: string;
    items: Array<{ prefix?: string; title: string; description: string }>;
    cta: CtaLink;
  };
  benefits: {
    kicker?: string;
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  howItWorks: {
    kicker?: string;
    title: string;
    steps: Array<{ kicker?: string; title: string; description: string }>;
  };
  commitments: {
    kicker?: string;
    title: string;
    items: Array<{ title: string; description: string }>;
    imageUrl?: string;
    imageAlt?: string;
  };
  testimonials: {
    title: string;
    items: Array<{ author: string; source?: string; text: string; rating?: number; date?: string }>;
  };
  finalCta: {
    title: string;
    body: string;
    cta: CtaLink;
  };
}

export interface BennesConfig {
  title: string;
  subtitle?: string;
  introTitle?: string;
  introBody?: string;
  items: Array<{
    title: string;
    volume?: string;
    lead?: string;
    paragraphs: string[];
    imageUrl?: string;
    imageAlt?: string;
  }>;
  cta: {
    title: string;
    body: string;
    label: string;
    to: string;
  };
}

export interface ServicesPageConfig {
  kicker?: string;
  title: string;
  items: Array<{
    prefix?: string;
    title: string;
    description: string;
    imageUrl?: string;
    imageAlt?: string;
  }>;
  cta: {
    title: string;
    body: string;
    label: string;
    to: string;
  };
}

export interface AboutPageConfig {
  kicker?: string;
  title: string;
  stats: Array<{ value: string; label: string }>;
  sections: Array<{
    title: string;
    subtitle?: string;
    paragraphs: string[];
  }>;
  cta: {
    title: string;
    body: string;
    label: string;
    to: string;
  };
}

export interface ContactPageConfig {
  kicker?: string;
  title: string;
  infoKicker?: string;
  infoTitle?: string;
  formTitle: string;
  formSubtitle?: string;
  successTitle: string;
  successBody: string;
  submitLabel: string;
}

export interface PrivacyConfig {
  title: string;
  lastUpdated: string; // YYYY-MM-DD
  sections: Array<{
    title: string;
    paragraphs: string[];
    bullets?: string[];
    note?: string;
  }>;
}

export interface AdminConfig {
  gate: {
    enabled: boolean;
    salt: string; // base64
    passwordHash: string; // base64
    iterations: number;
  };
  github: {
    owner: string;
    repo: string;
    branch: string;
    path: string;
    allowedUsers: string[];
  };
  google: {
    oauthClientId: string;
    accountName: string;
    locationName: string;
    scope: string;
  };
}

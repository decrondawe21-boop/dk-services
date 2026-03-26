const PRODUCTION_ORIGIN = 'https://dk.david-kozak.com';
const PRODUCTION_HOSTNAME = 'dk.david-kozak.com';
const DEFAULT_OG_IMAGE_PATH = '/api/og';
const DEFAULT_TWITTER_IMAGE_PATH = '/api/twitter-image';

type MetaSelector = {
  attribute: 'name' | 'property';
  value: string;
};

const normalizeOrigin = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
};

const getConfiguredOrigin = (): string => {
  const env = import.meta.env as Record<string, string | boolean | undefined>;
  const configuredOrigin =
    normalizeOrigin(typeof env.VITE_SITE_URL === 'string' ? env.VITE_SITE_URL : undefined) ??
    normalizeOrigin(typeof env.VITE_CANONICAL_URL === 'string' ? env.VITE_CANONICAL_URL : undefined);

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (window.location.hostname === PRODUCTION_HOSTNAME) {
    return window.location.origin;
  }

  return PRODUCTION_ORIGIN;
};

const getCanonicalPath = (): string => {
  if (window.location.pathname === '/') {
    return '/';
  }

  return window.location.pathname.replace(/\/+$/, '');
};

const upsertLink = (rel: string, href: string): void => {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.append(link);
  }

  link.href = href;
};

const upsertMeta = ({ attribute, value }: MetaSelector, content: string): void => {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.append(meta);
  }

  meta.content = content;
};

export const applySiteSeo = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const siteOrigin = getConfiguredOrigin();
  const canonicalUrl = new URL(getCanonicalPath(), siteOrigin);
  const ogImageUrl = new URL(DEFAULT_OG_IMAGE_PATH, siteOrigin);
  const twitterImageUrl = new URL(DEFAULT_TWITTER_IMAGE_PATH, siteOrigin);

  canonicalUrl.search = '';
  canonicalUrl.hash = '';

  upsertLink('canonical', canonicalUrl.toString());
  upsertMeta({ attribute: 'property', value: 'og:url' }, canonicalUrl.toString());
  upsertMeta({ attribute: 'property', value: 'og:image' }, ogImageUrl.toString());
  upsertMeta({ attribute: 'name', value: 'twitter:image' }, twitterImageUrl.toString());
};

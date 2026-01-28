import { DEFAULT_SITE_CONFIG } from './defaultConfig';
import type { SiteConfig } from './types';

const CONFIG_FILENAME = 'data.config';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base;
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = (base as Record<string, unknown>)[key];
    if (Array.isArray(baseValue) || Array.isArray(overrideValue)) {
      result[key] = overrideValue;
      continue;
    }
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = mergeDeep(baseValue, overrideValue);
      continue;
    }
    result[key] = overrideValue;
  }

  return result as T;
}

export async function loadSiteConfig(): Promise<SiteConfig> {
  try {
    const url = `${import.meta.env.BASE_URL}${CONFIG_FILENAME}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return DEFAULT_SITE_CONFIG;
    }

    const text = (await res.text()).replace(/^\uFEFF/, '').trim();
    const parsed = JSON.parse(text) as unknown;
    return mergeDeep(DEFAULT_SITE_CONFIG, parsed);
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}


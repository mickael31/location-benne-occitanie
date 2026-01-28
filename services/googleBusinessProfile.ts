export const BUSINESS_PROFILE_SCOPE = 'https://www.googleapis.com/auth/business.manage';

const GOOGLE_GIS_SCRIPT_ID = 'google-identity-services';

export type MyBusinessAccount = {
  name: string;
  accountName?: string;
  type?: string;
  role?: string;
};

export type MyBusinessLocation = {
  name: string;
  locationName?: string;
  title?: string;
  storeCode?: string;
  primaryPhone?: string;
};

export type MyBusinessReview = {
  name?: string;
  reviewId?: string;
  reviewer?: {
    displayName?: string;
    profilePhotoUrl?: string;
  };
  starRating?: string | number;
  rating?: number;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: {
    comment?: string;
    updateTime?: string;
  };
};

export async function loadGoogleIdentityServices(timeoutMs = 15000): Promise<void> {
  if (window.google?.accounts?.oauth2?.initTokenClient) return;

  const existing = document.getElementById(GOOGLE_GIS_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('Chargement Google Identity Services timeout.')), timeoutMs);
      existing.addEventListener('load', () => {
        window.clearTimeout(timeout);
        resolve();
      });
      existing.addEventListener('error', () => {
        window.clearTimeout(timeout);
        reject(new Error('Erreur de chargement Google Identity Services.'));
      });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_GIS_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    const timeout = window.setTimeout(() => {
      reject(new Error('Chargement Google Identity Services timeout.'));
    }, timeoutMs);

    script.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error('Erreur de chargement Google Identity Services.'));
    };

    document.head.appendChild(script);
  });
}

export async function requestGoogleAccessToken(params: {
  clientId: string;
  scope: string;
  prompt?: '' | 'consent' | 'select_account';
}): Promise<{ accessToken: string; expiresIn?: number }> {
  await loadGoogleIdentityServices();

  if (!window.google?.accounts?.oauth2?.initTokenClient) {
    throw new Error('Google Identity Services indisponible.');
  }

  return await new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: params.clientId,
      scope: params.scope,
      callback: (resp: { access_token?: string; expires_in?: number; error?: string }) => {
        if (resp.error) {
          reject(new Error(resp.error));
          return;
        }
        if (!resp.access_token) {
          reject(new Error('Token manquant.'));
          return;
        }
        resolve({ accessToken: resp.access_token, expiresIn: resp.expires_in });
      },
    });

    tokenClient.requestAccessToken({ prompt: params.prompt ?? 'consent' });
  });
}

async function googleJson<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    let message = `Google API error (${res.status})`;
    try {
      const json = JSON.parse(text) as { error?: { message?: string } } | { message?: string };
      const nested = (json as { error?: { message?: string } })?.error?.message;
      if (nested) message = `${message}: ${nested}`;
      else if ((json as { message?: string })?.message) message = `${message}: ${(json as { message?: string }).message}`;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (text ? (JSON.parse(text) as T) : (null as T));
}

async function listPaged<T>(params: {
  url: string;
  accessToken: string;
  listKey: string;
  pageSize?: number;
  maxPages?: number;
}): Promise<T[]> {
  const items: T[] = [];
  let pageToken: string | undefined = undefined;
  const pageSize = params.pageSize ?? 50;
  const maxPages = params.maxPages ?? 10;

  for (let page = 0; page < maxPages; page += 1) {
    const u = new URL(params.url);
    u.searchParams.set('pageSize', String(pageSize));
    if (pageToken) u.searchParams.set('pageToken', pageToken);

    const json = (await googleJson<Record<string, unknown>>(u.toString(), params.accessToken)) as Record<string, unknown>;
    const pageItems = (json[params.listKey] as T[] | undefined) ?? [];
    items.push(...pageItems);
    pageToken = (json.nextPageToken as string | undefined) ?? undefined;
    if (!pageToken) break;
  }

  return items;
}

export async function listMyBusinessAccounts(accessToken: string): Promise<MyBusinessAccount[]> {
  return await listPaged<MyBusinessAccount>({
    url: 'https://mybusiness.googleapis.com/v4/accounts',
    accessToken,
    listKey: 'accounts',
    // Max page size for this endpoint is 20.
    pageSize: 20,
    maxPages: 5,
  });
}

export async function listMyBusinessLocations(accessToken: string, accountName: string): Promise<MyBusinessLocation[]> {
  const normalized = accountName.startsWith('accounts/') ? accountName : `accounts/${accountName}`;
  return await listPaged<MyBusinessLocation>({
    url: `https://mybusiness.googleapis.com/v4/${normalized}/locations`,
    accessToken,
    listKey: 'locations',
    pageSize: 100,
    maxPages: 10,
  });
}

export async function listMyBusinessReviews(accessToken: string, locationName: string): Promise<MyBusinessReview[]> {
  const normalized = locationName.startsWith('accounts/') ? locationName : `accounts/${locationName}`;
  return await listPaged<MyBusinessReview>({
    url: `https://mybusiness.googleapis.com/v4/${normalized}/reviews`,
    accessToken,
    listKey: 'reviews',
    pageSize: 50,
    maxPages: 10,
  });
}

export function normalizeStarRating(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== 'string') return null;

  const upper = value.toUpperCase();
  if (upper === 'ONE') return 1;
  if (upper === 'TWO') return 2;
  if (upper === 'THREE') return 3;
  if (upper === 'FOUR') return 4;
  if (upper === 'FIVE') return 5;

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

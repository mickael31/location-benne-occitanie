import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Copy, Download, Lock, LogOut, RefreshCw, Save, Shield, Star, XCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { DEFAULT_SITE_CONFIG } from '../config/defaultConfig';
import { useSiteConfig } from '../config/SiteConfigContext';
import type { SiteConfig } from '../config/types';
import {
  BUSINESS_PROFILE_SCOPE,
  listMyBusinessAccounts,
  listMyBusinessLocations,
  listMyBusinessReviews,
  normalizeStarRating,
  requestGoogleAccessToken,
  type MyBusinessAccount,
  type MyBusinessLocation,
  type MyBusinessReview,
} from '../services/googleBusinessProfile';
import { createGateFromPassword, isGateEnabled, pbkdf2HashPassword, verifyPasswordHash } from '../services/adminGate';

type LoadStatus = 'idle' | 'checking' | 'ready' | 'error';

function encodeGithubPath(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function toBase64Utf8(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64Utf8(b64: string) {
  const cleaned = b64.replace(/\n/g, '');
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function mergeDeep<T>(base: T, override: unknown): T {
  const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

  if (!isPlainObject(base) || !isPlainObject(override)) return (override as T) ?? base;

  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, ov] of Object.entries(override)) {
    const bv = (base as Record<string, unknown>)[key];
    if (Array.isArray(bv) || Array.isArray(ov)) {
      out[key] = ov;
      continue;
    }
    if (isPlainObject(bv) && isPlainObject(ov)) {
      out[key] = mergeDeep(bv, ov);
      continue;
    }
    out[key] = ov;
  }
  return out as T;
}

function inferGithubRepoFromLocation(): { owner: string; repo: string } | null {
  const host = window.location.hostname;
  if (!host.endsWith('.github.io')) return null;

  const owner = host.replace(/\.github\.io$/, '');
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const firstSegment = path.split('/')[0];
  const repo = firstSegment || `${owner}.github.io`;
  return { owner, repo };
}

async function githubJson<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    let message = `GitHub API error (${res.status})`;
    try {
      const json = JSON.parse(text) as { message?: string };
      if (json?.message) message = `${message}: ${json.message}`;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (text ? (JSON.parse(text) as T) : (null as T));
}

type GithubUser = { login: string };
type GithubContentResponse = { sha: string; content: string; encoding: string };
type GithubUpdateResponse = { commit?: { html_url?: string } };

const SESSION_TOKEN_KEY = 'lbo_admin_github_token';
const SESSION_GATE_KEY = 'lbo_admin_gate_unlocked';

const Admin: React.FC = () => {
  const { config: runtimeConfig, setConfig: setRuntimeConfig } = useSiteConfig();

  const inferred = useMemo(() => inferGithubRepoFromLocation(), []);
  const defaults = runtimeConfig.admin.github;
  const googleDefaults = runtimeConfig.admin.google;
  const gateDefaults = runtimeConfig.admin.gate;

  const requiresGate = isGateEnabled(gateDefaults);

  const [gateUnlocked, setGateUnlocked] = useState<boolean>(!requiresGate);
  const [gatePassword, setGatePassword] = useState<string>('');
  const [gateStatus, setGateStatus] = useState<'idle' | 'checking' | 'error'>('idle');
  const [gateError, setGateError] = useState<string | null>(null);

  const [newGatePassword, setNewGatePassword] = useState<string>('');
  const [newGatePassword2, setNewGatePassword2] = useState<string>('');
  const [gateIterations, setGateIterations] = useState<number>(gateDefaults.iterations || 600_000);
  const [gateGenStatus, setGateGenStatus] = useState<'idle' | 'generating' | 'generated' | 'error'>('idle');
  const [gateGenError, setGateGenError] = useState<string | null>(null);

  const [owner, setOwner] = useState<string>(defaults.owner || inferred?.owner || '');
  const [repo, setRepo] = useState<string>(defaults.repo || inferred?.repo || '');
  const [branch, setBranch] = useState<string>(defaults.branch || 'main');
  const [path, setPath] = useState<string>(defaults.path || 'public/data.config');

  const [token, setToken] = useState<string>('');
  const [rememberSession, setRememberSession] = useState(false);

  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userLogin, setUserLogin] = useState<string | null>(null);

  const [fileSha, setFileSha] = useState<string | null>(null);
  const [editorText, setEditorText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [commitUrl, setCommitUrl] = useState<string | null>(null);

  const [googleClientId, setGoogleClientId] = useState<string>(googleDefaults.oauthClientId || '');
  const [googleScope, setGoogleScope] = useState<string>(googleDefaults.scope || BUSINESS_PROFILE_SCOPE);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [googleTokenExpiresAt, setGoogleTokenExpiresAt] = useState<number | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleStatus, setGoogleStatus] = useState<'idle' | 'connecting' | 'connected' | 'loading' | 'error'>('idle');
  const [googleAccounts, setGoogleAccounts] = useState<MyBusinessAccount[]>([]);
  const [googleAccountName, setGoogleAccountName] = useState<string>(googleDefaults.accountName || '');
  const [googleLocations, setGoogleLocations] = useState<MyBusinessLocation[]>([]);
  const [googleLocationName, setGoogleLocationName] = useState<string>(googleDefaults.locationName || '');
  const [googleReviews, setGoogleReviews] = useState<MyBusinessReview[]>([]);

  const allowedUsers = runtimeConfig.admin.github.allowedUsers ?? [];
  const hasUserGate = allowedUsers.length > 0;

  useEffect(() => {
    if (!requiresGate) {
      setGateUnlocked(true);
      sessionStorage.removeItem(SESSION_GATE_KEY);
      return;
    }

    setGateUnlocked(sessionStorage.getItem(SESSION_GATE_KEY) === '1');
  }, [requiresGate]);

  useEffect(() => {
    if (requiresGate && !gateUnlocked) return;

    const stored = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (stored) {
      setToken(stored);
      setRememberSession(true);
    }
  }, [gateUnlocked, requiresGate]);

  useEffect(() => {
    if (!rememberSession) {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      return;
    }
    if (!token) {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      return;
    }
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }, [rememberSession, token]);

  const canCheck = owner.trim() && repo.trim() && branch.trim() && path.trim() && token.trim();

  const githubFileUrl = useMemo(() => {
    if (!owner || !repo || !path) return '';
    const encodedPath = encodeGithubPath(path);
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`);
    if (branch) url.searchParams.set('ref', branch);
    return url.toString();
  }, [owner, repo, branch, path]);

  const loadFromGithub = async () => {
    setStatus('checking');
    setError(null);
    setSaveStatus('idle');
    setCommitUrl(null);
    setValidationError(null);

    try {
      const me = await githubJson<GithubUser>('https://api.github.com/user', token.trim());
      setUserLogin(me.login);

      if (hasUserGate && !allowedUsers.includes(me.login)) {
        throw new Error(`Accès refusé : l’utilisateur GitHub "${me.login}" n’est pas autorisé.`);
      }

      const file = await githubJson<GithubContentResponse>(githubFileUrl, token.trim());
      if (file.encoding !== 'base64') {
        throw new Error(`Encodage inattendu: ${file.encoding}`);
      }

      const raw = fromBase64Utf8(file.content);
      const parsed = JSON.parse(raw) as unknown;
      const pretty = JSON.stringify(parsed, null, 2);

      setFileSha(file.sha);
      setEditorText(pretty);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  const validateJson = () => {
    try {
      const parsed = JSON.parse(editorText) as unknown;
      const normalized = mergeDeep(DEFAULT_SITE_CONFIG, parsed) as SiteConfig;
      setValidationError(null);
      setRuntimeConfig(normalized);
      return true;
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'JSON invalide.');
      return false;
    }
  };

  const saveToGithub = async () => {
    setSaveStatus('saving');
    setCommitUrl(null);

    if (!fileSha) {
      setSaveStatus('error');
      setError('Impossible de sauvegarder : SHA du fichier manquant (rechargez depuis GitHub).');
      return;
    }

    if (!validateJson()) {
      setSaveStatus('error');
      return;
    }

    try {
      const content = toBase64Utf8(editorText);
      const body = {
        message: `Update ${path} via admin`,
        content,
        sha: fileSha,
        branch,
      };

      const res = await githubJson<GithubUpdateResponse>(githubFileUrl, token.trim(), {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      setCommitUrl(res.commit?.html_url ?? null);
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  const downloadConfig = () => {
    const blob = new Blob([editorText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.config';
    a.click();
    URL.revokeObjectURL(url);
  };

  const lockGate = () => {
    sessionStorage.removeItem(SESSION_GATE_KEY);
    setGateUnlocked(false);
    setGatePassword('');
    setGateStatus('idle');
    setGateError(null);
  };

  const unlockGate = async () => {
    setGateError(null);
    setGateStatus('checking');

    try {
      if (!isGateEnabled(gateDefaults)) {
        setGateUnlocked(true);
        setGateStatus('idle');
        return;
      }

      const password = gatePassword;
      if (!password) throw new Error('Mot de passe requis.');

      const actualHash = await pbkdf2HashPassword({
        password,
        saltBase64: gateDefaults.salt,
        iterations: gateDefaults.iterations,
      });

      const ok = verifyPasswordHash({ expectedHashBase64: gateDefaults.passwordHash, actualHashBase64: actualHash });
      if (!ok) throw new Error('Mot de passe incorrect.');

      sessionStorage.setItem(SESSION_GATE_KEY, '1');
      setGateUnlocked(true);
      setGatePassword('');
      setGateStatus('idle');
    } catch (err) {
      sessionStorage.removeItem(SESSION_GATE_KEY);
      setGateUnlocked(false);
      setGateStatus('error');
      setGateError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  const applyNewGateToEditor = async () => {
    setGateGenError(null);
    setGateGenStatus('generating');

    try {
      const p1 = newGatePassword;
      const p2 = newGatePassword2;
      if (!p1 || !p2) throw new Error('Entrez le mot de passe et la confirmation.');
      if (p1 !== p2) throw new Error('Les mots de passe ne correspondent pas.');
      if (p1.length < 12) throw new Error('Mot de passe trop court (12 caractères minimum recommandé).');

      const iterations = Math.max(100_000, Math.min(2_000_000, Math.floor(gateIterations || 600_000)));
      const gate = await createGateFromPassword({ password: p1, iterations });

      const parsed = editorText.trim() ? (JSON.parse(editorText) as unknown) : (DEFAULT_SITE_CONFIG as unknown);
      const normalized = mergeDeep(DEFAULT_SITE_CONFIG, parsed) as any;
      normalized.admin = normalized.admin ?? {};
      normalized.admin.gate = gate;

      setEditorText(JSON.stringify(normalized, null, 2));
      setValidationError(null);
      setNewGatePassword('');
      setNewGatePassword2('');
      setGateGenStatus('generated');
    } catch (err) {
      setGateGenStatus('error');
      setGateGenError(err instanceof Error ? err.message : 'Erreur de génération.');
    }
  };

  const disableGateInEditor = () => {
    try {
      const parsed = editorText.trim() ? (JSON.parse(editorText) as unknown) : (DEFAULT_SITE_CONFIG as unknown);
      const normalized = mergeDeep(DEFAULT_SITE_CONFIG, parsed) as any;
      normalized.admin = normalized.admin ?? {};
      normalized.admin.gate = {
        ...(normalized.admin.gate ?? DEFAULT_SITE_CONFIG.admin.gate),
        enabled: false,
        salt: '',
        passwordHash: '',
      };
      setEditorText(JSON.stringify(normalized, null, 2));
      setValidationError(null);
      setGateGenError(null);
      setGateGenStatus('idle');
    } catch (err) {
      setGateGenError(err instanceof Error ? err.message : 'Erreur.');
      setGateGenStatus('error');
    }
  };

  const logout = () => {
    lockGate();
    setToken('');
    setUserLogin(null);
    setStatus('idle');
    setError(null);
    setFileSha(null);
    setEditorText('');
    setValidationError(null);
    setSaveStatus('idle');
    setCommitUrl(null);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  };

  const googleTokenExpired = googleTokenExpiresAt ? Date.now() > googleTokenExpiresAt - 30_000 : false;

  const connectGoogle = async () => {
    setGoogleError(null);
    setGoogleStatus('connecting');
    setGoogleAccounts([]);
    setGoogleLocations([]);
    setGoogleReviews([]);

    try {
      const clientId = googleClientId.trim();
      if (!clientId) throw new Error('Client ID requis.');

      const scope = (googleScope || BUSINESS_PROFILE_SCOPE).trim();
      const { accessToken, expiresIn } = await requestGoogleAccessToken({
        clientId,
        scope,
        prompt: 'consent',
      });

      setGoogleAccessToken(accessToken);
      setGoogleTokenExpiresAt(expiresIn ? Date.now() + expiresIn * 1000 : null);

      setGoogleStatus('loading');
      const accounts = await listMyBusinessAccounts(accessToken);
      setGoogleAccounts(accounts);
      if (!googleAccountName && accounts[0]?.name) {
        setGoogleAccountName(accounts[0].name);
      }

      setGoogleStatus('connected');
    } catch (err) {
      setGoogleStatus('error');
      setGoogleError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  const loadGoogleLocations = async () => {
    setGoogleError(null);
    setGoogleStatus('loading');
    setGoogleLocations([]);
    setGoogleReviews([]);

    try {
      if (!googleAccessToken) throw new Error('Connectez-vous à Google.');
      if (googleTokenExpired) throw new Error('Session Google expirée, reconnectez-vous.');
      if (!googleAccountName) throw new Error('Compte manquant.');

      const locations = await listMyBusinessLocations(googleAccessToken, googleAccountName);
      setGoogleLocations(locations);
      if (!googleLocationName && locations[0]?.name) {
        setGoogleLocationName(locations[0].name);
      }

      setGoogleStatus('connected');
    } catch (err) {
      setGoogleStatus('error');
      setGoogleError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  const loadGoogleReviews = async () => {
    setGoogleError(null);
    setGoogleStatus('loading');
    setGoogleReviews([]);

    try {
      if (!googleAccessToken) throw new Error('Connectez-vous à Google.');
      if (googleTokenExpired) throw new Error('Session Google expirée, reconnectez-vous.');
      if (!googleLocationName) throw new Error('Établissement manquant.');

      const reviews = await listMyBusinessReviews(googleAccessToken, googleLocationName);
      setGoogleReviews(reviews);
      setGoogleStatus('connected');
    } catch (err) {
      setGoogleStatus('error');
      setGoogleError(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  const importGoogleReviewsToEditor = () => {
    try {
      const parsed = editorText.trim() ? (JSON.parse(editorText) as unknown) : (DEFAULT_SITE_CONFIG as unknown);
      const normalized = mergeDeep(DEFAULT_SITE_CONFIG, parsed) as any;

      const items = googleReviews
        .map((review) => {
          const text = (review.comment ?? '').trim();
          const author = review.reviewer?.displayName ?? 'Client';
          const rating = normalizeStarRating(review.rating ?? review.starRating) ?? undefined;
          const date = review.updateTime ?? review.createTime ?? undefined;
          return { author, source: 'Google', text, rating, date };
        })
        .filter((r) => r.text)
        .slice(0, 6);

      if (!normalized.home?.testimonials) normalized.home = { ...(normalized.home ?? {}), testimonials: { title: '', items: [] } };
      normalized.home.testimonials.items = items;

      normalized.admin = normalized.admin ?? {};
      normalized.admin.google = {
        oauthClientId: googleClientId.trim(),
        accountName: googleAccountName,
        locationName: googleLocationName,
        scope: (googleScope || BUSINESS_PROFILE_SCOPE).trim(),
      };

      setEditorText(JSON.stringify(normalized, null, 2));
      setValidationError(null);
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Erreur import.');
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  if (requiresGate && !gateUnlocked) {
    return (
      <div className="min-h-screen bg-canvas">
        <SEO title="Admin" description="Administration" />

        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-panel border border-white/10 shadow-soft rounded-3xl p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 text-sm font-semibold">
              <Shield size={16} className="text-primary" /> Accès protégé
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white mt-4">Admin</h1>
            <p className="text-slate-300 mt-2">
              Entrez le mot de passe pour accéder à l’éditeur. (Le mot de passe n’est jamais stocké en clair.)
            </p>

            <div className="mt-6 space-y-3">
              <input
                type="password"
                value={gatePassword}
                onChange={(e) => setGatePassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') unlockGate();
                }}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                placeholder="Mot de passe admin"
              />
              <button
                onClick={unlockGate}
                disabled={!gatePassword || gateStatus === 'checking'}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {gateStatus === 'checking' ? <RefreshCw size={18} className="animate-spin" /> : <Lock size={18} />}
                Déverrouiller
              </button>

              {gateStatus === 'error' && gateError ? (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 text-sm flex gap-2">
                  <XCircle size={18} className="mt-0.5" />
                  <div>{gateError}</div>
                </div>
              ) : null}

              <div className="text-xs text-slate-400">
                Mot de passe oublié ? Modifiez <code className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">admin.gate</code>{' '}
                dans <code className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">public/data.config</code> sur GitHub.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <SEO title="Admin" description="Administration" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 text-sm font-semibold">
              <Shield size={16} className="text-primary" /> Admin sécurisé
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white mt-4">Éditeur data.config</h1>
            <p className="text-slate-300 mt-2 max-w-3xl">
              Modifiez le contenu du site via{' '}
              <code className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">public/data.config</code> et
              poussez la mise à jour sur GitHub (déploiement automatique ensuite).
            </p>
          </div>
          {requiresGate ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-slate-200 font-semibold"
              title="Verrouiller l’admin"
            >
              <Lock size={18} /> Verrouiller
            </button>
          ) : token ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-slate-200 font-semibold"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Connection */}
          <div className="lg:col-span-4">
            <div className="bg-panel border border-white/10 shadow-soft rounded-3xl p-6">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Lock size={18} className="text-primary" /> Connexion GitHub
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                Utilisez un token <span className="font-semibold">fine-grained</span> limité à ce dépôt (permission{' '}
                <span className="font-semibold">Contents: Read & Write</span>). Le token n’est jamais stocké côté serveur.
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner</label>
                    <input
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repo</label>
                    <input
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      placeholder="repo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Branch</label>
                    <input
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      placeholder="main"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Path</label>
                    <input
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      placeholder="public/data.config"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token</label>
                  <input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    type="password"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition font-mono"
                    placeholder="github_pat_..."
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-300 mt-2 select-none">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary"
                    />
                    Mémoriser le token pour cette session (sessionStorage)
                  </label>
                </div>

                <button
                  onClick={loadFromGithub}
                  disabled={!canCheck || status === 'checking'}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'checking' ? <RefreshCw size={18} className="animate-spin" /> : <Lock size={18} />}
                  Charger depuis GitHub
                </button>

                {userLogin ? (
                  <div className="text-sm text-slate-300 flex items-center justify-between gap-3">
                    <span>
                      Connecté : <span className="font-bold text-white">{userLogin}</span>
                    </span>
                    <button
                      onClick={() => copy(userLogin)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                      title="Copier"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ) : null}

                {hasUserGate ? (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-slate-200">
                    Accès limité à : <span className="font-semibold">{allowedUsers.join(', ')}</span>
                  </div>
                ) : null}

                {status === 'error' && error ? (
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 text-sm flex gap-2">
                    <XCircle size={18} className="mt-0.5" />
                    <div>{error}</div>
                  </div>
                ) : null}

                {status === 'ready' ? (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-4 text-sm flex gap-2">
                    <CheckCircle2 size={18} className="mt-0.5" />
                    <div>Fichier chargé. Vous pouvez éditer puis sauvegarder.</div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 bg-panel border border-white/10 shadow-soft rounded-3xl p-6">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Lock size={18} className="text-primary" /> Mot de passe Admin
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                Protège <span className="font-semibold">/#/admin</span> avec un hash <span className="font-semibold">PBKDF2</span>{' '}
                (le mot de passe n’est jamais stocké en clair).
              </p>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Statut</span>
                <span className={`font-bold ${requiresGate ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {requiresGate ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nouveau mot de passe</label>
                  <input
                    value={newGatePassword}
                    onChange={(e) => setNewGatePassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="12+ caractères (recommandé)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmer</label>
                  <input
                    value={newGatePassword2}
                    onChange={(e) => setNewGatePassword2(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itérations PBKDF2</label>
                  <input
                    value={gateIterations}
                    onChange={(e) => setGateIterations(Number(e.target.value))}
                    type="number"
                    min={100000}
                    max={2000000}
                    step={50000}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition font-mono"
                  />
                  <div className="text-xs text-slate-400">Plus élevé = plus lent = plus résistant au brute‑force.</div>
                </div>

                <button
                  onClick={applyNewGateToEditor}
                  disabled={gateGenStatus === 'generating'}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {gateGenStatus === 'generating' ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  Générer & insérer dans l’éditeur
                </button>

                <button
                  onClick={disableGateInEditor}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold hover:bg-white/10 transition"
                >
                  <XCircle size={18} /> Désactiver (dans l’éditeur)
                </button>

                {gateGenStatus === 'generated' ? (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-4 text-sm flex gap-2">
                    <CheckCircle2 size={18} className="mt-0.5" />
                    <div>Mot de passe configuré dans le JSON. Sauvegardez sur GitHub pour l’activer.</div>
                  </div>
                ) : null}

                {gateGenStatus === 'error' && gateGenError ? (
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 text-sm flex gap-2">
                    <XCircle size={18} className="mt-0.5" />
                    <div>{gateGenError}</div>
                  </div>
                ) : null}

                <div className="text-xs text-slate-400">
                  Note : sur GitHub Pages (site statique), cette protection est côté client. La vraie sécurité reste votre token GitHub.
                </div>
              </div>
            </div>

            <div className="mt-8 bg-panel border border-white/10 shadow-soft rounded-3xl p-6">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Star size={18} className="text-primary" /> Avis Google (Business Profile)
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                Nécessite un <span className="font-semibold">OAuth Client ID (Web)</span> et l’API{' '}
                <span className="font-semibold">Google Business Profile</span> activée dans votre projet Google Cloud.
              </p>

              <div className="mt-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">OAuth Client ID</label>
                  <input
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition font-mono"
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scope</label>
                  <input
                    value={googleScope}
                    onChange={(e) => setGoogleScope(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition font-mono text-xs"
                    placeholder={BUSINESS_PROFILE_SCOPE}
                  />
                </div>

                <button
                  onClick={connectGoogle}
                  disabled={!googleClientId.trim() || googleStatus === 'connecting' || googleStatus === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleStatus === 'connecting' || googleStatus === 'loading' ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Lock size={18} />
                  )}
                  Se connecter à Google
                </button>

                {googleAccessToken ? (
                  <div className="text-sm text-slate-300">
                    Statut :{' '}
                    <span className={`font-bold ${googleTokenExpired ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {googleTokenExpired ? 'Expiré' : 'Connecté'}
                    </span>
                  </div>
                ) : null}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compte</label>
                  <select
                    value={googleAccountName}
                    onChange={(e) => {
                      setGoogleAccountName(e.target.value);
                      setGoogleLocations([]);
                      setGoogleLocationName('');
                      setGoogleReviews([]);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    disabled={!googleAccessToken || googleTokenExpired || googleAccounts.length === 0}
                  >
                    {googleAccounts.length === 0 ? <option value="">(Connectez-vous pour charger les comptes)</option> : null}
                    {googleAccounts.map((acc) => (
                      <option key={acc.name} value={acc.name}>
                        {acc.accountName ?? acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={loadGoogleLocations}
                  disabled={!googleAccessToken || googleTokenExpired || !googleAccountName || googleStatus === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleStatus === 'loading' ? <RefreshCw size={18} className="animate-spin" /> : <Star size={18} />}
                  Charger les établissements
                </button>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Établissement</label>
                  <select
                    value={googleLocationName}
                    onChange={(e) => {
                      setGoogleLocationName(e.target.value);
                      setGoogleReviews([]);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-white/10 text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    disabled={googleLocations.length === 0}
                  >
                    {googleLocations.length === 0 ? <option value="">(Chargez les établissements)</option> : null}
                    {googleLocations.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.locationName ?? loc.title ?? loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={loadGoogleReviews}
                  disabled={!googleAccessToken || googleTokenExpired || !googleLocationName || googleStatus === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleStatus === 'loading' ? <RefreshCw size={18} className="animate-spin" /> : <Star size={18} />}
                  Récupérer les avis
                </button>

                {googleReviews.length ? (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-slate-200 space-y-2">
                    <div className="font-bold">{googleReviews.length} avis récupéré(s)</div>
                    <ul className="space-y-3">
                      {googleReviews.slice(0, 3).map((review) => {
                        const author = review.reviewer?.displayName ?? 'Client';
                        const text = (review.comment ?? '').trim() || '(Sans commentaire)';
                        const snippet = text.length > 140 ? `${text.slice(0, 140)}...` : text;
                        const rating = normalizeStarRating(review.rating ?? review.starRating);
                        const key = review.reviewId ?? review.name ?? `${author}-${snippet.slice(0, 24)}`;

                        return (
                          <li key={key} className="bg-panel border border-white/10 rounded-xl p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-semibold text-white truncate">{author}</div>
                              {rating ? (
                                <div className="flex items-center gap-0.5 text-yellow-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      fill={i < rating ? 'currentColor' : 'none'}
                                      stroke="currentColor"
                                    />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                            <div className="mt-2 text-xs text-slate-300 leading-relaxed">{snippet}</div>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      onClick={importGoogleReviewsToEditor}
                      disabled={!googleReviews.length}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Save size={18} /> Importer dans l’éditeur
                    </button>
                    <div className="text-xs text-slate-400">
                      Import met à jour{' '}
                      <code className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">home.testimonials.items</code> (6 avis max).
                    </div>
                  </div>
                ) : null}

                {googleError ? (
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 text-sm flex gap-2">
                    <XCircle size={18} className="mt-0.5" />
                    <div>{googleError}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-8">
            <div className="bg-panel border border-white/10 shadow-soft rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Éditeur</h2>
                  <p className="text-sm text-slate-300">
                    Éditez le JSON. Cliquez sur <span className="font-semibold">Valider</span> avant de sauvegarder.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={validateJson}
                    disabled={!editorText.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={18} /> Valider
                  </button>
                  <button
                    onClick={downloadConfig}
                    disabled={!editorText.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Download size={18} /> Télécharger
                  </button>
                  <button
                    onClick={saveToGithub}
                    disabled={status !== 'ready' || saveStatus === 'saving'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saveStatus === 'saving' ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    Sauvegarder
                  </button>
                </div>
              </div>

              {validationError ? (
                <div className="px-6 pt-5">
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 text-sm">
                    <div className="font-bold">JSON invalide</div>
                    <div className="mt-1 font-mono text-xs whitespace-pre-wrap">{validationError}</div>
                  </div>
                </div>
              ) : null}

              {saveStatus === 'error' && error ? (
                <div className="px-6 pt-5">
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 text-sm">
                    <div className="font-bold">Sauvegarde impossible</div>
                    <div className="mt-1">{error}</div>
                  </div>
                </div>
              ) : null}

              {saveStatus === 'saved' ? (
                <div className="px-6 pt-5">
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-4 text-sm">
                    <div className="font-bold">Sauvegardé sur GitHub</div>
                    <div className="mt-1">
                      Le déploiement GitHub Pages se relancera sur le prochain push.
                      {commitUrl ? (
                        <>
                          {' '}
                          <a
                            href={commitUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline font-semibold text-emerald-200"
                          >
                            Voir le commit
                          </a>
                          .
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="p-6">
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder={
                    status === 'ready'
                      ? '{\n  \"meta\": { ... }\n}'
                      : 'Connectez-vous puis cliquez sur “Charger depuis GitHub”.'
                  }
                  spellCheck={false}
                  className="w-full min-h-[520px] font-mono text-xs md:text-sm leading-relaxed px-4 py-3 rounded-2xl bg-canvas border border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-400">
              Astuce : gardez le fichier à l’emplacement{' '}
              <code className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">public/data.config</code> pour qu’il soit
              publié dans <code className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">dist/data.config</code> au build.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_SITE_CONFIG } from './defaultConfig';
import { loadSiteConfig } from './loadConfig';
import type { SiteConfig } from './types';

type SiteConfigStatus = 'loading' | 'ready' | 'error';

interface SiteConfigContextValue {
  config: SiteConfig;
  status: SiteConfigStatus;
  error?: string;
  reload: () => Promise<void>;
  setConfig: (config: SiteConfig) => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [status, setStatus] = useState<SiteConfigStatus>('loading');
  const [error, setError] = useState<string | undefined>(undefined);

  const reload = async () => {
    setStatus('loading');
    setError(undefined);
    try {
      const loaded = await loadSiteConfig();
      setConfig(loaded);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Impossible de charger la configuration.');
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const value = useMemo<SiteConfigContextValue>(
    () => ({ config, status, error, reload, setConfig }),
    [config, status, error],
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
};

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig must be used within SiteConfigProvider');
  }
  return ctx;
}


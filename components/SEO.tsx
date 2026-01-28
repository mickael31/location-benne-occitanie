import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteConfig } from '../config/SiteConfigContext';

interface SEOProps {
  title?: string;
  description?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const { config } = useSiteConfig();
  const siteName = config.meta.siteName;
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description ?? config.meta.description;
  const socialImage = config.meta.socialImageUrl;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      {socialImage ? <meta property="og:image" content={socialImage} /> : null}
      <meta name="robots" content="index, follow" />
      <html lang={config.meta.language ?? 'fr'} />
    </Helmet>
  );
};

export default SEO;

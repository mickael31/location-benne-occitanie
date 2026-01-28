import React, { useMemo } from 'react';
import SEO from '../components/SEO';
import { useSiteConfig } from '../config/SiteConfigContext';

const Privacy: React.FC = () => {
  const { config } = useSiteConfig();
  const { privacy, contact } = config;

  const lastUpdatedLabel = useMemo(() => {
    const dt = new Date(`${privacy.lastUpdated}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return privacy.lastUpdated;
    return dt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }, [privacy.lastUpdated]);

  return (
    <>
      <SEO title={privacy.title} description={config.meta.description} />

      <div className="bg-canvas min-h-screen py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-panel border border-white/10 shadow-soft rounded-[2rem] p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white">{privacy.title}</h1>
            <p className="text-slate-400 mt-3">Dernière mise à jour : {lastUpdatedLabel}</p>

            <div className="mt-10 space-y-10">
              {privacy.sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-display font-bold text-white">{section.title}</h2>
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)} className="text-slate-300 leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {section.bullets?.length ? (
                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                      {section.bullets.map((b) => (
                        <li key={b.slice(0, 24)}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.note ? (
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-slate-200">
                      {section.note}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-3xl bg-secondary text-white p-6 md:p-8">
              <div className="text-sm uppercase tracking-wider text-slate-300 font-bold">Contact</div>
              <p className="mt-2 text-slate-200">
                Pour toute question, écrivez-nous à{' '}
                <a className="text-primary-light font-bold hover:underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;

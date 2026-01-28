import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useSiteConfig } from '../config/SiteConfigContext';

const Bennes: React.FC = () => {
  const { config } = useSiteConfig();
  const { bennes } = config;

  return (
    <>
      <SEO title="Bennes" description={config.meta.description} />

      <section className="bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">{bennes.title}</h1>
          {bennes.subtitle ? <p className="text-slate-300 text-lg mt-4 max-w-2xl">{bennes.subtitle}</p> : null}
        </div>
      </section>

      <section className="bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          {bennes.introTitle ? (
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">{bennes.introTitle}</h2>
          ) : null}
          {bennes.introBody ? <p className="text-slate-300 text-lg mt-4 max-w-4xl">{bennes.introBody}</p> : null}

          <div className="mt-12 grid grid-cols-1 gap-8">
            {bennes.items.map((item, idx) => (
              <div
                key={item.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-light text-sm font-bold border border-primary/20">
                    {item.volume ?? 'Benne'}
                  </div>
                  <h3 className="text-3xl font-display font-extrabold text-white">{item.title}</h3>
                  {item.lead ? <p className="text-lg text-slate-200 font-semibold">{item.lead}</p> : null}
                  <div className="space-y-3">
                    {item.paragraphs.map((p) => (
                      <p key={p.slice(0, 16)} className="text-slate-300 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {item.imageUrl ? (
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-blue-500/10 blur-2xl rounded-[2.5rem]"></div>
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-soft">
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt ?? ''}
                        className="w-full h-full object-cover aspect-[4/3]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
                    <div className="text-slate-400 font-semibold">Illustration à ajouter</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-panel border border-white/10 shadow-soft p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-white">{bennes.cta.title}</h2>
              <p className="text-slate-300 text-lg mt-3 max-w-2xl">{bennes.cta.body}</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 size={16} className="text-primary" /> Devis gratuit • Réponse rapide
              </div>
            </div>
            <Link
              to={bennes.cta.to}
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-md w-full md:w-auto"
            >
              {bennes.cta.label} <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Bennes;

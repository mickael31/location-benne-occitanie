import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useSiteConfig } from '../config/SiteConfigContext';

const Services: React.FC = () => {
  const { config } = useSiteConfig();
  const { servicesPage } = config;

  return (
    <>
      <SEO title="Services" description={config.meta.description} />

      <section className="bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -ml-24 -mt-24"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          {servicesPage.kicker ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-primary-light text-sm font-semibold backdrop-blur-sm">
              <Sparkles size={16} className="text-primary-light" /> {servicesPage.kicker}
            </div>
          ) : null}
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mt-4">{servicesPage.title}</h1>
          <p className="text-slate-300 text-lg mt-4 max-w-2xl">{config.meta.description}</p>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 space-y-14">
          {servicesPage.items.map((item, idx) => (
            <div
              key={item.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
              }`}
            >
              <div className="space-y-4">
                {item.prefix ? (
                  <div className="text-primary font-black tracking-tight text-xl">{item.prefix}</div>
                ) : null}
                <h2 className="text-3xl font-display font-extrabold text-white">{item.title}</h2>
                <p className="text-slate-300 text-lg leading-relaxed">{item.description}</p>
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
      </section>

      <section className="py-16 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-secondary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
            <div className="relative z-10 p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl font-display font-extrabold">{servicesPage.cta.title}</h2>
                <p className="text-slate-300 text-lg mt-3 max-w-2xl">{servicesPage.cta.body}</p>
              </div>
              <Link
                to={servicesPage.cta.to}
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-glow w-full md:w-auto"
              >
                {servicesPage.cta.label} <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;

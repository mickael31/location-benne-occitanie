import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useSiteConfig } from '../config/SiteConfigContext';

const About: React.FC = () => {
  const { config } = useSiteConfig();
  const { aboutPage } = config;

  return (
    <>
      <SEO title="À propos" description={config.meta.description} />

      <section className="bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          {aboutPage.kicker ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-primary-light text-sm font-semibold backdrop-blur-sm">
              <Sparkles size={16} className="text-primary-light" /> {aboutPage.kicker}
            </div>
          ) : null}
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mt-4">{aboutPage.title}</h1>
          <p className="text-slate-300 text-lg mt-4 max-w-2xl">{config.meta.description}</p>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {aboutPage.stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-panel p-6">
                <div className="text-3xl font-display font-extrabold text-white">{stat.value}</div>
                <div className="mt-1 text-sm font-semibold text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-14 space-y-12">
            {aboutPage.sections.map((section) => (
              <div key={section.title} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <h2 className="text-2xl font-display font-bold text-white">{section.title}</h2>
                  {section.subtitle ? <p className="text-slate-300 mt-2">{section.subtitle}</p> : null}
                </div>
                <div className="lg:col-span-8 space-y-4">
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)} className="text-slate-300 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-panel border border-white/10 shadow-soft p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-white">{aboutPage.cta.title}</h2>
              <p className="text-slate-300 text-lg mt-3 max-w-2xl">{aboutPage.cta.body}</p>
            </div>
            <Link
              to={aboutPage.cta.to}
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-md w-full md:w-auto"
            >
              {aboutPage.cta.label} <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

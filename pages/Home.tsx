import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Phone, Quote, Sparkles, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { useSiteConfig } from '../config/SiteConfigContext';

function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function formatReviewDate(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
}

const Home: React.FC = () => {
  const { config } = useSiteConfig();
  const { home, contact } = config;

  const telHref = toTelHref(contact.phone);

  return (
    <>
      <SEO />

      {/* Hero */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-[28rem] h-[28rem] bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-16 -translate-x-16 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-7 animate-fade-in-up">
              {home.hero.badge ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-primary-light text-sm font-semibold backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {home.hero.badge}
                </div>
              ) : null}

              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
                {home.hero.title}
              </h1>

              {home.hero.subtitle ? (
                <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">{home.hero.subtitle}</p>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to={home.hero.primaryCta.to}
                  className="inline-flex justify-center items-center px-7 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(5,150,105,0.25)] hover:shadow-[0_0_30px_rgba(5,150,105,0.45)] transform hover:-translate-y-1"
                >
                  {home.hero.primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                {home.hero.secondaryCta?.type === 'tel' ? (
                  <a
                    href={telHref}
                    className="inline-flex justify-center items-center px-7 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white text-lg font-semibold rounded-xl transition-all"
                  >
                    <Phone size={18} className="mr-2" />
                    {contact.phoneDisplay ?? contact.phone}
                  </a>
                ) : null}
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary-light" />
                  Livraison & enlèvement rapides
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary-light" />
                  Tri conforme & gestion responsable
                </div>
              </div>
            </div>

            {home.hero.imageUrl ? (
              <div className="relative lg:pl-8">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3]">
                  <img
                    src={home.hero.imageUrl}
                    alt={home.hero.imageAlt ?? ''}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="bg-panel/85 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zone</div>
                        <div className="font-bold text-white truncate">{contact.areasServed.join(' • ')}</div>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-primary grid place-items-center text-white shadow-glow">
                        <Sparkles size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 bg-canvas border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {home.aboutTeaser.imageUrl ? (
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-blue-500/10 blur-2xl rounded-[2.5rem]"></div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-soft">
                <img
                  src={home.aboutTeaser.imageUrl}
                  alt={home.aboutTeaser.imageAlt ?? ''}
                  className="w-full h-full object-cover aspect-[4/3]"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-6">
            {home.aboutTeaser.kicker ? (
              <p className="text-primary font-bold uppercase tracking-wider text-xs">{home.aboutTeaser.kicker}</p>
            ) : null}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{home.aboutTeaser.title}</h2>
            <p className="text-lg text-slate-300 leading-relaxed">{home.aboutTeaser.body}</p>
            <Link
              to={home.aboutTeaser.cta.to}
              className="inline-flex items-center font-bold text-primary hover:text-primary-dark transition"
            >
              {home.aboutTeaser.cta.label} <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {home.servicesTeaser.kicker ? (
                <p className="text-primary font-bold uppercase tracking-wider text-xs mb-2">{home.servicesTeaser.kicker}</p>
              ) : null}
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{home.servicesTeaser.title}</h2>
            </div>
            <Link
              to={home.servicesTeaser.cta.to}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-md"
            >
              {home.servicesTeaser.cta.label} <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {home.servicesTeaser.items.map((item) => (
              <div
                key={`${item.prefix ?? ''}-${item.title}`}
                className="bg-panel rounded-3xl border border-white/10 shadow-soft p-7 hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-primary font-black">{item.prefix}</div>
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-primary">
                    <Sparkles size={18} />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-white mt-4">{item.title}</h3>
                <p className="text-slate-300 mt-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {home.benefits.kicker ? (
            <p className="text-primary font-bold uppercase tracking-wider text-xs mb-2">{home.benefits.kicker}</p>
          ) : null}
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{home.benefits.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {home.benefits.items.map((benefit) => (
              <div key={benefit.title} className="p-7 rounded-3xl bg-panel border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-primary shadow-sm">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="mt-4 font-display font-bold text-xl text-white">{benefit.title}</h3>
                <p className="mt-2 text-slate-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {home.howItWorks.kicker ? (
            <p className="text-primary font-bold uppercase tracking-wider text-xs mb-2">{home.howItWorks.kicker}</p>
          ) : null}
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{home.howItWorks.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {home.howItWorks.steps.map((step) => (
              <div key={step.title} className="bg-panel rounded-3xl border border-white/10 shadow-soft p-7">
                {step.kicker ? (
                  <div className="text-xs font-black text-slate-400 tracking-widest uppercase">{step.kicker}</div>
                ) : null}
                <h3 className="mt-3 font-display font-bold text-xl text-white">{step.title}</h3>
                <p className="mt-2 text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {home.commitments.kicker ? (
              <p className="text-primary font-bold uppercase tracking-wider text-xs">{home.commitments.kicker}</p>
            ) : null}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{home.commitments.title}</h2>
            <div className="space-y-4">
              {home.commitments.items.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-1 w-8 h-8 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-slate-300 leading-relaxed">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-md"
            >
              {home.finalCta.cta.label} <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          {home.commitments.imageUrl ? (
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-blue-500/10 blur-2xl rounded-[2.5rem]"></div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-soft">
                <img
                  src={home.commitments.imageUrl}
                  alt={home.commitments.imageAlt ?? ''}
                  className="w-full h-full object-cover aspect-[4/3]"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{home.testimonials.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {home.testimonials.items.map((t) => {
              const ratingRounded = typeof t.rating === 'number' ? Math.max(1, Math.min(5, Math.round(t.rating))) : null;
              const dateLabel = formatReviewDate(t.date);

              return (
                <div
                  key={`${t.author}-${t.text.slice(0, 16)}`}
                  className="bg-panel rounded-3xl border border-white/10 shadow-soft p-7"
                >
                  <Quote className="text-primary/30" />
                  <p className="text-slate-200 mt-3 leading-relaxed">“{t.text}”</p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="font-bold text-white truncate">{t.author}</div>
                    {ratingRounded ? (
                      <div className="flex items-center gap-0.5 text-yellow-400 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const filled = i < ratingRounded;
                          return <Star key={i} size={14} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" />;
                        })}
                      </div>
                    ) : null}
                  </div>

                  {t.source || dateLabel ? (
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      {t.source ? (
                        <span className="font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-full">{t.source}</span>
                      ) : null}
                      {dateLabel ? <span>{dateLabel}</span> : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-secondary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
            <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold">{home.finalCta.title}</h2>
                <p className="text-slate-300 mt-3 text-lg leading-relaxed max-w-2xl">{home.finalCta.body}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Link
                  to={home.finalCta.cta.to}
                  className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-glow"
                >
                  {home.finalCta.cta.label} <ArrowRight className="ml-2" size={18} />
                </Link>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-semibold"
                >
                  <Phone size={18} className="mr-2" />
                  {contact.phoneDisplay ?? contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

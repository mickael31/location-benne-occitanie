import React, { useMemo, useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { useSiteConfig } from '../config/SiteConfigContext';

function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

interface ContactFormState {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const { config } = useSiteConfig();
  const { contactPage } = config;

  const telHref = useMemo(() => toTelHref(config.contact.phone), [config.contact.phone]);
  const mailHref = useMemo(() => `mailto:${config.contact.email}`, [config.contact.email]);
  const addressLine = `${config.contact.address.street}, ${config.contact.address.postalCode} ${config.contact.address.city}`;

  const [form, setForm] = useState<ContactFormState>({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `${contactPage.formTitle}`;
    const bodyLines = [
      `Nom : ${form.fullName}`,
      `Téléphone : ${form.phone}`,
      `Email : ${form.email}`,
      '',
      'Demande :',
      form.message,
    ];

    const mailto = `mailto:${config.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      bodyLines.join('\n'),
    )}`;

    window.location.href = mailto;
    setStatus('success');
  };

  return (
    <>
      <SEO title="Contact" description={config.meta.description} />

      <div className="bg-canvas min-h-screen">
        <div className="bg-secondary text-white pb-28 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {contactPage.kicker ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-primary-light text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {contactPage.kicker}
              </div>
            ) : null}
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mt-4">{contactPage.title}</h1>
            <p className="text-slate-300 text-lg mt-4 max-w-2xl mx-auto">{config.meta.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-panel p-8 rounded-3xl shadow-soft border border-white/10">
                {contactPage.infoKicker ? (
                  <p className="text-primary font-bold uppercase tracking-wider text-xs">{contactPage.infoKicker}</p>
                ) : null}
                {contactPage.infoTitle ? (
                  <h2 className="text-xl font-display font-bold text-white mt-2">{contactPage.infoTitle}</h2>
                ) : null}

                <div className="mt-8 space-y-7">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/5 p-3.5 rounded-2xl text-primary shrink-0 border border-white/10">
                      <Phone size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Téléphone</p>
                      <a href={telHref} className="text-lg font-bold text-white hover:text-primary-light transition">
                        {config.contact.phoneDisplay ?? config.contact.phone}
                      </a>
                      <p className="text-sm text-slate-400 mt-1">{config.contact.openingHours[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white/5 p-3.5 rounded-2xl text-primary shrink-0 border border-white/10">
                      <Mail size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email</p>
                      <a href={mailHref} className="text-lg font-bold text-white hover:text-primary-light transition break-all">
                        {config.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white/5 p-3.5 rounded-2xl text-primary shrink-0 border border-white/10">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Adresse</p>
                      <p className="text-lg font-bold text-white">{addressLine}</p>
                      <p className="text-sm text-slate-400 mt-1">{config.contact.areasServed.join(' • ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h3 className="font-bold text-xl mb-3 relative z-10">Besoin d’une réponse rapide ?</h3>
                <p className="text-primary-50 text-sm mb-6 relative z-10 leading-relaxed">
                  Appelez-nous : nous vous conseillons sur le volume et le type de benne selon votre chantier.
                </p>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center w-full bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition relative z-10"
                >
                  <Phone size={18} className="mr-2" />
                  {config.contact.phoneDisplay ?? config.contact.phone}
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-panel p-8 md:p-10 rounded-3xl shadow-soft border border-white/10">
                {status === 'success' ? (
                  <div className="text-center py-16 animate-fade-in-up">
                    <div className="text-3xl font-display font-extrabold text-white">{contactPage.successTitle}</div>
                    <p className="text-slate-300 mt-3">{contactPage.successBody}</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-8 inline-flex items-center justify-center px-7 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-md"
                    >
                      Faire une autre demande
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white">{contactPage.formTitle}</h2>
                    {contactPage.formSubtitle ? <p className="text-slate-300 mt-3">{contactPage.formSubtitle}</p> : null}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200" htmlFor="fullName">
                            Nom complet (obligatoire)
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            required
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 rounded-xl bg-canvas border border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-100 placeholder:text-slate-500"
                            placeholder="Votre nom"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200" htmlFor="phone">
                            Numéro de téléphone (obligatoire)
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            required
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 rounded-xl bg-canvas border border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-100 placeholder:text-slate-500"
                            placeholder="06..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200" htmlFor="email">
                          Email (obligatoire)
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-canvas border border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-100 placeholder:text-slate-500"
                          placeholder="vous@exemple.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200" htmlFor="message">
                          Description de la demande (obligatoire)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-canvas border border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-slate-100 placeholder:text-slate-500"
                          placeholder="Type de déchets, volume estimé, adresse de livraison, date souhaitée…"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-3"
                      >
                        {contactPage.submitLabel} <Send size={18} />
                      </button>

                      <p className="text-xs text-slate-400">
                        En cliquant sur “{contactPage.submitLabel}”, votre client e-mail s’ouvrira avec votre message pré-rempli.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

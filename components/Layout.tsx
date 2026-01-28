import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import { useSiteConfig } from '../config/SiteConfigContext';

function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

const Layout: React.FC = () => {
  const { config } = useSiteConfig();
  const { meta, contact, nav } = config;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const telHref = useMemo(() => toTelHref(contact.phone), [contact.phone]);
  const mailHref = useMemo(() => `mailto:${contact.email}`, [contact.email]);
  const areaLabel = contact.areasServed.length ? contact.areasServed.join(' • ') : 'Occitanie';
  const addressLine = `${contact.address.street}, ${contact.address.postalCode} ${contact.address.city}`;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top bar */}
      <div className="bg-secondary text-slate-300 py-2.5 text-sm hidden md:block border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <a href={telHref} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} className="text-primary" />
              <span className="font-medium">{contact.phoneDisplay ?? contact.phone}</span>
            </a>
            <a href={mailHref} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} className="text-primary" />
              <span className="font-medium">{contact.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-2">
              <MapPin size={14} />
              {areaLabel}
            </span>
            <Link to="/contact" className="text-xs font-semibold uppercase tracking-wider hover:text-primary transition">
              Devis rapide
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-secondary/80 backdrop-blur-md shadow-[0_10px_30px_-20px_rgba(0,0,0,0.75)] border-b border-white/10'
            : 'bg-secondary border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-glow grid place-items-center overflow-hidden">
                {meta.logoUrl ? (
                  <img src={meta.logoUrl} alt={`${meta.siteName} – logo`} className="w-8 h-8 object-contain" />
                ) : (
                  <ShieldCheck className="text-white" />
                )}
              </div>
              <div className="leading-tight">
                <div className="font-display font-extrabold tracking-tight text-white">{meta.siteName}</div>
                {meta.tagline ? <div className="text-xs text-slate-400">{meta.tagline}</div> : null}
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-primary-light rounded-lg hover:bg-white/5 transition"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ml-2 inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-dark shadow-md hover:-translate-y-0.5 transition"
              >
                Devis gratuit
              </Link>
            </nav>

            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-200 hover:text-primary-light transition"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden border-b border-white/10 bg-secondary/95 backdrop-blur-md transition-all duration-300 ${
            isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:text-primary-light hover:bg-white/5 transition"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-2 flex items-center justify-center w-full px-4 py-4 text-base font-bold text-white bg-primary rounded-xl hover:bg-primary-dark shadow-lg transition"
            >
              Devis gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 opacity-5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="font-display font-bold text-xl text-white">{meta.siteName}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{meta.description}</p>
              <div className="flex gap-3 pt-2">
                {contact.social?.facebook ? (
                  <a
                    href={contact.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                ) : null}
                {contact.social?.linkedin ? (
                  <a
                    href={contact.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                ) : null}
                {contact.social?.instagram ? (
                  <a
                    href={contact.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-3 text-sm">
                {nav.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/privacy" className="hover:text-primary transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Horaires</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {contact.openingHours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="mt-5">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3">Zones</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{areaLabel}</p>
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="bg-white/10 p-2 rounded-md text-primary shrink-0">
                    <MapPin size={16} />
                  </div>
                  <span className="text-slate-400">{addressLine}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-md text-primary shrink-0">
                    <Phone size={16} />
                  </div>
                  <a href={telHref} className="hover:text-white transition font-medium">
                    {contact.phoneDisplay ?? contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-md text-primary shrink-0">
                    <Mail size={16} />
                  </div>
                  <a href={mailHref} className="hover:text-white transition font-medium break-all">
                    {contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} {meta.siteName}. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition">
                RGPD / Confidentialité
              </Link>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                <ShieldCheck size={10} className="text-primary" /> RGPD
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

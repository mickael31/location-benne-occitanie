import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GDPRBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem('cookieConsent', 'refused');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-panel/95 border-t border-white/10 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.85)] z-50 p-5 md:p-6 animate-fade-in-up backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-bold text-white mb-1">Respect de votre vie privée</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez accepter ou refuser les traceurs non essentiels.{' '}
            <Link to="/privacy" className="text-primary-light font-semibold hover:underline">
              En savoir plus
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={handleRefuse}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-white/15 text-slate-200 hover:bg-white/5 transition font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition shadow-md font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default GDPRBanner;

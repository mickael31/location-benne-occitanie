import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-canvas flex items-center justify-center px-4">
      <SEO title="Page introuvable" description="La page demandée n’existe pas." />
      <div className="max-w-lg w-full bg-panel border border-white/10 shadow-soft rounded-[2rem] p-10 text-center">
        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Erreur 404</div>
        <h1 className="mt-3 text-3xl font-display font-extrabold text-white">Page introuvable</h1>
        <p className="mt-3 text-slate-300">La page que vous cherchez n’existe pas (ou a été déplacée).</p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center justify-center px-7 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-md"
        >
          Retour à l’accueil <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

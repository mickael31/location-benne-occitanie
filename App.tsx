import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Bennes from './pages/Bennes';
import Services from './pages/Services';
import About from './pages/About';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import GDPRBanner from './components/GDPRBanner';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="bennes" element={<Bennes />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <GDPRBanner />
      </Router>
    </HelmetProvider>
  );
};

export default App;

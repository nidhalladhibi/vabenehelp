import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css'; // Import des styles globaux

const Home = () => {
  return (
    <div className="home-page">
      {/* Section Hero/Bannière */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenue sur VabeneHelp</h1>
          <p>La plateforme qui connecte les professionnels aux clients</p>
          
          <div className="cta-buttons">
            <Link to="/auth/register" className="btn btn-primary">
              S'inscrire
            </Link>
            <Link to="/professionals" className="btn btn-secondary">
              Trouver un professionnel
            </Link>
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section className="services-section">
        <h2>Nos Services</h2>
        <div className="services-grid">
          {/* Exemple de service - à remplacer par vos données */}
          <div className="service-card">
            <h3>Plomberie</h3>
            <p>Services de plomberie résidentielle et commerciale</p>
            <Link to="/services/plomberie" className="btn btn-outline">
              Voir les professionnels
            </Link>
          </div>
          
          {/* Ajoutez d'autres cartes de service ici */}
        </div>
      </section>

      {/* Section Professionnels à l'honneur */}
      <section className="featured-pros">
        <h2>Professionnels Recommandés</h2>
        {/* Ici vous intégrerez le composant ProfessionalsList */}
      </section>
    </div>
  );
};

export default Home;
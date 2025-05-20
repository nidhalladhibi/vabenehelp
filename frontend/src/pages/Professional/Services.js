import React, { useState } from 'react';
import LocationPicker from '../../components/map/LocationPicker';

const Services = () => {
  const [location, setLocation] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Service location:', location);
    // Envoie vers l'API ici avec location.lat et location.lng
  };

  return (
    <div>
      <h2>Ajouter un Service</h2>
      <form onSubmit={handleSubmit}>
        {/* Autres champs : titre, description, etc. */}

        <label>Choisissez votre emplacement :</label>
        <LocationPicker onLocationSelect={setLocation} />

        <button type="submit" className="btn btn-primary mt-3">
          Enregistrer le service
        </button>
      </form>
    </div>
  );
};

export default Services;

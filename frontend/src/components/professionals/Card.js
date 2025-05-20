import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import Rating from '../common/Rating';

const ProfessionalCard = ({ professional }) => {
  return (
    <BootstrapCard className="mb-3 shadow-sm">
      <BootstrapCard.Body>
        <BootstrapCard.Title>{professional.name}</BootstrapCard.Title>
        <BootstrapCard.Subtitle className="mb-2 text-muted">
          {professional.specialty}
        </BootstrapCard.Subtitle>
        <BootstrapCard.Text>
          {professional.description || 'Aucune description fournie.'}
        </BootstrapCard.Text>
        <Rating value={professional.rating || 0} text={`${professional.reviews || 0} avis`} />
        <p className="mt-2"><strong>Ville:</strong> {professional.city}</p>
        <p><strong>Téléphone:</strong> {professional.phone}</p>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default ProfessionalCard;

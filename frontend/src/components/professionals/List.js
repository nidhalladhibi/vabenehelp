import React, { useEffect, useState } from 'react';
import ProfessionalCard from './Card';
import { getProfessionals } from '../../api/professionalsAPI';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';

const ProfessionalList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const data = await getProfessionals();
        setProfessionals(data);
      } catch (err) {
        setError('Erreur lors du chargement des professionnels');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Row>
      {professionals.map((pro) => (
        <Col key={pro._id} md={6} lg={4}>
          <ProfessionalCard professional={pro} />
        </Col>
      ))}
    </Row>
  );
};

export default ProfessionalList;

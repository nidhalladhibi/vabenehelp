import React, { useEffect, useState } from 'react';
import { getProfessionalById } from '../../api/professionalsAPI';

const Dashboard = () => {
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remplace cet ID par celui de l'utilisateur connecté via auth ou context
  const professionalId = '1234567890abcdef';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfessionalById(professionalId);
        setProfessional(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p className="text-danger">خطأ: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>لوحة التحكم</h2>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">{professional.name}</h5>
          <p className="card-text">البريد الإلكتروني: {professional.email}</p>
          <p className="card-text">المجال: {professional.domain}</p>
          <p className="card-text">المدينة: {professional.city}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

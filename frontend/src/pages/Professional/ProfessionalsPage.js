import React, { useEffect, useState } from 'react';
import { getProfessionals } from '../../api/professionalsAPI';

const ProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const data = await getProfessionals(); // appel API
        setProfessionals(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p className="text-danger">خطأ: {error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">قائمة المهنيين</h2>
      <div className="row">
        {professionals.map((pro) => (
          <div className="col-md-4 mb-3" key={pro._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{pro.name}</h5>
                <p className="card-text">المجال: {pro.domain}</p>
                <p className="card-text">المنطقة: {pro.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalsPage;

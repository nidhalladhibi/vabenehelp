import React, { useState } from 'react';
import '../../Register.css';

const Register = () => {
  const serviceDomains = [
    { id: 'tv', label: 'Réparation TV' },
    { id: 'heater', label: 'Réparation chauffage' },
    { id: 'car', label: 'Mécanique auto' },
    { id: 'fridge', label: 'Réparation réfrigérateur' },
    { id: 'plumbing', label: 'Plomberie' },
    { id: 'electricity', label: 'Électricité' },
    { id: 'ac', label: 'Climatisation' },
    { id: 'carpentry', label: 'Menuiserie' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: 'client',
    domains: []
  });

  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) => password.length >= 6;

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('216')) {
      return cleaned.slice(3).length === 8;
    }
    return cleaned.length === 8;
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('216') && cleaned.length >= 11) {
      const local = cleaned.slice(3);
      return `+216 ${local.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')}`;
    }
    if (cleaned.length === 8) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return phone;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, phone: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDomainChange = (domainId) => {
    setFormData((prev) => ({
      ...prev,
      domains: prev.domains.includes(domainId)
        ? prev.domains.filter(id => id !== domainId)
        : [...prev.domains, domainId]
    }));
  };

  const validateFirstStep = () => {
    const { name, email, password, phone } = formData;
    if (!name || !email || !password || !phone) {
      setError('Tous les champs sont requis');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Email invalide');
      return false;
    }
    if (!isStrongPassword(password)) {
      setError('Mot de passe trop faible (minimum 6 caractères)');
      return false;
    }
    if (!isValidPhone(phone)) {
      setError('Format téléphone invalide (ex: +21651674125 ou 51674125)');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateFirstStep()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.userType === 'professional' && formData.domains.length === 0) {
      setError('Veuillez sélectionner au moins un domaine de service');
      return;
    }

    const cleanedPhone = formData.phone.replace(/\D/g, '');
    const formattedData = {
      ...formData,
      phone: cleanedPhone.startsWith('216') ? cleanedPhone : `216${cleanedPhone}`
    };

    console.log('Données soumises:', formattedData);
    alert('Inscription réussie!');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Inscription</h2>
          <p>Créez votre compte pour commencer à utiliser notre service</p>
        </div>

        <div className="progress-steps">
          <div className="step-indicator">
            <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className="step-indicator">
            <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
        </div>

        <div className="register-form">
          {error && <div className="error-message">{error}</div>}

          {step === 1 ? (
            <div className="form-step">
              <div className="form-group">
                <label>Vous êtes</label>
                <div className="radio-group">
                  <div className={`radio-option ${formData.userType === 'client' ? 'selected' : ''}`}
                       onClick={() => setFormData({...formData, userType: 'client'})}>
                    <div className="radio-option-icon">👤</div>
                    <div className="radio-option-label">Client</div>
                  </div>
                  <div className={`radio-option ${formData.userType === 'professional' ? 'selected' : ''}`}
                       onClick={() => setFormData({...formData, userType: 'professional'})}>
                    <div className="radio-option-icon">🛠️</div>
                    <div className="radio-option-label">Professionnel</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="exemple@email.com"
                />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+216 51 674 125"
                />
              </div>

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
              </div>

              <button type="button" onClick={nextStep} className="action-button primary-button">
                Continuer
              </button>
            </div>
          ) : (
            <div className="form-step">
              {formData.userType === 'professional' && (
                <div className="expertise-section">
                  <div className="expertise-title">Sélectionnez vos domaines d'expertise</div>
                  <div className="domains-grid">
                    {serviceDomains.map(domain => (
                      <div key={domain.id}
                           className={`domain-checkbox ${formData.domains.includes(domain.id) ? 'selected' : ''}`}
                           onClick={() => handleDomainChange(domain.id)}>
                        <input type="checkbox" checked={formData.domains.includes(domain.id)} readOnly />
                        <span>{domain.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="button-group">
                <button type="button" onClick={prevStep} className="action-button back-button">
                  Retour
                </button>
                <button type="button" onClick={handleSubmit} className="action-button secondary-button">
                  S'inscrire
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="login-link">
          <p>Vous avez déjà un compte? <a href="#">Connectez-vous</a></p>
        </div>

        <div className="rtl-section">
          <p>تطبيق يربط المهنيين بالعملاء مباشرة حسب المجال والموقع</p>
        </div>
      </div>
    </div>
  );
};

export default Register;

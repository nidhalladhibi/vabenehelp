import React, { useState } from 'react';
import { isValidEmail } from '../../utils/validation';
import { saveToken } from '../../utils/auth';
import '../../Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      return setError('Email non valide');
    }
    if (password.length < 6) {
      return setError('Mot de passe trop court');
    }

    try {
      // remplacer par un appel réel à l'API
      const fakeToken = 'jwt-token-exemple';
      saveToken(fakeToken);
      setError('');
      alert('Connexion réussie !');
    } catch (err) {
      setError('Échec de la connexion');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Connexion</h2>
          <p>Entrez vos identifiants pour accéder à votre compte</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <i className="icon email-icon"></i>
              <input 
                id="email"
                type="email" 
                placeholder="Votre adresse email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Mot de passe</label>
              <a href="#" className="forgot-password">Mot de passe oublié?</a>
            </div>
            <div className="input-container">
              <i className="icon password-icon"></i>
              <input 
                id="password"
                type="password" 
                placeholder="Votre mot de passe" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>
          
          <button type="submit" className="login-button">Se connecter</button>
          
          <div className="register-prompt">
            Vous n'avez pas de compte ? <a href="#">S'inscrire</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
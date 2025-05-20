// src/App.js
import React from 'react';
import Navbar from './components/common/Navbar';
import AppRoutes from './AppRoutes'; // ou './routes' selon le nom réel

const App = () => {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
};

export default App;

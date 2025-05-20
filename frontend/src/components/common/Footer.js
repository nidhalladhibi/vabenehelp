import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-4">
      <p>&copy; {new Date().getFullYear()} VabeneHelp. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;

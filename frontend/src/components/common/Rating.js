import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} color="#ffc107" />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
    } else {
      stars.push(<FaRegStar key={i} color="#ccc" />);
    }
  }

  return (
    <div className="d-flex align-items-center">
      {stars}
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};

export default Rating;

// components/Card.js
import React from 'react';
import Image from 'next/image';

const Card = ({ card, hidden = false }) => {
  // カードが非表示の場合、カードの裏面を表示
  const imageSrc = hidden 
    ? '/images/Back.webp' 
    : `/images/${card.suit}_${card.rank}.webp`;
  
  const altText = hidden 
    ? 'Card Back' 
    : `${card.suit} ${card.rank}`;

  return (
    <div className="card">
      <Image 
        src={imageSrc} 
        alt={altText} 
        width={70} 
        height={100} 
        className="card-image"
      />
      <style jsx>{`
        .card {
          display: inline-block;
          margin: 0 4px;
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-10px);
        }
        .card-image {
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Card;

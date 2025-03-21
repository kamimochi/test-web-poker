// components/Hand.js
import React from 'react';
import Card from './Card';

const Hand = ({ cards, hidden = false, label }) => {
  return (
    <div className="hand">
      {label && <div className="hand-label">{label}</div>}
      <div className="cards">
        {cards && cards.length > 0 ? (
          cards.map((card, index) => (
            <Card key={`${card.suit}-${card.rank}-${index}`} card={card} hidden={hidden} />
          ))
        ) : (
          <div className="no-cards">カードなし</div>
        )}
      </div>
      <style jsx>{`
        .hand {
          margin: 10px 0;
          padding: 10px;
          border-radius: 5px;
          background-color: rgba(0, 0, 0, 0.1);
        }
        .hand-label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        .cards {
          display: flex;
          justify-content: center;
        }
        .no-cards {
          color: #888;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default Hand;

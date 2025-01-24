import React from 'react';

const Card = ({ card, hidden = false }) => {
    const getSuitSymbol = (suit) => {
        const symbols = {
            Hearts: '♥',
            Diamonds: '♦',
            Clubs: '♣',
            Spades: '♠'
        };
        return symbols[suit] || '';
    };

    // Dealer's hidden card
    if (hidden) {
        return (
            <div className="w-24 h-36 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-white text-2xl">?</div>
            </div>
        );
    }

    const suitColor = card.suit === 'Hearts' || card.suit === 'Diamonds' ? 'text-red-600' : 'text-black';

    return (

        // Card component
        <div className="w-24 h-36 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
            <div className={`text-2xl font-bold ${suitColor}`}>
                {card.rank}
            </div>
            <div className={`text-4xl ${suitColor}`}>
                {getSuitSymbol(card.suit)}
            </div>
        </div>
    );
};

export default Card;
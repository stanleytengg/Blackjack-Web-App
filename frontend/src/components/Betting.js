import React, { useState } from 'react';

const Betting = ({ onPlaceBet, currentBalance, disabled }) => {
    const [bet, setbet] = useState(10);
    const [error, setError] = useState('');

    // Can only place a bet that is less than or equal to the current balance
    const handleBetChange = (amount) => {
        if (disabled) return;
        const newBet = Math.max(1, Math.min(amount, currentBalance));
        setbet(newBet);
        setError('');
    };

    const handleSliderChange = (e) => {
        handleBetChange(parseInt(e.target.value));
    };

    const handleSubmit = () => {
        onPlaceBet(bet);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <h3 className="text-xl font-bold text-white">Place Your Bet</h3>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => handleBetChange(bet - 10)}
                    disabled={disabled || bet <= 10}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                    -10
                </button>
                
                <input
                    type="number"
                    value={bet}
                    onChange={(e) => handleBetChange(parseInt(e.target.value) || 0)}
                    disabled={disabled}
                    className="w-24 p-2 text-center rounded"
                />
                
                <button
                    onClick={() => handleBetChange(bet + 10)}
                    disabled={disabled || bet + 10 > currentBalance}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    +10
                </button>
            </div>

            {/* Sliding bar */}
            <div className="w-full px-2">
                <input
                    type="range"
                    min="10"
                    max={currentBalance}
                    step="10"
                    value={bet}
                    onChange={handleSliderChange}
                    disabled={disabled}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-white text-sm mt-1">
                    <span>$10</span>
                    <span>${currentBalance}</span>
                </div>
            </div>

            {/* Quick bet buttons */}
            <div className="flex space-x-4">
                {[50, 100, 500].map((amount) => (
                    <button
                        key={amount}
                        onClick={() => handleBetChange(amount)}
                        disabled={disabled || amount > currentBalance}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        ${amount}
                    </button>
                ))}
            </div>

            {error && (
                <div className="text-red-500 font-bold">
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={disabled || bet <= 0 || bet > currentBalance}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50"
            >
                Place Bet & Deal
            </button>

            <div className="text-white text-sm">
                Balance: ${currentBalance}
            </div>
        </div>
    );
};

export default Betting;
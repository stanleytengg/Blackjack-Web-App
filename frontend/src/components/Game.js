// src/components/Game.js
import React, { useState, useEffect } from 'react';
import Card from './Card';
import gameApi from '../services/api';

const Game = () => {
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const startNewGame = async () => {
        try {
            setLoading(true);
            setError(null);
            const newGame = await gameApi.createGame();
            setGame(newGame);
        } catch (err) {
            setError('Failed to start new game');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const hit = async () => {
        if (!game?.id) return;
        try {
            setLoading(true);
            setError(null);
            const updatedGame = await gameApi.hit(game.id);
            setGame(updatedGame);
        } catch (err) {
            setError('Failed to hit');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stand = async () => {
        if (!game?.id) return;
        try {
            setLoading(true);
            setError(null);
            const updatedGame = await gameApi.stand(game.id);
            setGame(updatedGame);
        } catch (err) {
            setError('Failed to stand');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-800 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Blackjack</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {!game && (
                    <div className="text-center">
                        <button
                            onClick={startNewGame}
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            Start New Game
                        </button>
                    </div>
                )}
                
                {game && (
                    <div>
                        {/* Dealer's cards */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-4">Dealer's Hand</h2>
                            <div className="flex gap-4">
                                {game.dealer_cards.map((card, index) => (
                                    <Card 
                                        key={index} 
                                        card={card} 
                                        hidden={index === 1 && game.status === 'ACTIVE'}
                                    />
                                ))}
                            </div>
                            {game.status !== 'ACTIVE' && (
                                <p className="text-white mt-2">Score: {game.dealer_score}</p>
                            )}
                        </div>

                        {/* Player's cards */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-4">Your Hand</h2>
                            <div className="flex gap-4">
                                {game.player_cards.map((card, index) => (
                                    <Card key={index} card={card} />
                                ))}
                            </div>
                            <p className="text-white mt-2">Score: {game.player_score}</p>
                        </div>

                        {/* Game controls */}
                        {game.status === 'ACTIVE' ? (
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={hit}
                                    disabled={loading}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Hit
                                </button>
                                <button
                                    onClick={stand}
                                    disabled={loading}
                                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                                >
                                    Stand
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white mb-4">
                                    {game.status === 'PLAYER_WON' && 'You Win!'}
                                    {game.status === 'DEALER_WON' && 'Dealer Wins'}
                                    {game.status === 'TIE' && "It's a Tie!"}
                                </p>
                                <button
                                    onClick={startNewGame}
                                    disabled={loading}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Play Again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
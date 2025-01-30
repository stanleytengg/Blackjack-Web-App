import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Authentication';
import Card from './Card';
import Betting from './Betting';
import gameApi from '../services/api';
import Profile from './Profile';

const Game = () => {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Fetches player profile and refreshes when game state changes
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await gameApi.getProfile();
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
            }
        };
        fetchProfile();
    }, [game]); 

    const startNewGame = async (bet) => {
        try {
            setLoading(true);
            setError(null);
            const newGame = await gameApi.createGame(bet);
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
            <div className="flex justify-between items-center mb-8 px-32">
                <h1 className="text-4xl font-bold text-white">Blackjack</h1>

                {/* Header with user info */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowProfile(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            View Profile
                        </button>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex gap-8 px-32">

                {/* Left side - Game Area */}
                <div className="flex-1">
                    {game && (
                        <>
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
                        </>
                    )}
                </div>

                {/* Right side - Betting Area */}
                <div className="w-80">
                    <div className="bg-green-900 p-6 rounded-lg sticky top-8">

                        {/* Betting interface */}
                        <Betting 
                            onPlaceBet={startNewGame}
                            currentBalance={profile?.balance}
                            disabled={game?.status === 'ACTIVE'}
                        />

                        {/* Game status */}
                        {game?.status === 'ACTIVE' && (
                            <div className="mt-4 text-center">
                                <p className="text-white text-lg font-bold">Current Bet: ${game.bet}</p>
                            </div>
                        )}
                        {game && game.status !== 'ACTIVE' && (
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white mb-4">
                                    {game.status === 'PLAYER_WON' && 'You Win!'}
                                    {game.status === 'DEALER_WON' && 'Dealer Wins'}
                                    {game.status === 'TIE' && "It's a Tie!"}
                                </p>
                            </div>
                        )}

                        {/* Game controls */}
                        <div className="mt-8 flex justify-center gap-4">
                            <div className="mt-8 flex justify-center gap-4">
                                <button
                                    onClick={hit}
                                    disabled={!game || game.status !== 'ACTIVE' || loading}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Hit
                                </button>
                                <button
                                    onClick={stand}
                                    disabled={!game || game.status !== 'ACTIVE' || loading}
                                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                                >
                                    Stand
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Window */}
                <Profile
                    isOpen={showProfile} 
                    onClose={() => setShowProfile(false)} 
                />
            </div>
        </div>
    );
};

export default Game;
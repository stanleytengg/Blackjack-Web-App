import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import gameApi from '../services/api';
import { useAuth } from '../context/Authentication';

const Profile = () => {
    const [stats, setStats] = useState(null);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await gameApi.getProfile();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) {
        return (
            <div className="min-h-screen bg-green-800 flex flex-col items-center justify-center">
                <div className="text-white text-xl py-1">No stats available</div>
                <Link 
                    to="/login" 
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Back to Game
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-800 p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Player Profile</h1>
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Back to Game
                        </Link>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Current Balance</h3>
                        <p className="text-3xl font-bold text-green-600">${stats.balance}</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Win Rate</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.win_rate || 0}%</p>
                        <p className="text-sm text-gray-600">
                            {stats.games_won || 0} / {stats.games_played || 0} games
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Net Profit</h3>
                        <p className={`text-3xl font-bold ${(stats.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${stats.net_profit || 0}
                        </p>
                    </div>
                </div>

                {/* Balance History Graph */}
                <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                    <h3 className="text-xl font-bold mb-4">Balance History</h3>
                    {stats.balance_history && stats.balance_history.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart 
                                    data={stats.balance_history}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="game_number" 
                                        label={{ value: 'Game Number', position: 'bottom', offset: 0 }}
                                    />
                                    <YAxis 
                                        label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip 
                                        formatter={(value) => [`$${value}`, 'Balance']}
                                        labelFormatter={(value) => `Game ${value}`}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        align="right"
                                        height={36}      
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="balance" 
                                        name="Balance"
                                        stroke="#10B981" 
                                        strokeWidth={2}
                                        dot={true}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-600">No balance history available yet. Play some games to see your balance trend!</p>
                    )}
                </div>

                {/* Detailed Stats */}
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Detailed Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Total Games Played</p>
                            <p className="text-2xl font-bold">{stats.games_played || 0}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Games Won</p>
                            <p className="text-2xl font-bold">{stats.games_won || 0}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Total Won</p>
                            <p className="text-2xl font-bold text-green-600">${stats.total_won || 0}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Total Lost</p>
                            <p className="text-2xl font-bold text-red-600">${stats.total_lost || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
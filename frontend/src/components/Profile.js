import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import gameApi from '../services/api';

const Profile = ({ isOpen, onClose }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await gameApi.getProfile();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (isOpen) fetchStats();
    }, [isOpen]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-green-800 p-8 rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Player Profile</h1>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>

                {stats && (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg p-6 shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Current Balance</h3>
                                <p className="text-3xl font-bold text-green-600">${stats.balance}</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Win Rate</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.win_rate}%</p>
                                <p className="text-sm text-gray-600">
                                    {stats.games_won} / {stats.games_played} games
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Net Profit</h3>
                                <p className={`text-3xl font-bold ${stats.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${stats.net_profit}
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
                                                verticalAlign='top'
                                                align='right'
                                                height={30}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="balance" 
                                                name="Balance"
                                                stroke="#10B981" 
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
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
                                    <p className="text-2xl font-bold">{stats.games_played}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Games Won</p>
                                    <p className="text-2xl font-bold">{stats.games_won}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Total Won</p>
                                    <p className="text-2xl font-bold text-green-600">${stats.total_won}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Total Lost</p>
                                    <p className="text-2xl font-bold text-red-600">${stats.total_lost}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
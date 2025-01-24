import React, { useState } from 'react';
import { useAuth } from '../context/Authentication';
import gameApi from '../services/api';

const Register = ({ onToggleForm }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await gameApi.register(username, password, email);
            login(response.user, response.access);
        } catch (err) {
            setError('Registration failed. Username might be taken.');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Register</h2>

            {/* Displays error msg */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Register form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>
                <p className="text-white text-center">
                    Already have an account?{' '}
                    <button
                        onClick={onToggleForm}
                        className="text-blue-300 hover:text-blue-400"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Register;
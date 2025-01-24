import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Creates axios instance with base URL
const api = axios.create({
    baseURL: API_URL
});

// Adds token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const gameApi = {
    // Authentication endpoints
    login: async (username, password) => {
        const response = await api.post('/login/', { username, password });
        return response.data;
    },

    register: async (username, password, email) => {
        const response = await api.post('/register/', { username, password, email });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/profile/');
        return response.data;
    },

    // Game-related endpoints
    createGame: async (bet) => {
        const response = await api.post('/games/', {bet});
        return response.data;
    },

    hit: async (gameId) => {
        const response = await api.post(`/games/${gameId}/hit/`);
        return response.data;
    },

    stand: async (gameId) => {
        const response = await api.post(`/games/${gameId}/stand/`);
        return response.data;
    },

    getGame: async (gameId) => {
        const response = await api.get(`/games/${gameId}/`);
        return response.data;
    }
};

export default gameApi;
import React from 'react';
import { AuthProvider, useAuth } from './context/Authentication';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Game from './components/Game';
import Auth from './components/Auth';
import Profile from './components/Profile';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen bg-green-800 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }
    
    return (!user) ? <Navigate to="/login" /> : children;
};

const AppContent = () => {
    const { user, loading } = useAuth();

    // Displays loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-green-800 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Game />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
};

// Main App component
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
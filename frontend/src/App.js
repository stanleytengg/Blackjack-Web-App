import React from 'react';
import { AuthProvider, useAuth } from './context/Authentication';
import Game from './components/Game';
import Auth from './components/Auth';

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

    return user ? <Game /> : <Auth />;
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
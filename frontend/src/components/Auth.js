import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-green-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {isLogin ? (
                    <Login onToggleForm={() => setIsLogin(false)} />
                ) : (
                    <Register onToggleForm={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
};

export default Auth;
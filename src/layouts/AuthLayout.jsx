import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage to-deep flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dhara</h1>
          <p className="text-white/80">Dimensión Humana</p>
        </div>
        {children}
      </div>
    </div>
  );
};
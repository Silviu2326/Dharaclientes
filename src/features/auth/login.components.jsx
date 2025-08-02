import React from 'react';

// Componente para el formulario de login
export const LoginForm = ({ onSubmit, loading = false }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-deep">Formulario de Login</h2>
      <p className="text-gray-600 text-center">Componente reutilizable para login</p>
      {/* TODO: Implementar formulario completo */}
    </div>
  );
};

// Componente para recuperación de contraseña
export const ForgotPasswordForm = ({ onSubmit }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-deep">Recuperar Contraseña</h3>
      {/* TODO: Implementar formulario de recuperación */}
    </div>
  );
};
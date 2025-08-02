import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';

export const AccountSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deep">Configuración de Cuenta</h1>
        <p className="text-gray-600 mt-2">Ajusta las preferencias de tu cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuraciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Notificaciones, privacidad, seguridad y preferencias de la aplicación.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';

export const HelpCenterPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deep">Centro de Ayuda</h1>
        <p className="text-gray-600 mt-2">Encuentra respuestas a tus preguntas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>¿Cómo podemos ayudarte?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Preguntas frecuentes, guías de usuario y contacto con soporte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
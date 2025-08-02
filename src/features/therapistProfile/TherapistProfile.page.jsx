import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';

export const TherapistProfilePage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deep">Perfil del Terapeuta</h1>
        <p className="text-gray-600 mt-2">ID: {id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Terapeuta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí se mostrará la información detallada del terapeuta, experiencia, especialidades, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';

export const PrivacyCommitmentPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deep">Compromiso de Privacidad</h1>
        <p className="text-gray-600 mt-2">Tu privacidad y confidencialidad son nuestra prioridad</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuestro Compromiso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Información sobre cómo protegemos tu información personal y médica.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
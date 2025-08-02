import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const PrivacyOverview = () => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Resumen de Privacidad</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-sage rounded-full mt-2"></div>
            <p className="text-gray-700">Toda tu información está encriptada y protegida</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-sage rounded-full mt-2"></div>
            <p className="text-gray-700">No compartimos tus datos con terceros sin tu consentimiento</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-sage rounded-full mt-2"></div>
            <p className="text-gray-700">Cumplimos con todas las regulaciones de privacidad</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const DataRights = ({ onExport, onDelete }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Tus Derechos sobre los Datos</h3>
        <p className="text-gray-600">
          Tienes control total sobre tu información personal
        </p>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full">
            Descargar mis datos
          </Button>
          <Button variant="danger" className="w-full">
            Solicitar eliminación de datos
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const PrivacyDocuments = ({ documents = [] }) => {
  const defaultDocs = [
    { id: 1, title: 'Política de Privacidad', updated: '2024-01-15' },
    { id: 2, title: 'Términos de Servicio', updated: '2024-01-15' },
    { id: 3, title: 'Política de Cookies', updated: '2024-01-10' },
  ];

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Documentos Legales</h3>
        <div className="space-y-3">
          {defaultDocs.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-deep">{doc.title}</h4>
                <p className="text-sm text-gray-600">Actualizado: {doc.updated}</p>
              </div>
              <Button size="sm" variant="ghost">Ver</Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const ContactPrivacyOfficer = ({ onContact }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Oficial de Privacidad</h3>
        <p className="text-gray-600">
          ¿Tienes preguntas sobre privacidad? Contacta directamente con nuestro oficial de privacidad.
        </p>
        <Button>Contactar Oficial de Privacidad</Button>
      </div>
    </Card>
  );
};
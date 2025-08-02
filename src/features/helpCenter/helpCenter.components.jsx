import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const HelpSearch = ({ onSearch }) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="font-semibold text-deep">Buscar Ayuda</h3>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="¿Qué necesitas saber?"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
          />
          <Button>Buscar</Button>
        </div>
      </div>
    </Card>
  );
};

export const FAQList = ({ faqs = [] }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Preguntas Frecuentes</h3>
        <div className="space-y-3">
          <details className="border border-gray-200 rounded-lg p-3">
            <summary className="cursor-pointer font-medium text-deep">
              ¿Cómo puedo agendar una cita?
            </summary>
            <p className="text-gray-600 mt-2">
              Puedes agendar una cita desde la sección "Explorar Terapeutas"...
            </p>
          </details>
          <details className="border border-gray-200 rounded-lg p-3">
            <summary className="cursor-pointer font-medium text-deep">
              ¿Cómo puedo cancelar una cita?
            </summary>
            <p className="text-gray-600 mt-2">
              Puedes cancelar una cita desde "Mis Citas"...
            </p>
          </details>
        </div>
      </div>
    </Card>
  );
};

export const ContactSupport = ({ onSubmit }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Contactar Soporte</h3>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Asunto"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
          />
          <textarea 
            placeholder="Describe tu problema..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
          />
          <Button>Enviar Mensaje</Button>
        </div>
      </div>
    </Card>
  );
};

export const HelpCategories = ({ categories = [] }) => {
  const defaultCategories = [
    { id: 1, name: 'Citas y Reservas', count: 8 },
    { id: 2, name: 'Pagos y Facturación', count: 5 },
    { id: 3, name: 'Cuenta y Perfil', count: 6 },
    { id: 4, name: 'Problemas Técnicos', count: 4 },
  ];

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Categorías de Ayuda</h3>
        <div className="grid grid-cols-2 gap-3">
          {defaultCategories.map(category => (
            <div key={category.id} className="p-3 border border-gray-200 rounded-lg hover:bg-sage/5 cursor-pointer">
              <h4 className="font-medium text-deep">{category.name}</h4>
              <p className="text-sm text-gray-600">{category.count} artículos</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
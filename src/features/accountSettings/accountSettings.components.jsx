import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const NotificationSettings = ({ settings, onSave }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Notificaciones</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Recordatorios de citas</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Nuevos mensajes</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Actualizaciones del sistema</span>
          </label>
        </div>
        <Button>Guardar Configuración</Button>
      </div>
    </Card>
  );
};

export const PrivacySettings = ({ settings, onSave }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Privacidad</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Perfil visible para terapeutas</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Permitir recomendaciones</span>
          </label>
        </div>
        <Button>Guardar Configuración</Button>
      </div>
    </Card>
  );
};

export const SecuritySettings = ({ onSave }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Seguridad</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Autenticación de dos factores</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Cerrar sesión en todos los dispositivos</span>
          </label>
        </div>
        <Button>Guardar Configuración</Button>
      </div>
    </Card>
  );
};

export const DangerZone = ({ onDeactivate }) => {
  return (
    <Card className="border-red-200">
      <div className="space-y-4">
        <h3 className="font-semibold text-red-600">Zona de Peligro</h3>
        <p className="text-gray-600">Acciones irreversibles de cuenta</p>
        <Button variant="danger">Desactivar Cuenta</Button>
      </div>
    </Card>
  );
};
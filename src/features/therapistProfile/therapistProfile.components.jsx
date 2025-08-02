import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const TherapistInfo = ({ therapist }) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="font-semibold text-deep">Información del Terapeuta</h3>
        <p className="text-gray-600">Nombre, foto, especialidades, experiencia</p>
      </div>
    </Card>
  );
};

export const TherapistReviews = ({ reviews = [] }) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="font-semibold text-deep">Reseñas</h3>
        <p className="text-gray-600">Lista de reseñas y calificaciones</p>
      </div>
    </Card>
  );
};

export const AvailabilityCalendar = ({ availability = [] }) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="font-semibold text-deep">Disponibilidad</h3>
        <p className="text-gray-600">Calendario con horarios disponibles</p>
        <Button>Agendar Cita</Button>
      </div>
    </Card>
  );
};
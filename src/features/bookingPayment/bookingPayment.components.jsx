import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const BookingSummary = ({ booking }) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="font-semibold text-deep">Resumen de la Reserva</h3>
        <p className="text-gray-600">Terapeuta, fecha, hora, duración, costo</p>
      </div>
    </Card>
  );
};

export const PaymentForm = ({ onPayment }) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="font-semibold text-deep">Información de Pago</h3>
        <p className="text-gray-600">Formulario para tarjeta de crédito/débito</p>
        <Button>Realizar Pago</Button>
      </div>
    </Card>
  );
};

export const PaymentMethods = ({ methods = [] }) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="font-semibold text-deep">Métodos de Pago</h3>
        <p className="text-gray-600">Tarjetas guardadas y opciones de pago</p>
      </div>
    </Card>
  );
};
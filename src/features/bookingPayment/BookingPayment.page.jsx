import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';

export const BookingPaymentPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deep">Reserva y Pago</h1>
        <p className="text-gray-600 mt-2">Confirma tu cita y realiza el pago</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Resumen de la cita, terapeuta, fecha, hora y costo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
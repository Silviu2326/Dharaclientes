// TODO: implementar llamadas a la API para citas

export async function getMyAppointments() {
  // TODO: Obtener citas del usuario
  console.log('Obteniendo mis citas');
  return [];
}

export async function getAppointmentById(appointmentId) {
  // TODO: Obtener detalles de una cita específica
  console.log('Obteniendo cita:', appointmentId);
  return null;
}

export async function rescheduleAppointment(appointmentId, newDateTime) {
  // TODO: Reprogramar cita
  console.log('Reprogramando cita:', appointmentId, newDateTime);
}

export async function cancelAppointment(appointmentId) {
  // TODO: Cancelar cita
  console.log('Cancelando cita:', appointmentId);
}
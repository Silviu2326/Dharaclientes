// API simulada para valoraciones

// Datos mock para citas pendientes de valorar
const mockPendingAppointments = [
  {
    id: 1,
    date: '2024-01-15T10:00:00Z',
    therapist: {
      id: 1,
      name: 'Dra. María González',
      specialty: 'Psicología Clínica',
      avatar: null
    },
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-01-12T14:30:00Z',
    therapist: {
      id: 2,
      name: 'Dr. Carlos Ruiz',
      specialty: 'Terapia de Pareja',
      avatar: null
    },
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-01-10T09:00:00Z',
    therapist: {
      id: 3,
      name: 'Dra. Ana Martín',
      specialty: 'Psicología Infantil',
      avatar: null
    },
    status: 'completed'
  }
];

// Datos mock para valoraciones enviadas
const mockSentReviews = [
  {
    id: 1,
    therapist: {
      id: 4,
      name: 'Dr. Luis Fernández',
      specialty: 'Trauma y EMDR',
      avatar: null
    },
    rating: 5,
    comment: 'Excelente profesional. Me ayudó mucho con mis problemas de ansiedad. Su enfoque es muy empático y efectivo.',
    createdAt: '2024-01-08T16:00:00Z',
    appointmentId: 4
  },
  {
    id: 2,
    therapist: {
      id: 5,
      name: 'Dra. Carmen López',
      specialty: 'Trastornos Alimentarios',
      avatar: null
    },
    rating: 4,
    comment: 'Muy buena terapeuta, aunque a veces las sesiones se sienten un poco cortas. En general, muy recomendable.',
    createdAt: '2024-01-05T11:30:00Z',
    appointmentId: 5
  },
  {
    id: 3,
    therapist: {
      id: 6,
      name: 'Dr. Miguel Sánchez',
      specialty: 'Adicciones',
      avatar: null
    },
    rating: 5,
    comment: 'Increíble trabajo. Su metodología me ha cambiado la vida. Muy profesional y comprensivo.',
    createdAt: '2024-01-02T13:15:00Z',
    appointmentId: 6
  }
];

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener citas pendientes de valorar
export async function getPendingAppointments() {
  await delay(800);
  console.log('Obteniendo citas pendientes de valorar');
  return mockPendingAppointments;
}

// Obtener valoraciones enviadas
export async function getSentReviews() {
  await delay(600);
  console.log('Obteniendo valoraciones enviadas');
  return mockSentReviews;
}

// Crear nueva valoración
export async function createReview(reviewData) {
  await delay(1000);
  console.log('Creando valoración:', reviewData);
  
  // Simular creación exitosa
  const newReview = {
    id: Date.now(),
    ...reviewData,
    createdAt: new Date().toISOString()
  };
  
  // En una app real, esto se enviaría al servidor
  // Por ahora solo simulamos el éxito
  return newReview;
}

// Actualizar valoración existente
export async function updateReview(reviewId, reviewData) {
  await delay(800);
  console.log('Actualizando valoración:', reviewId, reviewData);
  
  // Simular actualización exitosa
  const updatedReview = {
    id: reviewId,
    ...reviewData,
    updatedAt: new Date().toISOString()
  };
  
  return updatedReview;
}

// Eliminar valoración
export async function deleteReview(reviewId) {
  await delay(500);
  console.log('Eliminando valoración:', reviewId);
  
  // Simular eliminación exitosa
  return { success: true };
}

// Obtener estadísticas de valoraciones
export async function getReviewStats() {
  await delay(400);
  console.log('Obteniendo estadísticas de valoraciones');
  
  return {
    totalReviews: mockSentReviews.length,
    averageRating: mockSentReviews.reduce((sum, review) => sum + review.rating, 0) / mockSentReviews.length,
    pendingCount: mockPendingAppointments.length
  };
}

// Verificar si una valoración puede ser editada (dentro de 24 horas)
export function canEditReview(reviewDate) {
  const reviewTime = new Date(reviewDate);
  const now = new Date();
  const diffHours = (now - reviewTime) / (1000 * 60 * 60);
  return diffHours < 24;
}

// Obtener valoración por ID
export async function getReviewById(reviewId) {
  await delay(300);
  console.log('Obteniendo valoración por ID:', reviewId);
  
  const review = mockSentReviews.find(r => r.id === reviewId);
  return review || null;
}

// Marcar cita como valorada (remover de pendientes)
export async function markAppointmentAsReviewed(appointmentId) {
  await delay(400);
  console.log('Marcando cita como valorada:', appointmentId);
  
  // En una app real, esto actualizaría el estado de la cita
  return { success: true };
}
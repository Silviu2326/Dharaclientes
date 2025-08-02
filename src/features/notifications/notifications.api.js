// Mock data para notificaciones
const mockNotifications = [
  {
    id: 'NOT-001',
    title: 'Recordatorio de cita',
    message: 'Tienes una cita programada para mañana a las 10:00 AM con Dr. María García',
    type: 'appointment',
    priority: 'high',
    read: false,
    createdAt: '2024-01-15T08:00:00Z',
    actionUrl: '/appointments/APT-001',
    therapist: 'Dr. María García',
    appointmentDate: '2024-01-16T10:00:00Z'
  },
  {
    id: 'NOT-002',
    title: 'Nuevo mensaje',
    message: 'Tienes un nuevo mensaje de Dr. Carlos López en el chat',
    type: 'message',
    priority: 'medium',
    read: false,
    createdAt: '2024-01-14T15:30:00Z',
    actionUrl: '/chat/therapist-002',
    therapist: 'Dr. Carlos López'
  },
  {
    id: 'NOT-003',
    title: 'Pago procesado',
    message: 'Tu pago de €75.00 ha sido procesado exitosamente',
    type: 'payment',
    priority: 'low',
    read: true,
    createdAt: '2024-01-13T12:15:00Z',
    actionUrl: '/payment-history/PAY-001',
    amount: 75.00
  },
  {
    id: 'NOT-004',
    title: 'Actualización del sistema',
    message: 'Hemos actualizado nuestras políticas de privacidad. Revisa los cambios.',
    type: 'system',
    priority: 'medium',
    read: false,
    createdAt: '2024-01-12T09:00:00Z',
    actionUrl: '/privacy-policy'
  },
  {
    id: 'NOT-005',
    title: 'Sesión completada',
    message: 'Tu sesión con Dr. Ana Martínez ha sido completada. ¡Deja una reseña!',
    type: 'session',
    priority: 'low',
    read: true,
    createdAt: '2024-01-11T16:45:00Z',
    actionUrl: '/reviews/session-005',
    therapist: 'Dr. Ana Martínez'
  },
  {
    id: 'NOT-006',
    title: 'Recordatorio de evaluación',
    message: 'Es hora de completar tu evaluación mensual de progreso',
    type: 'evaluation',
    priority: 'medium',
    read: false,
    createdAt: '2024-01-10T10:00:00Z',
    actionUrl: '/evaluations/monthly'
  }
];

const mockStats = {
  total: 6,
  unread: 4,
  today: 2,
  thisWeek: 5,
  byType: {
    appointment: 1,
    message: 1,
    payment: 1,
    system: 1,
    session: 1,
    evaluation: 1
  },
  byPriority: {
    high: 1,
    medium: 3,
    low: 2
  }
};

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getNotifications(filters = {}) {
  await delay(600);
  
  let filteredNotifications = [...mockNotifications];
  
  // Aplicar filtros
  if (filters.type && filters.type !== 'all') {
    filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
  }
  
  if (filters.priority && filters.priority !== 'all') {
    filteredNotifications = filteredNotifications.filter(n => n.priority === filters.priority);
  }
  
  if (filters.read !== undefined) {
    filteredNotifications = filteredNotifications.filter(n => n.read === filters.read);
  }
  
  if (filters.dateFrom) {
    filteredNotifications = filteredNotifications.filter(n => 
      new Date(n.createdAt) >= new Date(filters.dateFrom)
    );
  }
  
  if (filters.dateTo) {
    filteredNotifications = filteredNotifications.filter(n => 
      new Date(n.createdAt) <= new Date(filters.dateTo)
    );
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredNotifications = filteredNotifications.filter(n => 
      n.title.toLowerCase().includes(searchLower) ||
      n.message.toLowerCase().includes(searchLower) ||
      (n.therapist && n.therapist.toLowerCase().includes(searchLower))
    );
  }
  
  // Ordenar por fecha (más recientes primero)
  filteredNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return {
    notifications: filteredNotifications,
    total: filteredNotifications.length
  };
}

export async function getNotificationById(notificationId) {
  await delay(300);
  return mockNotifications.find(n => n.id === notificationId) || null;
}

export async function getNotificationStats() {
  await delay(200);
  return mockStats;
}

export async function markNotificationAsRead(notificationId) {
  await delay(400);
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    // Actualizar estadísticas
    mockStats.unread = Math.max(0, mockStats.unread - 1);
    return true;
  }
  return false;
}

export async function markAllAsRead() {
  await delay(800);
  mockNotifications.forEach(n => n.read = true);
  mockStats.unread = 0;
  return true;
}

export async function deleteNotification(notificationId) {
  await delay(500);
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    const notification = mockNotifications[index];
    mockNotifications.splice(index, 1);
    
    // Actualizar estadísticas
    mockStats.total--;
    if (!notification.read) {
      mockStats.unread--;
    }
    mockStats.byType[notification.type]--;
    mockStats.byPriority[notification.priority]--;
    
    return true;
  }
  return false;
}

export async function deleteAllRead() {
  await delay(1000);
  const readNotifications = mockNotifications.filter(n => n.read);
  const unreadNotifications = mockNotifications.filter(n => !n.read);
  
  // Actualizar array de notificaciones
  mockNotifications.length = 0;
  mockNotifications.push(...unreadNotifications);
  
  // Actualizar estadísticas
  mockStats.total = unreadNotifications.length;
  
  // Recalcular estadísticas por tipo y prioridad
  mockStats.byType = {
    appointment: 0,
    message: 0,
    payment: 0,
    system: 0,
    session: 0,
    evaluation: 0
  };
  
  mockStats.byPriority = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  unreadNotifications.forEach(n => {
    mockStats.byType[n.type]++;
    mockStats.byPriority[n.priority]++;
  });
  
  return readNotifications.length;
}

export async function exportNotificationsCSV(filters = {}) {
  await delay(1500);
  const { notifications } = await getNotifications(filters);
  
  const csvContent = [
    'ID,Título,Mensaje,Tipo,Prioridad,Leída,Fecha,Terapeuta',
    ...notifications.map(n => 
      `${n.id},"${n.title}","${n.message}",${n.type},${n.priority},${n.read ? 'Sí' : 'No'},${new Date(n.createdAt).toLocaleDateString('es-ES')},"${n.therapist || ''}"`
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `notificaciones-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
  
  return true;
}

export async function getNotificationSettings() {
  await delay(400);
  return {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    messageAlerts: true,
    paymentUpdates: true,
    systemUpdates: false,
    marketingEmails: false
  };
}

export async function updateNotificationSettings(settings) {
  await delay(600);
  console.log('Actualizando configuración de notificaciones:', settings);
  return settings;
}

export async function testNotification(type = 'test') {
  await delay(300);
  const testNotification = {
    id: `TEST-${Date.now()}`,
    title: 'Notificación de prueba',
    message: 'Esta es una notificación de prueba para verificar que todo funciona correctamente.',
    type: type,
    priority: 'low',
    read: false,
    createdAt: new Date().toISOString()
  };
  
  mockNotifications.unshift(testNotification);
  mockStats.total++;
  mockStats.unread++;
  
  return testNotification;
}
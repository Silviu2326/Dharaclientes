// Datos mock para documentos
const mockDocuments = [
  {
    id: '1',
    name: 'Ejercicios de respiración.pdf',
    type: 'pdf',
    size: 2048576, // 2MB
    date: '2024-01-15T10:30:00Z',
    sessionId: 'session-1',
    sessionName: 'Sesión de Ansiedad #3',
    url: '/documents/ejercicios-respiracion.pdf',
    therapistName: 'Dr. María González'
  },
  {
    id: '2',
    name: 'Técnicas de mindfulness.pdf',
    type: 'pdf',
    size: 1536000, // 1.5MB
    date: '2024-01-12T14:15:00Z',
    sessionId: 'session-2',
    sessionName: 'Sesión de Mindfulness #1',
    url: '/documents/mindfulness.pdf',
    therapistName: 'Lic. Ana Rodríguez'
  },
  {
    id: '3',
    name: 'Registro de emociones.jpg',
    type: 'image',
    size: 512000, // 500KB
    date: '2024-01-10T09:45:00Z',
    sessionId: 'session-1',
    sessionName: 'Sesión de Ansiedad #3',
    url: '/documents/registro-emociones.jpg',
    therapistName: 'Dr. María González'
  },
  {
    id: '4',
    name: 'Meditación guiada.mp3',
    type: 'audio',
    size: 8388608, // 8MB
    date: '2024-01-08T16:20:00Z',
    sessionId: 'session-3',
    sessionName: 'Sesión de Relajación #2',
    url: '/documents/meditacion-guiada.mp3',
    therapistName: 'Lic. Carlos Mendoza'
  },
  {
    id: '5',
    name: 'Técnicas de relajación.mp4',
    type: 'video',
    size: 15728640, // 15MB
    date: '2024-01-05T11:00:00Z',
    sessionId: 'session-3',
    sessionName: 'Sesión de Relajación #2',
    url: '/documents/relajacion.mp4',
    therapistName: 'Lic. Carlos Mendoza'
  },
  {
    id: '6',
    name: 'Plan de tratamiento.docx',
    type: 'document',
    size: 256000, // 250KB
    date: '2024-01-03T13:30:00Z',
    sessionId: 'session-4',
    sessionName: 'Evaluación Inicial',
    url: '/documents/plan-tratamiento.docx',
    therapistName: 'Dr. María González'
  }
];

// Datos mock para sesiones
const mockSessions = [
  {
    id: 'session-1',
    name: 'Sesión de Ansiedad #3',
    date: '2024-01-15T10:00:00Z',
    therapistName: 'Dr. María González'
  },
  {
    id: 'session-2',
    name: 'Sesión de Mindfulness #1',
    date: '2024-01-12T14:00:00Z',
    therapistName: 'Lic. Ana Rodríguez'
  },
  {
    id: 'session-3',
    name: 'Sesión de Relajación #2',
    date: '2024-01-08T16:00:00Z',
    therapistName: 'Lic. Carlos Mendoza'
  },
  {
    id: 'session-4',
    name: 'Evaluación Inicial',
    date: '2024-01-03T13:00:00Z',
    therapistName: 'Dr. María González'
  }
];

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener todos los documentos
export const getDocuments = async () => {
  await delay(800); // Simular latencia de red
  return {
    documents: mockDocuments,
    total: mockDocuments.length
  };
};

// Obtener sesiones disponibles
export const getSessions = async () => {
  await delay(300);
  return mockSessions;
};

// Buscar documentos por texto
export const searchDocuments = async (searchTerm) => {
  await delay(400);
  
  if (!searchTerm.trim()) {
    return mockDocuments;
  }
  
  const filtered = mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.therapistName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return filtered;
};

// Filtrar documentos por sesión
export const filterDocumentsBySession = async (sessionId) => {
  await delay(300);
  
  if (!sessionId) {
    return mockDocuments;
  }
  
  return mockDocuments.filter(doc => doc.sessionId === sessionId);
};

// Buscar y filtrar documentos combinado
export const searchAndFilterDocuments = async (searchTerm, sessionId) => {
  await delay(500);
  
  let filtered = mockDocuments;
  
  // Aplicar filtro de sesión
  if (sessionId) {
    filtered = filtered.filter(doc => doc.sessionId === sessionId);
  }
  
  // Aplicar búsqueda de texto
  if (searchTerm && searchTerm.trim()) {
    filtered = filtered.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.therapistName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  return filtered;
};

// Obtener documento por ID
export const getDocumentById = async (documentId) => {
  await delay(200);
  return mockDocuments.find(doc => doc.id === documentId);
};

// Descargar documento
export const downloadDocument = async (documentId) => {
  await delay(1000); // Simular tiempo de descarga
  
  const document = mockDocuments.find(doc => doc.id === documentId);
  if (!document) {
    throw new Error('Documento no encontrado');
  }
  
  // En una implementación real, esto devolvería la URL de descarga o el blob del archivo
  return {
    success: true,
    downloadUrl: document.url,
    filename: document.name
  };
};

// Marcar documento como visto
export const markDocumentAsViewed = async (documentId) => {
  await delay(200);
  
  // En una implementación real, esto actualizaría el estado en el servidor
  return {
    success: true,
    documentId,
    viewedAt: new Date().toISOString()
  };
};

// Obtener estadísticas de documentos
export const getDocumentStats = async () => {
  await delay(300);
  
  const stats = {
    total: mockDocuments.length,
    byType: {
      pdf: mockDocuments.filter(doc => doc.type === 'pdf').length,
      image: mockDocuments.filter(doc => doc.type === 'image').length,
      audio: mockDocuments.filter(doc => doc.type === 'audio').length,
      video: mockDocuments.filter(doc => doc.type === 'video').length,
      document: mockDocuments.filter(doc => doc.type === 'document').length
    },
    totalSize: mockDocuments.reduce((sum, doc) => sum + doc.size, 0),
    recentCount: mockDocuments.filter(doc => {
      const docDate = new Date(doc.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return docDate > weekAgo;
    }).length
  };
  
  return stats;
};

// Funciones legacy mantenidas para compatibilidad
export const getJournalEntries = async () => {
  await delay(500);
  return [];
};

export const createJournalEntry = async (entry) => {
  await delay(800);
  return {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
};

export const uploadDocument = async (file) => {
  await delay(2000); // Simular tiempo de subida
  
  const newDocument = {
    id: Date.now().toString(),
    name: file.name,
    type: file.type.split('/')[0] || 'document',
    size: file.size,
    date: new Date().toISOString(),
    sessionId: 'session-1', // Por defecto
    sessionName: 'Sesión Actual',
    url: URL.createObjectURL(file),
    therapistName: 'Sistema'
  };
  
  return newDocument;
};

export const deleteDocument = async (documentId) => {
  await delay(500);
  
  const documentExists = mockDocuments.some(doc => doc.id === documentId);
  if (!documentExists) {
    throw new Error('Documento no encontrado');
  }
  
  return {
    success: true,
    deletedId: documentId
  };
};
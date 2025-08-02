// API para gestión de favoritos con datos mock

// Datos mock de terapeutas favoritos
const mockFavorites = [
  {
    id: 1,
    name: 'Dra. María González',
    specialty: 'Psicología Clínica',
    rating: 4.8,
    price: 75,
    photo: '/api/placeholder/80/80',
    alertsEnabled: true,
    dateAdded: '2024-01-15'
  },
  {
    id: 2,
    name: 'Dr. Carlos Rodríguez',
    specialty: 'Terapia Cognitivo-Conductual',
    rating: 4.9,
    price: 85,
    photo: '/api/placeholder/80/80',
    alertsEnabled: false,
    dateAdded: '2024-01-10'
  },
  {
    id: 3,
    name: 'Dra. Ana Martínez',
    specialty: 'Psicología Infantil',
    rating: 4.7,
    price: 70,
    photo: '/api/placeholder/80/80',
    alertsEnabled: true,
    dateAdded: '2024-01-20'
  },
  {
    id: 4,
    name: 'Dr. Luis Fernández',
    specialty: 'Terapia de Pareja',
    rating: 4.6,
    price: 90,
    photo: '/api/placeholder/80/80',
    alertsEnabled: false,
    dateAdded: '2024-01-05'
  },
  {
    id: 5,
    name: 'Dra. Carmen López',
    specialty: 'Psicología Positiva',
    rating: 4.9,
    price: 80,
    photo: '/api/placeholder/80/80',
    alertsEnabled: true,
    dateAdded: '2024-01-25'
  }
];

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener lista de favoritos
export async function getFavorites() {
  await delay(800); // Simular latencia de red
  
  try {
    // En una implementación real, esto sería una llamada HTTP
    // const response = await fetch('/api/favorites');
    // return await response.json();
    
    return {
      success: true,
      data: mockFavorites
    };
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    return {
      success: false,
      error: 'Error al cargar favoritos'
    };
  }
}

// Agregar terapeuta a favoritos
export async function addFavorite(therapistId) {
  await delay(500);
  
  try {
    console.log('Agregando a favoritos:', therapistId);
    
    // En una implementación real:
    // const response = await fetch('/api/favorites', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ therapistId })
    // });
    
    return {
      success: true,
      message: 'Terapeuta agregado a favoritos'
    };
  } catch (error) {
    console.error('Error agregando a favoritos:', error);
    return {
      success: false,
      error: 'Error al agregar a favoritos'
    };
  }
}

// Remover terapeuta de favoritos
export async function removeFavorite(therapistId) {
  await delay(500);
  
  try {
    console.log('Removiendo de favoritos:', therapistId);
    
    // En una implementación real:
    // const response = await fetch(`/api/favorites/${therapistId}`, {
    //   method: 'DELETE'
    // });
    
    return {
      success: true,
      message: 'Terapeuta removido de favoritos'
    };
  } catch (error) {
    console.error('Error removiendo de favoritos:', error);
    return {
      success: false,
      error: 'Error al remover de favoritos'
    };
  }
}

// Verificar si un terapeuta es favorito
export async function isFavorite(therapistId) {
  await delay(200);
  
  try {
    // En una implementación real:
    // const response = await fetch(`/api/favorites/check/${therapistId}`);
    // const data = await response.json();
    
    const isFav = mockFavorites.some(fav => fav.id === therapistId);
    
    return {
      success: true,
      isFavorite: isFav
    };
  } catch (error) {
    console.error('Error verificando favorito:', error);
    return {
      success: false,
      isFavorite: false
    };
  }
}

// Actualizar configuración de alertas para un terapeuta
export async function updateTherapistAlerts(therapistId, alertsEnabled) {
  await delay(500);
  
  try {
    console.log('Actualizando alertas para terapeuta:', therapistId, alertsEnabled);
    
    // En una implementación real:
    // const response = await fetch(`/api/favorites/${therapistId}/alerts`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ alertsEnabled })
    // });
    
    return {
      success: true,
      message: `Alertas ${alertsEnabled ? 'activadas' : 'desactivadas'}`
    };
  } catch (error) {
    console.error('Error actualizando alertas:', error);
    return {
      success: false,
      error: 'Error al actualizar alertas'
    };
  }
}

// Obtener configuración global de alertas
export async function getAlertSettings() {
  await delay(300);
  
  try {
    // En una implementación real:
    // const response = await fetch('/api/user/alert-settings');
    // return await response.json();
    
    return {
      success: true,
      data: {
        frequency: 'immediate', // 'immediate' | 'daily'
        channels: {
          email: true,
          push: true
        }
      }
    };
  } catch (error) {
    console.error('Error obteniendo configuración de alertas:', error);
    return {
      success: false,
      error: 'Error al cargar configuración'
    };
  }
}

// Actualizar configuración global de alertas
export async function updateAlertSettings(settings) {
  await delay(500);
  
  try {
    console.log('Actualizando configuración de alertas:', settings);
    
    // En una implementación real:
    // const response = await fetch('/api/user/alert-settings', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings)
    // });
    
    return {
      success: true,
      message: 'Configuración actualizada'
    };
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    return {
      success: false,
      error: 'Error al actualizar configuración'
    };
  }
}

// Buscar en favoritos
export function searchFavorites(favorites, searchTerm) {
  if (!searchTerm.trim()) return favorites;
  
  const term = searchTerm.toLowerCase();
  return favorites.filter(therapist => 
    therapist.name.toLowerCase().includes(term) ||
    therapist.specialty.toLowerCase().includes(term)
  );
}

// Ordenar favoritos
export function sortFavorites(favorites, sortBy) {
  const sorted = [...favorites];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'dateAdded':
      return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    default:
      return sorted;
  }
}
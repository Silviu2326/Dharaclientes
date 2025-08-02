// API para gestión de favoritos con datos mock

// Datos mock de terapeutas favoritos con categorías
const mockFavorites = [
  {
    id: 1,
    name: 'Dra. María González',
    specialty: 'Psicología Clínica',
    category: 'individual',
    rating: 4.8,
    price: 75,
    photo: '/api/placeholder/80/80',
    alertsEnabled: true,
    dateAdded: '2024-01-15',
    averageRating: 4.8,
    totalReviews: 127
  },
  {
    id: 2,
    name: 'Dr. Carlos Rodríguez',
    specialty: 'Terapia Cognitivo-Conductual',
    category: 'individual',
    rating: 4.9,
    price: 85,
    photo: '/api/placeholder/80/80',
    alertsEnabled: false,
    dateAdded: '2024-01-10',
    averageRating: 4.9,
    totalReviews: 203
  },
  {
    id: 3,
    name: 'Dra. Ana Martínez',
    specialty: 'Psicología Infantil',
    category: 'child',
    rating: 4.7,
    price: 70,
    photo: '/api/placeholder/80/80',
    alertsEnabled: true,
    dateAdded: '2024-01-20',
    averageRating: 4.7,
    totalReviews: 89
  },
  {
    id: 4,
    name: 'Dr. Luis Fernández',
    specialty: 'Terapia de Pareja',
    category: 'couple',
    rating: 4.6,
    price: 90,
    photo: '/api/placeholder/80/80',
    alertsEnabled: false,
    dateAdded: '2024-01-05',
    averageRating: 4.6,
    totalReviews: 156
  },
  {
    id: 5,
    name: 'Dra. Carmen López',
    specialty: 'Psicología Positiva',
    category: 'individual',
    rating: 4.9,
    price: 80,
    photo: '/api/placeholder/80/80',
    alertsEnabled: true,
    dateAdded: '2024-01-25',
    averageRating: 4.9,
    totalReviews: 174
  },
  {
    id: 6,
    name: 'Dra. Patricia Ruiz',
    specialty: 'Terapia Familiar Sistémica',
    category: 'family',
    rating: 4.8,
    price: 95,
    photo: '/api/placeholder/80/80',
    alertsEnabled: true,
    dateAdded: '2024-01-30',
    averageRating: 4.8,
    totalReviews: 92
  },
  {
    id: 7,
    name: 'Dr. Miguel Torres',
    specialty: 'Psicología del Adolescente',
    category: 'adolescent',
    rating: 4.5,
    price: 75,
    photo: '/api/placeholder/80/80',
    alertsEnabled: false,
    dateAdded: '2024-02-01',
    averageRating: 4.5,
    totalReviews: 67
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
        frequency: 'immediate', // 'immediate' | 'daily' | 'weekly'
        channels: {
          email: true,
          push: true,
          sms: false
        },
        alertTypes: {
          availability: true,
          messages: true,
          priceChanges: false,
          reminders: true
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

// Buscar en favoritos (mejorado)
export function searchFavorites(favorites, searchTerm) {
  if (!searchTerm.trim()) return favorites;
  
  const term = searchTerm.toLowerCase();
  return favorites.filter(therapist => 
    therapist.name.toLowerCase().includes(term) ||
    therapist.specialty.toLowerCase().includes(term) ||
    getCategoryLabel(therapist.category || 'individual').toLowerCase().includes(term)
  );
}

// Función auxiliar para obtener etiquetas de categorías
function getCategoryLabel(category) {
  const labels = {
    individual: 'Terapia Individual',
    couple: 'Terapia de Pareja',
    family: 'Terapia Familiar',
    group: 'Terapia Grupal',
    child: 'Psicología Infantil',
    adolescent: 'Psicología Adolescente'
  };
  return labels[category] || 'Otros';
}

// Ordenar favoritos (mejorado)
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
    case 'category':
      return sorted.sort((a, b) => {
        const categoryA = getCategoryLabel(a.category || 'individual');
        const categoryB = getCategoryLabel(b.category || 'individual');
        const categoryCompare = categoryA.localeCompare(categoryB);
        // Si las categorías son iguales, ordenar por rating
        return categoryCompare !== 0 ? categoryCompare : b.rating - a.rating;
      });
    default:
      return sorted;
  }
}

// Filtrar favoritos por categoría
export function filterFavoritesByCategory(favorites, category) {
  if (!category) return favorites;
  return favorites.filter(therapist => (therapist.category || 'individual') === category);
}

// Obtener estadísticas de favoritos
export function getFavoritesStats(favorites) {
  const stats = {
    total: favorites.length,
    withAlerts: favorites.filter(f => f.alertsEnabled).length,
    averageRating: 0,
    categories: {}
  };
  
  if (favorites.length > 0) {
    stats.averageRating = favorites.reduce((sum, f) => sum + f.rating, 0) / favorites.length;
    
    favorites.forEach(fav => {
      const category = fav.category || 'individual';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });
  }
  
  return stats;
}
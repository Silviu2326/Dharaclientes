import React, { useState, useEffect, useMemo } from 'react';
import {
  FavoritesHeader,
  FavoritesList,
  AlertsPanel,
  AlertsInfoModal,
  ErrorState
} from './favorites.components';
import {
  getFavorites,
  removeFavorite,
  updateTherapistAlerts,
  getAlertSettings,
  updateAlertSettings,
  searchFavorites,
  sortFavorites
} from './favorites.api';

export const Favorites = () => {
  // Estados principales
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Estados de alertas
  const [alertSettings, setAlertSettings] = useState({
    frequency: 'immediate',
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
  });
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const [showAlertsInfoModal, setShowAlertsInfoModal] = useState(false);
  
  // Estados de UI
  const [removingId, setRemovingId] = useState(null);
  const [updatingAlertsId, setUpdatingAlertsId] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadFavorites();
    loadAlertSettings();
  }, []);

  // Cargar favoritos
  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFavorites();
      
      if (response.success) {
        setFavorites(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Error inesperado al cargar favoritos');
      console.error('Error cargando favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar configuración de alertas
  const loadAlertSettings = async () => {
    try {
      const response = await getAlertSettings();
      if (response.success) {
        setAlertSettings(response.data);
      }
    } catch (err) {
      console.error('Error cargando configuración de alertas:', err);
    }
  };

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Manejar ordenamiento
  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Manejar filtro por categoría
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  // Remover de favoritos
  const handleRemoveFavorite = async (therapistId) => {
    try {
      setRemovingId(therapistId);
      
      const response = await removeFavorite(therapistId);
      
      if (response.success) {
        // Actualizar lista local
        setFavorites(prev => prev.filter(fav => fav.id !== therapistId));
        
        // Mostrar notificación de éxito (opcional)
        console.log(response.message);
      } else {
        console.error('Error:', response.error);
        // Aquí podrías mostrar una notificación de error
      }
    } catch (err) {
      console.error('Error removiendo favorito:', err);
    } finally {
      setRemovingId(null);
    }
  };

  // Alternar alertas de terapeuta
  const handleToggleAlerts = async (therapistId, alertsEnabled) => {
    try {
      setUpdatingAlertsId(therapistId);
      
      const response = await updateTherapistAlerts(therapistId, alertsEnabled);
      
      if (response.success) {
        // Actualizar estado local
        setFavorites(prev => 
          prev.map(fav => 
            fav.id === therapistId 
              ? { ...fav, alertsEnabled }
              : fav
          )
        );
        
        console.log(response.message);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Error actualizando alertas:', err);
    } finally {
      setUpdatingAlertsId(null);
    }
  };

  // Ver perfil de terapeuta
  const handleViewProfile = (therapistId) => {
    // Navegar al perfil del terapeuta
    window.location.href = `/therapist-profile/${therapistId}`;
  };

  // Actualizar configuración global de alertas
  const handleUpdateAlertSettings = async (newSettings) => {
    try {
      const response = await updateAlertSettings(newSettings);
      
      if (response.success) {
        setAlertSettings(newSettings);
        console.log(response.message);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Error actualizando configuración:', err);
    }
  };

  // Reintentar carga en caso de error
  const handleRetry = () => {
    loadFavorites();
  };

  // Función para obtener etiquetas de categorías
  const getCategoryLabel = (category) => {
    const labels = {
      individual: 'Terapia Individual',
      couple: 'Terapia de Pareja',
      family: 'Terapia Familiar',
      group: 'Terapia Grupal',
      child: 'Psicología Infantil',
      adolescent: 'Psicología Adolescente'
    };
    return labels[category] || 'Otros';
  };

  // Obtener categorías disponibles
  const categories = useMemo(() => {
    const categoryCount = {};
    favorites.forEach(fav => {
      const category = fav.category || 'individual';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.entries(categoryCount).map(([value, count]) => ({
      value,
      label: getCategoryLabel(value),
      count
    }));
  }, [favorites]);

  // Favoritos filtrados y ordenados
  const processedFavorites = useMemo(() => {
    let filtered = searchFavorites(favorites, searchTerm);
    
    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(fav => (fav.category || 'individual') === selectedCategory);
    }
    
    return sortFavorites(filtered, sortBy);
  }, [favorites, searchTerm, sortBy, selectedCategory]);

  // Renderizar estado de error
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con búsqueda, filtros y ordenamiento */}
      <FavoritesHeader
        onSearch={handleSearch}
        onSort={handleSort}
        onCategoryFilter={handleCategoryFilter}
        searchTerm={searchTerm}
        sortBy={sortBy}
        selectedCategory={selectedCategory}
        categories={categories}
      />

      {/* Panel de configuración de alertas */}
      {showAlertsPanel && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-deep">Configuración de Alertas</h2>
            <button
              onClick={() => setShowAlertsPanel(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cerrar panel de alertas"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <AlertsPanel
            alertSettings={alertSettings}
            onUpdateSettings={handleUpdateAlertSettings}
          />
        </div>
      )}

      {/* Botones para alertas */}
      {!showAlertsPanel && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowAlertsInfoModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            title="Información sobre alertas"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¿Qué son las alertas?
          </button>
          <button
            onClick={() => setShowAlertsPanel(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 12h.01" />
            </svg>
            Configurar Alertas
          </button>
        </div>
      )}

      {/* Lista de favoritos */}
      <FavoritesList
        favorites={processedFavorites}
        loading={loading}
        onRemove={handleRemoveFavorite}
        onToggleAlerts={handleToggleAlerts}
        onViewProfile={handleViewProfile}
      />

      {/* Modal de información de alertas */}
      <AlertsInfoModal 
        isOpen={showAlertsInfoModal} 
        onClose={() => setShowAlertsInfoModal(false)} 
      />

      {/* Información adicional */}
      {!loading && processedFavorites.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Mostrando {processedFavorites.length} de {favorites.length} terapeutas favoritos
          {searchTerm && (
            <span> • Filtrado por: "{searchTerm}"</span>
          )}
          {selectedCategory && (
            <span> • Categoría: {getCategoryLabel(selectedCategory)}</span>
          )}
        </div>
      )}

      {/* Mensaje cuando no hay resultados con filtros */}
      {!loading && favorites.length > 0 && processedFavorites.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600">
              No hay terapeutas que coincidan con los filtros aplicados.
            </p>
          </div>
          <div className="space-x-3">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                Limpiar búsqueda
              </button>
            )}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                Mostrar todas las categorías
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
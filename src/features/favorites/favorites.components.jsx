import React, { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

// Encabezado con título, búsqueda y ordenamiento
export const FavoritesHeader = ({ onSearch, onSort, searchTerm, sortBy }) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-deep">Mis Favoritos</h1>
        <p className="text-gray-600 mt-2">Gestiona tus terapeutas favoritos</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar onSearch={onSearch} searchTerm={searchTerm} />
        <SortSelect onSort={onSort} sortBy={sortBy} />
      </div>
    </div>
  );
};

// Barra de búsqueda
export const SearchBar = ({ onSearch, searchTerm }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Buscar terapeutas..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
        aria-label="Buscar terapeutas favoritos"
      />
    </div>
  );
};

// Selector de ordenamiento
export const SortSelect = ({ onSort, sortBy }) => {
  return (
    <select
      value={sortBy}
      onChange={(e) => onSort(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      aria-label="Ordenar favoritos"
    >
      <option value="name">Ordenar por nombre</option>
      <option value="rating">Ordenar por rating</option>
      <option value="price">Ordenar por precio</option>
      <option value="dateAdded">Fecha agregado</option>
    </select>
  );
};

// Lista de terapeutas favoritos
export const FavoritesList = ({ favorites = [], loading = false, onRemove, onToggleAlerts, onViewProfile }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (favorites.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((therapist) => (
        <FavoriteCard
          key={therapist.id}
          therapist={therapist}
          onRemove={onRemove}
          onToggleAlerts={onToggleAlerts}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

// Tarjeta individual de terapeuta favorito
export const FavoriteCard = ({ therapist, onRemove, onToggleAlerts, onViewProfile }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleAlerts = () => {
    onToggleAlerts(therapist.id, !therapist.alertsEnabled);
  };

  return (
    <Card className="relative">
      <CardContent className="p-4">
        {/* Menú de acciones en móvil */}
        <div className="absolute top-4 right-4 md:hidden">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Opciones"
          >
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={() => { onViewProfile(therapist.id); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Ver perfil
                </button>
                <button
                  onClick={() => { handleToggleAlerts(); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  aria-pressed={therapist.alertsEnabled}
                >
                  {therapist.alertsEnabled ? 'Desactivar alertas' : 'Activar alertas'}
                </button>
                <button
                  onClick={() => { onRemove(therapist.id); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Quitar de favoritos
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Foto del terapeuta */}
        <div className="flex items-start space-x-4">
          <img
            src={therapist.photo || '/api/placeholder/80/80'}
            alt={`Foto de ${therapist.name}`}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-deep text-lg truncate">{therapist.name}</h3>
            <p className="text-gray-600 text-sm">{therapist.specialty}</p>
            
            {/* Rating */}
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">({therapist.rating})</span>
              </div>
            </div>
            
            {/* Precio */}
            <p className="text-primary font-semibold mt-2">${therapist.price}/sesión</p>
          </div>
        </div>

        {/* Acciones en desktop */}
        <div className="hidden md:flex justify-between items-center mt-4 pt-4 border-t">
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => onViewProfile(therapist.id)}
            >
              Ver perfil
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRemove(therapist.id)}
            >
              Quitar
            </Button>
          </div>
          
          <button
            onClick={handleToggleAlerts}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              therapist.alertsEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
            aria-pressed={therapist.alertsEnabled}
            aria-label={`${therapist.alertsEnabled ? 'Desactivar' : 'Activar'} alertas para ${therapist.name}`}
          >
            Alertas {therapist.alertsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// Panel de configuración de alertas
export const AlertsPanel = ({ alertSettings, onUpdateSettings }) => {
  const handleFrequencyChange = (frequency) => {
    onUpdateSettings({ ...alertSettings, frequency });
  };

  const handleChannelChange = (channel, enabled) => {
    onUpdateSettings({
      ...alertSettings,
      channels: {
        ...alertSettings.channels,
        [channel]: enabled
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-deep mb-4">Configuración de Alertas</h3>
        
        {/* Frecuencia */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Frecuencia de notificaciones
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value="immediate"
                checked={alertSettings.frequency === 'immediate'}
                onChange={() => handleFrequencyChange('immediate')}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm">Inmediato</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={alertSettings.frequency === 'daily'}
                onChange={() => handleFrequencyChange('daily')}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm">Resumen diario</span>
            </label>
          </div>
        </div>
        
        {/* Canales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Canales de notificación
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={alertSettings.channels.email}
                onChange={(e) => handleChannelChange('email', e.target.checked)}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm">Email</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={alertSettings.channels.push}
                onChange={(e) => handleChannelChange('push', e.target.checked)}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm">Notificaciones push</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Estado vacío
export const EmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        {/* Ilustración SVG */}
        <div className="mx-auto w-24 h-24 mb-6">
          <svg
            className="w-full h-full text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-deep mb-2">
          Aún no tienes terapeutas guardados
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Explora nuestro directorio de terapeutas y guarda tus favoritos para acceder rápidamente a ellos.
        </p>
        
        <Button
          onClick={() => window.location.href = '/explore-therapists'}
          className="inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explorar Terapeutas
        </Button>
      </CardContent>
    </Card>
  );
};

// Componente de error
export const ErrorState = ({ onRetry }) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="mx-auto w-16 h-16 mb-4">
          <svg className="w-full h-full text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-deep mb-2">
          Error al cargar favoritos
        </h3>
        <p className="text-gray-600 mb-4">
          No pudimos cargar tus terapeutas favoritos. Por favor, inténtalo de nuevo.
        </p>
        
        <Button onClick={onRetry} variant="secondary">
          Reintentar
        </Button>
      </CardContent>
    </Card>
  );
};
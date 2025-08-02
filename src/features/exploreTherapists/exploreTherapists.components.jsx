import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Clock, X, Map, List, ChevronDown } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

// Barra de búsqueda superior
export const SearchBar = ({ searchTerm, onSearchChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
            aria-label="Buscar terapeutas por nombre o especialidad"
          />
        </div>
        <Button variant="outline" onClick={onReset} aria-label="Limpiar búsqueda">
          Reset
        </Button>
      </div>
    </div>
  );
};

// Slider de valoración
export const RatingSlider = ({ minRating, onRatingChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Valoración mínima: {minRating} ★
      </label>
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        value={minRating}
        onChange={(e) => onRatingChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>0★</span>
        <span>5★</span>
      </div>
    </div>
  );
};

// Selector de disponibilidad
export const AvailabilityPicker = ({ availability, onAvailabilityChange }) => {
  const timeSlots = [
    { value: 'morning', label: 'Mañana (8:00-12:00)' },
    { value: 'afternoon', label: 'Tarde (12:00-18:00)' },
    { value: 'evening', label: 'Noche (18:00-22:00)' },
    { value: 'weekend', label: 'Fines de semana' }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Disponibilidad
      </label>
      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <label key={slot.value} className="flex items-center">
            <input
              type="checkbox"
              checked={availability.includes(slot.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  onAvailabilityChange([...availability, slot.value]);
                } else {
                  onAvailabilityChange(availability.filter(a => a !== slot.value));
                }
              }}
              className="mr-2 h-4 w-4 text-sage focus:ring-sage border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{slot.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Panel de filtros
export const FiltersPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  isMobile = false 
}) => {
  const therapyTypes = [
    'Reiki',
    'Sanación con Cristales',
    'Aromaterapia',
    'Equilibrio de Chakras',
    'Acupuntura',
    'Lectura de Tarot',
    'Astrología',
    'Reflexología',
    'Flores de Bach',
    'Limpieza Energética',
    'Meditación Kundalini',
    'Medicina China',
    'Videncia',
    'Terapia Floral'
  ];

  const modalityOptions = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'online', label: 'Online' }
  ];

  const panelClasses = isMobile
    ? `fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    : 'w-80 bg-white rounded-lg shadow-sm border border-gray-200';

  return (
    <div className={panelClasses}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-deep">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="p-4 space-y-6">
        {!isMobile && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-deep">Filtros</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {/* Localización */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Localización
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Ciudad o código postal"
              value={filters.location || ''}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              aria-label="Filtrar por localización"
            />
          </div>
        </div>

        {/* Tipo de terapia */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de terapia
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {therapyTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.therapyTypes?.includes(type) || false}
                  onChange={(e) => {
                    const currentTypes = filters.therapyTypes || [];
                    if (e.target.checked) {
                      onFiltersChange({ 
                        ...filters, 
                        therapyTypes: [...currentTypes, type] 
                      });
                    } else {
                      onFiltersChange({ 
                        ...filters, 
                        therapyTypes: currentTypes.filter(t => t !== type) 
                      });
                    }
                  }}
                  className="mr-2 h-4 w-4 text-sage focus:ring-sage border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <AvailabilityPicker
          availability={filters.availability || []}
          onAvailabilityChange={(availability) => 
            onFiltersChange({ ...filters, availability })
          }
        />

        {/* Modalidad */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Modalidad
          </label>
          <div className="space-y-2">
            {modalityOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.modality?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentModality = filters.modality || [];
                    if (e.target.checked) {
                      onFiltersChange({ 
                        ...filters, 
                        modality: [...currentModality, option.value] 
                      });
                    } else {
                      onFiltersChange({ 
                        ...filters, 
                        modality: currentModality.filter(m => m !== option.value) 
                      });
                    }
                  }}
                  className="mr-2 h-4 w-4 text-sage focus:ring-sage border-gray-300 rounded"
                  aria-label={`Filtrar por modalidad ${option.label}`}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Valoración */}
        <RatingSlider
          minRating={filters.minRating || 0}
          onRatingChange={(minRating) => 
            onFiltersChange({ ...filters, minRating })
          }
        />

        {/* Rango de precio */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Precio por sesión (€)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filters.priceMin || ''}
              onChange={(e) => onFiltersChange({ ...filters, priceMin: e.target.value })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filters.priceMax || ''}
              onChange={(e) => onFiltersChange({ ...filters, priceMax: e.target.value })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onFiltersChange({})}
          >
            Limpiar
          </Button>
          <Button className="flex-1">
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Selector de ordenación
export const SortSelect = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'distance', label: 'Distancia' },
    { value: 'price', label: 'Precio' },
    { value: 'rating', label: 'Valoración' },
    { value: 'availability', label: 'Disponibilidad' }
  ];

  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Ordenar por: {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

// Tarjeta de terapeuta
export const TherapistCard = ({ therapist, onViewProfile }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 bg-white border border-gray-200">
      <div className="flex gap-4">
        {/* Foto del terapeuta */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border">
            {therapist.avatar ? (
              <img 
                src={therapist.avatar} 
                alt={`Foto de perfil de ${therapist.name}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-600 text-2xl font-semibold">
                {therapist.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Información del terapeuta */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {therapist.name}
              </h3>
              <p className="text-sm text-gray-700">{therapist.credentials}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-sage">
                €{therapist.price}/sesión
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {therapist.specialties?.slice(0, 3).map((specialty, index) => (
                <span 
                  key={index}
                  className="inline-block bg-sage/10 text-sage text-xs px-2 py-1 rounded-full"
                >
                  {specialty}
                </span>
              ))}
              {therapist.specialties?.length > 3 && (
                <span className="text-xs text-gray-600">+{therapist.specialties.length - 3} más</span>
              )}
            </div>
          </div>

          {/* Modalidad */}
          {therapist.modality && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {therapist.modality.map((mod, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
                  >
                    {mod === 'presencial' ? 'Presencial' : 'Online'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating y disponibilidad */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(therapist.rating)}
              </div>
              <span className="text-sm text-gray-700">
                {therapist.rating} ({therapist.reviewCount} reseñas)
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4" />
              <span>{therapist.nextAvailable}</span>
            </div>
          </div>

          {/* Localización */}
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4" />
            <span>{therapist.location}</span>
            {therapist.distance && (
              <span className="text-gray-500">• {therapist.distance} km</span>
            )}
          </div>
        </div>
      </div>

      {/* Botón de acción */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button 
          className="w-full"
          onClick={() => onViewProfile(therapist.id)}
        >
          Ver perfil completo
        </Button>
      </div>
    </Card>
  );
};

// Lista de terapeutas
export const TherapistList = ({ therapists, onViewProfile, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <Card>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (therapists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Search className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No se encontraron terapeutas
        </h3>
        <p className="text-gray-600">
          Intenta ajustar tus filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {therapists.map((therapist) => (
        <TherapistCard
          key={therapist.id}
          therapist={therapist}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

// Controles de vista (Lista/Mapa)
export const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          currentView === 'list'
            ? 'bg-white text-sage shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="h-4 w-4" />
        Lista
      </button>
      <button
        onClick={() => onViewChange('map')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          currentView === 'map'
            ? 'bg-white text-sage shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Map className="h-4 w-4" />
        Mapa
      </button>
    </div>
  );
};

// Componente de mapa mejorado
export const TherapistMap = ({ therapists, onTherapistSelect }) => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  // Coordenadas simuladas para Madrid
  const madridCoords = { lat: 40.4168, lng: -3.7038 };
  
  // Generar coordenadas simuladas para cada terapeuta basadas en su ubicación
  const getTherapistCoords = (therapist) => {
    const baseCoords = {
      'Madrid Centro': { lat: 40.4168, lng: -3.7038 },
      'Salamanca': { lat: 40.4300, lng: -3.6827 },
      'Chamberí': { lat: 40.4378, lng: -3.7044 },
      'Retiro': { lat: 40.4152, lng: -3.6844 },
      'Malasaña': { lat: 40.4267, lng: -3.7038 },
      'Arganzuela': { lat: 40.3980, lng: -3.6980 },
      'Chueca': { lat: 40.4215, lng: -3.6960 },
      'Lavapiés': { lat: 40.4087, lng: -3.7003 }
    };
    
    return baseCoords[therapist.location] || madridCoords;
  };

  return (
    <Card className="h-96">
      <div className="h-full bg-gray-50 rounded-lg relative overflow-hidden">
        {/* Mapa simulado con marcadores */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
          {/* Simulación de calles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-300 opacity-60"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 opacity-60"></div>
            <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-300 opacity-60"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"></div>
          </div>
          
          {/* Marcadores de terapeutas */}
          {therapists.map((therapist, index) => {
            const position = {
              left: `${20 + (index % 4) * 20}%`,
              top: `${20 + Math.floor(index / 4) * 25}%`
            };
            
            return (
              <div
                key={therapist.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={position}
                onClick={() => {
                  setSelectedTherapist(therapist);
                  onTherapistSelect(therapist.id);
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-sage rounded-full border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {therapist.name}
                      <div className="text-gray-300">€{therapist.price}/sesión</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Controles del mapa */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50">
            <span className="text-lg font-bold text-gray-600">+</span>
          </button>
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50">
            <span className="text-lg font-bold text-gray-600">−</span>
          </button>
        </div>
        
        {/* Información del mapa */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center gap-2 text-sm">
            <Map className="h-4 w-4 text-sage" />
            <span className="font-medium text-gray-900">
              {therapists.length} terapeutas en Madrid
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Haz clic en los marcadores para ver detalles
          </p>
        </div>
        
        {/* Leyenda */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-sage rounded-full"></div>
            <span className="text-gray-700">Terapeuta disponible</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Paginación
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalResults 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Mostrando {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalResults)} de {totalResults} resultados
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
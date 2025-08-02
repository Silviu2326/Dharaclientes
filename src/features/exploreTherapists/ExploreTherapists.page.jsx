import React, { useState, useEffect, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import {
  SearchBar,
  FiltersPanel,
  SortSelect,
  TherapistList,
  TherapistMap,
  ViewToggle,
  Pagination
} from './exploreTherapists.components';

const mockTherapists = [
  {
    id: 1,
    name: 'Luna Cristales',
    credentials: 'Maestra Reiki Nivel III, Certificada en Sanación Energética',
    specialties: ['Reiki', 'Sanación con Cristales', 'Limpieza Energética'],
    price: 45,
    rating: 4.8,
    reviewCount: 127,
    location: 'Madrid Centro',
    distance: 2.3,
    nextAvailable: 'Hoy 16:00',
    modality: ['presencial', 'online'],
    avatar: null
  },
  {
    id: 2,
    name: 'Sage Aromático',
    credentials: 'Aromaterapeuta Certificado, Especialista en Aceites Esenciales',
    specialties: ['Aromaterapia', 'Aceites Esenciales', 'Relajación Aromática'],
    price: 40,
    rating: 4.9,
    reviewCount: 89,
    location: 'Salamanca',
    distance: 4.1,
    nextAvailable: 'Mañana 10:00',
    modality: ['presencial'],
    avatar: null
  }
];

export const ExploreTherapistsPage = () => {
  const navigate = useNavigate();
  
  // Estado real
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('relevance');
  const [currentView, setCurrentView] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filtrar y ordenar terapeutas
  const filteredAndSortedTherapists = useMemo(() => {
    let result = [...mockTherapists];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(therapist => 
        therapist.name.toLowerCase().includes(term) ||
        therapist.specialties.some(specialty => 
          specialty.toLowerCase().includes(term)
        )
      );
    }

    // Filtrar por localización
    if (filters.location) {
      const location = filters.location.toLowerCase();
      result = result.filter(therapist => 
        therapist.location.toLowerCase().includes(location)
      );
    }

    // Filtrar por tipos de terapia
    if (filters.therapyTypes && filters.therapyTypes.length > 0) {
      result = result.filter(therapist => 
        filters.therapyTypes.some(type => 
          therapist.specialties.includes(type)
        )
      );
    }

    // Filtrar por valoración mínima
    if (filters.minRating) {
      result = result.filter(therapist => 
        therapist.rating >= filters.minRating
      );
    }

    // Filtrar por rango de precio
    if (filters.priceMin) {
      result = result.filter(therapist => 
        therapist.price >= parseInt(filters.priceMin)
      );
    }
    if (filters.priceMax) {
      result = result.filter(therapist => 
        therapist.price <= parseInt(filters.priceMax)
      );
    }

    // Filtrar por modalidad
    if (filters.modality && filters.modality.length > 0) {
      result = result.filter(therapist => 
        filters.modality.some(mod => 
          therapist.modality.includes(mod)
        )
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'price':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'availability':
        // Ordenar por disponibilidad más próxima
        result.sort((a, b) => {
          const aToday = a.nextAvailable.includes('Hoy');
          const bToday = b.nextAvailable.includes('Hoy');
          if (aToday && !bToday) return -1;
          if (!aToday && bToday) return 1;
          return 0;
        });
        break;
      default: // relevance
        result.sort((a, b) => {
          // Ordenar por una combinación de rating y número de reseñas
          const aScore = a.rating * Math.log(a.reviewCount + 1);
          const bScore = b.rating * Math.log(b.reviewCount + 1);
          return bScore - aScore;
        });
    }

    return result;
  }, [searchTerm, filters, sortBy]);

  // Paginación
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAndSortedTherapists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTherapists = filteredAndSortedTherapists.slice(
    startIndex, 
    startIndex + itemsPerPage
  );

  // Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTherapistSelect = (therapistId) => {
    navigate(`/therapist/${therapistId}`);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const filteredTherapists = paginatedTherapists;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Encuentra tu terapeuta ideal
            </h1>
            <p className="text-gray-600">
              Conecta con profesionales verificados cerca de ti
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtros */}
          <div className="lg:w-80">
            {/* Barra de búsqueda */}
            <div className="mb-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                onReset={handleReset}
              />
            </div>

            {/* Botón de filtros en móvil */}
            {isMobile && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={toggleFilters}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </Button>
              </div>
            )}

            {/* Panel de filtros */}
            <div className={`${isMobile && !showFilters ? 'hidden' : 'block'}`}>
              <FiltersPanel
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                onFiltersChange={handleFilterChange}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Controles superiores */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <SortSelect
                  value={sortBy}
                  onChange={handleSortChange}
                />
                <ViewToggle
                  currentView={currentView}
                  onViewChange={handleViewChange}
                />
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredAndSortedTherapists.length} terapeutas encontrados
              </div>
            </div>

            {/* Contenido */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {currentView === 'list' ? (
                  <TherapistList
                    therapists={filteredTherapists}
                    onViewProfile={handleTherapistSelect}
                    loading={loading}
                  />
                ) : (
                  <TherapistMap
                    therapists={filteredAndSortedTherapists}
                    onTherapistSelect={handleTherapistSelect}
                  />
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalResults={filteredAndSortedTherapists.length}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
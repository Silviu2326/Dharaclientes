import React from 'react';
import { Filter, X } from 'lucide-react';
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
    name: 'Dra. María González',
    credentials: 'Psicóloga Clínica, Colegiada M-12345',
    specialties: ['Ansiedad', 'Depresión', 'Terapia Cognitivo-Conductual'],
    price: 65,
    rating: 4.8,
    reviewCount: 127,
    location: 'Madrid Centro',
    distance: 2.3,
    nextAvailable: 'Hoy 16:00',
    avatar: null
  },
  {
    id: 2,
    name: 'Dr. Carlos Ruiz',
    credentials: 'Psicólogo Sanitario, Colegiado M-67890',
    specialties: ['Terapia de Pareja', 'Terapia Familiar', 'Mindfulness'],
    price: 70,
    rating: 4.9,
    reviewCount: 89,
    location: 'Salamanca',
    distance: 4.1,
    nextAvailable: 'Mañana 10:00',
    avatar: null
  },
  {
    id: 3,
    name: 'Dra. Ana Martín',
    credentials: 'Psicóloga Infantil, Colegiada M-11111',
    specialties: ['Psicología Infantil', 'TDAH', 'Trastornos del Aprendizaje'],
    price: 60,
    rating: 4.7,
    reviewCount: 156,
    location: 'Chamberí',
    distance: 3.8,
    nextAvailable: 'Lunes 09:00',
    avatar: null
  },
  {
    id: 4,
    name: 'Dr. Luis Fernández',
    credentials: 'Psicoterapeuta, Colegiado M-22222',
    specialties: ['Trauma', 'EMDR', 'Terapia Gestalt'],
    price: 75,
    rating: 4.6,
    reviewCount: 94,
    location: 'Retiro',
    distance: 5.2,
    nextAvailable: 'Miércoles 14:00',
    avatar: null
  },
  {
    id: 5,
    name: 'Dra. Carmen López',
    credentials: 'Psicóloga Clínica, Colegiada M-33333',
    specialties: ['Trastornos Alimentarios', 'Autoestima', 'Adolescentes'],
    price: 68,
    rating: 4.9,
    reviewCount: 203,
    location: 'Malasaña',
    distance: 1.9,
    nextAvailable: 'Hoy 18:30',
    avatar: null
  },
  {
    id: 6,
    name: 'Dr. Miguel Sánchez',
    credentials: 'Psicólogo Sanitario, Colegiado M-44444',
    specialties: ['Adicciones', 'Terapia Grupal', 'Rehabilitación'],
    price: 55,
    rating: 4.5,
    reviewCount: 78,
    location: 'Arganzuela',
    distance: 6.7,
    nextAvailable: 'Viernes 11:00',
    avatar: null
  }
];

export const ExploreTherapistsPage = () => {
  // Mock state values
  const searchTerm = '';
  const filters = {};
  const sortBy = 'relevance';
  const currentView = 'list';
  const showFilters = false;
  const currentPage = 1;
  const loading = false;
  const isMobile = false;

  // Mock handlers
  const handleSearch = () => {};
  const handleFilterChange = () => {};
  const handleSortChange = () => {};
  const handleViewChange = () => {};
  const toggleFilters = () => {};
  const handlePageChange = () => {};
  const handleTherapistSelect = () => {};

  const filteredTherapists = mockTherapists;
  const totalPages = 1;

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
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar por nombre, especialidad..."
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
                filters={filters}
                onChange={handleFilterChange}
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
                {filteredTherapists.length} terapeutas encontrados
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
                    onTherapistSelect={handleTherapistSelect}
                  />
                ) : (
                  <TherapistMap
                    therapists={filteredTherapists}
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
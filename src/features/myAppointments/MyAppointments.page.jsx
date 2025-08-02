import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { 
  RangeTabs, 
  DateRangePicker, 
  AppointmentsCalendar, 
  AppointmentsList, 
  AppointmentFilters,
  RescheduleModal,
  CancelDialog,
  IcsButton
} from './myAppointments.components';
import { getMyAppointments, rescheduleAppointment, cancelAppointment } from './myAppointments.api';
import { useNavigate } from 'react-router-dom';
import { addDays, subDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

// Datos mock para desarrollo
const mockAppointments = [
  {
    id: '1',
    date: '2024-01-15',
    time: '10:00',
    status: 'confirmed',
    therapist: {
      id: 'th1',
      name: 'Dra. María González',
      specialty: 'Psicología Clínica',
      avatar: null
    },
    notes: 'Primera sesión de evaluación',
    location: 'Online'
  },
  {
    id: '2',
    date: '2024-01-18',
    time: '15:30',
    status: 'pending',
    therapist: {
      id: 'th2',
      name: 'Dr. Carlos Ruiz',
      specialty: 'Terapia Cognitivo-Conductual',
      avatar: null
    },
    notes: 'Seguimiento de ansiedad',
    location: 'Presencial'
  },
  {
    id: '3',
    date: '2024-01-22',
    time: '11:00',
    status: 'confirmed',
    therapist: {
      id: 'th1',
      name: 'Dra. María González',
      specialty: 'Psicología Clínica',
      avatar: null
    },
    notes: null,
    location: 'Online'
  },
  {
    id: '4',
    date: '2024-01-08',
    time: '14:00',
    status: 'completed',
    therapist: {
      id: 'th3',
      name: 'Dra. Ana López',
      specialty: 'Terapia Familiar',
      avatar: null
    },
    notes: 'Sesión inicial completada',
    location: 'Presencial'
  },
  {
    id: '5',
    date: '2024-01-05',
    time: '16:00',
    status: 'cancelled',
    therapist: {
      id: 'th2',
      name: 'Dr. Carlos Ruiz',
      specialty: 'Terapia Cognitivo-Conductual',
      avatar: null
    },
    notes: 'Cancelada por conflicto de horario',
    location: 'Online'
  }
];

export const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState('upcoming');
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'calendar'
  const [filters, setFilters] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Cargar citas al montar el componente
  useEffect(() => {
    loadAppointments();
  }, []);

  // Filtrar citas cuando cambien los filtros
  useEffect(() => {
    filterAppointments();
  }, [appointments, activeRange, customDateRange, filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      // En desarrollo usamos datos mock
      // const data = await getMyAppointments();
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];
    const now = new Date();

    // Filtrar por rango de fechas
    switch (activeRange) {
      case 'upcoming':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(`${apt.date}T${apt.time}`);
          return isAfter(aptDate, now);
        });
        break;
      case 'past':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(`${apt.date}T${apt.time}`);
          return isBefore(aptDate, now);
        });
        break;
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= startOfDay(customDateRange.start) && 
                   aptDate <= endOfDay(customDateRange.end);
          });
        }
        break;
      // 'all' no filtra
    }

    // Filtrar por estado
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    // Filtrar por terapeuta
    if (filters.therapist) {
      filtered = filtered.filter(apt => 
        apt.therapist.name.toLowerCase().includes(filters.therapist.toLowerCase())
      );
    }

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return activeRange === 'past' ? dateB - dateA : dateA - dateB;
    });

    setFilteredAppointments(filtered);
  };

  const handleRangeChange = (range) => {
    setActiveRange(range);
    if (range === 'custom') {
      setShowDatePicker(true);
    }
  };

  const handleDateRangeChange = (type, date) => {
    setCustomDateRange(prev => ({
      ...prev,
      [type]: date
    }));
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const handleChat = (therapistId) => {
    navigate(`/chat/${therapistId}`);
  };

  const handleRescheduleConfirm = async (rescheduleData) => {
    try {
      // await rescheduleAppointment(rescheduleData);
      console.log('Reprogramando cita:', rescheduleData);
      
      // Actualizar el estado local (mock)
      setAppointments(prev => prev.map(apt => 
        apt.id === rescheduleData.appointmentId 
          ? { ...apt, date: rescheduleData.newDate, time: rescheduleData.newTime, status: 'pending' }
          : apt
      ));
      
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const handleCancelConfirm = async (cancelData) => {
    try {
      // await cancelAppointment(cancelData);
      console.log('Cancelando cita:', cancelData);
      
      // Actualizar el estado local (mock)
      setAppointments(prev => prev.map(apt => 
        apt.id === cancelData.appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      ));
      
      setShowCancelDialog(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
    // Aquí podrías mostrar un modal con los detalles de las citas del día
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep mb-2">Mis Citas</h1>
          <p className="text-gray-600">
            Gestiona tus citas programadas, reprograma o cancela según sea necesario.
          </p>
        </div>
        
        <div className="flex gap-2">
          <IcsButton appointments={filteredAppointments} />
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-sage shadow-sm' : 'text-gray-600'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-sage shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendario
            </button>
          </div>
        </div>
      </div>

      {/* Selector de rango */}
      <Card>
        <div className="p-4">
          <RangeTabs 
            activeRange={activeRange} 
            onRangeChange={handleRangeChange} 
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros laterales */}
        <div className="lg:col-span-1">
          <AppointmentFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          {viewMode === 'calendar' ? (
            <AppointmentsCalendar
              appointments={filteredAppointments}
              onDateClick={handleDateClick}
              currentDate={currentDate}
              onMonthChange={setCurrentDate}
            />
          ) : (
            <div>
              {filteredAppointments.length > 0 && (
                <div className="mb-4 text-sm text-gray-600">
                  {filteredAppointments.length} cita{filteredAppointments.length !== 1 ? 's' : ''} encontrada{filteredAppointments.length !== 1 ? 's' : ''}
                </div>
              )}
              
              <AppointmentsList
                appointments={filteredAppointments}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onChat={handleChat}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <DateRangePicker
        startDate={customDateRange.start}
        endDate={customDateRange.end}
        onDateChange={handleDateRangeChange}
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
      />

      <RescheduleModal
        appointment={selectedAppointment}
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleRescheduleConfirm}
      />

      <CancelDialog
        appointment={selectedAppointment}
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};
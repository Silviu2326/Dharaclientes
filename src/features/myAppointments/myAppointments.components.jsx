import React, { useState } from 'react';
import { Calendar, Clock, User, MessageCircle, X, RotateCcw, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

// Selector de rango de fechas
export const RangeTabs = ({ activeRange, onRangeChange }) => {
  const ranges = [
    { key: 'upcoming', label: 'Próximas' },
    { key: 'past', label: 'Pasadas' },
    { key: 'all', label: 'Todas' },
    { key: 'custom', label: 'Personalizado' }
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {ranges.map((range) => (
        <button
          key={range.key}
          onClick={() => onRangeChange(range.key)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeRange === range.key
              ? 'bg-white text-sage shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

// Selector de rango personalizado
export const DateRangePicker = ({ startDate, endDate, onDateChange, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deep">Seleccionar Rango</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha inicio
            </label>
            <input
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => onDateChange('start', new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha fin
            </label>
            <input
              type="date"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => onDateChange('end', new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Calendario de citas
export const AppointmentsCalendar = ({ appointments, onDateClick, currentDate, onMonthChange }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const getAppointmentsForDay = (date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date));
  };

  const previousMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  return (
    <Card>
      <div className="p-4">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold text-deep">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>
          
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            const hasAppointments = dayAppointments.length > 0;
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateClick(day, dayAppointments)}
                className={`p-2 min-h-[60px] text-left border border-gray-100 hover:bg-gray-50 transition-colors relative ${
                  !isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                } ${
                  isTodayDate ? 'bg-sage/10 border-sage' : ''
                } ${
                  hasAppointments && isCurrentMonth ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="text-sm font-medium">
                  {format(day, 'd')}
                </div>
                
                {/* Indicador de citas */}
                {hasAppointments && isCurrentMonth && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                
                {/* Badges de citas */}
                <div className="mt-1 space-y-1">
                  {dayAppointments.slice(0, 2).map((apt, index) => (
                    <div
                      key={index}
                      className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                        apt.status === 'confirmed' ? 'bg-green-500' :
                        apt.status === 'pending' ? 'bg-yellow-500' :
                        apt.status === 'cancelled' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}
                    >
                      {format(new Date(`${apt.date}T${apt.time}`), 'HH:mm')}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 2} más
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

// Tarjeta de cita individual
export const AppointmentCard = ({ appointment, onReschedule, onCancel, onChat }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  };

  const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
  const isPast = appointmentDateTime < new Date();
  const canModify = !isPast && appointment.status !== 'cancelled' && appointment.status !== 'completed';

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              {appointment.therapist.avatar ? (
                <img 
                  src={appointment.therapist.avatar} 
                  alt={appointment.therapist.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <User className="h-6 w-6 text-gray-400" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-deep">{appointment.therapist.name}</h3>
              <p className="text-sm text-gray-600">{appointment.therapist.specialty}</p>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            {getStatusText(appointment.status)}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(appointmentDateTime, 'EEEE, d MMMM yyyy', { locale: es })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{format(appointmentDateTime, 'HH:mm')} - {format(new Date(appointmentDateTime.getTime() + 60 * 60 * 1000), 'HH:mm')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              appointment.location === 'Online' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {appointment.location}
            </span>
          </div>
        </div>
        
        {appointment.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{appointment.notes}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          {canModify && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReschedule(appointment)}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reprogramar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(appointment)}
                className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </>
          )}
          
          <Button
            size="sm"
            onClick={() => onChat(appointment.therapist.id)}
            className="flex items-center gap-1 ml-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Lista de citas
export const AppointmentsList = ({ appointments, onReschedule, onCancel, onChat, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <Card>
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Calendar className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay citas programadas
        </h3>
        <p className="text-gray-600 mb-4">
          No se encontraron citas que coincidan con los filtros seleccionados.
        </p>
        <p className="text-sm text-gray-500">
          Prueba ajustando los filtros o programa una nueva cita con tu terapeuta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onReschedule={onReschedule}
          onCancel={onCancel}
          onChat={onChat}
        />
      ))}
    </div>
  );
};

// Modal para reprogramar cita
export const RescheduleModal = ({ appointment, isOpen, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm({
        appointmentId: appointment.id,
        newDate: selectedDate,
        newTime: selectedTime,
        reason
      });
      onClose();
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deep">Reprogramar Cita</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Cita actual: {format(new Date(`${appointment.date}T${appointment.time}`), 'EEEE, d MMMM yyyy HH:mm', { locale: es })}
          </p>
          <p className="text-sm text-gray-600">
            Con: {appointment.therapist.name}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva hora
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="">Seleccionar hora</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo (opcional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explica brevemente el motivo del cambio..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage resize-none"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Diálogo de confirmación para cancelar
export const CancelDialog = ({ appointment, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const cancelReasons = [
    'Conflicto de horario',
    'Enfermedad',
    'Emergencia familiar',
    'Problemas de transporte',
    'Ya no necesito la cita',
    'Otro'
  ];

  const handleConfirm = () => {
    onConfirm({
      appointmentId: appointment.id,
      reason: selectedReason === 'Otro' ? reason : selectedReason
    });
    onClose();
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deep">Cancelar Cita</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">
            ¿Estás seguro de que quieres cancelar esta cita?
          </p>
          <p className="text-sm text-red-600 mt-1">
            {format(new Date(`${appointment.date}T${appointment.time}`), 'EEEE, d MMMM yyyy HH:mm', { locale: es })}
          </p>
          <p className="text-sm text-red-600">
            Con: {appointment.therapist.name}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de cancelación
            </label>
            <div className="space-y-2">
              {cancelReasons.map((reasonOption) => (
                <label key={reasonOption} className="flex items-center">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reasonOption}
                    checked={selectedReason === reasonOption}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mr-2 h-4 w-4 text-sage focus:ring-sage border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>
          
          {selectedReason === 'Otro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especifica el motivo
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explica el motivo..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage resize-none"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Mantener cita
          </Button>
          <Button 
            variant="danger" 
            className="flex-1" 
            onClick={handleConfirm}
            disabled={!selectedReason || (selectedReason === 'Otro' && !reason.trim())}
          >
            Cancelar cita
          </Button>
        </div>
      </div>
    </div>
  );
};

// Botón para exportar calendario
export const IcsButton = ({ appointments }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MindfulConnect//ES',
      'CALSCALE:GREGORIAN',
      ...appointments.flatMap(apt => [
        'BEGIN:VEVENT',
        `UID:${apt.id}@mindfulconnect.com`,
        `DTSTART:${format(new Date(`${apt.date}T${apt.time}`), "yyyyMMdd'T'HHmmss")}`,
        `DTEND:${format(new Date(new Date(`${apt.date}T${apt.time}`).getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss")}`,
        `SUMMARY:Cita con ${apt.therapist.name}`,
        `DESCRIPTION:Sesión de ${apt.therapist.specialty}`,
        `LOCATION:${apt.location || 'Online'}`,
        `STATUS:${apt.status.toUpperCase()}`,
        'END:VEVENT'
      ]),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mis-citas.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportMenu(false);
    showNotification('Calendario exportado correctamente en formato iCal');
  };

  const generateCSV = () => {
    const csvHeaders = ['Fecha', 'Hora', 'Terapeuta', 'Especialidad', 'Estado', 'Tipo', 'Notas'];
    const csvRows = appointments.map(apt => [
      apt.date,
      apt.time,
      apt.therapist.name,
      apt.therapist.specialty,
      apt.status,
      apt.location,
      apt.notes || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mis-citas.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportMenu(false);
    showNotification('Datos exportados correctamente en formato CSV');
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="flex items-center gap-2"
        disabled={appointments.length === 0}
      >
        <Download className="h-4 w-4" />
        Exportar calendario
      </Button>
      
      {showExportMenu && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
          <button
            onClick={generateICS}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
          >
            <div className="font-medium">Formato iCal (.ics)</div>
            <div className="text-sm text-gray-500">Compatible con Google Calendar, Outlook</div>
          </button>
          <button
            onClick={generateCSV}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg border-t border-gray-100"
          >
            <div className="font-medium">Formato CSV (.csv)</div>
            <div className="text-sm text-gray-500">Compatible con Excel, hojas de cálculo</div>
          </button>
        </div>
      )}
      
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

// Modal para mostrar detalles de citas del día
export const DayDetailsModal = ({ appointments, isOpen, onClose, onReschedule, onCancel, onChat }) => {
  if (!isOpen || appointments.length === 0) return null;

  const selectedDate = appointments[0]?.date;
  const formattedDate = selectedDate ? format(new Date(selectedDate), 'EEEE, d MMMM yyyy', { locale: es }) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deep">
            Citas del {formattedDate}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onReschedule={onReschedule}
              onCancel={onCancel}
              onChat={onChat}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Filtros adicionales
export const AppointmentFilters = ({ filters, onFiltersChange }) => {
  const statuses = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas' }
  ];

  const appointmentTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'Online', label: 'Online' },
    { value: 'Presencial', label: 'Presencial' }
  ];

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="font-semibold text-deep">Filtros</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de cita
            </label>
            <select
              value={filters.type || 'all'}
              onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            >
              {appointmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terapeuta
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.therapist || ''}
              onChange={(e) => onFiltersChange({ ...filters, therapist: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFiltersChange({})}
          className="w-full mt-4"
        >
          Limpiar filtros
        </Button>
      </div>
    </Card>
  );
};
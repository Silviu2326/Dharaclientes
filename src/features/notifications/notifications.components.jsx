import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { 
  BellIcon, 
  EnvelopeIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  CurrencyEuroIcon,
  CogIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  HeartIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  CalendarIcon as CalendarSolidIcon,
  ChatBubbleLeftIcon as ChatSolidIcon,
  CurrencyEuroIcon as CurrencySolidIcon,
  CogIcon as CogSolidIcon,
  UserIcon as UserSolidIcon,
  DocumentTextIcon as DocumentSolidIcon,
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';

// Componente de encabezado con estadísticas
export function NotificationsHeader({ stats, onMarkAllRead, onDeleteAllRead, loading }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notificaciones</h1>
          <p className="text-gray-600">Gestiona todas tus notificaciones y alertas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllRead}
            disabled={loading || stats?.unread === 0}
            className="flex items-center gap-2"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Marcar todas como leídas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteAllRead}
            disabled={loading}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            Eliminar leídas
          </Button>
        </div>
      </div>
      
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsBadge
          icon={BellIcon}
          label="Total"
          value={stats?.total || 0}
          color="blue"
        />
        <StatsBadge
          icon={ExclamationTriangleIcon}
          label="Sin leer"
          value={stats?.unread || 0}
          color="red"
        />
        <StatsBadge
          icon={ClockIcon}
          label="Hoy"
          value={stats?.today || 0}
          color="green"
        />
        <StatsBadge
          icon={CalendarIcon}
          label="Esta semana"
          value={stats?.thisWeek || 0}
          color="purple"
        />
      </div>
    </div>
  );
}

// Componente de badge de estadísticas
export function StatsBadge({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <Card className={`p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3" />
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

// Panel de filtros
export function FiltersPanel({ filters, onFiltersChange, onClearFilters }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            Filtros
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TypeSelect
                value={filters.type}
                onChange={(value) => onFiltersChange({ ...filters, type: value })}
              />
              <PrioritySelect
                value={filters.priority}
                onChange={(value) => onFiltersChange({ ...filters, priority: value })}
              />
              <ReadStatusSelect
                value={filters.read}
                onChange={(value) => onFiltersChange({ ...filters, read: value })}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="flex-1"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha desde
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha hasta
                </label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                />
              </div>
              <SearchBar
                value={filters.search}
                onChange={(value) => onFiltersChange({ ...filters, search: value })}
                placeholder="Buscar por título, mensaje o terapeuta..."
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Selector de tipo
export function TypeSelect({ value, onChange }) {
  const options = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'appointment', label: 'Citas' },
    { value: 'message', label: 'Mensajes' },
    { value: 'payment', label: 'Pagos' },
    { value: 'system', label: 'Sistema' },
    { value: 'session', label: 'Sesiones' },
    { value: 'evaluation', label: 'Evaluaciones' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo
      </label>
      <Select
        value={value || 'all'}
        onChange={onChange}
        options={options}
      />
    </div>
  );
}

// Selector de prioridad
export function PrioritySelect({ value, onChange }) {
  const options = [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Prioridad
      </label>
      <Select
        value={value || 'all'}
        onChange={onChange}
        options={options}
      />
    </div>
  );
}

// Selector de estado de lectura
export function ReadStatusSelect({ value, onChange }) {
  const options = [
    { value: undefined, label: 'Todas' },
    { value: false, label: 'Sin leer' },
    { value: true, label: 'Leídas' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Estado
      </label>
      <Select
        value={value === undefined ? 'all' : value.toString()}
        onChange={(val) => {
          if (val === 'all') onChange(undefined);
          else onChange(val === 'true');
        }}
        options={[
          { value: 'all', label: 'Todas' },
          { value: 'false', label: 'Sin leer' },
          { value: 'true', label: 'Leídas' }
        ]}
      />
    </div>
  );
}

// Barra de búsqueda
export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Búsqueda
      </label>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
    </div>
  );
}

// Tabla de notificaciones
export function NotificationsTable({ notifications, onView, onMarkAsRead, onDelete, onArchive, loading }) {
  return (
    <div className="hidden md:block">
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notificación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onView={onView}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onArchive={onArchive}
                  loading={loading}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Fila de notificación
export function NotificationRow({ notification, onView, onMarkAsRead, onDelete, onArchive, loading }) {
  const getTypeIcon = (type) => {
    const icons = {
      appointment: CalendarSolidIcon,
      message: ChatSolidIcon,
      payment: CurrencySolidIcon,
      system: CogSolidIcon,
      session: UserSolidIcon,
      evaluation: DocumentSolidIcon,
      reminder: BellIcon,
      promotion: HeartSolidIcon
    };
    return icons[type] || BellIcon;
  };

  const getTypeColor = (type) => {
    const colors = {
      appointment: 'text-blue-600',
      message: 'text-green-600',
      payment: 'text-yellow-600',
      system: 'text-gray-600',
      session: 'text-purple-600',
      evaluation: 'text-indigo-600',
      reminder: 'text-orange-600',
      promotion: 'text-pink-600'
    };
    return colors[type] || 'text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      low: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: ExclamationCircleIcon,
      medium: ExclamationTriangleIcon,
      low: InformationCircleIcon
    };
    return icons[priority] || InformationCircleIcon;
  };

  const TypeIcon = getTypeIcon(notification.type);
  const PriorityIcon = getPriorityIcon(notification.priority);

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-400' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <TypeIcon className={`h-5 w-5 mt-1 ${getTypeColor(notification.type)}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </p>
            <p className="text-sm text-gray-500 line-clamp-2">
              {notification.message}
            </p>
            {notification.therapist && (
              <p className="text-xs text-gray-400 mt-1">
                <UserIcon className="h-3 w-3 inline mr-1" />
                {notification.therapist}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <TypeIcon className={`h-4 w-4 ${getTypeColor(notification.type)}`} />
          <span className="text-sm text-gray-900 capitalize">
            {notification.type === 'appointment' ? 'Cita' :
             notification.type === 'message' ? 'Mensaje' :
             notification.type === 'payment' ? 'Pago' :
             notification.type === 'system' ? 'Sistema' :
             notification.type === 'session' ? 'Sesión' :
             notification.type === 'evaluation' ? 'Evaluación' :
             notification.type === 'reminder' ? 'Recordatorio' :
             notification.type === 'promotion' ? 'Promoción' :
             notification.type}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={`${getPriorityColor(notification.priority)} flex items-center space-x-1`}>
          <PriorityIcon className="h-3 w-3" />
          <span>
            {notification.priority === 'high' ? 'Alta' :
             notification.priority === 'medium' ? 'Media' :
             notification.priority === 'low' ? 'Baja' :
             notification.priority}
          </span>
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(notification.createdAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={notification.read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {notification.read ? 'Leída' : 'Sin leer'}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(notification)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Ver detalle"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              disabled={loading}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Marcar como leída"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchive && onArchive(notification.id)}
            disabled={loading}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            title="Archivar"
          >
            <ArchiveBoxIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            disabled={loading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Eliminar"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// Tarjeta de notificación (móvil)
export function NotificationCard({ notification, onView, onMarkAsRead, onDelete, onArchive, loading }) {
  const getTypeIcon = (type) => {
    const icons = {
      appointment: CalendarSolidIcon,
      message: ChatSolidIcon,
      payment: CurrencySolidIcon,
      system: CogSolidIcon,
      session: UserSolidIcon,
      evaluation: DocumentSolidIcon,
      reminder: BellIcon,
      promotion: HeartSolidIcon
    };
    return icons[type] || BellIcon;
  };

  const getTypeColor = (type) => {
    const colors = {
      appointment: 'text-blue-600',
      message: 'text-green-600',
      payment: 'text-yellow-600',
      system: 'text-gray-600',
      session: 'text-purple-600',
      evaluation: 'text-indigo-600',
      reminder: 'text-orange-600',
      promotion: 'text-pink-600'
    };
    return colors[type] || 'text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      low: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: ExclamationCircleIcon,
      medium: ExclamationTriangleIcon,
      low: InformationCircleIcon
    };
    return icons[priority] || InformationCircleIcon;
  };

  const TypeIcon = getTypeIcon(notification.type);
  const PriorityIcon = getPriorityIcon(notification.priority);

  return (
    <Card className={`p-4 transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-blue-400 bg-blue-50' : 'hover:bg-gray-50'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0">
            <TypeIcon className={`h-6 w-6 mt-1 ${getTypeColor(notification.type)}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''} break-words`}>
              {notification.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 break-words leading-relaxed">
              {notification.message}
            </p>
            {notification.therapist && (
              <p className="text-xs text-gray-400 mt-2 flex items-center">
                <UserIcon className="h-3 w-3 mr-1" />
                {notification.therapist}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500 flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 capitalize">
                {notification.type === 'appointment' ? 'Cita' :
                 notification.type === 'message' ? 'Mensaje' :
                 notification.type === 'payment' ? 'Pago' :
                 notification.type === 'system' ? 'Sistema' :
                 notification.type === 'session' ? 'Sesión' :
                 notification.type === 'evaluation' ? 'Evaluación' :
                 notification.type === 'reminder' ? 'Recordatorio' :
                 notification.type === 'promotion' ? 'Promoción' :
                 notification.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge className={`${getPriorityColor(notification.priority)} flex items-center space-x-1`}>
            <PriorityIcon className="h-3 w-3" />
            <span>
              {notification.priority === 'high' ? 'Alta' :
               notification.priority === 'medium' ? 'Media' :
               notification.priority === 'low' ? 'Baja' :
               notification.priority}
            </span>
          </Badge>
          <Badge className={notification.read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {notification.read ? 'Leída' : 'Sin leer'}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-1 pt-2 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(notification)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="Ver detalle"
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
            disabled={loading}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Marcar como leída"
          >
            <CheckCircleIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onArchive && onArchive(notification.id)}
          disabled={loading}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          title="Archivar"
        >
          <ArchiveBoxIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(notification.id)}
          disabled={loading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Eliminar"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

// Lista de tarjetas de notificaciones
export function NotificationCardsList({ notifications, onView, onMarkAsRead, onDelete, onArchive, loading }) {
  return (
    <div className="md:hidden space-y-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onView={onView}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          onArchive={onArchive}
          loading={loading}
        />
      ))}
    </div>
  );
}

// Modal de detalle de notificación
export function NotificationDetailModal({ notification, isOpen, onClose, onMarkAsRead, onDelete, onArchive, loading }) {
  if (!notification) return null;

  const getTypeIcon = (type) => {
    const icons = {
      appointment: CalendarSolidIcon,
      message: ChatSolidIcon,
      payment: CurrencySolidIcon,
      system: CogSolidIcon,
      session: UserSolidIcon,
      evaluation: DocumentSolidIcon,
      reminder: BellIcon,
      promotion: HeartSolidIcon
    };
    return icons[type] || BellIcon;
  };

  const getTypeColor = (type) => {
    const colors = {
      appointment: 'text-blue-600',
      message: 'text-green-600',
      payment: 'text-yellow-600',
      system: 'text-gray-600',
      session: 'text-purple-600',
      evaluation: 'text-indigo-600',
      reminder: 'text-orange-600',
      promotion: 'text-pink-600'
    };
    return colors[type] || 'text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      low: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: ExclamationCircleIcon,
      medium: ExclamationTriangleIcon,
      low: InformationCircleIcon
    };
    return icons[priority] || InformationCircleIcon;
  };

  const TypeIcon = getTypeIcon(notification.type);
  const PriorityIcon = getPriorityIcon(notification.priority);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de notificación">
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <TypeIcon className={`h-8 w-8 ${getTypeColor(notification.type)}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {notification.title}
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={`${getPriorityColor(notification.priority)} flex items-center space-x-1`}>
                <PriorityIcon className="h-3 w-3" />
                <span>
                  Prioridad {notification.priority === 'high' ? 'Alta' :
                           notification.priority === 'medium' ? 'Media' :
                           notification.priority === 'low' ? 'Baja' :
                           notification.priority}
                </span>
              </Badge>
              <Badge className={notification.read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {notification.read ? 'Leída' : 'Sin leer'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{notification.message}</p>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Información</h4>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-gray-500">Tipo</dt>
                <dd className="text-sm text-gray-900 flex items-center space-x-2">
                  <TypeIcon className={`h-4 w-4 ${getTypeColor(notification.type)}`} />
                  <span>
                    {notification.type === 'appointment' ? 'Cita' :
                     notification.type === 'message' ? 'Mensaje' :
                     notification.type === 'payment' ? 'Pago' :
                     notification.type === 'system' ? 'Sistema' :
                     notification.type === 'session' ? 'Sesión' :
                     notification.type === 'evaluation' ? 'Evaluación' :
                     notification.type === 'reminder' ? 'Recordatorio' :
                     notification.type === 'promotion' ? 'Promoción' :
                     notification.type}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Fecha</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </dd>
              </div>
              {notification.therapist && (
                <div>
                  <dt className="text-xs text-gray-500">Terapeuta</dt>
                  <dd className="text-sm text-gray-900">{notification.therapist}</dd>
                </div>
              )}
              {notification.amount && (
                <div>
                  <dt className="text-xs text-gray-500">Importe</dt>
                  <dd className="text-sm text-gray-900">€{notification.amount.toFixed(2)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {notification.actionUrl && (
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                // Aquí iría la navegación a la URL de acción
                console.log('Navegando a:', notification.actionUrl);
                onClose();
              }}
            >
              Ver detalles
            </Button>
          )}
          {!notification.read && (
            <Button
              variant="outline"
              onClick={() => {
                onMarkAsRead(notification.id);
                onClose();
              }}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Marcar como leída
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              onArchive && onArchive(notification.id);
              onClose();
            }}
            disabled={loading}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <ArchiveBoxIcon className="h-4 w-4" />
            Archivar
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onDelete(notification.id);
              onClose();
            }}
            disabled={loading}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Botón de exportar CSV
export function ExportCSVButton({ onExport, loading, filters }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onExport(filters)}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <ArrowDownTrayIcon className="h-4 w-4" />
      Exportar CSV
    </Button>
  );
}

// Componente de carga
export function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Cargando notificaciones...</span>
    </div>
  );
}

// Estado vacío
export function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <Card className="text-center py-12">
      <BellIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasFilters ? 'No se encontraron notificaciones' : 'No tienes notificaciones'}
      </h3>
      <p className="text-gray-600 mb-6">
        {hasFilters 
          ? 'Intenta ajustar los filtros para ver más resultados.'
          : 'Cuando recibas notificaciones, aparecerán aquí.'
        }
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      )}
    </Card>
  );
}

// Estado de error
export function ErrorState({ error, onRetry }) {
  return (
    <Card className="text-center py-12 border-red-200 bg-red-50">
      <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-red-900 mb-2">
        Error al cargar las notificaciones
      </h3>
      <p className="text-red-700 mb-6">
        {error?.message || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
      </p>
      <Button variant="outline" onClick={onRetry} className="border-red-300 text-red-700 hover:bg-red-100">
        Reintentar
      </Button>
    </Card>
  );
}

// Hook para atajos de teclado
export function useKeyboardShortcuts({ onMarkAllRead, onExport, onClearFilters }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Alt + M: Marcar todas como leídas
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        onMarkAllRead();
      }
      
      // Alt + E: Exportar
      if (event.altKey && event.key === 'e') {
        event.preventDefault();
        onExport();
      }
      
      // Alt + C: Limpiar filtros
      if (event.altKey && event.key === 'c') {
        event.preventDefault();
        onClearFilters();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onMarkAllRead, onExport, onClearFilters]);
}
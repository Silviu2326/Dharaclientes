import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import {
  NotificationsHeader,
  FiltersPanel,
  NotificationsTable,
  NotificationCardsList,
  NotificationDetailModal,
  ExportCSVButton,
  Loader,
  EmptyState,
  ErrorState,
  useKeyboardShortcuts
} from './notifications.components';
import {
  getNotifications,
  getNotificationById,
  getNotificationStats,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  exportNotificationsCSV
} from './notifications.api';

export default function NotificationsPage() {
  // Estados principales
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Estados de filtros
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    read: undefined,
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Estados de modales
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [notificationsData, statsData] = await Promise.all([
        getNotifications(filters),
        getNotificationStats()
      ]);
      
      setNotifications(notificationsData.notifications);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar datos al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Manejar cambios en filtros
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Limpiar filtros
  const handleClearFilters = useCallback(() => {
    setFilters({
      type: 'all',
      priority: 'all',
      read: undefined,
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  }, []);

  // Ver detalle de notificación
  const handleViewNotification = useCallback(async (notification) => {
    try {
      // Si la notificación no está leída, marcarla como leída al verla
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        // Actualizar el estado local
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
        setStats(prev => prev ? { ...prev, unread: Math.max(0, prev.unread - 1) } : null);
      }
      
      setSelectedNotification(notification);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('Error viewing notification:', err);
    }
  }, []);

  // Marcar notificación como leída
  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      setActionLoading(true);
      await markNotificationAsRead(notificationId);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setStats(prev => prev ? { ...prev, unread: Math.max(0, prev.unread - 1) } : null);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Marcar todas como leídas
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      setActionLoading(true);
      await markAllAsRead();
      
      // Actualizar estado local
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setStats(prev => prev ? { ...prev, unread: 0 } : null);
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Archivar notificación
  const handleArchiveNotification = useCallback(async (notificationId) => {
    try {
      setActionLoading(true);
      // Aquí iría la llamada a la API para archivar
      // await archiveNotification(notificationId);
      
      // Por ahora, simulamos archivando (marcando como leída y ocultando)
      const archivedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (stats && archivedNotification && !archivedNotification.read) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          unread: prev.unread - 1
        }));
      } else if (stats) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      }
      
      // Cerrar modal si la notificación archivada estaba siendo vista
      if (selectedNotification?.id === notificationId) {
        setIsDetailModalOpen(false);
        setSelectedNotification(null);
      }
      
      console.log('Notificación archivada exitosamente');
    } catch (err) {
      console.error('Error archiving notification:', err);
    } finally {
      setActionLoading(false);
    }
  }, [notifications, stats, selectedNotification]);

  // Eliminar notificación
  const handleDeleteNotification = useCallback(async (notificationId) => {
    try {
      setActionLoading(true);
      await deleteNotification(notificationId);
      
      // Actualizar estado local
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (stats) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          unread: deletedNotification && !deletedNotification.read ? prev.unread - 1 : prev.unread
        }));
      }
      
      // Cerrar modal si la notificación eliminada estaba siendo vista
      if (selectedNotification?.id === notificationId) {
        setIsDetailModalOpen(false);
        setSelectedNotification(null);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    } finally {
      setActionLoading(false);
    }
  }, [notifications, stats, selectedNotification]);

  // Eliminar todas las leídas
  const handleDeleteAllRead = useCallback(async () => {
    try {
      setActionLoading(true);
      const deletedCount = await deleteAllRead();
      
      // Recargar datos para obtener el estado actualizado
      await loadData();
      
      console.log(`${deletedCount} notificaciones leídas eliminadas`);
    } catch (err) {
      console.error('Error deleting read notifications:', err);
    } finally {
      setActionLoading(false);
    }
  }, [loadData]);

  // Exportar CSV
  const handleExportCSV = useCallback(async (exportFilters = filters) => {
    try {
      setActionLoading(true);
      await exportNotificationsCSV(exportFilters);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    } finally {
      setActionLoading(false);
    }
  }, [filters]);

  // Configurar atajos de teclado
  useKeyboardShortcuts({
    onMarkAllRead: handleMarkAllAsRead,
    onExport: () => handleExportCSV(),
    onClearFilters: handleClearFilters
  });

  // Verificar si hay filtros activos
  const hasActiveFilters = (
    filters.type !== 'all' ||
    filters.priority !== 'all' ||
    filters.read !== undefined ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search
  );

  // Renderizar contenido principal
  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <ErrorBoundary 
          error={error} 
          onRetry={loadData}
        />
      );
    }

    if (notifications.length === 0) {
      return (
        <EmptyState 
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      );
    }

    return (
      <>
        {/* Tabla para desktop */}
        <NotificationsTable
          notifications={notifications}
          onView={handleViewNotification}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          onArchive={handleArchiveNotification}
          loading={actionLoading}
        />
        
        {/* Tarjetas para móvil */}
        <NotificationCardsList
          notifications={notifications}
          onView={handleViewNotification}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          onArchive={handleArchiveNotification}
          loading={actionLoading}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado con estadísticas */}
        <NotificationsHeader
          stats={stats}
          onMarkAllRead={handleMarkAllAsRead}
          onDeleteAllRead={handleDeleteAllRead}
          loading={actionLoading}
        />

        {/* Panel de filtros */}
        <FiltersPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Barra de acciones */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <span className="text-sm text-gray-600">
              {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}
              {hasActiveFilters && ' (filtradas)'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ExportCSVButton
              onExport={handleExportCSV}
              loading={actionLoading}
              filters={filters}
            />
          </div>
        </div>

        {/* Contenido principal */}
        {renderContent()}

        {/* Modal de detalle */}
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedNotification(null);
          }}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          onArchive={handleArchiveNotification}
          loading={actionLoading}
        />

        {/* Información de atajos de teclado */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Atajos de teclado</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-blue-700">
            <div><kbd className="bg-blue-100 px-1 rounded">Alt + M</kbd> Marcar todas como leídas</div>
            <div><kbd className="bg-blue-100 px-1 rounded">Alt + E</kbd> Exportar CSV</div>
            <div><kbd className="bg-blue-100 px-1 rounded">Alt + C</kbd> Limpiar filtros</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
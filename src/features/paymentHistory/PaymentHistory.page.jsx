import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  PaymentsHeader,
  FiltersPanel,
  PaymentsTable,
  PaymentCardsList,
  PaymentDetailModal,
  ExportCSVButton,
  ExportPDFButton,
  Loader,
  EmptyState,
  ErrorBoundary,
  useKeyboardShortcuts
} from './paymentHistory.components';
import {
  getPaymentHistory,
  getPaymentStats,
  getPaymentById
} from './paymentHistory.api';

export const PaymentHistoryPage = () => {
  // Estados principales
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'todos',
    status: 'todos',
    search: ''
  });
  
  // Estados del modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Estados de carga específicos
  const [statsLoading, setStatsLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, []);

  // Cargar pagos cuando cambien los filtros
  useEffect(() => {
    loadPayments();
  }, [filters]);

  // Función para cargar estadísticas
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const statsData = await getPaymentStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Función para cargar pagos
  const loadPayments = async () => {
    try {
      setPaymentsLoading(true);
      setError(null);
      const { payments: paymentsData } = await getPaymentHistory(filters);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Error cargando pagos:', err);
      setError(err);
    } finally {
      setPaymentsLoading(false);
      setLoading(false);
    }
  };

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      type: 'todos',
      status: 'todos',
      search: ''
    });
  };

  // Ver detalles de un pago
  const handleViewDetails = async (payment) => {
    try {
      // Obtener detalles completos del pago
      const fullPayment = await getPaymentById(payment.id);
      setSelectedPayment(fullPayment || payment);
      setModalOpen(true);
    } catch (err) {
      console.error('Error cargando detalles del pago:', err);
      setSelectedPayment(payment);
      setModalOpen(true);
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPayment(null);
  };

  // Manejar descarga de factura
  const handleDownloadInvoice = (paymentId) => {
    console.log('Factura descargada:', paymentId);
  };

  // Reintentar carga en caso de error
  const handleRetry = () => {
    setError(null);
    loadStats();
    loadPayments();
  };

  // Atajos de teclado
  useKeyboardShortcuts(() => {
    if (payments.length > 0) {
      handleDownloadInvoice(payments[0].id);
    }
  });

  // Mostrar error si hay problemas críticos
  if (error && !paymentsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-deep">Historial de Pagos</h1>
          <p className="text-gray-600 mt-2">Consulta tu historial de transacciones</p>
        </div>
        <ErrorBoundary error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-deep">Historial de Pagos</h1>
          <p className="text-gray-600 mt-2">Consulta tu historial de transacciones</p>
        </div>
        
        {/* Botones de exportación */}
        <div className="flex space-x-2">
          <ExportCSVButton 
            filters={filters}
            onExportStart={() => console.log('Iniciando exportación CSV...')}
            onExportComplete={() => console.log('Exportación CSV completada')}
          />
          <ExportPDFButton 
            year={new Date().getFullYear()}
            onExportStart={() => console.log('Iniciando exportación PDF...')}
            onExportComplete={() => console.log('Exportación PDF completada')}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <PaymentsHeader stats={stats} loading={statsLoading} />

      {/* Panel de filtros */}
      <FiltersPanel 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Contenido principal */}
      {loading ? (
        <Loader />
      ) : payments.length === 0 ? (
        <EmptyState 
          title="No hay pagos"
          description="No se encontraron pagos con los filtros aplicados. Intenta ajustar los criterios de búsqueda."
          icon="💳"
        />
      ) : (
        <>
          {/* Tabla para desktop */}
          <PaymentsTable 
            payments={payments}
            onViewDetails={handleViewDetails}
            onDownloadInvoice={handleDownloadInvoice}
            loading={paymentsLoading}
          />
          
          {/* Tarjetas para móvil */}
          <PaymentCardsList 
            payments={payments}
            onViewDetails={handleViewDetails}
            onDownloadInvoice={handleDownloadInvoice}
            loading={paymentsLoading}
          />
        </>
      )}

      {/* Información adicional */}
      {payments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Mostrando {payments.length} pagos</span>
              <span>Usa Alt+D para descargar la primera factura</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles */}
      <PaymentDetailModal 
        payment={selectedPayment}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
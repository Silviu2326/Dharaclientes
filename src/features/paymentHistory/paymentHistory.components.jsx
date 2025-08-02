import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { downloadInvoice, resendReceipt, exportPaymentsCSV, exportAnnualPDF } from './paymentHistory.api';

// Componente de encabezado con estadísticas
export const PaymentsHeader = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatsBadge 
        title="Total gastado este año" 
        value={`€${stats?.totalThisYear?.toFixed(2) || '0.00'}`}
        icon="💰"
      />
      <StatsBadge 
        title="Última factura" 
        value={`€${stats?.lastInvoice?.amount?.toFixed(2) || '0.00'}`}
        subtitle={stats?.lastInvoice?.date || 'N/A'}
        icon="📄"
      />
      <StatsBadge 
        title="Total de pagos" 
        value={stats?.totalPayments || 0}
        subtitle={`Promedio: €${stats?.averageAmount?.toFixed(2) || '0.00'}`}
        icon="📊"
      />
    </div>
  );
};

// Componente de badge de estadísticas
export const StatsBadge = ({ title, value, subtitle, icon }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-deep">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="text-2xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Panel de filtros
export const FiltersPanel = ({ filters, onFiltersChange, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      type: 'todos',
      status: 'todos',
      search: ''
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Rango de fechas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha desde
            </label>
            <input
              type="date"
              value={localFilters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha hasta
            </label>
            <input
              type="date"
              value={localFilters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tipo */}
          <TypeSelect 
            value={localFilters.type}
            onChange={(value) => handleFilterChange('type', value)}
          />

          {/* Estado */}
          <StatusSelect 
            value={localFilters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />

          {/* Búsqueda */}
          <SearchBar 
            value={localFilters.search}
            onChange={(value) => handleFilterChange('search', value)}
            placeholder="ID, terapeuta..."
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleReset}>
            Limpiar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Selector de tipo
export const TypeSelect = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="todos">Todos</option>
        <option value="sesion">Sesión</option>
        <option value="pack">Pack</option>
        <option value="otro">Otro</option>
      </select>
    </div>
  );
};

// Selector de estado
export const StatusSelect = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Estado
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="todos">Todos</option>
        <option value="Pagado">Pagado</option>
        <option value="Reembolsado">Reembolsado</option>
        <option value="Pendiente">Pendiente</option>
      </select>
    </div>
  );
};

// Barra de búsqueda
export const SearchBar = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Búsqueda
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

// Tabla de pagos (desktop)
export const PaymentsTable = ({ payments, onViewDetails, onDownloadInvoice, loading = false }) => {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (paymentId) => {
    setDownloading(paymentId);
    try {
      await downloadInvoice(paymentId);
      onDownloadInvoice?.(paymentId);
    } catch (error) {
      console.error('Error descargando factura:', error);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hidden md:block">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terapeuta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <PaymentRow 
                  key={payment.id}
                  payment={payment}
                  onViewDetails={onViewDetails}
                  onDownloadInvoice={() => handleDownload(payment.id)}
                  downloading={downloading === payment.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Fila de pago en tabla
export const PaymentRow = ({ payment, onViewDetails, onDownloadInvoice, downloading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagado': return 'bg-green-100 text-green-800';
      case 'Reembolsado': return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(payment.date).toLocaleDateString('es-ES')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {payment.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {payment.therapist}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-xs truncate" title={payment.concept}>
          {payment.concept}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        €{payment.amount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
          {payment.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onViewDetails(payment)}
        >
          Ver detalles
        </Button>
        <Button 
          size="sm"
          onClick={onDownloadInvoice}
          disabled={downloading}
          title="Descargar factura (Alt+D)"
        >
          {downloading ? '...' : '📄'}
        </Button>
      </td>
    </tr>
  );
};

// Tarjeta de pago (móvil)
export const PaymentCard = ({ payment, onViewDetails, onDownloadInvoice }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadInvoice(payment.id);
      onDownloadInvoice?.(payment.id);
    } catch (error) {
      console.error('Error descargando factura:', error);
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagado': return 'bg-green-100 text-green-800';
      case 'Reembolsado': return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="md:hidden mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium text-gray-900">{payment.id}</p>
            <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString('es-ES')}</p>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
            {payment.status}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="font-medium">Terapeuta:</span> {payment.therapist}
          </p>
          <p className="text-sm">
            <span className="font-medium">Concepto:</span> {payment.concept}
          </p>
          <p className="text-lg font-bold text-deep">
            €{payment.amount.toFixed(2)}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails(payment)}
          >
            Ver detalles
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Descargando...' : 'Descargar factura'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Lista de tarjetas de pago (móvil)
export const PaymentCardsList = ({ payments, onViewDetails, onDownloadInvoice, loading = false }) => {
  if (loading) {
    return (
      <div className="md:hidden space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {payments.map((payment) => (
        <PaymentCard 
          key={payment.id}
          payment={payment}
          onViewDetails={onViewDetails}
          onDownloadInvoice={onDownloadInvoice}
        />
      ))}
    </div>
  );
};

// Modal de detalle de pago
export const PaymentDetailModal = ({ payment, isOpen, onClose }) => {
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  const handleResendReceipt = async () => {
    if (!email) return;
    
    setResending(true);
    try {
      await resendReceipt(payment.id, email);
      alert('Recibo reenviado correctamente');
      setEmail('');
    } catch (error) {
      console.error('Error reenviando recibo:', error);
      alert('Error al reenviar el recibo');
    } finally {
      setResending(false);
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-deep">Detalle del Pago</h2>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información del Pago</h3>
              
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">ID de Pago:</span>
                  <p className="text-gray-900">{payment.id}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Fecha:</span>
                  <p className="text-gray-900">{new Date(payment.date).toLocaleDateString('es-ES')}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Terapeuta:</span>
                  <p className="text-gray-900">{payment.therapist}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Concepto:</span>
                  <p className="text-gray-900">{payment.concept}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Método de Pago:</span>
                  <p className="text-gray-900">{payment.method}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">ID de Transacción:</span>
                  <p className="text-gray-900 font-mono text-sm">{payment.transactionId}</p>
                </div>
              </div>
            </div>
            
            {/* Desglose financiero */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Desglose Financiero</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">€{payment.breakdown?.subtotal?.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="text-gray-900">€{payment.breakdown?.tax?.toFixed(2)}</span>
                </div>
                
                <hr className="my-2" />
                
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-deep">€{payment.breakdown?.total?.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Estado */}
              <div>
                <span className="text-sm font-medium text-gray-600">Estado:</span>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    payment.status === 'Pagado' ? 'bg-green-100 text-green-800' :
                    payment.status === 'Reembolsado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reenviar recibo */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reenviar Recibo</h3>
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleResendReceipt}
                disabled={!email || resending}
              >
                {resending ? 'Enviando...' : 'Reenviar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Botón de exportar CSV
export const ExportCSVButton = ({ filters, onExportStart, onExportComplete }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    onExportStart?.();
    
    try {
      await exportPaymentsCSV(filters);
      onExportComplete?.();
    } catch (error) {
      console.error('Error exportando CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? 'Exportando...' : '📊 Exportar CSV'}
    </Button>
  );
};

// Botón de exportar PDF anual
export const ExportPDFButton = ({ year, onExportStart, onExportComplete }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    onExportStart?.();
    
    try {
      await exportAnnualPDF(year);
      onExportComplete?.();
    } catch (error) {
      console.error('Error exportando PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? 'Generando...' : '📄 Resumen PDF Anual'}
    </Button>
  );
};

// Componente de carga
export const Loader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

// Estado vacío
export const EmptyState = ({ title = "No hay pagos", description = "No se encontraron pagos con los filtros aplicados.", icon = "💳" }) => {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de error
export const ErrorBoundary = ({ error, onRetry }) => {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar los datos</h3>
          <p className="text-gray-600 mb-4">{error?.message || 'Ha ocurrido un error inesperado'}</p>
          {onRetry && (
            <Button onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Hook para atajos de teclado
export const useKeyboardShortcuts = (onDownload) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === 'd') {
        event.preventDefault();
        onDownload?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDownload]);
};
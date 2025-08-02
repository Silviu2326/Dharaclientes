import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

// Encabezado con título, búsqueda y filtros
export const DocsHeader = ({ onSearch, onFilterSession, searchTerm, selectedSession, sessions }) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-deep">Documentos Recibidos</h1>
        <p className="text-gray-600 mt-2">Documentos compartidos por tus terapeutas</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar onSearch={onSearch} searchTerm={searchTerm} />
        <SessionFilter 
          onFilter={onFilterSession} 
          selectedSession={selectedSession} 
          sessions={sessions} 
        />
      </div>
    </div>
  );
};

// Barra de búsqueda full-text
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
        placeholder="Buscar documentos..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
        aria-label="Buscar documentos"
      />
    </div>
  );
};

// Filtro por sesión
export const SessionFilter = ({ onFilter, selectedSession, sessions }) => {
  return (
    <select
      value={selectedSession}
      onChange={(e) => onFilter(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      aria-label="Filtrar por sesión"
    >
      <option value="">Todas las sesiones</option>
      {sessions.map((session) => (
        <option key={session.id} value={session.id}>
          {session.name} - {new Date(session.date).toLocaleDateString()}
        </option>
      ))}
    </select>
  );
};

// Tabla de documentos (desktop)
export const DocumentsTable = ({ documents, onPreview, onDownload, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="hidden md:block">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sesión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((document) => (
                  <DocumentRow
                    key={document.id}
                    document={document}
                    onPreview={onPreview}
                    onDownload={onDownload}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Fila de documento en tabla
export const DocumentRow = ({ document, onPreview, onDownload }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6l-4-4H4v16zm8-14v3h3l-3-3z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getFileIcon(document.type)}
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{document.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          {document.type.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatFileSize(document.size)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(document.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {document.sessionName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onPreview(document)}
            className="text-primary hover:text-primary-dark"
            aria-label={`Vista previa de ${document.name}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onDownload(document)}
            className="text-green-600 hover:text-green-900"
            aria-label={`Descargar ${document.name}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

// Vista de tarjetas para móvil
export const DocumentCards = ({ documents, onPreview, onDownload, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="md:hidden space-y-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

// Tarjeta de documento para móvil
export const DocumentCard = ({ document, onPreview, onDownload }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{document.name}</h3>
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
              <span className="inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                {document.type.toUpperCase()}
              </span>
              <span>{formatFileSize(document.size)}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <div>Fecha: {new Date(document.date).toLocaleDateString()}</div>
              <div>Sesión: {document.sessionName}</div>
            </div>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onPreview(document)}
              className="p-2 text-primary hover:text-primary-dark rounded-full hover:bg-gray-100"
              aria-label={`Vista previa de ${document.name}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => onDownload(document)}
              className="p-2 text-green-600 hover:text-green-900 rounded-full hover:bg-gray-100"
              aria-label={`Descargar ${document.name}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Modal de vista previa
export const PreviewModal = ({ document, isOpen, onClose, documents, onNavigate }) => {
  const modalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (document && documents) {
      const index = documents.findIndex(doc => doc.id === document.id);
      setCurrentIndex(index);
    }
  }, [document, documents]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            const prevDoc = documents[currentIndex - 1];
            onNavigate(prevDoc);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < documents.length - 1) {
            const nextDoc = documents[currentIndex + 1];
            onNavigate(nextDoc);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, documents, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !document) return null;

  const renderPreview = () => {
    switch (document.type.toLowerCase()) {
      case 'pdf':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12V6l-4-4H4v16zm8-14v3h3l-3-3z" />
              </svg>
              <p className="text-gray-600 mb-4">Vista previa de PDF</p>
              <p className="text-sm text-gray-500">Para una mejor experiencia, descarga el archivo</p>
            </div>
          </div>
        );
      case 'image':
        return (
          <img
            src={document.url || '/api/placeholder/600/400'}
            alt={document.name}
            className="max-w-full max-h-full object-contain"
          />
        );
      case 'audio':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <audio controls className="w-full max-w-md">
              <source src={document.url} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        );
      case 'video':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <video controls className="max-w-full max-h-full">
              <source src={document.url} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-600 mb-4">Vista previa no disponible</p>
              <p className="text-sm text-gray-500">Descarga el archivo para verlo</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          tabIndex={-1}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg leading-6 font-medium text-gray-900 truncate" id="modal-title">
                  {document.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {document.type.toUpperCase()} • {document.sessionName}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Navegación */}
                <button
                  onClick={() => {
                    if (currentIndex > 0) {
                      const prevDoc = documents[currentIndex - 1];
                      onNavigate(prevDoc);
                    }
                  }}
                  disabled={currentIndex === 0}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Documento anterior"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} de {documents.length}
                </span>
                
                <button
                  onClick={() => {
                    if (currentIndex < documents.length - 1) {
                      const nextDoc = documents[currentIndex + 1];
                      onNavigate(nextDoc);
                    }
                  }}
                  disabled={currentIndex === documents.length - 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Documento siguiente"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-gray-50 px-4 py-6 sm:px-6" style={{ height: '60vh' }}>
            {renderPreview()}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
            <Button
              onClick={() => {
                // Simular descarga
                const link = document.createElement('a');
                link.href = document.url || '#';
                link.download = document.name;
                link.click();
              }}
              className="w-full sm:w-auto sm:ml-3"
            >
              Descargar
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estado vacío
export const EmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-deep mb-2">
          No hay documentos disponibles
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Tus terapeutas aún no han compartido documentos contigo. Los documentos aparecerán aquí cuando estén disponibles.
        </p>
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
          Error al cargar documentos
        </h3>
        <p className="text-gray-600 mb-4">
          No pudimos cargar tus documentos. Por favor, inténtalo de nuevo.
        </p>
        
        <Button onClick={onRetry} variant="secondary">
          Reintentar
        </Button>
      </CardContent>
    </Card>
  );
};
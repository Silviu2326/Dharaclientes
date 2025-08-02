import React from 'react';
import {
  DocsHeader,
  DocumentsTable,
  DocumentCards,
  PreviewModal,
  EmptyState,
  ErrorState
} from './journalDocuments.components';

// Mock data for demonstration
const mockDocuments = [
  {
    id: '1',
    name: 'Sesión 1 - Evaluación inicial.pdf',
    type: 'PDF',
    size: '2.5 MB',
    date: '2024-01-15',
    session: 'Sesión 1',
    url: '/mock-document.pdf'
  },
  {
    id: '2',
    name: 'Ejercicios de respiración.mp4',
    type: 'Video',
    size: '15.2 MB',
    date: '2024-01-20',
    session: 'Sesión 2',
    url: '/mock-video.mp4'
  },
  {
    id: '3',
    name: 'Registro de emociones.jpg',
    type: 'Imagen',
    size: '1.8 MB',
    date: '2024-01-25',
    session: 'Sesión 3',
    url: '/mock-image.jpg'
  }
];

const mockSessions = [
  { id: 'all', name: 'Todas las sesiones' },
  { id: '1', name: 'Sesión 1' },
  { id: '2', name: 'Sesión 2' },
  { id: '3', name: 'Sesión 3' }
];

function JournalDocuments() {
  // Simplified state without hooks for demonstration
  const documents = mockDocuments;
  const sessions = mockSessions;
  const loading = false;
  const error = null;
  const searchTerm = '';
  const selectedSession = 'all';
  const previewDocument = null;
  const isDownloading = false;

  const handleSearch = (term) => {
    console.log('Searching for:', term);
  };

  const handleSessionFilter = (sessionId) => {
    console.log('Filtering by session:', sessionId);
  };

  const handlePreview = (document) => {
    console.log('Previewing document:', document);
  };

  const handleDownload = (document) => {
    console.log('Downloading document:', document);
  };

  const handleClosePreview = () => {
    console.log('Closing preview');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState 
            message="Error al cargar los documentos"
            onRetry={() => console.log('Retrying...')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DocsHeader
          searchTerm={searchTerm}
          selectedSession={selectedSession}
          sessions={sessions}
          onSearch={handleSearch}
          onSessionFilter={handleSessionFilter}
        />

        {documents.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <DocumentsTable
                documents={documents}
                onPreview={handlePreview}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <DocumentCards
                documents={documents}
                onPreview={handlePreview}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            </div>
          </>
        )}

        {previewDocument && (
          <PreviewModal
            document={previewDocument}
            onClose={handleClosePreview}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}

export default JournalDocuments;
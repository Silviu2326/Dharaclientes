import React, { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import {
  DocsHeader,
  DocumentsTable,
  DocumentCards,
  PreviewModal,
  EmptyState,
  ErrorState,
  DiaryEntryForm
} from './components';

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

// Datos de ejemplo para entradas de diario personal
const mockDiaryEntries = [
  {
    id: 'd1',
    date: '2024-02-01',
    title: 'Reflexión diaria',
    content: 'Hoy trabajé en técnicas de respiración y me sentí más tranquilo.'
  },
  {
    id: 'd2',
    date: '2024-02-03',
    title: 'Sesión con terapeuta',
    content: 'Discutimos mis metas a corto plazo y me siento motivado.'
  }
];

function JournalDocuments() {
  // Estado y datos
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'diary'
  const documents = mockDocuments;
  const [diaryEntries, setDiaryEntries] = useState(mockDiaryEntries);
  const [isDiaryModalOpen, setDiaryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
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

  const handleSaveDiaryEntry = ({ title, content }) => {
    if (editingEntry) {
      setDiaryEntries(prev => prev.map(entry => entry.id === editingEntry.id ? { ...entry, title, content } : entry));
    } else {
      const newEntry = {
        id: 'd' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        title,
        content
      };
      setDiaryEntries(prev => [newEntry, ...prev]);
    }
    setDiaryModalOpen(false);
    setEditingEntry(null);
  };

  const handleClosePreview = () => {
    console.log('Closing preview');
  };

  // Función para compartir entrada con terapeuta
  const handleShareDiaryEntry = (entry) => {
    // TODO: Integrar con API de compartición
    console.log('Compartiendo entrada con terapeuta:', entry);
    alert(`Entrada "${entry.title}" compartida con tu terapeuta.`);
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
        {/* Navegación de pestañas */}
        <div className="flex space-x-4 border-b pb-2">
          <button
            className={`${activeTab === 'documents' ? 'text-primary border-primary' : 'text-gray-500'} pb-2 border-b-2 font-medium`}
            onClick={() => setActiveTab('documents')}
          >
            Documentos
          </button>
          <button
            className={`${activeTab === 'diary' ? 'text-primary border-primary' : 'text-gray-500'} pb-2 border-b-2 font-medium`}
            onClick={() => setActiveTab('diary')}
          >
            Diario Personal
          </button>
        </div>
        {activeTab === 'documents' && (
          <DocsHeader
          searchTerm={searchTerm}
          selectedSession={selectedSession}
          sessions={sessions}
          onSearch={handleSearch}
          onFilterSession={handleSessionFilter}
        />
        )}

        

        {activeTab === 'documents' && documents.length === 0 ? (
          <EmptyState />
        ) : null}

        {activeTab === 'documents' && documents.length > 0 && (
          <>
            {/* Desktop Table */}
            {/* Desktop Table */}
            <div className="hidden md:block">
              <DocumentsTable
                documents={documents}
                onPreview={handlePreview}
                onDownload={handleDownload}
                loading={loading}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <DocumentCards
                documents={documents}
                onPreview={handlePreview}
                onDownload={handleDownload}
                loading={loading}
              />
            </div>
          </>
        )}

        {activeTab === 'diary' && (
          <>
            <div className="flex justify-end">
              <Button onClick={() => setDiaryModalOpen(true)}>Nueva Entrada</Button>
            </div>
            <DiaryEntriesList entries={diaryEntries} onShare={handleShareDiaryEntry} />
            <Modal
              isOpen={isDiaryModalOpen}
              onClose={() => {
                setDiaryModalOpen(false);
                setEditingEntry(null);
              }}
              title={editingEntry ? 'Editar Entrada' : 'Nueva Entrada'}
            >
              <DiaryEntryForm
                initialData={editingEntry || {}}
                onSubmit={handleSaveDiaryEntry}
              />
            </Modal>
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

// Lista de entradas de diario personal
const DiaryEntriesList = ({ entries, onShare }) => {
  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-xl font-semibold text-deep mb-2">Aún no has escrito en tu diario</h3>
          <p className="text-gray-600">Cuando agregues entradas, aparecerán aquí.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-deep">{entry.title}</h3>
                <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onShare(entry)}
              >
                Compartir
              </Button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line">{entry.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JournalDocuments;
import React, { useState, useEffect } from 'react';
import {
  ReviewsHeader,
  PendingList,
  ReviewsHistory,
  RatingModal,
  EmptyState
} from './reviews.components';
import {
  getPendingAppointments,
  getSentReviews,
  createReview,
  updateReview,
  markAppointmentAsReviewed
} from './reviews.api';
import { AlertCircle } from 'lucide-react';

export const ReviewsPage = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [sentReviews, setSentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [pending, sent] = await Promise.all([
        getPendingAppointments(),
        getSentReviews()
      ]);
      
      setPendingAppointments(pending);
      setSentReviews(sent);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar las valoraciones. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Abrir modal para valorar
  const handleRate = (appointment) => {
    setSelectedAppointment(appointment);
    setEditingReview(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (review) => {
    // Buscar la cita correspondiente para el modal
    const appointment = {
      id: review.appointmentId,
      therapist: review.therapist
    };
    setSelectedAppointment(appointment);
    setEditingReview(review);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setEditingReview(null);
  };

  // Enviar valoración
  const handleSubmitReview = async (reviewData) => {
    try {
      setIsSubmitting(true);
      
      if (editingReview) {
        // Actualizar valoración existente
        const updatedReview = await updateReview(editingReview.id, {
          rating: reviewData.rating,
          comment: reviewData.comment,
          therapist: selectedAppointment.therapist
        });
        
        // Actualizar en la lista local
        setSentReviews(prev => 
          prev.map(review => 
            review.id === editingReview.id 
              ? { ...review, ...updatedReview }
              : review
          )
        );
      } else {
        // Crear nueva valoración
        const newReview = await createReview({
          ...reviewData,
          therapist: selectedAppointment.therapist
        });
        
        // Agregar a la lista de enviadas
        setSentReviews(prev => [newReview, ...prev]);
        
        // Remover de pendientes
        setPendingAppointments(prev => 
          prev.filter(apt => apt.id !== selectedAppointment.id)
        );
        
        // Marcar cita como valorada
        await markAppointmentAsReviewed(selectedAppointment.id);
      }
      
      handleCloseModal();
      
      // Cambiar a pestaña de enviadas si se creó una nueva valoración
      if (!editingReview) {
        setActiveTab('sent');
      }
    } catch (err) {
      console.error('Error al enviar valoración:', err);
      setError('Error al enviar la valoración. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente de error
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
      <p className="text-red-700 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con pestañas */}
      <ReviewsHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setError(null);
              loadData();
            }} 
          />
        ) : (
          <>
            {/* Pestaña de pendientes */}
            {activeTab === 'pending' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Valoraciones pendientes
                  </h2>
                  {!loading && pendingAppointments.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {pendingAppointments.length} pendiente{pendingAppointments.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <PendingList
                  appointments={pendingAppointments}
                  onRate={handleRate}
                  loading={loading}
                />
              </div>
            )}

            {/* Pestaña de enviadas */}
            {activeTab === 'sent' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Valoraciones enviadas
                  </h2>
                  {!loading && sentReviews.length > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      {sentReviews.length} enviada{sentReviews.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <ReviewsHistory
                  reviews={sentReviews}
                  onEdit={handleEdit}
                  loading={loading}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de valoración */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
        onSubmit={handleSubmitReview}
        loading={isSubmitting}
        initialData={editingReview ? {
          rating: editingReview.rating,
          comment: editingReview.comment
        } : null}
      />
    </div>
  );
};
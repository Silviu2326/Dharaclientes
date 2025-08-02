import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { Star, Clock, Check, Edit, X, Calendar, User } from 'lucide-react';

// Componente de encabezado con pestañas
export const ReviewsHeader = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'pending', label: 'Pendientes', icon: Clock },
    { id: 'sent', label: 'Enviadas', icon: Check }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Valoraciones</h1>
        <p className="text-gray-600 mb-6">Gestiona tus valoraciones de terapeutas</p>
        
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente de calificación con estrellas
export const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleKeyDown = (e, starValue) => {
    if (readonly) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRatingChange(starValue);
    }
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            role="slider"
            aria-valuemin="1"
            aria-valuemax="5"
            aria-valuenow={rating}
            aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
            tabIndex={readonly ? -1 : 0}
            className={`${sizeClasses[size]} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${
              filled ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => !readonly && onRatingChange(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            onKeyDown={(e) => handleKeyDown(e, star)}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        );
      })}
    </div>
  );
};

// Componente de caja de comentarios
export const CommentBox = ({ value, onChange, maxLength = 300, placeholder = "Escribe tu valoración..." }) => {
  const remainingChars = maxLength - (value?.length || 0);
  
  return (
    <div className="space-y-2">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Comparte tu experiencia</span>
        <span className={`${remainingChars < 50 ? 'text-orange-500' : 'text-gray-400'}`}>
          {remainingChars} caracteres restantes
        </span>
      </div>
    </div>
  );
};

// Tarjeta de cita pendiente
export const PendingCard = ({ appointment, onRate }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={appointment.therapist.avatar}
            alt={appointment.therapist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {appointment.therapist.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {appointment.therapist.specialty}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onRate(appointment)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Valorar ahora
            </Button>
            <span className="text-xs text-gray-400">
              Cita completada
            </span>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <div className="w-3 h-3 bg-orange-400 rounded-full" title="Pendiente de valorar" />
        </div>
      </div>
    </Card>
  );
};

// Lista de citas pendientes
export const PendingList = ({ appointments, onRate, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No tienes valoraciones pendientes"
        description="Cuando completes una cita, podrás valorar a tu terapeuta aquí."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {appointments.map((appointment) => (
          <PendingCard
            key={appointment.id}
            appointment={appointment}
            onRate={onRate}
          />
        ))}
      </div>
    </div>
  );
};

// Modal de valoración
export const RatingModal = ({ isOpen, onClose, appointment, onSubmit, loading, initialData }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = 'Por favor, selecciona una calificación';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ rating, comment });
  };

  const handleClose = () => {
    setRating(initialData?.rating || 0);
    setComment(initialData?.comment || '');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Editar valoración' : 'Valorar terapeuta'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {appointment && (
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <img
                src={appointment.therapist.avatar}
                alt={appointment.therapist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {appointment.therapist.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {appointment.therapist.specialty}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación *
              </label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              {errors.rating && (
                <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario (opcional)
              </label>
              <CommentBox
                value={comment}
                onChange={setComment}
                placeholder="Comparte tu experiencia con este terapeuta..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Enviando...' : (initialData ? 'Actualizar' : 'Enviar valoración')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Tarjeta de valoración enviada
export const ReviewCard = ({ review, onEdit, canEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.ceil((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={review.therapist.avatar}
            alt={review.therapist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {review.therapist.name}
              </h3>
              <p className="text-sm text-gray-600">
                {review.therapist.specialty}
              </p>
            </div>
            
            {canEdit && (
              <button
                onClick={() => onEdit(review)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                title="Editar valoración"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="mb-3">
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
          
          {review.comment && (
            <p className="text-gray-700 mb-3 leading-relaxed">
              {review.comment}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatDate(review.createdAt)}</span>
            <span>{getTimeAgo(review.createdAt)}</span>
          </div>
          
          {canEdit && (
            <p className="text-xs text-blue-600 mt-2">
              Puedes editar esta valoración durante las próximas 24 horas
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// Lista de valoraciones enviadas
export const ReviewsHistory = ({ reviews, onEdit, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No has enviado valoraciones"
        description="Cuando valores a tus terapeutas, aparecerán aquí."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => {
          const canEdit = () => {
            const reviewDate = new Date(review.createdAt);
            const now = new Date();
            const diffHours = (now - reviewDate) / (1000 * 60 * 60);
            return diffHours < 24;
          };

          return (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={onEdit}
              canEdit={canEdit()}
            />
          );
        })}
      </div>
    </div>
  );
};

// Estado vacío
export const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
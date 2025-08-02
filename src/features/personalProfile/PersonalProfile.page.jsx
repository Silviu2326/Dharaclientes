import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import {
  ProfileHeader,
  BasicInfoForm,
  UsageMetrics,
  PreferencesPanel,
  ErrorState,
  LoadingState
} from './personalProfile.components';
import {
  getUserProfile,
  updateUserProfile,
  getUserMetrics,
  getUserPreferences,
  updateUserPreferences,
  sendEmailVerification
} from './personalProfile.api';

export const PersonalProfilePage = () => {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del perfil
  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar datos en paralelo
      const [profileResponse, metricsResponse, preferencesResponse] = await Promise.all([
        getUserProfile(),
        getUserMetrics(),
        getUserPreferences()
      ]);
      
      setUser(profileResponse.data);
      setMetrics(metricsResponse.data);
      setPreferences(preferencesResponse.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProfileData();
  }, []);

  // Manejar cambio de modo edición
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Guardar cambios del perfil
  const handleSaveProfile = async (data) => {
    setSaving(true);
    try {
      const response = await updateUserProfile(data);
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  // Actualizar preferencias
  const handleUpdatePreferences = async (newPreferences) => {
    try {
      const response = await updateUserPreferences(newPreferences);
      setPreferences(response.data);
    } catch (err) {
      console.error('Error al actualizar preferencias:', err);
    }
  };

  // Enviar verificación de email
  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(user.email);
    } catch (err) {
      console.error('Error al enviar verificación:', err);
    }
  };

  // Mostrar estado de carga
  if (loading && !user) {
    return <LoadingState />;
  }

  // Mostrar estado de error
  if (error && !user) {
    return <ErrorState error={error} onRetry={loadProfileData} />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-deep">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
        </div>

        {/* Grid para layout responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna principal */}
          <div className="space-y-6">
            {/* Encabezado del perfil */}
            <ProfileHeader
              user={user}
              isEditing={isEditing}
              onToggleEdit={handleToggleEdit}
              onSave={handleSaveProfile}
              loading={saving}
              onSendVerification={handleSendVerification}
            />
            
            {/* Formulario de información básica */}
            <BasicInfoForm
              user={user}
              isEditing={isEditing}
              onSave={handleSaveProfile}
            />
          </div>
          
          {/* Columna secundaria */}
          <div className="space-y-6">
            {/* Métricas de uso */}
            <UsageMetrics metrics={metrics} />
            
            {/* Panel de preferencias */}
            <PreferencesPanel
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
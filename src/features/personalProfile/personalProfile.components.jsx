import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import { Loader } from '../../components/Loader';
import {
  UserIcon,
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  HeartIcon,
  BookOpenIcon,
  FireIcon
} from '@heroicons/react/24/outline';

// Schema de validación con Zod
const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  birthDate: z.string().min(1, 'Fecha de nacimiento requerida'),
  gender: z.string().min(1, 'Género requerido')
});

// Componente de encabezado del perfil
export const ProfileHeader = ({ user, isEditing, onToggleEdit, onSave, loading, onSendVerification }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <AvatarUpload 
            src={user?.avatar} 
            name={user?.firstName + ' ' + user?.lastName}
            onUpload={(file) => console.log('Upload avatar:', file)}
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-deep mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
              <EnvelopeIcon className="w-4 h-4" />
              {user?.email}
            </p>
            <VerificationBadge 
              isVerified={user?.emailVerified} 
              onSendVerification={onSendVerification}
            />
          </div>
          
          <EditSaveButton 
            isEditing={isEditing}
            onToggleEdit={onToggleEdit}
            onSave={onSave}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de subida de avatar
export const AvatarUpload = ({ src, name, onUpload }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        await onUpload(file);
      } finally {
        setUploading(false);
      }
    }
  };
  
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };
  
  return (
    <div className="relative group">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-sage to-deep flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Cambiar foto de perfil"
      >
        {uploading ? (
          <Loader size="sm" />
        ) : (
          <CameraIcon className="w-6 h-6 text-white" />
        )}
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="sr-only" aria-live="polite">
        {uploading && 'Subiendo foto de perfil...'}
      </div>
    </div>
  );
};

// Botón de editar/guardar
export const EditSaveButton = ({ isEditing, onToggleEdit, onSave, loading }) => {
  return (
    <div className="flex gap-2">
      {isEditing ? (
        <>
          <Button
            variant="primary"
            onClick={onSave}
            loading={loading}
            className="min-w-[100px]"
          >
            Guardar
          </Button>
          <Button
            variant="secondary"
            onClick={onToggleEdit}
            disabled={loading}
          >
            Cancelar
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          onClick={onToggleEdit}
        >
          Editar
        </Button>
      )}
    </div>
  );
};

// Formulario de información básica
export const BasicInfoForm = ({ user, isEditing, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      gender: user?.gender || ''
    }
  });
  
  const genderOptions = [
    { value: '', label: 'Seleccionar género' },
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' },
    { value: 'prefer-not-to-say', label: 'Prefiero no decir' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Información Personal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <Input
                id="firstName"
                {...register('firstName')}
                disabled={!isEditing}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos *
              </label>
              <Input
                id="lastName"
                {...register('lastName')}
                disabled={!isEditing}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={!isEditing}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                disabled={!isEditing}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento *
              </label>
              <Input
                id="birthDate"
                type="date"
                {...register('birthDate')}
                disabled={!isEditing}
                className={errors.birthDate ? 'border-red-500' : ''}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Género *
              </label>
              <Select
                id="gender"
                {...register('gender')}
                options={genderOptions}
                disabled={!isEditing}
                className={errors.gender ? 'border-red-500' : ''}
              />
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>
          </div>
        </form>
       </CardContent>
     </Card>
   );
 };

// Componente de métricas de uso
export const UsageMetrics = ({ metrics }) => {
  const metricsData = [
    {
      icon: ClockIcon,
      label: 'Sesiones totales',
      value: metrics?.totalSessions || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BookOpenIcon,
      label: 'Horas totales',
      value: `${metrics?.totalHours || 0}h`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: HeartIcon,
      label: 'Terapeutas favoritos',
      value: metrics?.favoriteTherapists || 0,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: FireIcon,
      label: 'Días consecutivos',
      value: metrics?.consecutiveDays || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Uso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricsData.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Tarjeta individual de métrica
export const MetricCard = ({ icon: Icon, label, value, color, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-4 text-center`}>
      <div className={`${color} mb-2 flex justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

// Panel de preferencias
export const PreferencesPanel = ({ preferences, onUpdatePreferences }) => {
  const [isDarkMode, setIsDarkMode] = useState(preferences?.theme === 'dark');
  const [language, setLanguage] = useState(preferences?.language || 'es');

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    onUpdatePreferences({
      ...preferences,
      theme: newTheme ? 'dark' : 'light'
    });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    onUpdatePreferences({
      ...preferences,
      language: newLanguage
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LanguageIcon className="w-5 h-5" />
          Preferencias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeToggle 
          isDarkMode={isDarkMode}
          onToggle={handleThemeToggle}
        />
        
        <LanguageSelect 
          value={language}
          onChange={handleLanguageChange}
        />
      </CardContent>
    </Card>
  );
};

// Toggle de tema
export const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isDarkMode ? (
          <MoonIcon className="w-5 h-5 text-gray-600" />
        ) : (
          <SunIcon className="w-5 h-5 text-yellow-500" />
        )}
        <span className="font-medium">Tema {isDarkMode ? 'Oscuro' : 'Claro'}</span>
      </div>
      
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 ${
          isDarkMode ? 'bg-sage' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={isDarkMode}
        aria-label={`Cambiar a tema ${isDarkMode ? 'claro' : 'oscuro'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// Selector de idioma
export const LanguageSelect = ({ value, onChange }) => {
  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'pt', label: 'Português' }
  ];

  return (
    <div>
      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
        Idioma
      </label>
      <Select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={languageOptions}
        className="w-full"
      />
    </div>
  );
};

// Badge de verificación de email
export const VerificationBadge = ({ isVerified, onSendVerification }) => {
  const [sending, setSending] = useState(false);

  const handleSendVerification = async () => {
    setSending(true);
    try {
      await onSendVerification();
    } finally {
      setSending(false);
    }
  };

  if (isVerified) {
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircleIcon className="w-4 h-4" />
        Email verificado
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="warning" className="flex items-center gap-1">
        <XCircleIcon className="w-4 h-4" />
        Email no verificado
      </Badge>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleSendVerification}
        loading={sending}
        className="text-sm"
      >
        Verificar
      </Button>
    </div>
  );
};

// Componente de estado de error
export const ErrorState = ({ error, onRetry }) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error al cargar el perfil
        </h3>
        <p className="text-gray-600 mb-4">
          {error?.message || 'Ha ocurrido un error inesperado'}
        </p>
        <Button onClick={onRetry} variant="primary">
          Intentar de nuevo
        </Button>
      </CardContent>
    </Card>
  );
};

// Componente de estado de carga
export const LoadingState = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const PasswordForm = ({ onSave }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-deep">Cambiar Contraseña</h3>
        <input 
          type="password" 
          placeholder="Contraseña actual"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
        />
        <input 
          type="password" 
          placeholder="Nueva contraseña"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
        />
        <input 
          type="password" 
          placeholder="Confirmar contraseña"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
        />
        <Button>Cambiar Contraseña</Button>
      </div>
    </Card>
  );
};
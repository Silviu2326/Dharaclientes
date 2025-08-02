// API para gestión del perfil personal

// Datos mock para desarrollo
const mockUser = {
  id: '1',
  firstName: 'María',
  lastName: 'González',
  email: 'maria.gonzalez@email.com',
  phone: '+34 612 345 678',
  birthDate: '1990-05-15',
  gender: 'female',
  avatar: null,
  emailVerified: false,
  createdAt: '2023-01-15T10:00:00Z'
};

const mockMetrics = {
  totalSessions: 24,
  totalHours: 36,
  favoriteTherapists: 3,
  consecutiveDays: 7
};

const mockPreferences = {
  theme: 'light',
  language: 'es',
  notifications: {
    email: true,
    push: true,
    sms: false
  }
};

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener perfil del usuario
export async function getUserProfile() {
  await delay(800);
  
  try {
    // Simular posible error
    if (Math.random() < 0.1) {
      throw new Error('Error de conexión con el servidor');
    }
    
    return {
      success: true,
      data: mockUser
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Actualizar perfil del usuario
export async function updateUserProfile(profileData) {
  await delay(1000);
  
  try {
    // Validar datos requeridos
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      throw new Error('Faltan campos obligatorios');
    }
    
    // Simular validación de email único
    if (profileData.email !== mockUser.email && profileData.email === 'test@test.com') {
      throw new Error('Este email ya está en uso');
    }
    
    // Actualizar datos mock
    Object.assign(mockUser, profileData);
    
    return {
      success: true,
      data: mockUser,
      message: 'Perfil actualizado correctamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Subir foto de perfil
export async function uploadProfilePicture(file) {
  await delay(2000);
  
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no puede superar los 5MB');
    }
    
    // Simular subida y generar URL
    const avatarUrl = URL.createObjectURL(file);
    mockUser.avatar = avatarUrl;
    
    return {
      success: true,
      data: { avatarUrl },
      message: 'Foto de perfil actualizada'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Obtener métricas de uso
export async function getUserMetrics() {
  await delay(600);
  
  try {
    return {
      success: true,
      data: mockMetrics
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Obtener preferencias del usuario
export async function getUserPreferences() {
  await delay(400);
  
  try {
    return {
      success: true,
      data: mockPreferences
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Actualizar preferencias
export async function updateUserPreferences(preferences) {
  await delay(500);
  
  try {
    Object.assign(mockPreferences, preferences);
    
    return {
      success: true,
      data: mockPreferences,
      message: 'Preferencias actualizadas'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Enviar verificación de email
export async function sendEmailVerification() {
  await delay(1500);
  
  try {
    // Simular envío de email
    return {
      success: true,
      message: 'Email de verificación enviado. Revisa tu bandeja de entrada.'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al enviar el email de verificación'
    };
  }
}

// Verificar email con token
export async function verifyEmail(token) {
  await delay(800);
  
  try {
    if (!token || token.length < 10) {
      throw new Error('Token de verificación inválido');
    }
    
    mockUser.emailVerified = true;
    
    return {
      success: true,
      message: 'Email verificado correctamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Cambiar contraseña
export async function changePassword(currentPassword, newPassword) {
  await delay(1000);
  
  try {
    // Validar contraseña actual (mock)
    if (currentPassword !== 'password123') {
      throw new Error('La contraseña actual es incorrecta');
    }
    
    // Validar nueva contraseña
    if (newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }
    
    return {
      success: true,
      message: 'Contraseña cambiada correctamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Eliminar cuenta
export async function deleteAccount(password) {
  await delay(1500);
  
  try {
    // Validar contraseña para eliminar cuenta
    if (password !== 'password123') {
      throw new Error('Contraseña incorrecta');
    }
    
    return {
      success: true,
      message: 'Cuenta eliminada correctamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Exportar datos del usuario
export async function exportUserData() {
  await delay(2000);
  
  try {
    const userData = {
      profile: mockUser,
      metrics: mockMetrics,
      preferences: mockPreferences,
      exportDate: new Date().toISOString()
    };
    
    // Crear y descargar archivo JSON
    const blob = new Blob([JSON.stringify(userData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-usuario-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: 'Datos exportados correctamente'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al exportar los datos'
    };
  }
}
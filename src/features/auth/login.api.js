// TODO: Sustituir por llamada real a la API
export async function loginUser(email, password) {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Implementar validación real
  if (email && password) {
    return {
      token: 'fake-jwt-token-' + Date.now(),
      user: { 
        id: 1, 
        name: 'Cliente Demo', 
        email,
        avatar: null,
        phone: '+1234567890',
        memberSince: '2024-01-01'
      },
    };
  } else {
    throw new Error('Credenciales inválidas');
  }
}

// TODO: Implementar logout real
export async function logoutUser() {
  // TODO: Invalidar token en el servidor
  console.log('Usuario desconectado');
}
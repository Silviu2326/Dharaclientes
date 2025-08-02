// TODO: implementar llamadas a la API para chat

export async function getConversations() {
  // TODO: Obtener lista de conversaciones
  console.log('Obteniendo conversaciones');
  return [];
}

export async function getMessages(conversationId) {
  // TODO: Obtener mensajes de una conversación
  console.log('Obteniendo mensajes de:', conversationId);
  return [];
}

export async function sendMessage(conversationId, message) {
  // TODO: Enviar mensaje
  console.log('Enviando mensaje:', conversationId, message);
}

export async function markAsRead(conversationId) {
  // TODO: Marcar conversación como leída
  console.log('Marcando como leída:', conversationId);
}
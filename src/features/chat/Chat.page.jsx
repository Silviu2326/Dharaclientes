import React, { useState, useEffect } from 'react';
import { ConversationList, ChatWindow } from './chat.components';
import { getConversations, getMessages, sendMessage } from './chat.api';

// Mock data para desarrollo
const mockConversations = [
  {
    id: '1',
    therapist: {
      id: 'therapist-1',
      name: 'Dra. María González',
      specialty: 'Psicología Clínica',
      avatar: null,
      status: 'online',
      lastSeen: new Date().toISOString()
    },
    lastMessage: {
      id: 'msg-1',
      text: 'Hola, ¿cómo te sientes hoy?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      senderId: 'therapist-1'
    },
    unreadCount: 2
  },
  {
    id: '2',
    therapist: {
      id: 'therapist-2',
      name: 'Dr. Carlos Ruiz',
      specialty: 'Terapia Familiar',
      avatar: null,
      status: 'away',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    lastMessage: {
      id: 'msg-2',
      text: 'Perfecto, nos vemos la próxima semana',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'user-1'
    },
    unreadCount: 0
  },
  {
    id: '3',
    therapist: {
      id: 'therapist-3',
      name: 'Dra. Ana López',
      specialty: 'Terapia Cognitivo-Conductual',
      avatar: null,
      status: 'offline',
      lastSeen: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    lastMessage: {
      id: 'msg-3',
      text: 'Te envío algunos ejercicios para practicar',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'therapist-3'
    },
    unreadCount: 0
  }
];

const mockMessages = {
  '1': [
    {
      id: 'msg-1-1',
      text: 'Hola doctora, he estado sintiendo mucha ansiedad últimamente',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read'
    },
    {
      id: 'msg-1-2',
      text: 'Entiendo. ¿Puedes contarme más sobre cuándo comenzaste a sentir esta ansiedad?',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      senderId: 'therapist-1',
      sender: { id: 'therapist-1', name: 'Dra. María González', avatar: null },
      status: 'delivered'
    },
    {
      id: 'msg-1-3',
      text: 'Comenzó hace unas dos semanas, especialmente cuando tengo que hablar en público en el trabajo',
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read'
    },
    {
      id: 'msg-1-4',
      text: 'Es muy común sentir ansiedad en situaciones de exposición social. Vamos a trabajar en algunas técnicas de respiración que pueden ayudarte.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      senderId: 'therapist-1',
      sender: { id: 'therapist-1', name: 'Dra. María González', avatar: null },
      status: 'delivered',
      reactions: [
        {
          userId: 'user-1',
          emoji: '❤️',
          timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'msg-1-5',
      text: 'Te envío un audio con un ejercicio de respiración',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      senderId: 'therapist-1',
      sender: { id: 'therapist-1', name: 'Dra. María González', avatar: null },
      attachment: {
        type: 'audio',
        url: '/audio/breathing-exercise.mp3',
        name: 'Ejercicio de respiración.mp3',
        size: 2048576
      },
      status: 'delivered'
    },
    {
      id: 'msg-1-6',
      text: 'Muchas gracias doctora, lo voy a practicar',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read',
      reactions: [
        {
          userId: 'therapist-1',
          emoji: '👍',
          timestamp: new Date(Date.now() - 34 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'msg-1-7',
      text: 'Hola, ¿cómo te sientes hoy?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      senderId: 'therapist-1',
      sender: { id: 'therapist-1', name: 'Dra. María González', avatar: null },
      status: 'delivered'
    }
  ],
  '2': [
    {
      id: 'msg-2-1',
      text: 'Hola doctor, ¿podemos reprogramar la sesión de mañana?',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read'
    },
    {
      id: 'msg-2-2',
      text: 'Por supuesto, ¿qué día te viene mejor?',
      timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000).toISOString(),
      senderId: 'therapist-2',
      sender: { id: 'therapist-2', name: 'Dr. Carlos Ruiz', avatar: null },
      status: 'delivered'
    },
    {
      id: 'msg-2-3',
      text: '¿Podría ser el viernes a la misma hora?',
      timestamp: new Date(Date.now() - 24.2 * 60 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read'
    },
    {
      id: 'msg-2-4',
      text: 'Perfecto, nos vemos la próxima semana',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read'
    }
  ],
  '3': [
    {
      id: 'msg-3-1',
      text: 'Hola doctora, he estado practicando los ejercicios que me envió',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read'
    },
    {
      id: 'msg-3-2',
      text: 'Excelente, ¿cómo te has sentido con ellos?',
      timestamp: new Date(Date.now() - 3.8 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'therapist-3',
      sender: { id: 'therapist-3', name: 'Dra. Ana López', avatar: null },
      status: 'delivered'
    },
    {
      id: 'msg-3-3',
      text: 'Mucho mejor, me ayudan a controlar los pensamientos negativos',
      timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'user-1',
      sender: { id: 'user-1', name: 'Usuario', avatar: null },
      status: 'read'
    },
    {
      id: 'msg-3-4',
      text: 'Te envío algunos ejercicios para practicar',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'therapist-3',
      sender: { id: 'therapist-3', name: 'Dra. Ana López', avatar: null },
      attachment: {
        type: 'document',
        url: '/documents/ejercicios-tcc.pdf',
        name: 'Ejercicios TCC - Semana 3.pdf',
        size: 1024000
      },
      status: 'delivered'
    }
  ]
};

const currentUserId = 'user-1';

export const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simular carga de conversaciones
    const loadConversations = async () => {
      try {
        setLoading(true);
        // En una app real, esto sería: const data = await getConversations();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
        setConversations(mockConversations);
        
        // Auto-seleccionar la primera conversación en desktop
        if (!isMobile && mockConversations.length > 0) {
          setSelectedConversation(mockConversations[0]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [isMobile]);

  useEffect(() => {
    if (selectedConversation) {
      // Simular carga de mensajes
      const loadMessages = async () => {
        try {
          // En una app real: const data = await getMessages(selectedConversation.id);
          const conversationMessages = mockMessages[selectedConversation.id] || [];
          setMessages(conversationMessages);
          
          // Marcar mensajes como leídos
          if (selectedConversation.unreadCount > 0) {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === selectedConversation.id 
                  ? { ...conv, unreadCount: 0 }
                  : conv
              )
            );
          }
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };

      loadMessages();
    }
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (messageData) => {
    if (!selectedConversation) return;

    try {
      const newMessage = {
        id: `msg-${Date.now()}`,
        text: messageData.text,
        timestamp: new Date().toISOString(),
        senderId: currentUserId,
        sender: { id: currentUserId, name: 'Usuario', avatar: null },
        status: 'sent',
        attachment: messageData.attachments.length > 0 ? {
          type: messageData.attachments[0].type.startsWith('image/') ? 'image' : 'document',
          url: URL.createObjectURL(messageData.attachments[0]),
          name: messageData.attachments[0].name,
          size: messageData.attachments[0].size
        } : null
      };

      // Agregar mensaje a la lista
      setMessages(prev => [...prev, newMessage]);

      // Actualizar última conversación
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: {
                  id: newMessage.id,
                  text: newMessage.text || 'Archivo adjunto',
                  timestamp: newMessage.timestamp,
                  senderId: currentUserId
                }
              }
            : conv
        )
      );

      // Simular respuesta del terapeuta después de un delay
      if (Math.random() > 0.3) { // 70% de probabilidad de respuesta
        setIsTyping(true);
        
        setTimeout(() => {
          const responses = [
            'Entiendo lo que me dices.',
            'Eso es muy interesante, cuéntame más.',
            '¿Cómo te hace sentir eso?',
            'Vamos a trabajar en eso juntos.',
            'Es normal sentirse así en estas situaciones.',
            'Gracias por compartir eso conmigo.'
          ];
          
          const responseMessage = {
            id: `msg-response-${Date.now()}`,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toISOString(),
            senderId: selectedConversation.therapist.id,
            sender: selectedConversation.therapist,
            status: 'delivered'
          };
          
          setMessages(prev => [...prev, responseMessage]);
          setIsTyping(false);
          
          // Actualizar última conversación con la respuesta
          setConversations(prev => 
            prev.map(conv => 
              conv.id === selectedConversation.id 
                ? { 
                    ...conv, 
                    lastMessage: {
                      id: responseMessage.id,
                      text: responseMessage.text,
                      timestamp: responseMessage.timestamp,
                      senderId: selectedConversation.therapist.id
                    },
                    unreadCount: conv.unreadCount + 1
                  }
                : conv
            )
          );
        }, 2000 + Math.random() * 3000); // 2-5 segundos
      }

      // En una app real: await sendMessage(selectedConversation.id, messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const handleLoadMore = () => {
    // En una app real, cargar más mensajes históricos
    console.log('Loading more messages...');
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.userId === currentUserId);
          
          if (existingReaction) {
            // Si ya reaccionó, cambiar la reacción o eliminarla si es la misma
            if (existingReaction.emoji === emoji) {
              return {
                ...msg,
                reactions: reactions.filter(r => r.userId !== currentUserId)
              };
            } else {
              return {
                ...msg,
                reactions: reactions.map(r => 
                  r.userId === currentUserId ? { ...r, emoji } : r
                )
              };
            }
          } else {
            // Nueva reacción
            return {
              ...msg,
              reactions: [...reactions, {
                userId: currentUserId,
                emoji,
                timestamp: new Date().toISOString()
              }]
            };
          }
        }
        return msg;
      })
    );
  };

  const handleForward = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.attachment) {
      // Simular reenvío de archivo
      const forwardedMessage = {
        id: `msg-forward-${Date.now()}`,
        text: `📎 Archivo reenviado: ${message.attachment.name}`,
        timestamp: new Date().toISOString(),
        senderId: currentUserId,
        sender: { id: currentUserId, name: 'Usuario', avatar: null },
        status: 'sent',
        attachment: message.attachment,
        isForwarded: true
      };
      
      setMessages(prev => [...prev, forwardedMessage]);
      
      // Actualizar última conversación
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: {
                  id: forwardedMessage.id,
                  text: forwardedMessage.text,
                  timestamp: forwardedMessage.timestamp,
                  senderId: currentUserId
                }
              }
            : conv
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
      </div>
    );
  }

  // Vista móvil: mostrar solo conversaciones o solo chat
  if (isMobile) {
    if (selectedConversation) {
      return (
        <div className="h-[calc(100vh-4rem)]">
          <ChatWindow
            therapist={selectedConversation.therapist}
            messages={messages}
            currentUserId={currentUserId}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            onLoadMore={handleLoadMore}
            onReaction={handleReaction}
            onForward={handleForward}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-deep mb-2">Chat</h1>
          <p className="text-gray-600">
            Selecciona una conversación para comenzar
          </p>
        </div>
        
        <div className="h-[calc(100vh-12rem)]">
          <ConversationList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>
      </div>
    );
  }

  // Vista desktop: layout de dos columnas
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-deep mb-2">Chat</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comunícate directamente con tu terapeuta a través de nuestro sistema de mensajería seguro.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-1">
          <ConversationList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>
        
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <ChatWindow
              therapist={selectedConversation.therapist}
              messages={messages}
              currentUserId={currentUserId}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              onLoadMore={handleLoadMore}
              onReaction={handleReaction}
              onForward={handleForward}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
                <p className="text-sm">Elige una conversación de la lista para comenzar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
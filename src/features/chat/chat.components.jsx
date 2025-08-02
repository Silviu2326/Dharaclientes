import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, X, Download, Play, Pause, MoreVertical, Check, CheckCheck, Circle } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { format, isToday, isYesterday, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

// Encabezado del chat
export const ChatHeader = ({ therapist, onBack }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status, lastSeen) => {
    switch (status) {
      case 'online': return 'En línea';
      case 'away': return 'Ausente';
      case 'offline': 
        if (lastSeen) {
          const lastSeenDate = new Date(lastSeen);
          if (isToday(lastSeenDate)) {
            return `Últ. vez hoy ${format(lastSeenDate, 'HH:mm')}`;
          } else if (isYesterday(lastSeenDate)) {
            return `Últ. vez ayer ${format(lastSeenDate, 'HH:mm')}`;
          } else {
            return `Últ. vez ${format(lastSeenDate, 'dd/MM/yyyy')}`;
          }
        }
        return 'Desconectado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
      <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {therapist.avatar ? (
              <img 
                src={therapist.avatar} 
                alt={therapist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {therapist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(therapist.status)}`}>
            <Circle className="w-full h-full fill-current" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-deep truncate">{therapist.name}</h2>
          <p className="text-sm text-gray-600 truncate">
            {therapist.specialty} • {getStatusText(therapist.status, therapist.lastSeen)}
          </p>
        </div>
      </div>
      
      <Button variant="ghost" size="sm">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

// Burbuja de mensaje individual
export const MessageBubble = ({ message, isOwn, showAvatar = true, showTime = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderAttachment = (attachment) => {
    const { type, url, name, size } = attachment;
    
    switch (type) {
      case 'image':
        return (
          <div className="mt-2 max-w-xs">
            <img 
              src={url} 
              alt={name}
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(url, '_blank')}
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="mt-2 flex items-center gap-2 p-3 bg-gray-50 rounded-lg max-w-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAudioPlay}
              className="p-1"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
            </div>
            <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} />
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-2 max-w-xs">
            <video 
              controls 
              className="rounded-lg max-w-full h-auto"
              preload="metadata"
            >
              <source src={url} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        );
      
      default:
        return (
          <div className="mt-2 flex items-center gap-2 p-3 bg-gray-50 rounded-lg max-w-xs cursor-pointer hover:bg-gray-100 transition-colors"
               onClick={() => window.open(url, '_blank')}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
            </div>
            <Download className="h-4 w-4 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <div className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && showAvatar && (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {message.sender.avatar ? (
            <img 
              src={message.sender.avatar} 
              alt={message.sender.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-xs font-medium text-gray-600">
              {message.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          )}
        </div>
      )}
      
      {!isOwn && !showAvatar && <div className="w-8" />}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : ''}`}>
        <div className={`px-4 py-2 rounded-2xl ${
          isOwn 
            ? 'bg-sage text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          {message.text && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          )}
          
          {message.attachment && renderAttachment(message.attachment)}
        </div>
        
        {showTime && (
          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwn && (
              <div className="flex items-center">
                {message.status === 'sent' && <Check className="h-3 w-3" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                {message.status === 'read' && <CheckCheck className="h-3 w-3 text-sage" />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Separador de fecha
export const DateSeparator = ({ date }) => {
  const formatDate = (date) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return 'Hoy';
    } else if (isYesterday(messageDate)) {
      return 'Ayer';
    } else {
      return format(messageDate, 'EEEE, d MMMM yyyy', { locale: es });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-100 px-3 py-1 rounded-full">
        <span className="text-xs text-gray-600 font-medium">{formatDate(date)}</span>
      </div>
    </div>
  );
};

// Indicador de escritura
export const TypingIndicator = ({ therapistName }) => {
  return (
    <div className="flex gap-2 justify-start mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-medium text-gray-600">...</span>
      </div>
      
      <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md max-w-xs">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">{therapistName} está escribiendo</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lista de mensajes
export const MessageList = ({ messages, currentUserId, therapist, isTyping, onLoadMore }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, isTyping, shouldAutoScroll]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setShouldAutoScroll(isAtBottom);
      
      // Load more messages when scrolling to top
      if (scrollTop === 0 && onLoadMore) {
        onLoadMore();
      }
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message, index) => {
      const messageDate = format(new Date(message.timestamp), 'yyyy-MM-dd');
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }
    
    return groups;
  };

  const shouldShowAvatar = (message, index, groupMessages) => {
    if (message.senderId === currentUserId) return false;
    if (index === groupMessages.length - 1) return true;
    
    const nextMessage = groupMessages[index + 1];
    return nextMessage.senderId !== message.senderId;
  };

  const shouldShowTime = (message, index, groupMessages) => {
    if (index === groupMessages.length - 1) return true;
    
    const nextMessage = groupMessages[index + 1];
    const timeDiff = differenceInMinutes(new Date(nextMessage.timestamp), new Date(message.timestamp));
    
    return timeDiff > 5 || nextMessage.senderId !== message.senderId;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-1"
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-label="Mensajes del chat"
    >
      {messageGroups.map((group, groupIndex) => (
        <div key={group.date}>
          <DateSeparator date={group.date} />
          
          {group.messages.map((message, messageIndex) => {
            const isOwn = message.senderId === currentUserId;
            const showAvatar = shouldShowAvatar(message, messageIndex, group.messages);
            const showTime = shouldShowTime(message, messageIndex, group.messages);
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showTime={showTime}
              />
            );
          })}
        </div>
      ))}
      
      {isTyping && <TypingIndicator therapistName={therapist.name} />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

// Vista previa de adjuntos
export const AttachmentPreview = ({ file, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const fileType = getFileType(file);
  const fileUrl = URL.createObjectURL(file);

  return (
    <div className="relative inline-block mr-2 mb-2">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 max-w-xs">
        {fileType === 'image' && (
          <img 
            src={fileUrl} 
            alt={file.name}
            className="w-20 h-20 object-cover rounded"
          />
        )}
        
        {fileType === 'video' && (
          <video 
            src={fileUrl} 
            className="w-20 h-20 object-cover rounded"
            muted
          />
        )}
        
        {(fileType === 'audio' || fileType === 'document') && (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
            <span className="text-xs font-medium text-gray-600 text-center">
              {fileType === 'audio' ? '🎵' : '📄'}
            </span>
          </div>
        )}
        
        <div className="mt-1">
          <p className="text-xs font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(file)}
        className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Entrada de mensaje
export const MessageInput = ({ onSend, disabled = false, placeholder = "Escribe un mensaje..." }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const maxLength = 1000;
  const maxFileSize = 25 * 1024 * 1024; // 25MB

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSend({
        text: message.trim(),
        attachments: attachments
      });
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        alert(`El archivo ${file.name} es demasiado grande. Máximo 25MB.`);
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (fileToRemove) => {
    setAttachments(prev => prev.filter(file => file !== fileToRemove));
  };

  const canSend = (message.trim() || attachments.length > 0) && !disabled;

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Vista previa de adjuntos */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap">
          {attachments.map((file, index) => (
            <AttachmentPreview
              key={index}
              file={file}
              onRemove={removeAttachment}
            />
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        {/* Botón de adjuntos */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 flex-shrink-0"
          aria-label="Adjuntar archivo"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {/* Área de texto */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            style={{ minHeight: '40px', maxHeight: '120px' }}
            aria-label="Mensaje"
          />
          
          {/* Contador de caracteres */}
          <div className="absolute bottom-1 right-2 text-xs text-gray-400">
            {message.length}/{maxLength}
          </div>
        </div>
        
        {/* Botón enviar */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          className="p-2 flex-shrink-0"
          aria-label="Enviar mensaje"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Ayuda de teclado */}
      <div className="mt-2 text-xs text-gray-500">
        Presiona Enter para enviar, Shift+Enter para nueva línea
      </div>
    </div>
  );
};

// Ventana de chat completa
export const ChatWindow = ({ therapist, messages, currentUserId, isTyping, onSendMessage, onBack, onLoadMore }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader therapist={therapist} onBack={onBack} />
      
      <MessageList 
        messages={messages}
        currentUserId={currentUserId}
        therapist={therapist}
        isTyping={isTyping}
        onLoadMore={onLoadMore}
      />
      
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

// Lista de conversaciones
export const ConversationList = ({ conversations, onSelectConversation, selectedConversationId }) => {
  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Ayer';
    } else {
      return format(date, 'dd/MM');
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-deep">Conversaciones</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              selectedConversationId === conversation.id ? 'bg-sage/10 border-r-2 border-sage' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {conversation.therapist.avatar ? (
                    <img 
                      src={conversation.therapist.avatar} 
                      alt={conversation.therapist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {conversation.therapist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
                
                {conversation.therapist.status === 'online' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-deep truncate">{conversation.therapist.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatLastMessageTime(conversation.lastMessage.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.text || 'Archivo adjunto'}
                  </p>
                  
                  {conversation.unreadCount > 0 && (
                    <span className="bg-sage text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center flex-shrink-0">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {conversations.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No hay conversaciones activas</p>
          <p className="text-sm mt-1">Las conversaciones aparecerán aquí cuando inicies un chat</p>
        </div>
      )}
    </div>
  );
};
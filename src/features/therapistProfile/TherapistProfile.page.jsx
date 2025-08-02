import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, Phone, Mail, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

// Datos simulados de terapeutas (mismos que en ExploreTherapists)
const mockTherapists = [
  {
    id: 1,
    name: 'Luna Cristales',
    credentials: 'Maestra Reiki Nivel III, Certificada en Sanación Energética',
    specialties: ['Reiki', 'Sanación con Cristales', 'Limpieza Energética'],
    price: 45,
    rating: 4.8,
    reviewCount: 127,
    location: 'Madrid Centro',
    distance: 2.3,
    nextAvailable: 'Hoy 16:00',
    modality: ['presencial', 'online'],
    avatar: null,
    description: 'Maestra de Reiki con más de 10 años de experiencia en sanación energética y trabajo con cristales. Especializada en limpieza de chakras y equilibrio energético para promover el bienestar integral.',
    experience: '10+ años',
    education: ['Certificación Reiki Nivel I, II y III - Centro Holístico Madrid', 'Curso de Cristaloterapia - Instituto de Gemas y Minerales', 'Formación en Sanación Energética - Escuela de Terapias Alternativas'],
    languages: ['Español', 'Inglés'],
    phone: '+34 600 123 456',
    email: 'luna.cristales@email.com',
    address: 'Calle Gran Vía, 28, Madrid Centro',
    schedule: {
      'Lunes': '10:00 - 19:00',
      'Martes': '10:00 - 19:00',
      'Miércoles': '10:00 - 19:00',
      'Jueves': '10:00 - 19:00',
      'Viernes': '10:00 - 16:00',
      'Sábado': '11:00 - 15:00',
      'Domingo': 'Cerrado'
    }
  },
  {
    id: 2,
    name: 'Sage Aromático',
    credentials: 'Aromaterapeuta Certificado, Especialista en Aceites Esenciales',
    specialties: ['Aromaterapia', 'Aceites Esenciales', 'Relajación Aromática'],
    price: 40,
    rating: 4.9,
    reviewCount: 89,
    location: 'Salamanca',
    distance: 4.1,
    nextAvailable: 'Mañana 10:00',
    modality: ['presencial'],
    avatar: null,
    description: 'Aromaterapeuta especializado en el uso terapéutico de aceites esenciales puros. Combino técnicas ancestrales con conocimientos modernos para crear experiencias de sanación únicas y personalizadas.',
    experience: '8 años',
    education: ['Certificación en Aromaterapia Clínica - Instituto Francés de Aromaterapia', 'Curso de Aceites Esenciales Terapéuticos - Escuela de Naturopatía'],
    languages: ['Español', 'Francés'],
    phone: '+34 600 234 567',
    email: 'sage.aromatico@email.com',
    address: 'Calle Serrano, 45, Salamanca',
    schedule: {
      'Lunes': '09:00 - 18:00',
      'Martes': '09:00 - 18:00',
      'Miércoles': '09:00 - 18:00',
      'Jueves': '09:00 - 18:00',
      'Viernes': '09:00 - 15:00',
      'Sábado': '10:00 - 14:00',
      'Domingo': 'Cerrado'
    }
  }
  // Agregar más terapeutas según sea necesario
];

export const TherapistProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Buscar el terapeuta por ID
  const therapist = useMemo(() => {
    return mockTherapists.find(t => t.id === parseInt(id));
  }, [id]);

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Terapeuta no encontrado</h1>
          <Button onClick={() => navigate('/explore-therapists')}>Volver a la búsqueda</Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Información General' },
    { id: 'schedule', label: 'Horarios' },
    { id: 'reviews', label: 'Reseñas' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/explore-therapists')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-2 ${isFavorite ? 'text-red-600 border-red-200' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Guardado' : 'Guardar'}
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartir
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Foto y información básica */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border">
                    {therapist.avatar ? (
                      <img 
                        src={therapist.avatar} 
                        alt={`Foto de perfil de ${therapist.name}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-600 text-4xl font-semibold">
                        {therapist.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {therapist.name}
                  </h1>
                  <p className="text-lg text-gray-700 mb-3">{therapist.credentials}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center">
                      {renderStars(therapist.rating)}
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      {therapist.rating}
                    </span>
                    <span className="text-gray-600">
                      ({therapist.reviewCount} reseñas)
                    </span>
                  </div>
                  
                  {/* Especialidades */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {therapist.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-sage/10 text-sage text-sm px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  {/* Modalidad */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {therapist.modality.map((mod, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200"
                      >
                        {mod === 'presencial' ? 'Presencial' : 'Online'}
                      </span>
                    ))}
                  </div>
                  
                  {/* Ubicación y disponibilidad */}
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{therapist.location} • {therapist.distance} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Próxima cita: {therapist.nextAvailable}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Precio y botón de reserva */}
              <div className="lg:w-80">
                <Card className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-sage mb-2">
                      €{therapist.price}
                    </div>
                    <div className="text-gray-600">por sesión</div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <Calendar className="h-5 w-5 mr-2" />
                      Reservar Cita
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="h-5 w-5 mr-2" />
                      Llamar
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-5 w-5 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-sage text-sage'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de tabs */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Descripción */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sobre mí</h3>
                <p className="text-gray-700 leading-relaxed">
                  {therapist.description}
                </p>
              </Card>
              
              {/* Formación */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Formación</h3>
                <ul className="space-y-2">
                  {therapist.education?.map((edu, index) => (
                    <li key={index} className="text-gray-700">
                      • {edu}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Información de contacto */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Información de contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{therapist.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{therapist.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-700">{therapist.address}</span>
                  </div>
                </div>
              </Card>
              
              {/* Detalles adicionales */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Detalles</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-900">Experiencia:</span>
                    <span className="text-gray-700 ml-2">{therapist.experience}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Idiomas:</span>
                    <span className="text-gray-700 ml-2">{therapist.languages?.join(', ')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'schedule' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Horarios de atención</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(therapist.schedule || {}).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">{day}</span>
                  <span className="text-gray-700">{hours}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {selectedTab === 'reviews' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Reseñas de pacientes</h3>
            <div className="text-center py-12">
              <p className="text-gray-600">Las reseñas se mostrarán aquí una vez implementadas.</p>
              <p className="text-sm text-gray-500 mt-2">
                Actualmente: {therapist.reviewCount} reseñas con valoración promedio de {therapist.rating}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
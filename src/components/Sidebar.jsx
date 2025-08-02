import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  User, 
  Calendar, 
  MessageCircle, 
  Heart, 
  FileText, 
  Star, 
  CreditCard, 
  Bell, 
  Settings, 
  HelpCircle, 
  Shield 
} from 'lucide-react';

const navigationItems = [
  { path: '/explore-therapists', label: 'Explorar Terapeutas', icon: Search },
  { path: '/my-appointments', label: 'Mis Citas', icon: Calendar },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/favorites', label: 'Favoritos', icon: Heart },
  { path: '/journal-documents', label: 'Documentos', icon: FileText },
  { path: '/reviews', label: 'Reseñas', icon: Star },
  { path: '/payment-history', label: 'Historial de Pagos', icon: CreditCard },
  { path: '/notifications', label: 'Notificaciones', icon: Bell },
];

const profileItems = [
  { path: '/profile', label: 'Mi Perfil', icon: User },
  { path: '/settings', label: 'Configuración', icon: Settings },
  { path: '/help', label: 'Centro de Ayuda', icon: HelpCircle },
  { path: '/privacy', label: 'Privacidad', icon: Shield },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sage text-white'
                      : 'text-gray-700 hover:bg-sage/10 hover:text-sage'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Perfil
            </p>
            {profileItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-sage text-white'
                        : 'text-gray-700 hover:bg-sage/10 hover:text-sage'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
};
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth.jsx';
// import { useNotifications } from '../hooks/useNotifications';
import { Button } from './Button';

export const Navbar = () => {
  // const { user, logout } = useAuth();
  const user = { name: 'Usuario' };
  const logout = () => {};
  // const { unreadCount } = useNotifications();
  const unreadCount = 0;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-deep">Dhara</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar terapeutas..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-sage" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
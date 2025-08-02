# Dhara Dimensión Humana - Cliente Frontend

Aplicación web frontend para la plataforma de bienestar Dhara Dimensión Humana, desarrollada con React 18, Vite y Tailwind CSS.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS utility-first
- **React Router DOM v6** - Enrutamiento
- **TanStack Query** - Gestión de estado del servidor
- **Lucide React** - Iconos

## 🛠️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd dhara-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus valores:
   ```
   VITE_API_URL=https://api.dhara.local
   VITE_JWT_SECRET=tu-jwt-secret
   VITE_APP_NAME=Dhara Dimensión Humana
   VITE_APP_VERSION=1.0.0
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
client/
├─ src/
│  ├─ components/           # Componentes globales reutilizables
│  ├─ features/            # Páginas organizadas por funcionalidad
│  ├─ app/                 # Configuración de router y store
│  ├─ hooks/               # Hooks personalizados
│  ├─ layouts/             # Layouts de la aplicación
│  └─ styles/              # Estilos globales
├─ public/                 # Archivos estáticos
└─ ...archivos de config
```

## 🎨 Paleta de Colores

- **Verde Salvia** (`sage`): `#819983` - Color principal
- **Arena Cálida** (`sand`): `#fef7ef` - Fondo suave
- **Azul Profundo** (`deep`): `#273b51` - Texto y elementos oscuros

## 🔐 Autenticación

Para el desarrollo se incluye un sistema de autenticación falso:

- **Email:** cualquier email válido
- **Contraseña:** cualquier contraseña
- **Token:** Se genera automáticamente para desarrollo

## 📱 Páginas Disponibles

- **Explorar Terapeutas** - Búsqueda y filtrado de profesionales
- **Perfil de Terapeuta** - Información detallada y reservas
- **Mis Citas** - Gestión de citas programadas
- **Chat** - Comunicación con terapeutas
- **Favoritos** - Terapeutas marcados como favoritos
- **Mi Perfil** - Información personal del usuario
- **Configuración** - Ajustes de cuenta y preferencias
- **Centro de Ayuda** - FAQs y soporte
- **Y más...**

## 🧩 Características

- ✅ Autenticación con JWT
- ✅ Rutas protegidas
- ✅ Responsive design
- ✅ Gestión de estado con TanStack Query
- ✅ Componentes reutilizables
- ✅ Arquitectura modular por features
- ✅ Error boundaries
- ✅ Loading states
- ✅ Notificaciones en tiempo real (preparado)

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

## 🚧 Estado del Proyecto

Este es un **MVP (Producto Mínimo Viable)** con:

- ✅ Estructura completa de archivos
- ✅ Componentes base implementados
- ✅ Sistema de routing funcional
- ✅ Autenticación de desarrollo
- ⏳ APIs stub preparadas para implementación
- ⏳ Componentes de features listos para desarrollo

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte y preguntas:
- Email: soporte@dhara.com
- Documentación: [docs.dhara.com](https://docs.dhara.com)

---

Desarrollado con ❤️ para Dhara Dimensión Humana
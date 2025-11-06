# osp-web

## Open Source Panopticon (OSP) - Truth Verification Platform

OSP is a production-ready truth verification platform that enables users to capture and share verifiable media evidence. By combining timestamped, geotagged media with a dynamic trust scoring system, OSP creates an immutable archive of real-world events for journalistic, civic, and accountability purposes.

---

## 🌐 Web Platform Overview

The OSP web interface provides public access to verified media content, enabling exploration, commentary, and accountability with a modern, professional UI.

### Key Features
- **Public Content Viewing**: Browse media submissions without authentication
- **Interactive Map Experience**:
  - Real-time map with Leaflet.js + OpenStreetMap
  - Marker clustering for better performance
  - Hover preview for quick media viewing
  - Coordinate-based navigation
  - Dynamic radius search based on zoom level
- **Advanced Filtering**:
  - Date/time range selectors with modern UI
  - Geographic region filtering
  - Real-time search updates
- **Media Viewer**:
  - Full-screen modal with image/video support
  - Navigation through clustered items
  - Detailed metadata display (location, orientation, trust score)
- **User Actions (Authenticated)**:
  - View own uploaded content
  - Comment on public media
  - Delete personal content
- **Account Management**:
  - Sign in via Apple/Google OAuth
  - Sign out
  - Delete account (creation only allowed on mobile)

### Technical Implementation
- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 5.3+ (fast HMR, optimized builds)
- **Interactive Map**: [Leaflet.js](https://leafletjs.com/) 1.9+ with OSM tiles
- **Map Clustering**: leaflet.markercluster for performance
- **Routing**: Vue Router 4.4+
- **Styling**: Modern CSS with design system
  - CSS custom properties for theming
  - Glassmorphism effects
  - Smooth animations and transitions
  - Responsive breakpoints
- **Authentication**: JWT tokens (access + refresh) from FastAPI backend
- **API Client**: Custom client with automatic token refresh
- **Video Support**: Native HTML5 video player with controls

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- FastAPI backend running locally (`osp-backend`)
- Mobile app for account creation (iOS/Android)

### Local Development Setup

1. **Start the Backend Server**
   ```bash
   cd ../osp-backend
   poetry install
   alembic upgrade head
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

2. **Install Dependencies & Run Dev Server**
   ```bash
   cd osp-web
   npm install
   npm run dev
   ```

3. **Access the Platform**
   Open http://localhost:5173 in your browser (Vite default port)

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

Production files are generated in the `dist/` directory.

---

## 🔧 Web Architecture

```
osp-web/
├── public/                      # Static assets
│   └── favicon.ico
├── src/
│   ├── main.js                  # Vue app entry point
│   ├── App.vue                  # Root component with routing
│   ├── index.css                # Global styles & design system
│   ├── router/
│   │   └── index.js             # Vue Router configuration
│   ├── pages/
│   │   ├── HomePage.vue         # Map view with filters
│   │   ├── SignInPage.vue       # OAuth authentication
│   │   ├── AccountSettingsPage.vue
│   │   └── MediaDetailPage.vue
│   ├── components/
│   │   ├── LoadingSpinner.vue
│   │   └── auth/
│   │       └── SignInButton.vue
│   ├── services/
│   │   └── apiClient.js         # API client with token refresh
│   └── assets/
│       └── icons/               # SVG icons
├── index.html                   # Vite entry point
├── vite.config.ts               # Vite configuration
└── package.json                 # Dependencies & scripts
```

### Core Functionality

#### `HomePage.vue` (Main Interface)
- Leaflet map with marker clustering
- Real-time coordinate search
- Date/time range filtering
- Hover preview on marker hover
- Full-screen media modal with navigation
- Grid view (alternative to map)
- Responsive design for mobile/desktop

#### `apiClient.js`
- Centralized API communication
- Automatic JWT token refresh
- Error handling and retry logic
- Request/response interceptors

#### `router/index.js`
- Client-side routing with Vue Router
- Route guards for authentication
- Lazy-loaded page components
- Fullscreen layout for map view

### Design System

The application uses a comprehensive design system defined in `src/index.css`:

**Color Palette:**
- Primary: Modern blue (`#2563eb`)
- Grays: 50-900 scale for hierarchy
- Semantic colors: success, danger, warning, info

**Typography:**
- Font scale: xs to 4xl
- Weight system: 400-700
- Letter spacing: tight, normal, wide
- Line heights: tight, normal, relaxed

**Effects:**
- Glassmorphism with backdrop blur
- Layered shadows (xs to xl)
- Smooth cubic-bezier transitions
- Modern border radius (6-24px)

**Components:**
- Custom Leaflet map controls
- Animated modals and overlays
- Hover states and micro-interactions
- Focus rings for accessibility

---

## 🔍 Search & Filter Capabilities

Users can explore media through:
- **Interactive Map**:
  - Pan and zoom to region of interest
  - Marker clustering for large datasets
  - Click markers to open full-screen modal
  - Hover over markers for quick preview
  - Coordinate-based navigation (Lat, Lng input)
  - Dynamic search radius based on zoom level
- **Advanced Date/Time Filters**:
  - Modern filter panel with glassmorphism
  - Select start/end date and time ranges
  - Filter media by capture time (UTC)
  - Clear and apply buttons for better UX
- **Combined Queries**:
  - Search within geographic bounds AND time windows
  - Results update dynamically on map movement
  - Real-time filtering without page reload
- **Media Modal**:
  - Full-screen image/video viewer
  - Navigate between clustered items
  - View detailed metadata (location, orientation, trust score)
  - Smooth animations and transitions

---

## 🔐 Authentication Flow

Web uses same credentials as mobile apps with modern OAuth integration:

1. **Sign In Process**:
   - Click "Sign In" → Modern sign-in page
   - Choose Apple or Google OAuth provider
   - Popup-based authentication flow

2. **After Successful Authentication**:
   - Backend validates ID token
   - Issues JWT access token and refresh token
   - Client stores tokens in localStorage
   - Automatic redirect to home page

3. **Token Management**:
   - API client automatically includes `Authorization: Bearer <token>`
   - Refresh token used to get new access token when expired
   - Automatic token refresh on 401 responses
   - Logout clears all tokens

4. **Security Features**:
   - HttpOnly cookie support (optional)
   - Token expiration handling
   - Automatic cleanup on logout

> **Note**: Account creation is only possible through mobile apps. Web supports sign-in, sign-out, and account deletion.

---

## 🧪 Testing & Verification

### Manual Verification Steps
1. Start backend server (`uvicorn app.main:app --port 8000`)
2. Start dev server (`npm run dev`)
3. Open `http://localhost:5173`
4. Verify:
   - [ ] Map loads with custom styled controls
   - [ ] Sample media appears with clustering
   - [ ] Hover over markers shows preview
   - [ ] Click markers opens full-screen modal
   - [ ] Coordinate search works (e.g., "40.7128, -74.0060")
   - [ ] Filter panel opens with modern UI
   - [ ] Date/time filters work correctly
   - [ ] Sign-in page has OAuth buttons
   - [ ] Responsive design works on mobile/tablet/desktop
   - [ ] Animations and transitions are smooth
   - [ ] Video playback works in modal

### Unit Testing
```bash
npm run test:unit  # Run Vitest unit tests
```

Currently uses Vitest for component testing.

### Build Testing
```bash
npm run build      # Build for production
npm run preview    # Test production build locally
```

---

## 🔄 Integration with Backend

### API Endpoints Used
| Endpoint | Method | Description | Auth Required |
|--------|--------|-------------|---------------|
| `/media` | GET | List media with filters (lat, lng, radius, date range) | No |
| `/media/{id}` | GET | Get single media item | No |
| `/media/{id}` | DELETE | Delete own media | Yes |
| `/media/{id}/comments` | GET | Get media comments | No |
| `/media/{id}/comments` | POST | Add comment | Yes |
| `/auth/signin` | POST | OAuth sign-in (Apple/Google) | No |
| `/auth/refresh` | POST | Refresh access token | Yes (refresh token) |
| `/users/me` | GET | Get current user info | Yes |
| `/users/me` | DELETE | Delete account | Yes |

### API Client Features
- Automatic token refresh on 401 responses
- Request/response interceptors
- Error handling with user-friendly messages
- Base URL configuration via environment variables
- CORS handling with `ngrok-skip-browser-warning` header

---

## 🛠️ Development Notes

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173
VITE_APPLE_CLIENT_ID=your-apple-client-id
VITE_APPLE_REDIRECT_URI=http://localhost:5173
```

### Development Features
- **Hot Module Replacement (HMR)**: Instant updates during development
- **Source Maps**: Full debugging support in browser DevTools
- **Vue DevTools**: Browser extension support for component inspection
- **Fast Refresh**: Preserves component state during edits

### Production Optimizations
- Code splitting and lazy loading
- Tree shaking for smaller bundle sizes
- CSS minification and optimization
- Asset optimization (images, fonts)
- Gzip/Brotli compression ready

### Modern UI Features
- **Glassmorphism**: Backdrop blur effects throughout
- **Smooth Animations**: 60fps CSS animations with cubic-bezier easing
- **Micro-interactions**: Hover, focus, and active states on all interactive elements
- **Custom Map Styling**: Branded Leaflet controls and markers
- **Responsive Design**: Mobile-first approach with fluid layouts

### Future Enhancements
- [ ] Add PWA support for offline viewing
- [ ] Integrate analytics dashboard
- [ ] Add dark mode toggle
- [ ] Implement virtual scrolling for large datasets
- [ ] Add comprehensive E2E testing with Playwright
- [ ] Implement WebSocket for real-time updates
- [ ] Add accessibility (WCAG 2.1 AA compliance)
- [ ] Implement i18n for multiple languages

---

## 🎨 Design System

The application uses a comprehensive, modern design system with CSS custom properties for easy theming.

### Color Palette
```css
/* Primary Colors */
--color-primary: #2563eb        /* Modern blue */
--color-primary-hover: #1d4ed8
--color-accent: #8b5cf6         /* Purple accent */

/* Semantic Colors */
--color-success: #10b981
--color-danger: #ef4444
--color-warning: #f59e0b

/* Gray Scale (50-900) */
--color-gray-50: #f9fafb   /* Backgrounds */
--color-gray-600: #4b5563  /* Body text */
--color-gray-900: #111827  /* Headings */
```

### Typography Scale
- **xs**: 0.75rem (12px) - Small labels
- **sm**: 0.875rem (14px) - Secondary text
- **base**: 1rem (16px) - Body text
- **lg**: 1.125rem (18px) - Subheadings
- **xl**: 1.25rem (20px) - Small headings
- **2xl**: 1.5rem (24px) - Medium headings
- **3xl**: 1.875rem (30px) - Large headings
- **4xl**: 2.25rem (36px) - Hero text

### Spacing System
Based on 4px grid: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), xxl (48px)

### Shadow Hierarchy
- **xs**: Subtle elevation for cards
- **sm**: Small lift for buttons
- **md**: Default cards and panels
- **lg**: Modals and overlays
- **xl**: High-priority modals

### Border Radius
- **sm**: 6px - Buttons, inputs
- **md**: 12px - Cards, panels
- **lg**: 16px - Large containers
- **xl**: 24px - Modals

### Component Styling Patterns
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur
- **Elevation**: Layered shadows for depth hierarchy
- **Transitions**: Smooth 200-300ms cubic-bezier animations
- **Focus States**: Blue ring with shadow for accessibility
- **Hover Effects**: Subtle lift and color changes

---

## 📄 License
MIT License - see LICENSE file in root directory

---

## 🙌 Contributing
Please open issues and pull requests in the main repository. Coordinate with backend and mobile teams when modifying shared interfaces.

> This project is part of the larger OSP monorepo:
> - `osp-backend`: FastAPI service
> - `osp-web`: This web frontend
> - `osp-android`: Android client
> - `osp-ios`: iOS client

---

## 💬 Contact
For questions or collaboration, please open a discussion in the project repository.

---

*OSP: Empowering truth through verifiable citizen media*

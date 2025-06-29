# React Frontend

This is the frontend application built with React, TypeScript, and Mantine UI, providing a modern user interface for the Spring Boot backend.

## Features

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Mantine UI** - Modern React components library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **Vite** - Fast build tool and dev server

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend running on http://localhost:8081
- Keycloak running on http://localhost:8080

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will start at http://localhost:3000

## Port Configuration

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081 (proxied via /api)
- **Keycloak**: http://localhost:8080

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

### Proxy Configuration
API calls are proxied to the backend in `vite.config.ts`:

\`\`\`typescript
server: {
  port: 3000,
  proxy: {
    "/api": "http://localhost:8081",
    "/oauth2": "http://localhost:8081"
  }
}
\`\`\`

### Environment Variables
Create a `.env` file for environment-specific settings:

\`\`\`env
VITE_API_URL=http://localhost:8081
\`\`\`

## Authentication Flow

1. **Login**: User clicks login → Redirects to Keycloak (port 8080)
2. **Authentication**: Keycloak handles authentication
3. **Redirect**: After success, redirects to dashboard
4. **API Calls**: Frontend makes calls to backend (port 8081)
5. **Token Management**: Automatic token handling via cookies
6. **Role-based UI**: Components render based on user roles
7. **Logout**: Clears session and redirects to home

## API Integration

The frontend communicates with the Spring Boot backend through:

- REST API calls via Axios to http://localhost:8081
- Automatic credential handling (cookies)
- Error handling and retry logic
- Response caching with TanStack Query

### API Service Structure

\`\`\`typescript
// services/api.ts
export const api = {
  // Public endpoints
  health: () => Promise<HealthResponse>
  
  // Auth endpoints
  getCurrentUser: () => Promise<UserInfo>
  logout: () => Promise<LogoutResponse>
  
  // Tutorial endpoints
  getTutorials: () => Promise<Tutorial[]>
  createTutorial: (tutorial) => Promise<Tutorial>
  // ... more endpoints
  
  // Admin endpoints (require ADMIN role)
  getUsersByRole: (role) => Promise<UsersByRoleResponse>
  getRolesSummary: () => Promise<RolesSummary>
}
\`\`\`

## Default Test User

Use this user for testing:
- **Username**: testuser
- **Password**: testuser
- **Roles**: USER, ADMIN (configured in Keycloak)

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend is running on port 8081
   - Verify proxy configuration in `vite.config.ts`
   - Check CORS configuration in backend

2. **Authentication Issues**
   - Ensure Keycloak is running on port 8080
   - Check Keycloak client configuration
   - Verify redirect URIs match exactly

3. **Role-based Features Not Working**
   - Check if user has proper roles in Keycloak
   - Verify client mapper includes roles in ID token
   - Use debug page to inspect user authorities

4. **Port Conflicts**
   - Frontend runs on port 3000
   - Backend should be on port 8081
   - Keycloak should be on port 8080

### Debug Tools

1. **Debug Page**: Visit `/debug` to see:
   - Authentication state
   - User roles and authorities
   - Backend connectivity
   - Spring Security authorities

2. **Browser DevTools**:
   - Network tab for API calls (should go to localhost:8081)
   - Console for JavaScript errors
   - Application tab for cookies/storage

3. **React Query DevTools**:
   - Enabled in development mode
   - Shows query states and cache

### Useful Commands

\`\`\`bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Development with specific port
npm run dev -- --port 3001

# Build and preview
npm run build && npm run preview

# Type checking
npx tsc --noEmit

# Check if port 3000 is available
lsof -i :3000
\`\`\`

## Integration with Backend

The frontend expects the backend to provide:

1. **Authentication endpoints** (`/api/me`, `/api/auth/logout`)
2. **Tutorial CRUD endpoints** (`/api/tutorials/*`)
3. **Admin endpoints** (`/api/admin/*`)
4. **Proper CORS configuration** for http://localhost:3000
5. **Role information** in user responses

Make sure the backend is properly configured and running on port 8081 before starting the frontend development server.

## Port Summary

- **Frontend Dev Server**: 3000
- **Backend Spring Boot**: 8081
- **Keycloak**: 8080
- **H2 Console**: 8081/h2-console

All services must be running on their respective ports for the application to work correctly.

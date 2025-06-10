# Components Structure

This project follows a modular component structure organized by feature areas:

## Directory Structure

```
src/components/
├── home/           # Home page components
│   ├── HomePage.tsx
│   ├── Header.tsx
│   ├── CountDown.tsx
│   ├── Couple.tsx
│   ├── Story.tsx
│   ├── Gallery.tsx
│   └── index.ts
├── admin/          # Admin dashboard components
│   ├── AdminDashboard.tsx
│   └── index.ts
├── auth/           # Authentication components
│   ├── Login.tsx
│   └── index.ts
├── common/         # Shared/common components
│   ├── ProtectedRoute.tsx
│   ├── Loading.tsx
│   └── index.ts
└── index.ts        # Main export file
```

## Usage

Import components using the organized structure:

```typescript
// Import from main components index
import { HomePage, AdminDashboard, ProtectedRoute } from './components';

// Or import from specific feature areas
import { Login } from './components/auth';
import { Loading } from './components/common';
```

## Features

### Authentication
- **Login Component**: Handles user authentication with comprehensive error handling
- **ProtectedRoute**: Wraps admin routes to ensure authentication
- **Loading States**: Shows loading indicators during authentication checks

### Error Handling
The login system includes detailed error messages for:
- Invalid credentials
- Network connectivity issues
- Server errors
- General authentication failures

### Routing
- **Home Route** (`/`): Public wedding page that uses subdomain for data
- **Admin Route** (`/admin`): Protected admin dashboard requiring authentication

## Environment Variables

```
REACT_APP_API_URL=http://localhost:3000
```

## Future Expansion

This structure allows for easy expansion:
- Add more admin components in `admin/` folder
- Add more authentication features in `auth/` folder
- Add shared UI components in `common/` folder
- Add new feature areas as separate folders
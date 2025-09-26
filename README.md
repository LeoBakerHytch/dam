# Digital Asset Management (DAM) platform

<img src="./screenshot.png"  alt="Screenshot of Digital Asset Management (DAM) platform" />

A modern digital asset management platform built with Laravel, GraphQL, and React. This application provides a
comprehensive solution for managing, organizing, and displaying digital assets with a focus on user experience and
performance.

## Architecture overview

This project follows a modern full-stack architecture with clear separation between backend and frontend:

### Backend (Laravel + GraphQL)
- **Framework**: Laravel 12 with PHP 8.2+
- **API layer**: GraphQL using Lighthouse package
- **Database**: PostgreSQL 16
- **Authentication**: JWT-based authentication with `tymon/jwt-auth`
- **Development tools**: Laravel Telescope for debugging

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Build tool**: Vite 7
- **Routing**: React Router v7
- **State management**: URQL for GraphQL client
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Theme**: Dark/light mode support with next-themes

## Project structure

```
dam/
├── backend/                 # Laravel backend application
│   ├── app/
│   │   ├── Models/         # Eloquent models (User, ImageAsset)
│   │   ├── GraphQL/        # GraphQL resolvers and scalars
│   │   └── Casts/          # Custom Eloquent casts
│   ├── database/migrations/ # Database migrations
│   └── graphql/            # GraphQL schema definitions
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Authentication features
│   │   │   ├── images/     # Image asset management
│   │   │   └── settings/   # User settings and profile
│   │   ├── lib/            # Utilities and configurations
│   │   └── types/          # TypeScript type definitions
└── docker-compose.yml      # Development environment setup
```

## Key Features

### Image asset management
- **Upload & storage**: Direct file upload through GraphQL with local filesystem storage
- **Metadata management**: Editable descriptions, alt text, and tags for each asset
- **Visual gallery**: Grid-based gallery with pagination and detail sheets
- **Search & organization**: Tag-based categorization and filtering
- **Responsive design**: Optimized for desktop and mobile viewing

### User experience
- **Modern UI**: Clean, accessible interface using `shadcn/ui` components
- **Keyboard shortcuts**: Cmd/Ctrl+Enter shortcuts for saving in dialogs
- **Loading states**: Skeleton loading animations for better perceived performance
- **Tooltips & hints**: Contextual help and keyboard shortcut indicators
- **Theming**: System-aware dark/light mode switching

### Authentication & user management
- **JWT authentication**: Secure token-based authentication
- **User profiles**: Customizable profiles with avatar support
- **Settings management**: Comprehensive settings pages for profile and appearance

## Technology stack

### Backend dependencies
- **Laravel**: Core web framework
- **Lighthouse GraphQL**: GraphQL server implementation
- **JWT Auth**: JSON Web Token authentication
- **PostgreSQL**: Primary database

### Frontend dependencies
- **React & TypeScript**: Core frontend framework with type safety
- **urql**: Lightweight GraphQL client with caching
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (via shadcn/ui)
- **React Hook Form**: Performant forms with validation
- **Lucide React**: Modern icon library

## Development environment

The project uses Docker Compose for local development:

### Services
- **Backend**: Laravel development server on port 8000
- **Database**: PostgreSQL 16 on port 5432
- **Frontend**: Vite development server (configured separately)

### Getting started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dam
   ```

2. **Start backend services**
   ```bash
   docker-compose up -d
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

## Development workflow

### Backend development
- **GraphQL API**: Schema-first approach with resolvers in `app/GraphQL/Resolvers/`
- **Database**: Migrations in `database/migrations/`
- **Models**: Eloquent models with custom casts for complex data types
- **Debugging**: Laravel Telescope available in development

### Frontend development
- **Component library**: `shadcn/ui` components in `src/components/ui/`
- **Feature modules**: Organized by domain in `src/features/`
- **Type safety**: Full TypeScript coverage with GraphQL type generation planned
- **Styling**: Tailwind CSS with consistent design tokens

### Code quality
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier with import sorting and Tailwind class sorting
- **Type checking**: TypeScript strict mode enabled

## Current status & roadmap

The platform is in active development with core functionality implemented:

✅ **Completed features**:
- Image upload and storage
- Gallery with pagination
- Asset detail management (description, alt text, tags)
- User authentication and profiles
- Responsive UI with dark/light themes
- Keyboard shortcuts and accessibility features

🚧 **In progress**:
- GraphQL type generation for frontend
- Enhanced testing coverage

📋 **Planned features** (see TODO.md):
- Cloud storage integration (S3)
- Automatic token refresh
- CSRF protection
- Advanced search and filtering
- Bulk operations
- API documentation

For detailed technical debt and planned improvements, see [TODO.md](TODO.md).

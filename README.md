# Digital Asset Management (DAM) platform

<video
    src="https://github.com/user-attachments/assets/07ee3451-bc00-4084-96fb-f403c0608cda"
    controls
    alt="Screen recording of Digital Asset Management (DAM) platform"></video>

A digital asset management platform built with Laravel, GraphQL, and React.

## Architecture overview

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
- **State management**: Apollo Client v4
- **Styling**: Tailwind CSS v4 with `shadcn/ui` components
- **Forms**: React Hook Form with Zod validation
- **Theme**: Dark/light mode support

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

## Key features

### Image asset management
- **Upload & storage**: Direct file upload through GraphQL with local filesystem storage
- **Metadata management**: Editable descriptions, alt text, and tags for each asset
- **Visual gallery**: Grid-based gallery with pagination and detail sheets
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

## Developer experience

### Development environment
- **Docker Compose**: Containerized backend and database for consistent local development across all platforms

### Hot reload
- **Vite**: Instant HMR (hot module reload) for frontend changes
- **Laravel**: Auto-reload on backend code changes

### Type safety
- **TypeScript**: Full type coverage with strict mode enabled
- **PHPStan**: Static analysis for backend code (level 5)

### Dev tools
- **Laravel Telescope**: Request/response logging, database query monitoring, exception tracking, and GraphQL inspection for backend debugging
- **Apollo Client DevTools**: GraphQL query explorer, cache inspection, and performance monitoring for frontend debugging

### Code quality
- **Pint**: Opinionated PHP formatting (Laravel style)
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Consistent code formatting

### Testing
- **PHPUnit**: Backend unit and integration tests
- **GitHub Actions**: Automated CI pipeline

### Workflow
- **`just`**: Context-aware commands for common tasks (format, types, test, lint)

## Development environment

The project uses Docker Compose for local development:

### Services
- **Backend**: Laravel development server on port 8000
- **Database**: PostgreSQL 16 on port 5432
- **Frontend**: Vite development server (configured separately)

### Getting started

1. **Clone the repository**
   ```bash
   git clone https://github.com/LeoBakerHytch/dam.git
   cd dam
   ```

2. **Set up environment files**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env

   # Frontend environment
   cp frontend/.env.example frontend/.env
   ```

3. **Start backend services**
   ```bash
   docker-compose up -d
   ```

4. **Generate application keys** (after services are running)
   ```bash
   # Generate Laravel application key
   docker compose exec backend php artisan key:generate

   # Generate JWT secret for authentication
   docker compose exec backend php artisan jwt:secret
   ```

5. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

6. **Start frontend development server**
   ```bash
   npm run dev
   ```

For developer tooling, debugging tips, and troubleshooting, see **[DEVELOPMENT.md](DEVELOPMENT.md)**.

## Development workflow

### Backend development
- **GraphQL API**: Schema-first approach with resolvers in `app/GraphQL/Resolvers/`
- **Database**: Migrations in `database/migrations/`
- **Models**: Eloquent models with custom casts for complex data types
- **Debugging**: Laravel Telescope available in development

### Frontend development
- **Component library**: `shadcn/ui` components in `src/components/ui/`
- **Feature modules**: Organized by domain in `src/features/`
- **Type safety**: Full TypeScript coverage with GraphQL type generation (thanks to `gql.tada`)
- **Styling**: Tailwind CSS with consistent design tokens

### Code quality
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier with import sorting and Tailwind class sorting
- **Type checking**: TypeScript strict mode enabled

### CI/CD
- **Backend CI**: GitHub Actions runs PHPUnit tests on every backend change
- **Frontend CI**: Vercel builds and deploys on frontend changes
- **Deployment**: Automatic deployment to Fly.io (backend) and Vercel (frontend) on push to `main`
- **Local testing**: `act` for testing GitHub Actions workflows locally

## Current status & roadmap

✅ **Completed features**:
- Image upload and storage
- Gallery with pagination
- Asset detail management (description, alt text, tags)
- User authentication and profiles
- Responsive UI with dark/light themes
- Keyboard shortcuts and accessibility features
- GraphQL type generation for frontend
- Thumbnail generation for images
- CSRF protection

🚧 **In progress**:
- Testing coverage

📋 **Planned features** (see TODO.md):
- Cloud storage integration (S3)
- Automatic token refresh
- Advanced search and filtering
- Bulk operations
- API documentation

For detailed technical debt and planned improvements, see [TODO.md](TODO.md).

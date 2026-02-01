# OSC Internal Tool - Project Configuration Guide

## Project Overview

The OSC Internal Tool is a monorepo project built for internal management of Open Source Community. It uses a modern tech stack with Turbo for monorepo management, Bun as the package manager, and includes multiple applications.

## Tech Stack

- **Package Manager:** Bun
- **Monorepo Tool:** Turbo
- **Frontend:** Next.js 15.5.4, React 19.1.0, Tailwind CSS 4
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB with Prisma
- **Authentication:** GitHub OAuth, JWT
- **File Storage:** Cloudinary

## Environment Files Structure

### Total Environment Files: 4

#### 1. Root Level Configuration

- **File:** `./.env.example`
- **Location:** Project root directory
- **Content:**
  BACKEND_URL="http://localhost:8000"

#### 2. Client Application

- **File:** `./apps/client/.env.example`
- **Location:** Client application directory
- **Content:**
  BACKEND_URL="http://localhost:8000"

#### 3. Server Application

- **File:** `./apps/server/.env.example`
- **Location:** Server application directory
- **Content:**
  PORT=8000
  FRONTEND_URL_SUCCESS="http://localhost:3000"
  FRONTEND_URL_FAIL="http://localhost:3000"
  NODE_ENV="development"
  FRONTEND_URL="http://localhost:3000"
  JWT_SECRET="your_secret"
  GITHUB_CALLBACK_URL="http://localhost:8000/api/v1/users/oauth/redirect/github"
  GITHUB_OAUTH_CLIENTID="your_client_id"
  GITHUB_OAUTH_SECRET="your_client_secret"
  CLOUDINARY_API_KEY="your_cloudinary_api_key"
  CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
  CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
  DATABASE_URL="mongodb://127.0.0.1:27017"

#### 4. Database Package

- **File:** `./packages/db/src/.env.example`
- **Location:** Database package source directory
- **Content:**
  DATABASE_URL="mongodb://127.0.0.1:27017"

## Environment Variables Explanation

### Server Application Variables

- **PORT:** Server running port (8000)
- **NODE_ENV:** Environment mode (development/production)
- **JWT_SECRET:** Secret key for JWT token generation
- **DATABASE_URL:** MongoDB connection string
- **FRONTEND_URL:** Client application URL
- **GITHUB_OAUTH_CLIENTID:** GitHub OAuth App Client ID
- **GITHUB_OAUTH_SECRET:** GitHub OAuth App Client Secret
- **GITHUB_CALLBACK_URL:** OAuth callback URL
- **CLOUDINARY\_\*:** Cloudinary configuration for file uploads

### Client Application Variables

- **BACKEND_URL:** Server API endpoint

## Project Setup Instructions

### Prerequisites

- Bun runtime (v1.2.19 or higher)
- MongoDB running locally
- GitHub OAuth App configured

### Step 1: Clone Repository

git clone https://github.com/Open-Source-Chandigarh/osc-internal-tool.git
cd osc-internal-tool-hacktoberFest

### Step 2: Install Dependencies

bun install

### Step 3: Environment Configuration

#### For Root Level:

cp .env.example .env

#### For Client Application:

cp apps/client/.env.example apps/client/.env
Edit apps/client/.env with actual values

#### For Server Application:

cp apps/server/.env.example apps/server/.env

Edit apps/server/.env with actual values

#### For Database Package:

cp packages/db/src/.env.example packages/db/src/.env

### Step 4: Database Setup

Generate Prisma client
bun run generate:db

### Step 5: Start Applications

#### Development Mode (All apps):

bun run dev

#### Start Backend Only:

bun run start:backend

#### Start Frontend Only:

bun run start:frontend

#### Production Build:

bun run build

## Monorepo Structure

osc-internal-tool-hacktoberFest/
├── apps/
│ ├── client/ # Next.js frontend
│ │ ├── .env.example
│ │ └── package.json
│ └── server/ # Express backend
│ ├── .env.example
│ └── package.json
├── packages/
│ ├── db/ # Database package
│ │ └── src/
│ │ └── .env.example
│ ├── eslint-config/ # Shared ESLint config
│ ├── typescript-config/ # Shared TypeScript config
│ └── ui/ # Shared UI components
├── .env.example # Root environment
└── package.json # Root package with turbo scripts

## Available Scripts (From Root)

- `bun run dev` - Start all applications in development mode
- `bun run build` - Build all applications
- `bun run lint` - Run linting across all packages
- `bun run generate:db` - Generate Prisma client
- `bun run start:backend` - Start backend server only
- `bun run start:frontend` - Start frontend only

## Security Notes

- All `.env` files are ignored in `.gitignore`
- Never commit actual `.env` files to version control
- Use different secrets for development and production
- Keep OAuth credentials secure

## External Services Configuration

### GitHub OAuth

1. Create GitHub OAuth App
2. Set Authorization callback URL to: `http://localhost:8000/api/v1/users/oauth/redirect/github`
3. Update `GITHUB_OAUTH_CLIENTID` and `GITHUB_OAUTH_SECRET` in server `.env`

### Cloudinary

1. Create Cloudinary account
2. Get API Key, Secret, and Cloud Name
3. Update Cloudinary variables in server `.env`

### MongoDB

1. Ensure MongoDB is running on `mongodb://127.0.0.1:27017`
2. Prisma uses MongoDB transactions, which require MongoDB to run as a **replica set**

### Local Development (Docker)

For local Docker-based setup, MongoDB runs as a **single-node replica set**.

Start services:

```bash
docker compose up -d
```

After MongoDB starts, initialize the replica set once:

```bash
docker exec -it mongodb mongosh
rs.initiate()
```

This step is required only once per machine.

## Verification

After setup, verify applications are running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

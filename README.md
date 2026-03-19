
  # NearU Frontend

  NearU is a React + Vite frontend for discovering nearby services and campus-life essentials, including transport, food, gifts, accommodation, jobs, and deals.

  This repository contains the UI application, route definitions, reusable components, and page-level flows for multiple user roles (customer, rider, business owner, and admin).

  ## Highlights

  - Multi-page app powered by React Router
  - Domain pages for transport, food, gifts, accommodation, jobs, and deals
  - User account flows: register, login, forgot password, reset password
  - Role-specific dashboards: rider, business owner, and admin
  - Shared UI component library based on Radix UI primitives
  - **Integrated with ASP.NET Core backend API**

  ## Tech Stack

  - React 18
  - TypeScript
  - Vite 6
  - React Router 7
  - Tailwind CSS 4
  - Radix UI components
  - Material UI packages (`@mui/material`, `@mui/icons-material`)
  - Axios for API communication
  - JWT authentication with auto-refresh

  ## Prerequisites

  - Node.js 18+ (LTS recommended)
  - npm 9+
  - .NET 8 SDK (for backend)

  ## Getting Started

  ### Frontend Only

  1. Clone the repository:

  ```bash
  git clone https://github.com/Nearu-Project-SUSL/NearU-Frontend.git
  cd NearU-Frontend
  ```

  2. Install dependencies:

  ```bash
  npm install
  ```

  3. Create a `.env` file (copy from `.env.example`):

  ```bash
  cp .env.example .env
  ```

  4. Start the development server:

  ```bash
  npm run dev
  ```

  5. Open the local URL shown in the terminal (usually `http://localhost:5173`).

  ### Full Stack (Frontend + Backend)

  To run both frontend and backend together:

  ```bash
  npm run start:all
  ```

  This will start:
  - Backend API on `http://localhost:5059`
  - Frontend on `http://localhost:5173`

  ## Backend Integration

  The frontend is integrated with the NearU Backend located at:
  `C:\Users\THIMIRA\source\repos\NearU_Backend_Revised`

  - **Backend Technology**: ASP.NET Core Web API
  - **Database**: PostgreSQL (Railway hosted)
  - **Authentication**: JWT with refresh token rotation
  - **API Base URL**: Configured via `.env` file (`VITE_API_BASE_URL`)

  For detailed integration information, see [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md).

  ## Available Commands

  ```bash
  npm run dev           # Start frontend development server only
  npm run build         # Create production build in dist/
  npm run start:backend # Start backend only
  npm run start:all     # Start both frontend and backend
  ```

  Optional local preview of the production build:

  ```bash
  npx vite preview
  ```

  ## Environment Variables

  Create a `.env` file in the root directory:

  ```env
  VITE_API_BASE_URL=http://localhost:5059/api
  VITE_APP_ENV=development
  ```

  See `.env.example` for the template.

  ## Project Structure

  | Path | Purpose |
  | --- | --- |
  | `src/main.tsx` | App entry point |
  | `src/app/App.tsx` | Root app composition (`RouterProvider`, context wrappers) |
  | `src/app/routes.tsx` | Route map for all pages |
  | `src/app/pages/` | Page-level screens |
  | `src/app/components/` | Reusable domain and layout components |
  | `src/app/components/ui/` | Shared UI primitives and wrappers |
  | `src/app/context/` | React context providers |
  | `src/styles/` | Global styles, theme, and font setup |
  | `src/assets/` | Static image assets |
  | `guidelines/Guidelines.md` | Team AI/code generation guidelines template |

  ## Route Map

  | Route | Screen |
  | --- | --- |
  | `/` | Loading screen |
  | `/location-permission` | Location permission |
  | `/landing` | Landing page |
  | `/home` | Home |
  | `/register` | Register |
  | `/login` | Login |
  | `/forgot-password` | Forgot password |
  | `/reset-password` | Reset password |
  | `/transport` | Transport selection |
  | `/transport/tuk` | Tuk riders |
  | `/transport/all` | Transport list |
  | `/transport/bus` | Transport list |
  | `/transport/train` | Transport list |
  | `/transport/bike` | Rides |
  | `/rides` | Rides |
  | `/food` | Food |
  | `/food/:vendorId` | Food vendor details |
  | `/gifts` | Gifts |
  | `/gifts/:shopId` | Gift shop details |
  | `/accommodation` | Accommodation |
  | `/accommodation/:id` | Accommodation details |
  | `/jobs` | Jobs |
  | `/jobs/:id` | Job details |
  | `/deals` | Deals |
  | `/profile` | Profile |
  | `/favorites` | Favorites |
  | `/rider-home` | Rider dashboard |
  | `/rider-profile` | Rider profile |
  | `/business-owner-home` | Business owner dashboard |
  | `/admin-home` | Admin dashboard |

  ## Collaboration Workflow

  1. Create a branch from `main`:

  ```bash
  git checkout main
  git pull origin main
  git checkout -b feat/short-description
  ```

  2. Commit clearly and frequently:

  ```bash
  git add .
  git commit -m "feat: add transport filter chips"
  ```

  3. Push your branch and open a Pull Request:

  ```bash
  git push -u origin feat/short-description
  ```

  4. Request review, address feedback, and merge after approval.

  ## Notes

  - `@` is configured as an alias for `src` in `vite.config.ts`.
  - `figma:asset/...` imports are mapped to `src/assets/...`.
  - `.gitignore` currently ignores `node_modules`.

  ## Attribution

  Design and asset attributions are tracked in `ATTRIBUTIONS.md`.

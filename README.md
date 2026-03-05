
  # NearU Frontend

  NearU is a React + Vite frontend for discovering nearby services and campus-life essentials, including transport, food, gifts, accommodation, jobs, and deals.

  This repository contains the UI application, route definitions, reusable components, and page-level flows for multiple user roles (customer, rider, business owner, and admin).

  ## Highlights

  - Multi-page app powered by React Router
  - Domain pages for transport, food, gifts, accommodation, jobs, and deals
  - User account flows: register, login, forgot password, reset password
  - Role-specific dashboards: rider, business owner, and admin
  - Shared UI component library based on Radix UI primitives

  ## Tech Stack

  - React 18
  - TypeScript
  - Vite 6
  - React Router 7
  - Tailwind CSS 4
  - Radix UI components
  - Material UI packages (`@mui/material`, `@mui/icons-material`)

  ## Prerequisites

  - Node.js 18+ (LTS recommended)
  - npm 9+

  ## Getting Started

  1. Clone the repository:

  ```bash
  git clone https://github.com/Nearu-Project-SUSL/NearU-Frontend.git
  cd NearU-Frontend
  ```

  2. Install dependencies:

  ```bash
  npm install
  ```

  3. Start the development server:

  ```bash
  npm run dev
  ```

  4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

  ## Available Commands

  ```bash
  npm run dev      # Start development server
  npm run build    # Create production build in dist/
  ```

  Optional local preview of the production build:

  ```bash
  npx vite preview
  ```

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

# GigFactory - Internal Admin & User Portal (Frontend)

This is the frontend client application for **GigFactory**, built with React, Vite, TanStack Query, and Zustand. It provides dashboards, profile management, team views, registration workflows, and projects management for freelancers, agencies, and super administrators.

---

## 🚀 Key Features

- **Multi-Role Dashboards**: Role-tailored workspace views for Super Admins, Freelancers, and Agencies.
- **Registration Requests System**: Fully modular table lists, detail panels, and custom re-application cooldown selectors for Admin review.
- **My Team Management**: Agency-specific interface with forms to add, edit, or remove team members.
- **Search Debouncing**: Fully integrated client-side debouncing with a **350ms delay** on search/filter fields to prevent performance lags.
- **Zustand State Store**: Integrated auth token persistence, auto-login capability, and profile synchronization.
- **Clean Split Components**: Component-level separation of metrics, tables, cards, modals, and skeletons under `src/components/` for optimized rendering.

---

## 🛠️ Tech Stack

- **Core**: React 19, Javascript ES6
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS, React Bootstrap 2 (reused for specific layout grids), TailwindCSS (Vite plugin configuration)
- **State Management**: Zustand
- **Data Fetching**: `@tanstack/react-query`
- **Routing**: `react-router-dom` v7
- **Icons**: `lucide-react`
- **Validation**: `yup`

---

## 📂 Project Directory Structure

```
internalGigFactoryProject/
├── src/
│   ├── assets/             # Brand logos and images
│   ├── components/         # Centralized modular subcomponents
│   │   ├── Admin/          # Agency, Freelancer, RegRequest card/table/modal subcomponents
│   │   ├── Team/           # Member edit/add/delete subcomponents
│   │   ├── Dashboard/      # Main dashboard statistics, projects list, activity panels
│   │   ├── Profile/        # Header, stats, bio, work history, document components
│   │   ├── ActiveProject/  # Trackers list, insights, empty states
│   │   ├── Layout/         # Unified AppLayout shell & navigation structure
│   │   └── AdminShared.jsx # Shared badges, pagination, completion bars
│   ├── pages/              # Main routing page wrappers
│   │   ├── Admin/          # AdminOverview, AdminFreelancers, AdminAgencies, RegistrationRequests
│   │   ├── Dashboard/      # Dashboard main page
│   │   ├── Profile/        # User Profile main page
│   │   ├── ActiveProject/  # Active Projects main page
│   │   └── Team/           # My Team main page
│   ├── store/              # Zustand Auth & Profile store managers
│   ├── utils/              # Axios API clients
│   ├── App.jsx             # React Routes and Guards configuration
│   └── main.jsx            # Entry mount point
├── package.json
└── vite.config.js
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18+ recommended) and **npm** installed.

### 2. Configure Environment Variable
Create a `.env` file in the root directory (or ensure your API client links correctly to the backend port):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
Run the installation command in the project root folder:
```bash
npm install
```

### 4. Run Development Server
Start the local development server:
```bash
npm run dev
```
By default, the client will be accessible at: **`http://localhost:5173`**

### 5. Production Compilation
To compile and bundle assets for production:
```bash
npm run build
```
The compiled static build files will output to the `/dist` folder.

To preview the production build locally:
```bash
npm run preview
```

---

## 🧪 Styling and Best Practices
- **Variables**: The design system relies on CSS root tokens defined in `src/components/Layout/AppLayout.css` (e.g., `--accent`, `--bg-card`, `--border`).
- **Debounced Inputs**: Whenever implementing custom search or query inputs, ensure a debounce helper (e.g., `setTimeout`) is used with a `350ms` delay to prevent excess queries.
- **Subcomponents**: Avoid creating large inline components. Always place new, reusable panels or tables under `src/components/<FeatureArea>/`.

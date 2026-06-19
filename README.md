# GigFactory - Internal Admin & User Portal (Frontend)

This is the frontend client application for **GigFactory**, built with React, Vite, TanStack Query, and Zustand. It provides dashboards, profile management, team views, registration workflows, and projects management for freelancers, agencies, and super administrators.

---

## 🚀 Key Features

- **Multi-Role Dashboards**: Role-tailored workspace views for Super Admins, Freelancers, and Agencies.
- **My Applications Dashboard**: An interactive view (`/applications`) for freelancers and agencies showing their project bid applications, complete with high-level stats cards, searching, sorting, status filtering, and custom pagination.
- **Registration Requests System**: Fully modular table lists, detail panels, and custom re-application cooldown selectors for Admin review.
- **My Team Management**: Agency-specific interface with forms to add, edit, or remove team members.
- **Milestone Deliverable Management**: Assigned freelancers/agencies can submit deliverables for project milestones and edit/resubmit their submissions (updating text descriptions, adding new attachments, and removing old ones) before approval.
- **Admin Milestone Payments**: Administrators can manually record milestone payments and edit/update recorded payment details (amount, payment method, reference number, remarks, receipt proof attachment) directly.
- **Search Debouncing**: Fully integrated client-side debouncing with a **350ms delay** on search/filter fields (and **400ms** on applications) to prevent performance lags.
- **Zustand State Store**: Integrated auth token persistence, auto-login capability, and profile synchronization.
- **Clean Split Components**: Component-level separation of metrics, tables, cards, modals, and skeletons under `src/components/` for optimized rendering.

---

## 🛠️ Tech Stack

- **Core**: React 19, Javascript ES6
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS, Tailwind CSS v3 (configured via PostCSS with `tailwind.config.js` content scanning)
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
- **Tailwind CSS v3**: Utility-first styles are compiled via PostCSS using paths defined in `tailwind.config.js`. Static inline styles (`style={{ ... }}`) should be avoided in favor of Tailwind utility classes.
- **No Bootstrap**: Bootstrap has been completely removed from dependencies and imports. The styling system relies solely on Tailwind CSS and custom component-specific stylesheets, resulting in a cleaner, conflict-free rendering pipeline and a 67% smaller compiled CSS footprint.
- **Variables**: The design system relies on CSS root tokens defined in `src/components/Layout/AppLayout.css` (e.g., `--accent`, `--bg-card`, `--border`).
- **Debounced Inputs**: Whenever implementing custom search or query inputs, ensure a debounce helper (e.g., `setTimeout`) is used with a `350ms` delay to prevent excess queries.
- **Subcomponents**: Avoid creating large inline components. Always place new, reusable panels or tables under `src/components/<FeatureArea>/`.

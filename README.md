# Trip Planner Website

An AI-powered trip planning web app that generates cycling and trekking routes for any location. Users can plan multi-day trips, view routes on an interactive map with real road/trail geometry, check weather forecasts, save trips, and export them as PDFs.

Live site: https://my-tripplanner-ai.vercel.app

## Features

- **AI Route Generation** — Uses Groq (Llama 3.3 70B) to plan multi-day cycling or trekking routes with real waypoints
- **Interactive Map** — Leaflet-based map with route geometry from Google Directions API and OpenRouteService (for nature trails)
- **Google Places Autocomplete** — Location search with city suggestions
- **Weather Forecasts** — 3-day forecasts via OpenWeatherMap for trip destinations
- **Location Images** — Landscape photos from Unsplash for each trip
- **Save & Manage Trips** — Authenticated users can save, view, and delete past trips
- **PDF Export** — Export trip details as a downloadable PDF
- **JWT Authentication** — Secure login/register with HTTP-only cookie tokens and silent refresh

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Leaflet / React-Leaflet, SWR, jsPDF |
| Backend | Express 5, MongoDB / Mongoose 9, bcrypt, JSON Web Tokens |
| AI | Groq API (Llama 3.3 70B Versatile) |
| External APIs | Google Maps (Geocoding, Directions, Places), OpenWeatherMap, Unsplash, OpenRouteService |

## Project Structure

```
├── express-auth-server/     # Backend
│   ├── server.js             # Express entry point + MongoDB connection
│   ├── routes/
│   │   ├── auth.js           # Register, login, logout, token refresh
│   │   └── routes.js         # Save, get, delete trip routes
│   └── models/
│       ├── User.js           # User schema
│       └── Route.js          # Trip route schema
│
└── nextjs-app/              # Frontend
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/      # Login & Register pages
    │   │   ├── (main)/      # Home, Planning, History pages
    │   │   └── api/         # Next.js API routes (route generation, weather, images, etc.)
    │   ├── components/      # Navbar, shared UI
    │   ├── utils/           # PDF generation utilities
    │   └── middleware.js     # JWT verification & silent token refresh
    └── public/              # Static assets & fonts
```

## Setup instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [MongoDB](https://www.mongodb.com/) instance — local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)
- API keys from the following services:

| Service | Sign up | Used for |
|---------|---------|----------|
| [Groq](https://console.groq.com/) | Free | AI route generation (Llama 3.3 70B) |
| [Google Cloud](https://console.cloud.google.com/) | Free tier available | Maps, Geocoding, Directions, Places Autocomplete |
| [OpenWeatherMap](https://openweathermap.org/api) | Free | 3-day weather forecasts |
| [Unsplash](https://unsplash.com/developers) | Free | Location landscape images |
| [OpenRouteService](https://openrouteservice.org/dev/) | Free | Nature trail routing |

### Installation

**1. Clone the repo**

```bash
git clone https://github.com/Ariel-Yitzhaki/Final-Project-WEB-dev.git
cd Final-Project-WEB-dev
```

**2. Install dependencies**

```bash
cd express-auth-server
npm install

cd ../nextjs-app
npm install
```

**3. Configure environment variables**

Create `express-auth-server/.env`:

```env
MONGODB_URI=              # MongoDB connection string
JWT_SECRET=               # Any secure random string (must match the Next.js value below)
NEXTJS_URL=http://localhost:3000
PORT=5000
```

Create `nextjs-app/.env.local`:

```env
GROQ_API_KEY=             # From Groq Console
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=  # From Google Cloud Console (enable Maps JS, Geocoding, Directions, Places APIs)
OPENWEATHER_API_KEY=      # From OpenWeatherMap
UNSPLASH_ACCESS_KEY=      # From Unsplash Developer portal
ORS_API_KEY=              # From OpenRouteService
EXPRESS_URL=http://localhost:5000
JWT_SECRET=               # Must be the same value as in express-auth-server/.env
```

**4. Run the app**

You need two terminal windows:

```bash
# Terminal 1 — Backend
cd express-auth-server
npm start
```

```bash
# Terminal 2 — Frontend
cd nextjs-app
npm run dev
```

The app will be available at `http://localhost:3000`.

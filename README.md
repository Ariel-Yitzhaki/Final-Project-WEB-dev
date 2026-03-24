![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

# Trip Planner Website

An AI-powered trip planning web app that generates cycling and trekking routes for any location. Users can plan multi-day trips, view routes on an interactive map with real road/trail geometry, check weather forecasts, save trips, and export them as PDFs.

**Note**: The backend is hosted on Render's free tier, so the first request after a period of inactivity may take up to a minute while the server spins back up.

Live site: https://my-tripplanner-ai.vercel.app  
<img width="960" src="https://github.com/user-attachments/assets/97892c64-adf4-4056-b06f-b353c303588a">
<br><br><br>


## Features

### Route Planning
- Plan multi-day cycling or trekking routes for any location
- Routes follow real roads and trails via Google Directions API and OpenRouteService
- Interactive Leaflet map displays waypoints, routes and total trip length
- Location search with Google Places Autocomplete
- 3-day weather forecast for the trip destination via OpenWeatherMap
- Landscape photo for the destination pulled from Unsplash
- Approve and save generated routes to the database
<img width="800" src="https://github.com/user-attachments/assets/5cacc3ea-3873-44a5-8186-82c75f1e3e61">

<br><br>



### Trip History <img align="right" width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/ff122306-8681-49b5-95d2-6f7ede6e55f5" />

- View all previously saved trips with route details and map
- Delete saved trips
- Expand a trip to see its full breakdown with an updated weather forecast
- Export a saved trip as a PDF

<br clear="right">
<br><br>


### Authentication <img align="right" width="250" alt="image" src="https://github.com/user-attachments/assets/fdd5634a-de2c-4c7b-bf67-65a948516166" />

- User registration and login with hashed passwords (bcrypt + salt) 
- JWT tokens stored in HTTP-only cookies
- Silent token refresh when the token is close to expiring
- Next.js middleware protects all pages — unauthenticated users are redirected to login
<br clear="right">
<br>

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Leaflet / React-Leaflet, SWR, jsPDF |
| Backend | Express 5, MongoDB / Mongoose 9, bcrypt, JSON Web Tokens |
| AI | Groq API (Llama 3.3 70B Versatile) |
| External APIs | Google Maps (Geocoding, Directions, Places), OpenWeatherMap, Unsplash, OpenRouteService |
<br>

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
<br>

## Setup instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [MongoDB](https://www.mongodb.com/) instance - local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)
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
# Terminal 1 - Backend
cd express-auth-server
npm start
```

```bash
# Terminal 2 - Frontend
cd nextjs-app
npm run dev
```

The application will be available at `http://localhost:3000`.

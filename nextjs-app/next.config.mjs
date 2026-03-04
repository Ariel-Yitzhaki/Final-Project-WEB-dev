/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow external images from Unsplash and OpenWeatherMap
    images: {
        remotePatterns: [
            { hostname: "images.unsplash.com" },
            { hostname: "openweathermap.org" },
        ],
    },
};

export default nextConfig;
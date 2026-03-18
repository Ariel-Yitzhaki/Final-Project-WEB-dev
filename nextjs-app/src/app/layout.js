import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Ariel's Travel Planner",
  description: "WEB development final project by Ariel Yitzhaki",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=beta`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
import "./globals.css";

export const metadata = {
  title: "Ariel's Travel Planner",
  description: "WEB development final project by Ariel Yitzhaki",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}

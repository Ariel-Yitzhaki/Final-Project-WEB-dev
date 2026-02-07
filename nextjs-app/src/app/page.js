// Home page
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">מסלול טיולים אפקה 2026</h1>
        <div className="flex gap-4">
          <Link
            href="/planning"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Plan a Route
          </Link>
          <Link
            href="/history"
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
          >
            Route History
          </Link>
        </div>
      </div>
    </>
  );
}
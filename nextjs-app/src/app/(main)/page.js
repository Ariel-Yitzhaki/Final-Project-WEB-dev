// Home page
import Link from "next/link";

export const metadata = {
    title: "Home - Trip Planner",
    description: "Plan your next trip with AI-generated routes",
};

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start pt-52">
        <h1 className="text-8xl font-bold mb-8">מסלול טיולים אפקה 2026</h1>
        <div className="flex gap-20 mt-20">
          <Link
            href="/planning"
            className="bg-blue-500 text-2xl text-white px-20 py-10 rounded hover:bg-blue-700"
          >
            Plan a Trip
          </Link>
          <Link
            href="/history"
            className="bg-gray-500 text-2xl text-white px-20 py-10 rounded hover:bg-gray-700"
          >
            Trip History
          </Link>
        </div>
      </div>
    </>
  );
}
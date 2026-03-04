// Home page
import Link from "next/link";

export const metadata = {
  title: "Home - Trip Planner",
  description: "Plan your next trip with AI-generated routes",
};

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start pt-52"
        style={{
          backgroundImage: "url('/website_background2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <h1 className="text-8xl font-bold text-black mb-8 px-8 py-4 rounded-4xl border-4 border-black" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>מסלול טיולים אפקה 2026</h1>
        <div className="flex gap-20 mt-20">
          <Link
            href="/planning"
            className="bg-black text-2xl text-white font-bold px-20 py-10 rounded-2xl hover:bg-white hover:text-black border-2 border-black"
          >
            Plan a Trip
          </Link>
          <Link
            href="/history"
            className="bg-gray-500 text-2xl text-white font-bold px-20 py-10 rounded-2xl hover:bg-white hover:text-black border-2 border-gray-600"
          >
            Trip History
          </Link>
        </div>
      </div>
    </>
  );
}
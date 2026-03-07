// Home page
import Link from "next/link";
export const metadata = {
  title: "Home - Trip Planner",
  description: "Plan your next trip with AI-generated routes",
};
export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start"
        style={{
          paddingTop: '15vw',
          backgroundImage: "url('/website_background2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <h1 className="font-bold text-black" style={{ fontSize: '3.13vw', marginBottom: '1.25vw', padding: '0.63vw 1.25vw', borderRadius: '1.25vw', borderWidth: '0.16vw', borderColor: 'black', borderStyle: 'solid', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>מסלול טיולים אפקה 2026</h1>
        <div className="flex" style={{ gap: '3.13vw', marginTop: '3.13vw' }}>
          <Link
            href="/planning"
            className="text-white font-bold hover:bg-white hover:text-black"
            style={{ backgroundColor: 'black', fontSize: '0.94vw', padding: '1.56vw 3.13vw', borderRadius: '0.63vw', border: '0.08vw solid black' }}
          >
            Plan a Trip
          </Link>
          <Link
            href="/history"
            className="text-white font-bold hover:bg-white hover:text-black"
            style={{ backgroundColor: '#6b7280', fontSize: '0.94vw', padding: '1.56vw 3.13vw', borderRadius: '0.63vw', border: '0.08vw solid #4b5563' }}
          >
            Trip History
          </Link>
        </div>
      </div>
    </>
  );
}
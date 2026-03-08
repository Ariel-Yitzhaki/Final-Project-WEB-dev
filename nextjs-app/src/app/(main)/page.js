// Home page
import Link from "next/link";
export const metadata = {
  title: "Home - Trip Planner",
  description: "Plan your next trip with AI-generated routes",
};
export default function Home() {
  return (
    <>
      <div className="h-screen flex flex-col items-end justify-start"
        style={{
          paddingTop: '6.5vw',
          backgroundImage: "url('/website_background3.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <h1 className="font-bold text-black" style={{ fontSize: '3.53vw', marginBottom: '1.25vw' }}>
          <div style={{ position: 'relative', right: '6.7vw', marginTop: '2.2vw' }}>מסלול</div>
          <div style={{ position: 'relative', right: '24vw', marginTop: '-2.5vw' }}>טיולים</div>
          <div style={{ position: 'relative', right: '35vw', marginTop: '-1vw' }}>אפקה</div>
          <div style={{ position: 'relative', right: '43vw', marginTop: '1.3vw', color: 'white', fontSize: '6vw' }}>2026</div>
        </h1>
        <div className="flex justify-center w-full" style={{ gap: '13vw', marginTop: '8vw' }}>
          <Link
            href="/planning"
            className="text-white font-bold border-4 border-black hover:border-white"
            style={{ backgroundColor: 'black', fontSize: '0.94vw', padding: '1.56vw 3.13vw', borderRadius: '0.63vw' }}
          >
            Plan a Trip
          </Link>
          <Link
            href="/history"
            className="text-black font-bold border-4 border-white hover:border-black"
            style={{ backgroundColor: '#ffffff', fontSize: '0.94vw', padding: '1.56vw 3.13vw', borderRadius: '0.63vw' }}
          >
            Trip History
          </Link>
        </div>
      </div>
    </>
  );
}
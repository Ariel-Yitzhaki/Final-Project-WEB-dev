// Loading UI shown while planning page loads
import { Dancing_Script } from 'next/font/google';
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });
export default function PlanningLoading() {
    return (
        <div style={{ paddingTop: '3.13vw', backgroundColor: '#000000', minHeight: '100vh' }}>
            <h1 className={`${dancingScript.className} text-center text-white`} style={{ fontSize: '1.88vw', letterSpacing: '0.31vw', padding: '0.31vw 0' }}>Plan your trip</h1>
            <p className="text-center text-gray-400" style={{ fontSize: '0.63vw' }}>Loading Trip Generator...</p>
        </div>
    );
}
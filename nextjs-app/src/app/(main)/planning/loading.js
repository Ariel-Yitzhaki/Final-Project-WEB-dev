// Loading UI shown while planning page loads
import { Dancing_Script } from 'next/font/google';
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });

export default function PlanningLoading() {
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#000000', minHeight: '100vh' }}>
            <h1 className={`${dancingScript.className} text-5xl text-center text-white py-2`} style={{ letterSpacing: '8px' }}>Plan your trip</h1>
            <p className="text-center text-gray-400">Loading Trip Generator...</p>
        </div>
    );
}
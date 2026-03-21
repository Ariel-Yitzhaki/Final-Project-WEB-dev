// Loading UI shown while planning page loads
import { Dancing_Script } from 'next/font/google';
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });
export default function PlanningLoading() {
    return (
        <div style={{ paddingTop: '5.25rem', backgroundColor: '#000000', minHeight: '100vh' }}>
            <h1 className={`${dancingScript.className} text-center text-white`} style={{ fontSize: '2.9rem', letterSpacing: '0.5rem', padding: '0.5rem 0' }}>Plan your trip</h1>
            <p className="font-bold text-center text-gray-400" style={{ marginTop: '28rem', fontSize: '1.5rem' }}>Loading Trip Generator...</p>
        </div>
    );
}

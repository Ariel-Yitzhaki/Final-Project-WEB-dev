// Layout for authenticated pages (The shared Navbar)
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
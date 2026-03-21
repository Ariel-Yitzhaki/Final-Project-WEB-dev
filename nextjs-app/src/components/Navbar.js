// Navigation bar - server component renders the layout,
// delegates interactive parts (logout, active link highlighting) to client
import NavbarClient from "./NavbarClient";

export default function Navbar() {
    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem 1.75rem",
            backgroundColor: "#030303",
            borderBottom: "2px solid white",
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            zIndex: 1000,
        }}>
            <NavbarClient />
        </nav>
    );
}

// Loading UI shown while history page fetches saved routes from server
export default function HistoryLoading() {
    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '0.31vw', paddingTop: '0.94vw' }}>
            <p className="font-bold text-center text-white" style={{ marginTop: '18vw', fontSize: '1.5vw' }}>Loading History...</p>
        </div>
    );
}
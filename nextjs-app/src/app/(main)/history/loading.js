// Loading UI shown while history page fetches saved routes from server
export default function HistoryLoading() {
    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '0.5rem', paddingTop: '1.4rem' }}>
            <p className="font-bold text-center text-white" style={{ marginTop: '28rem', fontSize: '2.3rem' }}>Loading History...</p>
        </div>
    );
}

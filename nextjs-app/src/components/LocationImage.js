// Shared component - displays location image with Unsplash credit
export default function LocationImage({ image }) {
    if (!image) return null;
    return (
        <div>
            <img src={image.url} alt={image.alt} className="w-full object-cover border-2 border-gray-400 rounded-2xl" style={{ height: '400px', maxWidth: '80%' }} />
            {/* Unsplash requires photographer credit */}
            <p className="text-gray-500 text-xs mt-1">Photo by {image.credit} on Unsplash</p>
        </div>
    );
}
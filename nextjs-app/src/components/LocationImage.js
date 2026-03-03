export default function LocationImage({ image }) {
    if (!image) return null;
    return (
        <div>
            <img src={image.url} alt={image.alt} className="w-full h-64 object-cover rounded" />
            <p className="text-gray-500 text-sm mt-1">Photo by {image.credit} on Unsplash</p>
        </div>
    );
}
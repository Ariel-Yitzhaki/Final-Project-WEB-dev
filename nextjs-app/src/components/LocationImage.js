// Shared component - displays location image with Unsplash credit
import Image from "next/image";

export default function LocationImage({ image }) {
    if (!image || !image.url) return null;
    return (
        <div>
            <Image
                src={image.url}
                alt={image.alt}
                width={800}
                height={400}
                className="w-full object-cover border-2 border-gray-400 rounded-2xl"
                style={{ height: '400px', maxWidth: '100%' }}
            />
            {/* Unsplash requires photographer credit */}
            <p className="text-gray-500 text-xs mt-1">Photo by {image.credit} on Unsplash</p>
        </div>
    );
}
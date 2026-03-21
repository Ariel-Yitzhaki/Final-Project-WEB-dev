// Shared component - displays location image with Unsplash credit
import Image from "next/image";

export default function LocationImage({ image }) {
    if (!image || !image.url) return null;
    return (
        <div>
            <Image
                src={image.url}
                alt={image.alt}
                width={500}
                height={400}
                className="w-full object-cover"
                style={{ height: '300px', maxWidth: '100%', border: '2px solid #9ca3af', borderRadius: '1rem' }}
            />
            <p className="text-gray-500" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Photo by {image.credit} on Unsplash</p>
        </div>
    );
}

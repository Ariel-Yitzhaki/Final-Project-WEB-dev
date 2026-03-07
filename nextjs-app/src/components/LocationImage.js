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
                className="w-full object-cover"
                style={{ height: '15.63vw', maxWidth: '100%', border: '0.08vw solid #9ca3af', borderRadius: '0.63vw' }}
            />
            {/* Unsplash requires photographer credit */}
            <p className="text-gray-500" style={{ fontSize: '0.47vw', marginTop: '0.16vw' }}>Photo by {image.credit} on Unsplash</p>
        </div>
    );
}
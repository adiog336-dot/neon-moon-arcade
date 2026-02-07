
import { useEffect, useState } from 'react';

const StarField = () => {
    const [stars, setStars] = useState<{ id: number; style: React.CSSProperties; className: string }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            style: {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
            },
            className: `absolute bg-white rounded-full opacity-70 ${Math.random() > 0.5 ? 'animate-twinkle-slow' : 'animate-twinkle-fast'
                }`,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className={star.className}
                    style={star.style}
                />
            ))}
        </div>
    );
};

export default StarField;

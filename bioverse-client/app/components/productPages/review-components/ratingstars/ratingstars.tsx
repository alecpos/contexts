import Image from 'next/image';

interface Props {
    rating: number;
    className: string;
}

export default function RatingStars({ rating, className }: Props) {
    return (
        <div className={`relative ${className}`}>
            <Image
                alt="rating-stars"
                src="/img/product-page/rating/rating-stars.svg"
                style={{
                    clipPath: `inset(0 ${((5 - rating) / 5) * 100}% 0 0)`,
                }}
                fill
                unoptimized
            />
        </div>
    );
}

'use client';
import Image from 'next/image';
import React from 'react';

interface SvgImageProps {
    image: string;
}

const SvgImage = ({ image }: SvgImageProps) => {
    return (
        <div
            className="relative"
            style={{ width: '25vw', height: 'calc(25vw * 1.3333)' }}
        >
            <Image
                src={image}
                alt="Doctor"
                layout="fill"
                objectFit="contain"
                priority
                quality={100}
                unoptimized
            />
        </div>
    );
};

export default SvgImage;

'use client';

import SealFactory from '../productImageFactory/sealFactory/sealFactory';
import PreviewImageFactory from '../productImageFactory/previewImageFactory/previewImageFactory';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
    data: any;
}

export default function SupplementProductImageFactory({ data }: Props) {
    const [mainImageRef, setMainImageRef] = useState<string>(
        data ? data.image_ref[0] : '',
    );

    return (
        <>
            <div className="inline-flex w-full flex-col items-start justify-normal gap-[10px] relative">
                <div
                    className={`relative w-full aspect-square`}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src={`/img/product-images/${data.category}/${data.href}.png`}
                        fill
                        objectFit="cover"
                        alt="Product Image"
                        quality={100}
                        priority
                        unoptimized
                    />
                    <SealFactory
                        className="flex flex-col-reverse items-start gap-1 absolute bottom-0 p-2"
                        seals={data.seals}
                    />
                </div>
            </div>
            {/* <PreviewImageFactory
                productType={data.category}
                imageClassName='relative w-[7.8vw] h-[7.8vw]'
                imageRefs={data.image_ref}
                setMainImageRef={setMainImageRef}
            /> */}
        </>
    );
}

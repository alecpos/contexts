'use client';

import SealFactory from './sealFactory/sealFactory';
import PreviewImageFactory from './previewImageFactory/previewImageFactory';
import Image from 'next/image';
import { useState } from 'react';
import PreviewImageCarousel from './previewImageCarousel/previewImageCarousel';
import Layout from '../../../(login)/signup/layout';

interface Props {
    data: any;
}

export default function ProductImageFactory({ data }: Props) {
    const [mainImageRef, setMainImageRef] = useState<string>(
        data ? data.image_ref[0] : ''
    );

    return (
        <div id='product-image-factory-container' className='w-full'>
            {/** Below is For mobile versions. */}
            <div className='flex md:hidden'>
                <PreviewImageCarousel data={data} mainImageRef={mainImageRef} />
            </div>

            {/** Below is For desktop versions. */}
            <div className='w-full hidden md:flex'>
                <div className='inline-flex w-full flex-col items-start justify-normal gap-[10px] relative  '>
                    <div className={`w-full h-auto aspect-square relative`}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${mainImageRef}`}
                            fill
                            sizes='(max-width:  360px)  327px, (max-width:  1440px)  550px, (max-width:  2560px)  768px, (max-width:  3840px)  1024px,  100vw'
                            alt={`Product Image: ${mainImageRef}`}
                            priority
                            unoptimized
                        />
                        <SealFactory
                            className='flex flex-col-reverse items-start gap-1 absolute bottom-0 p-2'
                            seals={data.seals}
                        />
                    </div>
                    <PreviewImageFactory
                        productType={data.category}
                        imageClassName='relative w-[8.1vw] h-[8.1vw] cursor-pointer'
                        imageRefs={data.image_ref}
                        setMainImageRef={setMainImageRef}
                        isMobile={false}
                    />
                </div>
            </div>
        </div>
    );
}

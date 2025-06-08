import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SealFactory from '../sealFactory/sealFactory';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import './previewImageCarousel.css';

interface Props {
    data: any;
    mainImageRef: string;
}

export default function PreviewImageCarousel({ data, mainImageRef }: Props) {
    return (
        <div className="mt-2 mx-auto w-[100%] h-[90%]">
            <Swiper
                loop={true}
                centeredSlides={true}
                pagination={true}
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1}
            >
                {data.image_ref.map((imageRef: string, index: number) => (
                    <SwiperSlide key={index}>
                        <div
                            className={`block aspect-square`}
                            style={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${imageRef}`} // 修改这里的mainImageRef为imageRef
                                fill
                                objectFit="cover"
                                alt={`Product Image ${imageRef}`}
                                quality={100}
                                priority
                                unoptimized
                            />

                            <SealFactory
                                className="flex flex-col-reverse items-start gap-1 absolute bottom-0 p-2"
                                seals={data.seals}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

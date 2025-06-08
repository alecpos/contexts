import BiomarkerCard from './biomarker-card/biomarker-card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

interface BiomarkerRow {
    id: number;
    name: string;
    unit: string;
    description: string;
}

interface Props {
    biomarkers: BiomarkerRow[];
}

export default function BiomarkerCarousel({ biomarkers }: Props) {
    return (
        <>
            <Swiper
                slidesPerView={3}
                spaceBetween={50}
                centeredSlides={true}
                initialSlide={1}
                parallax={true}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                breakpoints={{
                    // when window width is >= 320px
                    320: {
                        width: 320,
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    // when window width is >= 480px
                    480: {
                        width: 480,
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    // when window width is >= 640px
                    640: {
                        width: 640,
                        slidesPerView: 3,
                        spaceBetween: 50,
                    },
                }}
            >
                <div className="w-full">
                    {biomarkers.map(
                        (biomarker: BiomarkerRow, index: number) => (
                            <SwiperSlide key={index}>
                                <BiomarkerCard
                                    name={biomarker.name}
                                    description={biomarker.description}
                                    unit={biomarker.unit}
                                />
                            </SwiperSlide>
                        ),
                    )}
                </div>
            </Swiper>
        </>
    );
}

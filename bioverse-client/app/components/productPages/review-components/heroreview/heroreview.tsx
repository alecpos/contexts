import RatingStars from '../ratingstars/ratingstars';
import Image from 'next/image';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import styles from '../../../../styles/pdp/prescription-pdp.module.css';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button } from '@mui/material';

import 'swiper/css';
import 'swiper/css/pagination';
import {
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';

/*
  02/02/2024 - @Olivier
    - Added slider between product reviews on desktop
    - Mobile view shows the reviews in a list
*/

interface Review {
    customer_name: string;
    customer_review: string;
}

interface Props {
    href: string;
    data: any;
    isMobile: boolean;
}

interface ImageRefs {
    [key: string]: string;
}

const imageRefs: ImageRefs = {};

export default function HeroReview({ href, data, isMobile }: Props) {
    const isSpecial =
        href === SEMAGLUTIDE_PRODUCT_HREF || href === TIRZEPATIDE_PRODUCT_HREF;

    return (
        <>
            <div className='flex w-full p-0 flex-col items-start justify-center gap-[1.67vw]'>
                <div className='w-full flex flex-col md:flex-row gap-[1.67vw] justify-start'>
                    <BioType className='h6 md:h4 !text-[#286BA2]'>
                        <span className={`${styles.pdpheaderMobile}`}>
                            Customer Reviews
                        </span>
                    </BioType>
                    <div className='flex md:flex-1 h-[1px] md:self-center'>
                        <HorizontalDivider
                            backgroundColor={'#B1B1B1'}
                            height={1}
                        />
                    </div>
                </div>

                <div className='flex flex-col md:flex-row p-0 justify-center items-center gap-[5.83vw] self-stretch mt-6'>
                    {!isSpecial && !isMobile && (
                        <div className='w-full md:w-[26.3vw] aspect-[4/3] relative'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${data.review_image_ref}`}
                                alt={'review-product-image'}
                                fill
                                unoptimized
                            />
                        </div>
                    )}
                    <div className='flex p-0 flex-col items-start gap-2 w-full md:w-[30.5vw]'>
                        {/* <RatingStars
              rating={review.rating}
              className="w-[34vw] md:w-[14.86vw] aspect-[6.52] mb-2"
            /> */}
                        {!isMobile ? (
                            <div className='flex w-full'>
                                <Button
                                    disableRipple
                                    className='arrowLeft'
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <ChevronLeftIcon
                                        sx={{ color: '#7F7F7F' }}
                                    />
                                </Button>
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={0}
                                    loop={true}
                                    parallax={true}
                                    className='w-full'
                                    navigation={{
                                        nextEl: '.arrowRight',
                                        prevEl: '.arrowLeft',
                                    }}
                                    pagination={{ clickable: true }}
                                    modules={[Pagination, Navigation]}
                                >
                                    {data.customer_reviews.map(
                                        (review: Review, index: number) => (
                                            <SwiperSlide key={index}>
                                                <BioType className='body1'>
                                                    &quot;
                                                    {review.customer_review}
                                                    &quot;
                                                </BioType>
                                                <BioType className='body2 mt-7 text-[#767676]'>
                                                    {review.customer_name}
                                                </BioType>
                                            </SwiperSlide>
                                        )
                                    )}
                                </Swiper>
                                <Button
                                    disableRipple
                                    className='arrowRight'
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <ChevronRightIcon
                                        sx={{ color: '#7F7F7F' }}
                                    />
                                </Button>
                            </div>
                        ) : (
                            <div>
                                {data.customer_reviews.map(
                                    (review: Review, index: number) => (
                                        <div className='mb-8' key={index}>
                                            <BioType className='body1'>
                                                &quot;{review.customer_review}
                                                &quot;
                                            </BioType>
                                            <BioType className='body2 mt-3 text-[#767676]'>
                                                {review.customer_name}
                                            </BioType>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                        {!isSpecial && isMobile && (
                            <div className='flex mx-auto w-[70%] md:w-[26.3vw] aspect-[4/3] relative'>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${data.review_image_ref}`}
                                    alt={'review-product-image'}
                                    fill
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

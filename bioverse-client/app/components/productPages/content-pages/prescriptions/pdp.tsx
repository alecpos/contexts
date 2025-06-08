'use client';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Image from 'next/image';
import { useMediaQuery } from '@mui/material';
import InformationTabBox from '../../information-tab-box/information-tab-box';
import ProductImageFactory from '../../productImageFactory/productImageFactory';
import RatingStars from '../../review-components/ratingstars/ratingstars';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import styles from '../../../../styles/pdp/prescription-pdp.module.css';
import ScrollingMarqueeBar from './components/scrollingMarqueeBar';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import PDPProductPurchaseMenu from '../../productPurchaseMenu/v2/purchase-menu';

const DynamicScientificInfoBox = dynamic(
    () => import('../../scientific-information-box/scientific-information-box')
);

const DynamicHealthcareSteps = dynamic(
    () => import('./components/healthcareSteps')
);

const DynamicHeroReview = dynamic(
    () => import('../../review-components/heroreview/heroreview')
);

const DynamicFrequentlyAskedQuestions = dynamic(
    () => import('../../frequently-asked-questions/frequenly-asked-questions')
);

const DynamicSafetyInformation = dynamic(
    () => import('../../safety-infomation/safety-infomation')
);

interface Props {
    data: any;
}

export default function PrescriptionProductPage({ data }: Props) {
    const isDesktop = useMediaQuery('(min-width:640px)');

    function mapBenefitsToTaggedString(benefits: string[]): string {
        return benefits
            .map((benefit) => `[bio-bullet-item]${benefit}[/bio-bullet-item]`)
            .join('');
    }
    const taggedBenefitsString = mapBenefitsToTaggedString(data.benefits_short);

    const pathname = usePathname();

    function capitalizeFirstLetter(string: string) {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        // Enable smooth scrolling for all anchor links
        const allLinks = document.querySelectorAll('a[href^="#"]');
        allLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                let href = (e.currentTarget as HTMLElement).getAttribute(
                    'href'
                );
                document
                    .querySelector(href!)
                    ?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }, []);

    return (
        <div id={'main-container'} className='mt-[50px] md:mt-[0px]'>
            <div
                id='content-justification-container'
                className='flex justify-center mx-auto max-w-7xl overflow-hidden'
            >
                <div
                    id='content-vertical-unbound-container'
                    className='w-full md:max-w-[80vw] bg-white flex justify-center mb-[10.98vw] mt-[30px] md:mt-[90px]'
                >
                    <div
                        id='content-detail-container'
                        className='w-full inline-flex  flex-col gap-[8.6vw]'
                    >
                        <div
                            id='product-information-container'
                            className='flex flex-col relative gap-[1.8vw] md:flex-row mx-5'
                        >
                            <div
                                id='image-container'
                                className='flex p-0 flex-col items-start gap-[.833vw] flex-1 md:w-1/2 h-full   '
                            >
                                <Breadcrumbs
                                    className={`flex-[0_0_auto]`}
                                    link1={'collections'}
                                    link2={data.href}
                                    name={data.name}
                                />
                                <ProductImageFactory data={data} />
                            </div>

                            <div
                                id='product-information-text-container'
                                className='flex pt-8 flex-col items-start gap-2 flex-1'
                            >
                                <div
                                    id='product-name-rating-benefits-short-container'
                                    className='flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]'
                                >
                                    <div
                                        id='product-name-container'
                                        className='flex flex-row self-stretch w-full items-center gap-2'
                                    >
                                        <BioType
                                            className={`${styles.pdptitle}`}
                                        >
                                            {data.name.toUpperCase()}
                                        </BioType>
                                    </div>
                                    <div className='h-[1px] w-full '>
                                        <HorizontalDivider
                                            backgroundColor={'#B1B1B1'}
                                            height={1}
                                        />
                                    </div>
                                    <RatingStars
                                        className='w-[90px] h-[18px] mt-2'
                                        rating={data.rating}
                                    />
                                    <div className='inline-flex items-center gap-[.556vw] relative flex-[0_0_auto] mt-4'>
                                        <Image
                                            src={`/img/type-icons/${data.type.toLowerCase()}.svg`}
                                            alt={'icon'}
                                            width={24}
                                            height={24}
                                            unoptimized
                                        />
                                        <BioType className='body1'>
                                            {capitalizeFirstLetter(data.type)}
                                        </BioType>
                                    </div>
                                    <div className='flex flex-col items-start gap-4 self-stretch w-full relative flex-[0_0_auto] mt-4'>
                                        <span>
                                            <BioType className='body1'>
                                                {data.description_short + '.. '}
                                                <a
                                                    href='#tabs-background'
                                                    className='text-primary'
                                                >
                                                    Read more
                                                </a>
                                            </BioType>
                                        </span>

                                        {data.benefits_short && (
                                            <div className='mt-2'>
                                                <BioType className='body1bold'>
                                                    BENEFITS:
                                                </BioType>

                                                <BioType className='body1 flex flex-col align-middle '>
                                                    {taggedBenefitsString}
                                                </BioType>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <ProductPurchaseMenuNew
                                    priceData={priceData}
                                    productHref={data.href}
                                /> */}
                                {/* <ProductPurchaseMenu
                                    priceData={productPricesData}
                                /> */}
                                <PDPProductPurchaseMenu
                                    product_href={data.href}
                                />
                            </div>
                        </div>

                        <div className='flex w-full relative overflow-hidden'>
                            <div className='md:hidden flex absolute bg-gradient-radial from-[#508DC1] to-[#DFCFBA] blur-[132.5px] h-full w-full'></div>
                            <div
                                id='information-tab-and-image-container'
                                className='flex flex-col justify-center w-full self-center items-center'
                            >
                                <div className='mt-5' id='tabs-background'>
                                    <ScrollingMarqueeBar
                                        type='header'
                                        isMobile={!isDesktop}
                                    />
                                </div>
                                <div className='flex flex-row w-full m-0 my-[35px] gap-4 justify-between'>
                                    <div
                                        id='information-box'
                                        className='flex w-full md:w-[45%] h-[90%] flex-col items-start z-[1]'
                                    >
                                        <InformationTabBox
                                            instructions={data.instructions}
                                            benefits={data.benefits_long}
                                            description={data.description_long}
                                        />
                                    </div>
                                    <div
                                        id='scientist-image'
                                        className='w-[40%] hidden md:flex justify-center align-middle overflow-hidden'
                                    >
                                        <Image
                                            src={
                                                '/img/long-description/happy-lady.png'
                                            }
                                            alt={'Scientist Image'}
                                            width={456}
                                            height={528} // Set the height directly based on the aspect ratio
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mx-5 md:mx-0'>
                            <DynamicScientificInfoBox
                                scienceDescrtiption={data.scientific_research}
                                citations={data.citations}
                            />
                        </div>

                        <div className=''>
                            <DynamicHealthcareSteps
                                data={data}
                                isMobile={!isDesktop}
                            />
                        </div>

                        <div className='mb-8 mx-5 md:mx-0'>
                            <DynamicHeroReview
                                href={data.href}
                                data={data}
                                isMobile={!isDesktop}
                            />
                        </div>

                        <div className='mx-5 md:mx-0'>
                            <DynamicFrequentlyAskedQuestions
                                questions={data.faq_questions}
                            />
                        </div>

                        <div className='mx-5 md:mx-0'>
                            <DynamicSafetyInformation
                                data={data.safety_information}
                                data_link={data.safety_info_link}
                                bold_text={data.safety_info_bold}
                                safety_bullet={data.safety_bullet}
                            />
                            {/* {showDrawer && (
                <div
                  className="md:hidden"
                  style={{ height: `${isDrawerOpen ? "330px" : "95px"}` }}
                ></div>
              )} */}
                        </div>
                    </div>
                </div>

                {/* <div className="md:hidden">
					<MobileDrawerButton
						data={data}
						priceData={priceData}
						productHref={data.href}
					/>
				</div> */}
            </div>
        </div>
    );
}

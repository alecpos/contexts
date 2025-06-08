'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from '@mui/material';

import ScientificInfoBox from '../../scientific-information-box/scientific-information-box';
import InformationTabBox from '../../information-tab-box/information-tab-box';
import ProductImageFactory from '../../productImageFactory/productImageFactory';
// import ProductPurchaseMenu from "../../productPurchaseMenu/productPurchaseMenu";

import HeroReview from '../../review-components/heroreview/heroreview';
import RatingStars from '../../review-components/ratingstars/ratingstars';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import FrequentlyAskedQuestions from '../../frequently-asked-questions/frequenly-asked-questions';
import SafetyInformation from '../../safety-infomation/safety-infomation';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import ProductPurchaseMenuNew from '../../productPurchaseMenu/product-purchase-menu-new';
import MobileDrawerButton from '../../mobileDrawer/MobileDrawerButton';
import HealthcareSteps from './components/healthcareSteps';

import styles from '../../../../styles/pdp/prescription-pdp.module.css';
import ScrollingMarqueeBar from './components/scrollingMarqueeBar';

interface Props {
    data: any;
    priceData: any;
}

export default function PrescriptionProductPage({ data, priceData }: Props) {
    const isNotMobile = useMediaQuery('(min-width:640px)');
    const [loading, setLoading] = useState<boolean>(true);
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const referenceButton = document.getElementById(
                'startButtonContainer'
            );

            if (referenceButton) {
                const divPosition = referenceButton.getBoundingClientRect();

                // Set the condition to check if the div is fully above the viewport
                const isDivAboveViewport = divPosition.bottom <= 50;

                // Update the state
                setShowDrawer(isDivAboveViewport);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const [showAllFAQs, setShowAllFAQs] = useState(false);

    useEffect(() => {
        // Trigger the fade-in effect when the component mounts
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.classList.add('fadeInUp');
        }
        setLoading(false);
    }, []);

    function mapBenefitsToTaggedString(benefits: string[]): string {
        return benefits
            .map((benefit) => `[bio-bullet-item]${benefit}[/bio-bullet-item]`)
            .join('');
    }
    const taggedBenefitsString = mapBenefitsToTaggedString(data.benefits_short);

    if (loading) {
        return null;
    }

    function capitalizeFirstLetter(string: string) {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div>
            {!isNotMobile ? (
                //Mobile Version
                <div className={`flex justify-center w-full`}>
                    <div
                        id='page-container'
                        className='w-full bg-white flex justify-center mb-[10.98vw] mt-[30px] md:mt-[90px]'
                    >
                        <div className='w-full inline-flex  flex-col gap-[8.6vw]'>
                            <div className='flex flex-col relative gap-[1.8vw] md:flex-row mx-5'>
                                <div className='flex p-0 flex-col items-start gap-[.833vw] flex-1 md:w-1/2 h-full   '>
                                    <Breadcrumbs
                                        className={`flex-[0_0_auto]`}
                                        link1={'collections'}
                                        link2={data.href}
                                        name={data.name}
                                    />
                                    <ProductImageFactory data={data} />
                                </div>

                                <div className='flex pt-[2vw] flex-col items-start gap-[1.67vw] flex-1'>
                                    <div className='flex flex-col items-start gap-[.833vw] relative self-stretch w-full flex-[0_0_auto]'>
                                        <div className='flex flex-row self-stretch w-full items-center gap-2'>
                                            <BioType
                                                className={`${styles.pdptitle}`}
                                            >
                                                {data.name.toUpperCase()}
                                            </BioType>
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
                                                {capitalizeFirstLetter(
                                                    data.type
                                                )}
                                            </BioType>
                                        </div>
                                        <div className='flex flex-col items-start gap-4 self-stretch w-full relative flex-[0_0_auto] mt-4'>
                                            <span>
                                                <BioType className='body1'>
                                                    {data.description_short +
                                                        '.. '}
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
                                </div>
                            </div>

                            <div className='flex w-full relative overflow-hidden'>
                                <div
                                    id='tabs-background'
                                    className='flex absolute bg-gradient-radial from-[#508DC1] to-[#DFCFBA] blur-[132.5px] h-full w-full'
                                ></div>
                                <div className='flex flex-col justify-center w-full self-center items-center'>
                                    <div className='mt-5'>
                                        <ScrollingMarqueeBar
                                            type='header'
                                            isMobile={true}
                                        />
                                    </div>
                                    <div className='flex flex-row w-full m-0 my-[35px] items-center justify-start'>
                                        <div
                                            id='description_long'
                                            className='flex w-full md:w-[38.3vw] h-[90%] p-0 flex-col items-start gap-0 flex-shrink-0 z-[1]'
                                        >
                                            <InformationTabBox
                                                instructions={data.instructions}
                                                benefits={data.benefits_long}
                                                description={
                                                    data.description_long
                                                }
                                            />
                                        </div>
                                        <div className='relative w-[33.67vw] h-[20.28vw] hidden md:flex'>
                                            <Image
                                                src={
                                                    '/img/product-page/product-static-molecule.png'
                                                }
                                                alt={'Molecule Image'}
                                                fill
                                                sizes='(max-width: 100px) 456px'
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mx-5'>
                                <ScientificInfoBox
                                    scienceDescrtiption={
                                        data.scientific_research
                                    }
                                    citations={data.citations}
                                />
                            </div>

                            <div className=''>
                                <HealthcareSteps data={data} isMobile={true} />
                            </div>

                            <div className='mb-8 mx-5'>
                                <HeroReview
                                    href={data.href}
                                    data={data}
                                    isMobile={true}
                                />
                            </div>

                            <div className='mx-5'>
                                <FrequentlyAskedQuestions
                                    questions={data.faq_questions}
                                />
                            </div>

                            <div className='mx-5'>
                                <SafetyInformation
                                    data={data.safety_information}
                                    data_link={data.safety_info_link}
                                    bold_text={data.safety_info_bold}
                                    safety_bullet={data.safety_bullet}
                                />
                                {showDrawer && (
                                    <div
                                        style={{
                                            height: `${
                                                isDrawerOpen ? '330px' : '95px'
                                            }`,
                                        }}
                                    ></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {showDrawer && (
                        <MobileDrawerButton
                            data={data}
                            priceData={priceData}
                            productHref={data.href}
                        />
                    )}
                </div>
            ) : (
                <div className='w-full overflow-hidden flex justify-center '>
                    {/**
                     *
                     *  vvv DESKTOP VERSION BELOW - DESKTOP VERSION BELOW vvv
                     *
                     */}
                    <div
                        id='page-container'
                        className='w-[80vw] bg-white flex justify-center mb-[10.98vw] mt-[30px] md:mt-[90px]  '
                    >
                        <div className='w-full inline-flex justify-center flex-col gap-[8.6vw]   '>
                            <div className='flex flex-col relative gap-[1.8vw] md:flex-row   '>
                                <div className='flex p-0 flex-col items-start gap-[.833vw] flex-1 md:w-1/2 h-full   '>
                                    <Breadcrumbs
                                        className={`flex-[0_0_auto] `}
                                        link1={'collections'}
                                        link2={data.href}
                                        name={data.name}
                                    />
                                    <ProductImageFactory data={data} />
                                </div>

                                <div className='flex pt-[2vw] flex-col items-start gap-[1.67vw] flex-1   '>
                                    <div className='flex flex-col items-start gap-[.833vw] relative self-stretch w-full flex-[0_0_auto]   '>
                                        <div className='flex flex-row self-stretch w-full items-center gap-2   '>
                                            {/* <BioType className="h4 md:h3 text-[#286BA2]"> */}
                                            <div className={styles.pdptitle}>
                                                {data.name.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className='h-[1px] w-full '>
                                            <HorizontalDivider
                                                backgroundColor={'#B1B1B1'}
                                                height={1}
                                            />
                                        </div>
                                        <RatingStars
                                            className='w-[90px] h-[18px]'
                                            rating={data.rating}
                                        />
                                        <div className='inline-flex items-center gap-[.556vw] relative flex-[0_0_auto] '>
                                            <Image
                                                src={`/img/type-icons/${data.type.toLowerCase()}.svg`}
                                                alt={'icon'}
                                                width={24}
                                                height={24}
                                                unoptimized
                                            />
                                            <BioType className='label2'>
                                                {capitalizeFirstLetter(
                                                    data.type
                                                )}
                                            </BioType>
                                        </div>
                                        <div className='flex flex-col items-start gap-4 self-stretch w-full relative flex-[0_0_auto]'>
                                            <span>
                                                <BioType className='body1'>
                                                    {data.description_short +
                                                        '.. '}
                                                    <a
                                                        href='#tabs-background'
                                                        className='text-primary'
                                                    >
                                                        Read More
                                                    </a>
                                                </BioType>
                                            </span>
                                            <div>
                                                {data.benefits_short && (
                                                    <div>
                                                        <div className='body1bold'>
                                                            BENEFITS:
                                                        </div>
                                                        {data.benefits_short.map(
                                                            (
                                                                benefit: string,
                                                                index: number
                                                            ) => (
                                                                <BioType
                                                                    key={index}
                                                                    className='body1 flex align-middle'
                                                                >
                                                                    <span className='mr-5'>
                                                                        •
                                                                    </span>{' '}
                                                                    <span>
                                                                        {
                                                                            benefit
                                                                        }
                                                                    </span>
                                                                </BioType>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <ProductPurchaseMenuNew
                                        priceData={priceData}
                                        productHref={data.href}
                                    /> */}
                                </div>
                            </div>

                            <div className='flex w-[100vw] relative overflow-y-hidden mx-[-10vw] justify-center '>
                                <span id='tabs-background'></span>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='bg-[#F9F8FF] z-10 rounded-md mt-8 self-center p-2 text-center w-[78vw]'>
                                        <ScrollingMarqueeBar
                                            isMobile={false}
                                            type='header'
                                        />
                                    </div>
                                    <div className='flex flex-row w-[78.9vw] m-0 my-[35px] justify-between'>
                                        <div
                                            id='description_long'
                                            className='flex w-full md:w-[49%] h-[90%] flex-col gap-0 flex-shrink-0 z-[1]'
                                        >
                                            <InformationTabBox
                                                instructions={data.instructions}
                                                benefits={data.benefits_long}
                                                description={
                                                    data.description_long
                                                }
                                            />
                                        </div>
                                        <div className='relative w-[40%] aspect-video max-h-[62vw] hidden md:flex'>
                                            <Image
                                                src={
                                                    '/img/long-description/happy-lady.png'
                                                }
                                                alt={'Molecule Image'}
                                                fill
                                                sizes='(max-width: 4000px)'
                                                unoptimized
                                            />
                                            {/* <div className="w-full h-full overflow-hidden rounded-3xl">
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          width="100%"
                          height="100%"
                          style={{
                            transform: "rotate(90deg)",
                            objectFit: "cover",
                          }}
                          className={`rounded-3xl`}
                        >
                          <source src="/mechanism_of_action_pdp_video.mp4" />
                        </video>
                      </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ScientificInfoBox
                                scienceDescrtiption={data.scientific_research}
                                citations={data.citations}
                            />

                            <HealthcareSteps data={data} isMobile={false} />

                            <div className='mb-8'>
                                <HeroReview
                                    href={data.href}
                                    data={data}
                                    isMobile={false}
                                />
                            </div>

                            <FrequentlyAskedQuestions
                                questions={data.faq_questions}
                            />

                            <div>
                                <SafetyInformation
                                    data={data.safety_information}
                                    data_link={data.safety_info_link}
                                    bold_text={data.safety_info_bold}
                                    safety_bullet={data.safety_bullet}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

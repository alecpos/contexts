import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

import { Typography } from '@mui/material';

import Image from 'next/image';
import Link from 'next/link';

import ScientificInfoBox from '../../scientific-information-box/scientific-information-box';
import BiomarkersInformationBox from '../../biomarkers/biomarkers-box';
import SupplementProductImageFactory from '../../supplementProductImageFactory/supplementProductImageFactory';

import RatingStars from '../../review-components/ratingstars/ratingstars';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import OptimizedSuggestions from '../../optimized-suggestions/optimizedSuggestions';
import FrequentlyAskedQuestions from '../../frequently-asked-questions/frequenly-asked-questions';

/**
 * MOCK DATA IMPORTS : REMOVE THESE AFTER SETTING UP DATABASE COMPLETELY
 */
import mockSuggestionCardDataArray from '../../optimized-suggestions/mock-data-optimized-suggestions/mockdata';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';

/**
 * Searches database based on prescriptionHref which is unique for all table values.
 */
interface Props {
    supplementHref: string;
}

const toLowerCase = (str: string) => str.toLowerCase();

//Revalidation occurs every 60 seconds.
export const revalidate = 60;
export default async function SupplementProductPage({ supplementHref }: Props) {
    /**
     * Supabase response.
     * Searches row with href matching prop
     * takes 1st result only - but supabase should never return more than 1
     */
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('href', toLowerCase(supplementHref))
        .single();

    if (error) {
        console.error('Error fetching data:', error);
    }

    return (
        <div>
            {/**
             * The below div's are necessary for
             */}
            {data ? (
                <div className='bg-white flex justify-center w-full mb-[10.98vw]'>
                    <div className='w-[78.3vw] inline-flex justify-center flex-col gap-[8.6vw]'>
                        <div className='flex relative gap-[1.8vw]'>
                            {/** MAIN IMAGE DISPLAY
                             * Below is the contents containing the product image and accessories. Breadcrumbs are clickable links appearing above.
                             * The Product Image Factory generates: Main image, seals, chips, and preview images (clickable)
                             *
                             * Breadcrumbs Props:
                             * - name: name of data to display
                             * - link1: category to link on click
                             * - link2: product href to link to on click
                             *
                             * Product Image Factory Props:
                             * - data: accepts the entirety of the data
                             * - TODO: pass down only necessary information here.
                             *
                             */}
                            <div
                                className={`flex p-0 flex-col items-start gap-[.833vw] flex-1 w-1/2 h-full`}
                            >
                                <Breadcrumbs
                                    className={`!flex-[0_0_auto] text-gray-800`}
                                    link1={data.category}
                                    link2={data.href}
                                    name={data.name}
                                />
                                <SupplementProductImageFactory data={data} />
                            </div>

                            <div className='flex pt-[2vw] flex-col items-start gap-[1.67vw] flex-1'>
                                <div className='flex flex-col items-start gap-[.833vw] relative self-stretch w-full flex-[0_0_auto]'>
                                    {/** ITEM TITLE + DIVIDER
                                     * Below div contains the title of the page as well as the horizontal divider below it.
                                     * Divider Horizontal props:
                                     * - divider: divider image reference.
                                     */}
                                    <div className='flex flex-row gap-[.278vw] relative self-stretch w-full flex-[0_0_auto] items-center'>
                                        <div>
                                            <Typography
                                                className={`h3`}
                                                style={{ color: '#286BA2' }}
                                            >
                                                {data.name}
                                            </Typography>
                                        </div>
                                        <HorizontalDivider
                                            backgroundColor={'#B1B1B1'}
                                            height={1}
                                        />
                                    </div>

                                    {/** STAR RATING
                                     * The below img is the star rating. The style clipPath cuts the top | left | bottom | right of the image. =
                                     * a Calculation is being used to calculate and round the rating.
                                     */}
                                    <RatingStars
                                        rating={data.rating}
                                        className={''}
                                    />

                                    {/** ICON + TYPE
                                     * Below is Information regarding the type and the type as name
                                     * Type icons are stored in ./img/type-icons folder.
                                     */}
                                    <div className='inline-flex items-center gap-[.556vw] relative flex-[0_0_auto] mr-[-.417vw]'>
                                        <img
                                            className='relative w-[1.67vw] h-[1.67vw]'
                                            alt='Injection'
                                            src={`/img/type-icons/${data.type.toLowerCase()}.svg`}
                                        />
                                        <div>
                                            <Typography className={`label2`}>
                                                {data.type.toUpperCase()}
                                            </Typography>
                                        </div>
                                    </div>

                                    {/** DESCRIPTION
                                     * Element information regarding description
                                     */}
                                    <div className='flex flex-col items-start gap-[.833vw] self-stretch w-full relative flex-[0_0_auto]'>
                                        <div className="relative self-stretch mt-[-.069vw] [font-family:'Neue_Haas_Grotesk_Text_Pro-Regular',Helvetica] font-normal text-mdsyslighton-surface text-[1.11vw] leading-[1.11vw]">
                                            <span>
                                                <Typography
                                                    className={`body1 w-[38.3vw] `}
                                                >
                                                    {data.description_short +
                                                        ' '}
                                                    <Link
                                                        href='#description_long'
                                                        className='underline'
                                                    >
                                                        Read more..
                                                    </Link>
                                                </Typography>
                                            </span>
                                            {/**
                                             * Note: This link to redirect to # anchor does not
                                             * account for layout offset, so you have to set the anchor above by the navbar height
                                             */}

                                            <br />
                                            <br />

                                            {/* BENEFITS SHORT FORM
                                             * Mapping Benefits Data with class name. Added bullet point before each benefit.
                                             */}
                                            {data.benefits_short && (
                                                <>
                                                    {data.benefits_short.map(
                                                        (
                                                            benefit: string,
                                                            index: number
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className='body1'
                                                            >
                                                                • {benefit}
                                                            </div>
                                                        )
                                                    )}
                                                    <br />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/** PRICE & PURCHASE SECTION
                                 * A product purchase component is made here:
                                 * props:
                                 */}
                            </div>
                        </div>

                        {/**
                         * DESCRIPTION BENEFITS INSTRUCTIONS TABS
                         */}
                        <div className='flex w-[78.3vw] p-0 justify-between items-start'>
                            <div
                                className='flex w-[38.3vw] p-0 flex-col items-start gap-0 flex-shrink-0'
                                id='description_long'
                            >
                                PLACEHOLDER FOR INFORMATION TABS
                            </div>
                            <div className='flex relative w-[31.67vw] h-[20.28vw]'>
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

                        {/**
                         * BACKED BY SCIENTIFIC RESEARCH SECTION
                         */}
                        <ScientificInfoBox
                            scienceDescrtiption={data.scientific_research}
                            citations={data.citations}
                        />

                        {/**
                         *
                         * COMPONENT: BIOMARKER INFORMATION BOX
                         *
                         */}
                        {/*<BiomarkersInformationBox
              productName={data.name}
              productId={data.id}
              />*/}

                        {/**
                         *
                         * REVIEWS SECTION
                         */}
                        <div>PLACEHOLDER FOR REVIEWS!!</div>

                        {/**
                         * Optimize Further Component
                         *
                         */}
                        <OptimizedSuggestions
                            suggestionCardList={mockSuggestionCardDataArray}
                        />

                        {/**
                         * FREQUENTLY ASKED QUESTIONS SECTION: FAQ
                         *
                         */}
                        <FrequentlyAskedQuestions
                            questions={data.faq_questions}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div>Loading...</div>
                </>
            )}
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CitationsBox from './citations-box';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import styles from '../../../styles/pdp/prescription-pdp.module.css';
import { useMediaQuery } from '@mui/material';

interface Props {
    scienceDescrtiption: string;
    citations: string[];
}

/**
 * Scientific Information Box : displays science backed information and interactible citations component.
 *  Citations are collapsible.
 *
 * @returns
 *
 */

export default function ScientificInfoBox({
    scienceDescrtiption,
    citations,
}: Props) {
    const isNotMobile = useMediaQuery('(min-width:640px)');

    return (
        <div>
            {!isNotMobile ? (
                <div className='flex flex-col md:flex-row p-0 items-start gap-[8.47vw] '>
                    <div className='flex relative w-full md:w-[25vw] md:h-[21.46vw]'>
                        {/* <Image
              src={"/img/product-page/product-static-istock-test.jpg"}
              alt={"scientific-research-image"}
              fill
              sizes="456px"
            /> */}
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            width='100%'
                            height='auto'
                            className='rounded w-[105vw] mx-[-5%]'
                        >
                            <source src='/mechanism_of_action_pdp_video.mp4' />
                        </video>
                    </div>
                    <div className='flex flex-col p-0 flex-shrink-0 items-start gap-[2.5vw] w-full md:w-[45vw]'>
                        <div className='inline-flex flex-col items-start gap-[0.83vw] relative flex-[0_0_auto]'>
                            <div
                                className={`flex flex-col md:flex-row gap-[1.67vw] justify-start relative w-full flex-[0_0_auto]`}
                            >
                                <BioType
                                    className='h6 md:h4 text-[#286BA2]'
                                    id='scientific-research-header'
                                >
                                    <span
                                        className={`${styles.pdpheaderMobile}`}
                                    >
                                        Mechanism of Action
                                    </span>
                                </BioType>
                                <div className='flex md:flex-1 h-[1px] md:self-center'>
                                    <HorizontalDivider
                                        backgroundColor={'#B1B1B1'}
                                        height={1}
                                    />
                                </div>
                            </div>

                            <BioType
                                className='body1'
                                id='scientific-research-contents'
                            >
                                {scienceDescrtiption}
                            </BioType>
                        </div>

                        {/* <div className="-mt-2">
              {citations.length > 0 && (
                <CitationsBox
                  className="flex p-0 flex-col items-start gap-[.83vw]"
                  citations={citations}
                />
              )}
            </div> */}
                    </div>
                </div>
            ) : (
                <div className='flex flex-col md:flex-row p-0 items-start gap-6'>
                    <div className='flex relative w-full md:w-[40vw] aspect-[1.75]'>
                        {/* <Image
              src={"/img/product-page/product-static-istock-test.jpg"}
              alt={"scientific-research-image"}
              fill
              sizes="456px"
            /> */}
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            width='100%'
                            height='auto'
                            className='rounded'
                        >
                            <source src='/mechanism_of_action_pdp_video.mp4' />
                        </video>
                    </div>
                    <div className='flex flex-col p-0 flex-shrink-0 items-start gap-[2.5vw] w-full md:w-[40vw] overflow-hidden'>
                        <div className='inline-flex flex-col items-start gap-[0.83vw] relative flex-[0_0_auto]'>
                            <div className='flex flex-col md:flex-row gap-[1.67vw] justify-start relative w-full flex-[0_0_auto]'>
                                <BioType
                                    className='h6 md:h4 !text-[#286BA2]'
                                    id='scientific-research-header'
                                >
                                    Mechanism of Action
                                </BioType>
                                <div className='flex md:flex-1 h-[1px] md:self-center'>
                                    <HorizontalDivider
                                        backgroundColor={'#B1B1B1'}
                                        height={1}
                                    />
                                </div>
                            </div>

                            <BioType
                                className='body1'
                                id='scientific-research-contents'
                            >
                                {scienceDescrtiption}
                            </BioType>
                        </div>

                        {/* <div className='-mt-10'>
              {citations.length > 0 && (
                <CitationsBox
                  className='flex p-0 flex-col items-start gap-[.83vw]'
                  citations={citations}
                />
              )}
            </div> */}
                    </div>
                </div>
            )}
        </div>
    );
}

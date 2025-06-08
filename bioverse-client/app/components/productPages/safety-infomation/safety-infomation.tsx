'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import styles from '../../../styles/pdp/prescription-pdp.module.css';

interface Props {
    data: any;
    data_link: any;
    bold_text: any;
    safety_bullet?: string[]; // Optional prop for safety bullet points
}

export default function SafetyInformation({
    data,
    data_link,
    bold_text,
    safety_bullet,
}: Props) {
    const paragraphs = data; // Accessing the 'data' array
    const dataLinks = data_link; // Accessing the 'data_link' array
    const boldText = bold_text;

    const isNotMobile = useMediaQuery('(min-width:640px)');

    return (
        <div id='safety-information-main-container'>
            {!isNotMobile ? (
                <div>
                    <div className='w-full flex flex-col md:flex-row gap-[1.67vw] justify-start'>
                        <BioType className='h6 md:h4 !text-[#286BA2] mb-1'>
                            <span className={`${styles.pdpheaderMobile}`}>
                                Important Safety Information & Side Effects
                            </span>
                        </BioType>
                        <div className='flex md:flex-1 h-[1px] md:self-center'>
                            <HorizontalDivider
                                backgroundColor={'#B1B1B1'}
                                height={1}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row w-[70.3vw] p-0 items-start gap-[8.47vw]'>
                        {isNotMobile && (
                            <div className='flex relative w-full aspect-[1/1] md:w-[20vw] md:h-[21.46vw]'></div>
                        )}
                        <BioType className='body3 md:body1 paragraph-container w-[95vw] '>
                            {Array.isArray(paragraphs) &&
                                paragraphs.map((paragraph, index) => (
                                    <div
                                        key={index}
                                        className='mt-5 body1'
                                        dangerouslySetInnerHTML={{
                                            __html: paragraph,
                                        }}
                                    />
                                ))}

                            {Array.isArray(safety_bullet) &&
                                safety_bullet.length > 0 && (
                                    <ul className='mb-10 ml-4 body1 w-[90vw]'>
                                        {safety_bullet.map((bullet, index) => (
                                            <li key={index}>{bullet}</li>
                                        ))}
                                    </ul>
                                )}

                            {Array.isArray(dataLinks) &&
                                dataLinks.map((paragraph, index) => {
                                    const linkMatch = paragraph.match(
                                        /\[([^[]+)\]\(([^)]+)\)/
                                    );

                                    if (linkMatch) {
                                        const preLinkText = paragraph.substr(
                                            0,
                                            linkMatch.index
                                        );
                                        const linkText = linkMatch[1];
                                        const linkUrl = linkMatch[2];
                                        return (
                                            <div
                                                key={index}
                                                className='paragraph mt-5 body1'
                                            >
                                                {preLinkText}
                                                <a
                                                    href={linkUrl}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='light-tiffany-blue'
                                                >
                                                    {linkText}
                                                </a>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={index}
                                                className='paragraph mt-5'
                                                dangerouslySetInnerHTML={{
                                                    __html: paragraph,
                                                }}
                                            />
                                        );
                                    }
                                })}

                            <div className='mt-5 body1bold'>{boldText}</div>
                        </BioType>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='w-full flex flex-col md:flex-row gap-[1.67vw] justify-start'>
                        <BioType className='h6 md:h4 !text-[#286BA2] mb-1'>
                            Important Safety Information & Side Effects
                        </BioType>
                        <div className='flex md:flex-1 h-[1px] md:self-center'>
                            <HorizontalDivider
                                backgroundColor={'#B1B1B1'}
                                height={1}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row justify-end items-start gap-[8.47vw] '>
                        <BioType className='body3 md:body1 paragraph-container  w-[45.3vw]'>
                            {/* BioType 内容 */}
                            <div>
                                {Array.isArray(paragraphs) &&
                                    paragraphs.map((paragraph, index) => (
                                        <div
                                            key={index}
                                            className='mt-5 body1'
                                            dangerouslySetInnerHTML={{
                                                __html: paragraph,
                                            }}
                                        />
                                    ))}

                                {Array.isArray(safety_bullet) &&
                                    safety_bullet.length > 0 && (
                                        <ul className='mb-10 ml-4 body1'>
                                            {safety_bullet.map(
                                                (bullet, index) => (
                                                    <li key={index}>
                                                        {bullet}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}

                                {Array.isArray(dataLinks) &&
                                    dataLinks.map((paragraph, index) => {
                                        const linkMatch = paragraph.match(
                                            /\[([^[]+)\]\(([^)]+)\)/
                                        );

                                        if (linkMatch) {
                                            const preLinkText =
                                                paragraph.substr(
                                                    0,
                                                    linkMatch.index
                                                );
                                            const linkText = linkMatch[1];
                                            const linkUrl = linkMatch[2];
                                            return (
                                                <div
                                                    key={index}
                                                    className='paragraph mt-5 body1'
                                                >
                                                    {preLinkText}
                                                    <a
                                                        href={linkUrl}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='light-tiffany-blue'
                                                    >
                                                        {linkText}
                                                    </a>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={index}
                                                    className='paragraph mt-5'
                                                    dangerouslySetInnerHTML={{
                                                        __html: paragraph,
                                                    }}
                                                />
                                            );
                                        }
                                    })}

                                <div className='mt-5 body1bold'>{boldText}</div>
                            </div>
                        </BioType>
                    </div>
                </div>
            )}{' '}
        </div>
    );
}

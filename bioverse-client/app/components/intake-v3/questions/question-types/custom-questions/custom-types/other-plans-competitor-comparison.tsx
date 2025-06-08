'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import ContinueButton from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    QUESTION_HEADER_TAILWIND,
    QUESTION_SUBTITLE_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND
} from '@/app/components/intake-v3/styles/intake-tailwind-declarations';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';

interface Props {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function NoomCompetitorComparisonsQuestion({
    handleContinueButton,
    isButtonLoading,
}: Props) {

    
    return (
        <div className="flex flex-col items-center justify-center w-full mt-[1.25rem] md:mt-[48px] mb-[2.5rem] md:mb-[0px]">
            <p className={`inter_h5_regular mb-[1rem] md:mb-[16px] text-start w-full`}>Why do patients switch to Bioverse?</p>


            <div className="flex flex-row w-full">
                {/* first column */}
                <div 
                    className="flex flex-col  w-full md:max-w-[252px] inter_body_small_regular "
                    style={{
                        borderTop: `1px solid #fafafa`,
                    }}
                >
                    <p className="h-[3.25rem] md:h-[52px]"></p>
                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px] md:pr-[12px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                            
                        }}
                    >
                        Access to compounded Semaglutide
                    </p>
                
                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px] md:pr-[20px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Access to compounded Tirzepatide
                    </p>

                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px] pr-[2rem] md:pr-0"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        100% online, no in-person visits
                    </p>

                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px] pr-[2rem] md:pr-0"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Long-term health tracking
                    </p>

                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px] pr-[12px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Monthly membership fee
                    </p>

                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Hidden fees
                    </p>

                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px] pr-[1rem] md:pr-[40px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Access to Ozempic® and Wegovy®
                    </p>

                    <p 
                        className="flex items-center justify-start h-[3.25rem] md:h-[52px] "
                        style={{
                            // borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                            paddingRight: '20px'
                        }}
                    >
                        Access to Mounjaro® and Zepbound™
                    </p>
                </div>
                {/* end of first column */}

                {/* second column */}
                <div 
                    className="flex flex-col  w-full max-w-[5.63rem] md:max-w-[120px] inter_body_small_regular"
                    style={{
                        borderRadius: `12px`,
                        border: `1px solid  #AFDBA1`,
                        backgroundColor: `rgba(204, 251, 182, 0.10)`,
                        boxShadow: '0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 0px 16px 0px rgba(204, 251, 182, 0.20)'
                    }}
                >
                    <p className="flex items-center justify-center h-[3.25rem] md:h-[52px] w-[4rem] md:w-full mx-auto">
                        {renderLogo()}
                    </p>

                    <p 
                        className="flex items-center justify-center text-center inter_body_small_bold text-[#7FA274] px-[12px] h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        As low as $129/mo
                    </p>
                
                    <p 
                        className="flex items-center justify-center text-center inter_body_small_bold text-[#7FA274] px-[12px] h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        As low as $229/mo
                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderCheckmark()}

                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]" 
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderCheckmark()}
                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderXMark()}
                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderXMark()}
                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderCheckmark()}
                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                    
                    >
                        {renderCheckmark()}
                    </p>
                </div> 
                {/* end of second column */}


                {/* third column */}
                <div 
                    className="flex flex-col  w-full  max-w-[5.63rem] md:max-w-[120px] inter_body_small_regular"
                    style={{
                        borderTop: `1px solid #fafafa`,
                    }}
                >
                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                    >
                        Other plans
                    </p>

                    <p 
                        className="flex items-center justify-center text-center inter_body_small text-[#D11E66] px-[1rem] md:px-[25px] h-[3.25rem] md:h-[52px]" 
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Up to $450/mo
                    </p>
                
                    <p 
                        className="flex items-center justify-center text-center inter_body_small text-[#D11E66] px-[12px] h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Does not offer
                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderCheckmark('rgba(102, 102, 102, 0.20)')}

                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderXMark('#D11E66')}

                    </p>

                    <p 
                        className="flex items-center justify-center inter_body_small text-center text-[#D11E66] px-[1rem] md:px-[25px] h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        Up to $249/mo
                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"

                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                        {renderCheckmark('rgba(102, 102, 102, 0.20)')}
                        </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                        }}
                    >
                                                {renderXMark('#D11E66')}

                    </p>

                    <p 
                        className="flex items-center justify-center h-[3.25rem] md:h-[52px]"
                        style={{
                            // borderBottom: `1px solid rgba(0, 6, 38, 0.1)`,
                            height: '52px'
                        }}
                    >
                                                {renderXMark('#D11E66')}

                    </p>
                </div>
                {/* end of third column */}
            </div>
            <div
                className={`w-full md:w-1/3 mx-auto md:flex md:justify-center mt-[1.25rem] md:mt-[48px]`}
            >
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}



const renderLogo = () => {
    return (
        <div className={`flex justify-center w-[7rem] md:w-[94px] mx-auto`}>
        <svg
            xmlns='http://www.w3.org/2000/svg'
            className={``}
            viewBox='0 0 134 23'
            fill='none'
        >
            <path
                d='M21.6067 7.26434C20.0966 7.23414 18.4354 7.63886 17.3964 8.7745L17.4085 3.35603C17.4085 3.01171 17.4266 2.6674 17.3722 2.33516C17.1306 0.843117 16.4359 0.450474 14.8895 0.921645C13.5606 1.32033 12.4612 1.58612 11.2168 1.77338C8.23272 2.22039 5.35132 1.7915 2.5847 0.613571C2.11957 0.414229 1.69672 0.269253 1.27387 0.643774C0.808743 1.06058 0.693971 1.62236 0.935597 2.19018C1.5155 3.59766 2.70551 4.23193 4.08882 4.47959C5.65939 4.75746 7.19372 4.49168 8.68577 3.86949C9.49522 3.52517 10.649 3.01775 11.5068 2.81841C12.292 2.63115 12.8538 2.96339 13.0713 3.62786C13.1257 3.81512 13.1619 4.03259 13.1619 4.29837V22.7224H13.5727C14.0438 22.1546 14.8593 21.6834 15.6748 21.6834C16.3634 21.6834 16.9313 22.0277 17.5595 22.3116C18.7555 22.8432 20.0724 22.9399 20.9846 22.9399C23.1834 22.9399 24.6935 22.215 25.9137 21.1518C27.5447 19.7081 28.4267 17.1348 28.3964 14.6521C28.336 10.5384 25.8835 7.30058 21.6128 7.27038L21.6067 7.26434ZM23.5216 20.2518C22.7968 21.919 21.4497 22.523 20.1932 22.523C18.7495 22.4928 17.3964 21.6774 17.3964 19.539V9.26984C17.9642 8.92552 18.6227 8.76846 19.4381 8.76846C22.7968 8.76846 24.1197 12.852 24.1801 15.8662C24.2103 17.2798 23.9626 19.1826 23.5216 20.2518Z'
                fill='#172226'
            />
            <path
                d='M38.1468 22.9277H29.2188V22.3297C29.847 22.3297 31.5746 21.6713 31.5746 18.9651V12.9909C31.5746 11.0397 31.2001 10.037 29.5027 9.97053V9.55976L35.4104 7.57843H35.8212V18.959C35.8212 21.5686 37.6455 22.3237 38.1468 22.3237V22.9217V22.9277ZM33.3385 1.17532C34.752 1.17532 35.8876 2.34117 35.8876 3.75469C35.8876 5.1682 34.758 6.30385 33.3385 6.30385C31.9189 6.30385 30.8256 5.138 30.8256 3.75469C30.8256 2.37137 31.925 1.17532 33.3385 1.17532Z'
                fill='#172226'
            />
            <path
                d='M133.448 19.092C132.379 20.1008 130.778 20.6021 129.171 20.6021C127.884 20.6021 126.592 20.2578 125.68 19.5329C124.012 18.2463 123.257 16.3556 123.13 14.344H133.696C133.822 10.2545 131.34 7.2402 127.154 7.2402C122.152 7.2402 118.914 10.1337 118.914 15.1958C118.914 19.7565 121.898 22.9278 126.556 22.9278C129.824 22.9278 132.403 21.5445 133.756 19.3094L133.442 19.092H133.448ZM123.106 13.595C123.106 11.5532 123.704 8.34565 126.187 8.03153C128.452 7.74762 129.836 10.4236 129.836 13.3111L123.106 13.6856V13.5889V13.595Z'
                fill='#172226'
            />
            <path
                d='M86.9323 19.0859C85.8631 20.0947 84.2623 20.5961 82.6555 20.5961C81.3688 20.5961 80.0761 20.2518 79.164 19.5269C77.4968 18.2402 76.7417 16.3495 76.6148 14.3379H87.1799C87.3068 10.2484 84.8241 7.23413 80.6379 7.23413C75.6362 7.23413 72.3984 10.1276 72.3984 15.1897C72.3984 19.7504 75.3825 22.9217 80.0399 22.9217C83.3079 22.9217 85.8872 21.5384 87.2403 19.3034L86.9262 19.0859H86.9323ZM76.5846 13.5889C76.5846 11.5472 77.1826 8.33957 79.6654 8.02546C81.9306 7.74154 83.3139 10.4176 83.3139 13.305L76.5846 13.6795V13.5829V13.5889Z'
                fill='#172226'
            />
            <path
                d='M105.133 11.668C105.29 8.21272 108.624 7.23413 111.608 7.23413C113.68 7.23413 115.384 7.7053 116.483 8.58724L116.701 12.3929H116.103C115.348 9.94035 113.68 7.95901 111.041 7.95901C109.283 7.95901 108.34 8.998 108.34 10.1578C108.34 11.07 108.908 12.0123 110.098 12.4835C111.228 12.9244 112.297 13.2385 113.402 13.5829C115.698 14.3379 117.456 15.7817 117.365 18.4577C117.208 21.9492 113.97 22.9519 111.016 22.9217C109.102 22.9217 107.15 22.4506 105.55 21.7257L105.296 17.1046H105.894C106.806 19.7745 108.093 21.9794 110.702 22.1968C112.146 22.3237 113.783 21.8525 113.753 20.0585C113.753 19.3034 113.378 18.5483 112.714 18.0771C112.086 17.6059 111.234 17.2616 110.231 16.9113C107.809 16.0293 105.012 14.8997 105.139 11.6619L105.133 11.668Z'
                fill='#172226'
            />
            <path
                d='M89.2734 22.8613V22.2633C89.9017 22.2633 91.6293 21.6049 91.6293 18.8986V12.9244C91.6293 10.9733 91.2548 9.97054 89.5573 9.90409V9.49333L95.4651 7.51199H95.8759V11.5049C97.0417 9.02216 98.86 7.51199 101.222 7.51199C104.333 7.51199 104.333 11.9458 102.261 11.9458C100.781 11.976 100.31 10.6229 98.7392 10.6229C97.5431 10.6229 96.631 11.5351 95.8759 12.7613V18.9832C95.8759 21.5928 97.7002 22.2512 98.2015 22.2512V22.8492H89.2734V22.8613Z'
                fill='#172226'
            />
            <path
                d='M54.9062 9.9343V9.52354L60.1556 7.5422H60.5301L66.2204 20.0887C67.0721 18.6751 68.3286 15.6246 68.3286 13.4862C68.2984 11.1606 66.4741 10.78 66.5043 9.02217C66.5043 6.88377 70.9684 6.63006 70.9684 9.80745C70.9684 11.3478 70.1166 13.7701 69.1139 16.0293C68.0447 18.4214 66.758 20.6806 65.2781 22.8855H62.7652L57.9568 12.5439C57.1413 10.786 56.5735 9.99471 54.9062 9.9343Z'
                fill='#172226'
            />
            <path
                d='M47.0512 7.20996C42.1159 7.20996 38.9688 10.1034 38.9688 15.0689C38.9688 20.0343 41.9528 22.9278 46.8277 22.9278C51.7025 22.9278 54.6866 19.847 54.6866 15.0689C54.6866 10.2907 51.8233 7.20996 47.0451 7.20996H47.0512ZM47.0512 22.2029C43.4992 22.2029 43.2757 17.0804 43.2757 14.5312C43.2757 12.4593 43.7167 8.1523 46.5739 7.959C50.1259 7.74154 50.3494 12.9909 50.3494 15.5642C50.3494 17.6059 49.8782 22.1968 47.0512 22.1968V22.2029Z'
                fill='#172226'
            />
        </svg>
        </div>
    )
}


const renderCheckmark = (colorOverride?: string) => {

    const color = colorOverride || '#7FA274'
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.5 6.4707L9.5 17.4707L4.5 12.4707" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

const renderXMark = (colorOverride?: string) => {

    const color = colorOverride || '#7FA274'
    return (
        <svg width="119" height="53" viewBox="0 0 119 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M65.5 20.4707L53.5 32.4707M53.5 20.4707L65.5 32.4707" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}
import PropTypes from 'prop-types';
import React from 'react';

interface Props {
    breakpoint: 'desktop' | 'mobile';
    status: 'assessment' | 'visitor';
    className: any;
    logoColor: string;
}

export default function LogoHorizontal({
    breakpoint,
    status,
    className,
    logoColor = '/img/logo-color-1-4.png',
}: Props) {
    return (
        <div
            className={`inline-flex flex-col items-center justify-center relative ${className}`}
        >
            <div
                className={`inline-flex items-center flex-[0_0_auto] relative ${
                    breakpoint === 'mobile'
                        ? 'gap-[2px]'
                        : status === 'assessment'
                        ? 'gap-[3px]'
                        : status === 'visitor' && breakpoint === 'desktop'
                        ? 'gap-[4px]'
                        : ''
                }`}
            >
                <img
                    className={`object-cover relative ${
                        breakpoint === 'mobile'
                            ? 'w-[16px]'
                            : status === 'assessment'
                            ? 'w-[24px]'
                            : status === 'visitor' && breakpoint === 'desktop'
                            ? 'w-[32px]'
                            : ''
                    } ${
                        breakpoint === 'mobile'
                            ? 'h-[16px]'
                            : status === 'assessment'
                            ? 'h-[24px]'
                            : status === 'visitor' && breakpoint === 'desktop'
                            ? 'h-[32px]'
                            : ''
                    }`}
                    alt='Logo color'
                    src={
                        breakpoint === 'mobile'
                            ? '/img/logo-color-1-3.png'
                            : status === 'assessment'
                            ? '/img/logo-color-1-2.png'
                            : status === 'visitor' && breakpoint === 'desktop'
                            ? logoColor
                            : undefined
                    }
                />
                <div
                    className={`[font-family:'Ofelia_Display-Regular',Helvetica] w-fit mt-[-1.00px] tracking-[0] text-black relative font-normal whitespace-nowrap ${
                        breakpoint === 'mobile'
                            ? 'text-[16px]'
                            : status === 'assessment'
                            ? 'text-[24px]'
                            : status === 'visitor' && breakpoint === 'desktop'
                            ? 'text-[32px]'
                            : ''
                    } ${
                        breakpoint === 'mobile'
                            ? 'leading-[16px]'
                            : status === 'assessment'
                            ? 'leading-[24px]'
                            : status === 'visitor' && breakpoint === 'desktop'
                            ? 'leading-[32px]'
                            : ''
                    }`}
                >
                    BIOVERSE
                </div>
            </div>
            {status === 'visitor' && breakpoint === 'desktop' && (
                <p className="relative w-fit [font-family:'Neue_Haas_Grotesk_Display_Pro-45Light',Helvetica] font-light text-black text-[11.1px] text-center tracking-[1.44px] leading-[normal] whitespace-nowrap">
                    Vibrant Living Backed by Science
                </p>
            )}
        </div>
    );
}

LogoHorizontal.propTypes = {
    breakpoint: PropTypes.oneOf(['desktop', 'mobile']),
    status: PropTypes.oneOf(['assessment', 'visitor']),
    logoColor: PropTypes.string,
};

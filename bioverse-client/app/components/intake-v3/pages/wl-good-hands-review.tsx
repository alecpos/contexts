'use client';
import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

export default function WLGoodHandsReview({}) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const router = useRouter();

    const pushToNextRoute = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(
            fullPath,
            'semaglutide',
            search,
            false,
            'none',
            '',
        );

        router.push(`/intake/prescriptions/semaglutide/${nextRoute}?${search}`);
    };
    return (
        <div className="flex flex-col gap-12 flex-1 mt-12">
            <div className="flex flex-col gap-6 self-stretch">
                <BioType className="inter-h5-question-header">
                    You&apos;re in good hands
                </BioType>
                <div className="flex p-6 flex-col gap-8 self-stretch rounded-[24px] bg-[#D7E3EB]">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                        >
                            <path
                                d="M9.04894 1.39849C9.3483 0.477177 10.6517 0.477175 10.9511 1.39849L12.4697 6.07225C12.6035 6.48427 12.9875 6.76323 13.4207 6.76323H18.335C19.3037 6.76323 19.7065 8.00285 18.9228 8.57225L14.947 11.4608C14.5966 11.7154 14.4499 12.1668 14.5838 12.5788L16.1024 17.2526C16.4017 18.1739 15.3472 18.94 14.5635 18.3706L10.5878 15.4821C10.2373 15.2274 9.7627 15.2274 9.41221 15.4821L5.43648 18.3706C4.65276 18.94 3.59828 18.1739 3.89763 17.2526L5.41623 12.5788C5.55011 12.1668 5.40345 11.7154 5.05296 11.4608L1.07722 8.57225C0.293507 8.00285 0.696283 6.76323 1.66501 6.76323H6.57929C7.01252 6.76323 7.39647 6.48427 7.53035 6.07225L9.04894 1.39849Z"
                                fill="black"
                                fill-opacity="0.9"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                        >
                            <path
                                d="M9.04894 1.39849C9.3483 0.477177 10.6517 0.477175 10.9511 1.39849L12.4697 6.07225C12.6035 6.48427 12.9875 6.76323 13.4207 6.76323H18.335C19.3037 6.76323 19.7065 8.00285 18.9228 8.57225L14.947 11.4608C14.5966 11.7154 14.4499 12.1668 14.5838 12.5788L16.1024 17.2526C16.4017 18.1739 15.3472 18.94 14.5635 18.3706L10.5878 15.4821C10.2373 15.2274 9.7627 15.2274 9.41221 15.4821L5.43648 18.3706C4.65276 18.94 3.59828 18.1739 3.89763 17.2526L5.41623 12.5788C5.55011 12.1668 5.40345 11.7154 5.05296 11.4608L1.07722 8.57225C0.293507 8.00285 0.696283 6.76323 1.66501 6.76323H6.57929C7.01252 6.76323 7.39647 6.48427 7.53035 6.07225L9.04894 1.39849Z"
                                fill="black"
                                fill-opacity="0.9"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                        >
                            <path
                                d="M9.04894 1.39849C9.3483 0.477177 10.6517 0.477175 10.9511 1.39849L12.4697 6.07225C12.6035 6.48427 12.9875 6.76323 13.4207 6.76323H18.335C19.3037 6.76323 19.7065 8.00285 18.9228 8.57225L14.947 11.4608C14.5966 11.7154 14.4499 12.1668 14.5838 12.5788L16.1024 17.2526C16.4017 18.1739 15.3472 18.94 14.5635 18.3706L10.5878 15.4821C10.2373 15.2274 9.7627 15.2274 9.41221 15.4821L5.43648 18.3706C4.65276 18.94 3.59828 18.1739 3.89763 17.2526L5.41623 12.5788C5.55011 12.1668 5.40345 11.7154 5.05296 11.4608L1.07722 8.57225C0.293507 8.00285 0.696283 6.76323 1.66501 6.76323H6.57929C7.01252 6.76323 7.39647 6.48427 7.53035 6.07225L9.04894 1.39849Z"
                                fill="black"
                                fill-opacity="0.9"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                        >
                            <path
                                d="M9.04894 1.39849C9.3483 0.477177 10.6517 0.477175 10.9511 1.39849L12.4697 6.07225C12.6035 6.48427 12.9875 6.76323 13.4207 6.76323H18.335C19.3037 6.76323 19.7065 8.00285 18.9228 8.57225L14.947 11.4608C14.5966 11.7154 14.4499 12.1668 14.5838 12.5788L16.1024 17.2526C16.4017 18.1739 15.3472 18.94 14.5635 18.3706L10.5878 15.4821C10.2373 15.2274 9.7627 15.2274 9.41221 15.4821L5.43648 18.3706C4.65276 18.94 3.59828 18.1739 3.89763 17.2526L5.41623 12.5788C5.55011 12.1668 5.40345 11.7154 5.05296 11.4608L1.07722 8.57225C0.293507 8.00285 0.696283 6.76323 1.66501 6.76323H6.57929C7.01252 6.76323 7.39647 6.48427 7.53035 6.07225L9.04894 1.39849Z"
                                fill="black"
                                fill-opacity="0.9"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                        >
                            <path
                                d="M9.04894 1.39849C9.3483 0.477177 10.6517 0.477175 10.9511 1.39849L12.4697 6.07225C12.6035 6.48427 12.9875 6.76323 13.4207 6.76323H18.335C19.3037 6.76323 19.7065 8.00285 18.9228 8.57225L14.947 11.4608C14.5966 11.7154 14.4499 12.1668 14.5838 12.5788L16.1024 17.2526C16.4017 18.1739 15.3472 18.94 14.5635 18.3706L10.5878 15.4821C10.2373 15.2274 9.7627 15.2274 9.41221 15.4821L5.43648 18.3706C4.65276 18.94 3.59828 18.1739 3.89763 17.2526L5.41623 12.5788C5.55011 12.1668 5.40345 11.7154 5.05296 11.4608L1.07722 8.57225C0.293507 8.00285 0.696283 6.76323 1.66501 6.76323H6.57929C7.01252 6.76323 7.39647 6.48427 7.53035 6.07225L9.04894 1.39849Z"
                                fill="black"
                                fill-opacity="0.9"
                            />
                        </svg>
                    </div>
                    <BioType className="intake-v3-18px-20px">
                        &quot;I&apos;ve had an amazing experience with
                        Bioverse&apos;s weight loss program. I&apos;ve tried all
                        kinds of diets and over-the-counter pills and nothing
                        has worked until now! I&apos;ve been taking GLP-1
                        medication for 3 months and have already lost 21
                        lbs!&quot;
                    </BioType>
                    <div className="flex flex-col">
                        <BioType className="intake-v3-18px-20px">
                            Carmen S.
                        </BioType>
                        <BioType className="intake-v3-18px-20px">
                            Bioverse Patient
                        </BioType>
                    </div>
                </div>
                <BioType className="intake-v3-disclaimer-text text-weak">
                    Medications are part of the Bioverse Weight Loss program,
                    which also includes a reduced calorie diet and increased
                    physical activity. Customer&apos;s results have not been
                    independently verified. Individual results will vary.
                </BioType>
            </div>
            <ContinueButtonV3
                onClick={pushToNextRoute}
                buttonLoading={buttonLoading}
            />
        </div>
    );
}

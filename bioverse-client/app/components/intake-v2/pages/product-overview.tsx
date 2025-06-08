'use client';

import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    constructPricingStructureV2,
    isWeightlossProduct,
} from '@/app/utils/functions/pricing';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import Image from 'next/image';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import { SEMAGLUTIDE_PRODUCT_HREF } from '@/app/services/tracking/constants';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface ProductOverview {
    productInformationData: any;
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    priceData: ProductVariantRecord[];
}

export default function ProductOverview({
    productInformationData,
    product_data,
    priceData,
}: ProductOverview) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href, discountable } = getIntakeURLParams(
        url,
        searchParams,
    );

    const pushToNextRoute = async () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    const pricingStructure = constructPricingStructureV2(
        product_data,
        priceData,
        discountable,
    );

    return (
        <div className={`w-full flex justify-center animate-slideRight`}>
            <div className="md:w-full flex justify-center">
                <div className="flex flex-col w-full md:w-[456px]">
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Your order summary
                    </BioType>

                    <div className="flex justify-center items-center mt-4 w-full">
                        <div className="relative w-[180px] h-[180px] md:w-[269px] md:h-[269px]">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${productInformationData.image_ref[0]}`}
                                alt={'product'}
                                fill
                                priority
                                sizes="(min-width: 780px) 336px, 138px"
                                unoptimized
                            />
                        </div>
                    </div>

                    <div className="w-full mt-4">
                        <div className="w-full">
                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} mb-2`}
                            >
                                {productInformationData.name}
                            </BioType>
                            {/**
                             * Olivier, I had to remove this, but add it back later.
                             */}
                            {/* <BioType className='body1 text-[#1b1b1bde] text-[16px] mb-2'>
                                    {productData.variantText}
                                </BioType> */}
                            <div
                                className={`flex flex-col ${INTAKE_PAGE_BODY_TAILWIND} gap-1`}
                            >
                                <div className="flex justify-between text-[#1b1b1bde]">
                                    <BioType className="text-[#1b1b1bde]">
                                        {
                                            priceData?.find(
                                                (record) =>
                                                    record.variant_index ==
                                                    parseInt(
                                                        searchParams.get(
                                                            'pvn',
                                                        )!,
                                                    ),
                                            )!.variant
                                        }{' '}
                                    </BioType>
                                    <BioType
                                        className={`text-[#1b1b1bde] ${pricingStructure.discountApplied} ? 'line-through' : ''`}
                                    >
                                        ${pricingStructure.item_price}
                                    </BioType>
                                </div>
                                {pricingStructure['coupon_price'] && (
                                    <div className="flex justify-between text-[#1b1b1b] opacity-60">
                                        <BioType>Subscribe + Save</BioType>
                                        <BioType>
                                            - $
                                            {pricingStructure['coupon_price']}
                                        </BioType>
                                    </div>
                                )}

                                {product_data.product_href ===
                                    SEMAGLUTIDE_PRODUCT_HREF &&
                                    product_data.variant != 5 &&
                                    ((discountable &&
                                        product_data.subscriptionType !==
                                            'one_time') ||
                                        isWeightlossProduct(
                                            product_data.product_href,
                                        )) && (
                                        <div className="flex justify-between text-[#1b1b1bde]">
                                            <BioType>
                                                First Month Discount:
                                            </BioType>
                                            <BioType className="text-[#D32F2F]">
                                                -$
                                                {pricingStructure.coupon_price}
                                            </BioType>
                                        </div>
                                    )}
                                <div className="flex justify-between text-[#1b1b1bde]">
                                    <BioType>Total (if perscribed):</BioType>
                                    <BioType>
                                        ${pricingStructure.total_price}
                                    </BioType>
                                </div>
                                {product_data.subscriptionType === 'monthly' ||
                                    (product_data.subscriptionType ===
                                        'quarterly' && (
                                        <div className="flex justify-between text-[#1b1b1b] opacity-80 ">
                                            <BioType>First order only:</BioType>
                                        </div>
                                    ))}
                                <div className="flex justify-between my-2">
                                    <BioType
                                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !text-primary`}
                                    >
                                        DUE TODAY:
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !text-primary`}
                                    >
                                        $00.00
                                    </BioType>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center leading-0 mt-2 flex-col gap-4">
                        <BioType
                            className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !text-[1rem]`}
                        >
                            You won&apos;t be charged for your treatment unless
                            approved by your provider!
                        </BioType>
                        {/* <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            You won&apos;t be charged for your treatment unless
                            approved by your provider!
                        </BioType> */}
                    </div>
                    {/* <div className='w-full mt-3'>
                        <IntakeButtonWithLoading
                            button_text='CONTINUE'
                            custom_function={pushToNextRoute}
                            fullWidth={true}
                        />
                    </div> */}
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </div>
    );
}

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { INTAKE_PAGE_BODY_TAILWIND } from '../styles/intake-tailwind-declarations';

import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
    Instruction,
    StripePriceId,
} from '@/app/types/product-prices/product-prices-types';
import {
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import {
    updateOrder,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { BaseOrder } from '@/app/types/orders/order-types';
import { sum } from 'lodash';

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { continueButtonExitAnimation } from '../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Image from 'next/image';

interface WeightlossSupplyProps {
    monthlyPrice: Partial<ProductVariantRecord>;
    bundlePrice: Partial<ProductVariantRecord> | null;
    biannualPrice: Partial<ProductVariantRecord> | null;
    annualPrice: Partial<ProductVariantRecord> | null;
    orderData: BaseOrder;
    allowModifyPlan: boolean;
    userSexAtBirth: string;
}

export default function WeightlossSupplyComponent({
    monthlyPrice,
    bundlePrice,
    biannualPrice,
    annualPrice,
    orderData,
    allowModifyPlan,
    userSexAtBirth,
}: WeightlossSupplyProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const product_href = orderData.product_href;
    const lookupProductHref = orderData.metadata.selected_product
        ? PRODUCT_HREF.WEIGHT_LOSS
        : orderData.product_href;
    //const lookupProductHref = orderData.product_href;
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const bundle = bundlePrice?.price_data || null; // (quarterly)
    const monthly = monthlyPrice.price_data;
    const biannual = biannualPrice?.price_data || null;
    const annual = annualPrice?.price_data || null;

    const bannerRef =
        userSexAtBirth === 'Male'
            ? 'yellow_male_banner.png'
            : 'purple_banner.png';


    const initialSelectedSupplyNumber = () => {

        if (annual) {
            return 5;
        }
        if (biannual) {
            return 4;
        }
        if (bundle) {
            return 3;
        }
        return 1;
        // switch (true) {
        //     case annual:
        //         return 5;
        //     case biannual:
        //         return 4;
        //     case bundle:
        //         return 3;
        //     default:
        //         console.log("returning 1")
        //         return 1;
        // }
    };
        
    const getIsTrueForBoxChecked = (selectedSupplyTarget: number) => {
        return selectedSupplyTarget === initialSelectedSupplyNumber();
    };

    const [selectedSupply, setSelectedSupply] = useState<number>(
        initialSelectedSupplyNumber()
    );
    const [showMore1, setShowMore1] = useState<boolean>(false); //for monthly
    const [showMore2, setShowMore2] = useState<boolean>(false); //for biannual
    const [showMore3, setShowMore3] = useState<boolean>(false); //for bundle (quarterly)
    const [showMore4, setShowMore4] = useState<boolean>(false); //for annual
    const [box1Checked, setBox1Checked] = useState<boolean>(
        getIsTrueForBoxChecked(3)
    );
    const [box2Checked, setBox2Checked] = useState<boolean>(
        getIsTrueForBoxChecked(1)
    );
    const [biannualBoxChecked, setBiannualBoxChecked] = useState<boolean>(
        getIsTrueForBoxChecked(4)
    );
    const [annualBoxChecked, setAnnualBoxChecked] = useState<boolean>(
        getIsTrueForBoxChecked(5)
    );

    //box 1 is quarterly
    const handleBox1CheckboxClick = () => {
        setBox1Checked(!box1Checked);
    };

    //box 2 is monthly
    const handleBox2CheckboxClick = () => {
        setBox2Checked(!box2Checked);
    };

    // 6 month
    const handleBiannualBoxCheckboxClick = () => {
        setBiannualBoxChecked(!biannualBoxChecked);
    };

    const handleAnnualBoxCheckboxClick = () => {
        setAnnualBoxChecked(!annualBoxChecked);
    };

    //*** need to handle biannual orders ***
    const buildUpdateOrderPayload = () => {
        if (selectedSupply === 5 && annualPrice?.stripe_price_ids) {
            // It's annual

            return {
                price_id:
                    annualPrice.stripe_price_ids[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                variant_index: annualPrice.variant_index,
                variant_text: annualPrice.variant,
                subscription_type: 'annually',
                discount_id: [],
            };
        }

        if (selectedSupply === 4 && biannualPrice?.stripe_price_ids) {
            // It's a biannual

            return {
                price_id:
                    biannualPrice.stripe_price_ids[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                variant_index: biannualPrice.variant_index,
                variant_text: biannualPrice.variant,
                subscription_type: 'biannually',
                discount_id: [],
            };
        }

        if (selectedSupply === 3) {
            // It's a bundle
            return {
                price_id:
                    bundlePrice?.price_data?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                variant_index: bundlePrice?.variant_index,
                variant_text: bundlePrice?.variant,
                subscription_type: 'quarterly',
                discount_id: [],
            };
        } else {
            // It's a monthly
            return {
                price_id:
                    monthly?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                variant_index: monthlyPrice.variant_index,
                variant_text: monthlyPrice.variant,
                subscription_type: 'monthly',
                discount_id: [],
            };
        }
    };

    const pushToNextRoute = async () => {
        setButtonLoading(true);

        // Update order's price id, variant_index, variant_text, discount
        const updatedPayload = buildUpdateOrderPayload();

        await updateOrder(orderData.id, updatedPayload);
        if (searchParams.get('sd') === '23c') {
            await updateOrderDiscount(orderData.id);
        }

        let selectedCadency;
        switch (selectedSupply) {
            case 3:
                selectedCadency = 'quarterly';
                break;
            case 4:
                selectedCadency = 'biannually';
                break;
            default:
                selectedCadency = 'monthly';
                break;
        }

        const nextRoute = getNextIntakeRoute(
            fullPath,
            lookupProductHref,
            search,
            false,
            'latest',
            selectedCadency
        );

        const searchParamsNew = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParamsNew.delete('nu');
        searchParamsNew.set('st', selectedCadency);

        if (selectedSupply === 3) {
            searchParamsNew.set('pvn', String(bundlePrice?.variant_index));
        } else if (selectedSupply === 4 && biannualPrice) {
            searchParamsNew.set('pvn', String(biannualPrice.variant_index));
        } else {
            searchParamsNew.set('pvn', String(monthlyPrice.variant_index));
        }

        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParamsNew.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${lookupProductHref}/${nextRoute}?${newSearch}`
        );
    };

    const pushToModifyPlan = () => {
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${lookupProductHref}/wl-dosage-v3?${newSearch}`
        );
    };

    // test_id2=default: 6 month % savings on subheader (6 month supply at top)
    // test_id2=2: 6 month $ savings on subheader ( 6 month supply at the top)
    // test_id2=3: 3 month % savings on subheader (3 month supply at top)
    // test_id2=4: 3 month $ savings on subheader ( 3 month supply at the top)
    // test_id2=5: 6 month % savings on subheader (6 month supply at top & “Most popular”)
    // test_id2=6: 6 month $ savings on subheader ( 6 month supply at the top)
    // test_id2=7: 3 month $ savings on subheader ( 3 month supply at the top)
    // test_id2=8: 3 month $ savings on subheader ( 3 month supply at the top)
    const renderOfferSentence = () => {
        const test_id2 = searchParams.get('test_id2');

        //if there is not even a bundle, then we'll assume that the only one there is monthly:
        if (!bundle) {
            if (!monthly?.discount_price?.discount_amount) {
                return '';
            }
            return `For a limited time, BIOVERSE is offering a ${((monthly?.discount_price?.discount_amount / monthly?.product_price) * 100).toFixed(0)}% discount on your medication if you order today.`;
        }

        switch (test_id2) {
            case '1':
                return biannual
                    ? `For a limited time, BIOVERSE is offering a ${biannual?.savings.percent}% discount on your medication if you purchase a 6-month supply.`
                    : `For a limited time, BIOVERSE is offering a ${bundle?.savings.percent}% discount on your medication if you purchase a 3-month supply.`;
            case '2':
                return biannual
                    ? `For a limited time, BIOVERSE is offering a $${biannual?.savings.total} discount on your medication if you purchase a 6-month supply.`
                    : `For a limited time, BIOVERSE is offering a $${bundle?.savings.total} discount on your medication if you purchase a 3-month supply.`;
            case '3':
                return `For a limited time, BIOVERSE is offering a ${bundle?.savings.percent}% discount on your medication if you purchase a 3-month supply.`;
            case '4':
                return `For a limited time, BIOVERSE is offering a $${bundle?.savings.total} discount on your medication if you purchase a 3-month supply.`;
            case '5':
                return biannual
                    ? `For a limited time, BIOVERSE is offering a ${biannual?.savings.percent}% discount on your medication if you purchase a 6-month supply.`
                    : `For a limited time, BIOVERSE is offering a ${bundle?.savings.percent}% discount on your medication if you purchase a 3-month supply.`;
            case '6':
                return biannual
                    ? `For a limited time, BIOVERSE is offering a $${biannual?.savings.total} discount on your medication if you purchase a 6-month supply.`
                    : `For a limited time, BIOVERSE is offering a $${bundle?.savings.total} discount on your medication if you purchase a 3-month supply.`;
            case '7':
                return `For a limited time, BIOVERSE is offering a ${bundle?.savings.percent}% discount on your medication if you purchase a 3-month supply.`;
            case '8':
                return `For a limited time, BIOVERSE is offering a $${bundle?.savings.total} discount on your medication if you purchase a 3-month supply.`;
            case 'ann':
                return annual
                    ? `For a limited time, BIOVERSE is offering a ${annual?.savings.percent}% discount on your medication if you purchase a 12-month supply.`
                    : biannual
                    ? `For a limited time, BIOVERSE is offering a ${biannual?.savings.percent}% discount on your medication if you purchase a 6-month supply.`
                    : `For a limited time, BIOVERSE is offering a ${bundle?.savings.percent}% discount on your medication if you purchase a 3-month supply.`;
            default:
                return biannual
                    ? `For a limited time, BIOVERSE is offering a ${biannual?.savings.percent}% discount on your medication if you purchase a 6-month supply.`
                    : `For a limited time, BIOVERSE is offering a ${bundle?.savings.percent}% discount on your medication if you purchase a 3-month supply.`;
        }
    };

    const renderOfferCards = () => {
        const test_id2 = searchParams.get('test_id2');

        const renderOrderMap: Record<string, (() => JSX.Element | null)[]> = {
            default: [
                displayBiannualCard,
                displayQuarterlyCard,
                displayMonthlyCardV2,
            ],
            '1': [
                displayBiannualCard,
                displayQuarterlyCard,
                displayMonthlyCardV2,
            ],
            '2': [
                displayBiannualCard,
                displayQuarterlyCard,
                displayMonthlyCardV2,
            ],
            '3': [
                displayQuarterlyCard,
                displayBiannualCard,
                displayMonthlyCardV2,
            ],
            '4': [
                displayQuarterlyCard,
                displayBiannualCard,
                displayMonthlyCardV2,
            ],
            '5': [
                displayBiannualCard,
                displayQuarterlyCard,
                displayMonthlyCardV2,
            ],
            '6': [
                displayBiannualCard,
                displayQuarterlyCard,
                displayMonthlyCardV2,
            ],
            '7': [
                displayQuarterlyCard,
                displayBiannualCard,
                displayMonthlyCardV2,
            ],
            '8': [
                displayQuarterlyCard,
                displayBiannualCard,
                displayMonthlyCardV2,
            ],
            ann: [
                displayAnnualCard,
                displayBiannualCard,
                displayQuarterlyCard,
                displayMonthlyCardV2,
            ],
        };

        const orderedCards =
            renderOrderMap[test_id2 || 'default'] || renderOrderMap.default;

        return (
            <>
                {orderedCards.map((Component, index) => (
                    <Component key={index} />
                ))}
            </>
        );
    };

    const displayBiannualCardTopBanner = () => {
        const test_id2 = searchParams.get('test_id2');

        if (test_id2 === '7' || test_id2 === '8') {
            return null;
        }

        if (test_id2 === '5' || test_id2 === '6') {
            return (
                <div className='w-full mb-[-22px] max-w-[520px] mx-auto'>
                    <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 mx-4 flex flex-col justify-center'>
                        <BioType className='intake-v3-disclaimer-text text-center'>
                            <div className=' flex flex-row justify-center gap-1'>
                                <StarBorderIcon className='text-[1.2rem] md:text-[20px]' />
                                <span className='my-auto'>Most Popular</span>
                            </div>
                        </BioType>
                    </div>
                </div>
            );
        }

        return (
            <div className='w-full mb-[-22px] max-w-[500px] mx-auto'>
                <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-[#ffbbbb] to-[#ffdeb3] mx-4 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text text-center'>
                        <span className='text-[0.9rem] md:text-[16px]'>$</span>{' '}
                        Max Savings
                    </BioType>
                </div>
            </div>
        );
    };

    const displayAnnualCardTopBanner = () => {
        return (
            <div className='w-full mb-[-22px] max-w-[500px] mx-auto'>
                <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-[#ffbbbb] to-[#ffdeb3] mx-4 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text text-center'>
                        <div className=' flex flex-row justify-center gap-1'>
                            <ErrorOutlineIcon className='text-[1.2rem] md:text-[20px]' />
                            <span className='my-auto'>New Offer</span>
                        </div>
                    </BioType>
                </div>
            </div>
        );
    };

    const displayQuarterlyCardTopBanner = () => {
        const test_id2 = searchParams.get('test_id2');

        if (test_id2 === '5' || test_id2 === '6') {
            return null;
        }

        return (
            <div className='w-full mb-[-22px] max-w-[520px] mx-auto'>
                <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 mx-4 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text text-center'>
                        <div className=' flex flex-row justify-center gap-1'>
                            <StarBorderIcon className='text-[1.2rem] md:text-[20px]' />
                            <span className='my-auto'>Most Popular</span>
                        </div>
                    </BioType>
                </div>
            </div>
        );
    };

    const displayMonthlyCardTopBanner = () => {

        if (bundle || biannual) {
            return null;
        }

        return (
            <div className='w-full mb-[-22px] max-w-[7.1rem] md:max-w-[141px] '>
                <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 mx-4 flex flex-col justify-center'>
                    <div className=' text-center'>
                        <div className=' flex flex-row justify-center gap-1'>
                            {/* <StarBorderIcon className='text-[1.2rem] md:text-[20px]' /> */}
                            <span className='my-auto inter_body_small_regular'>Best Seller</span>
                        </div>
                    </div>
                </div>
            </div>
    );
    };

    const displayCopy = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 5% of their body weight when taking semaglutide for 3 months*';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average people lose 7% of their body weight in their first 3 months of using tirzepatide*';
            default:
                return '';
        }
    };
    const displayCopyMonthly = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 2% of their weight after 1 month on semaglutide*';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average, people lose 2% of their weight after 1 month on tirzepatide*';
            default:
                return '';
        }
    };
    const displayCopyBiannual = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 13.8% of their body weight when taking semaglutide for 6 months*';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average, people lose 10.1% of their body weight when taking tirzepatide for 6 months*';
            default:
                return '';
        }
    };

    const displayCopyAnnual = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 15-17% of their body weight when taking semaglutide for 12 months*';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average, people lose 15.3% of their body weight when taking tirzepatide for 12 months*';
            default:
                return '';
        }
    };

    const displaySource = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return '* This is based on data from a 2022 study published the American Medical Association titled "Weight Loss Outcomes Associated With Semaglutide Treatment for Patients With Overweight or Obesity".';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '* This is based on data from a 2022 study published in the New England Journal of Medicine titled "Tirzepatide Once Weekly for the Treatment of Obesity".';
            default:
                return '';
        }
    };
    const displaySourceBiannual = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return '* This is based on data from a 2021 study published the New New England Journal of Medicine “Once-Weekly Semaglutide in Adults with Overweight or Obesity”.';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '* This is based on data from a 2024 study published in the JAMA Internal Medicine Journal titled "Semaglutide vs Tirzepatide for Weight Loss in Adults With Overweight or Obesity".';
            default:
                return '';
        }
    };
    const displaySourceMonthly = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return '* This is based on data from a 2022 study published the American Medical Association titled “Weight Loss Outcomes Associated With Semaglutide Treatment for Patients With Overweight or Obesity”';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '* This is based on data from a 2023 study published in the Journal of the Endocrine Society titled "Adipose Tissue, Appetite, & Obesity".';
            default:
                return '';
        }
    };

    const displaySourceAnnual = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return '* This is based on data from a 2021 study published the New England Journal of Medicine titled “Once-Weekly Semaglutide in Adults with Overweight or Obesity”';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '* This is based on data from a 2024 study published in the JAMA Internal Medicine Journal titled "Semaglutide vs Tirzepatide for Weight Loss in Adults With Overweight or Obesity".';
            default:
                return '';
        }
    };

    const displayBiannualStartingDoseMessage = () => {
        return (
            <p className='intake-subtitle text-weak'>
                You&apos;ll start by injecting{' '}
                {biannualPrice?.dosages?.split(',')[0].substring(1)} weekly
            </p>
        );
    };
    const displayBundleStartingDoseMessage = () => {
        return (
            <p className='intake-subtitle text-weak'>
                You&apos;ll start by injecting{' '}
                {bundlePrice?.dosages?.split(',')[0].substring(1)} weekly
            </p>
        );
    };
    const displayMonthlyStartingDoseMessage = () => {
        return (
            <p className='intake-subtitle text-weak'>
                {monthlyPrice.price_data.dosage_instructions}
            </p>
        );
    };
    const displayAnnualStartingDoseMessage = () => {
        return (
            <p className='intake-subtitle text-weak'>
                You&apos;ll start by injecting{' '}
                {annualPrice?.dosages?.split(',')[0].substring(1)} weekly
            </p>
        );
    };

    const displayBundleVialInformation = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Semaglutide {bundlePrice?.vial}
                        </BioType>
                        {/* <BioType
                            className={`inter text-sm text-black opacity-60`}
                        >
                            ({bundle?.vial_sizes.length} vials included -{' '}
                            {bundle?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index === bundle.vial_sizes.length - 1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType> */}
                    </div>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Tirzepatide {bundlePrice?.vial}
                        </BioType>
                        {/* <BioType
                            className={`inter text-sm text-black opacity-60`}
                            >
                            ({bundle?.vial_sizes.length}{' '}
                            {bundle?.vial_sizes && bundle?.vial_sizes.length > 1
                                ? 'vials'
                                : 'vial'}{' '}
                            included -{' '}
                            {bundle?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index === bundle.vial_sizes.length - 1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType> */}
                    </div>
                );
            default:
                return null;
        }
    };

    const displayBiannualVialInformation = () => {
        if (biannualPrice === null) {
            return null;
        }

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Semaglutide {biannualPrice.vial}
                        </BioType>
                    </div>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Tirzepatide {biannualPrice.vial}
                        </BioType>
                    </div>
                );
            default:
                return null;
        }
    };

    const displayAnnualVialInformation = () => {
        if (annualPrice === null) {
            return null;
        }

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Semaglutide {annualPrice.vial}
                        </BioType>
                    </div>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Tirzepatide {annualPrice.vial}
                        </BioType>
                    </div>
                );
            default:
                return null;
        }
    };

    const displayMonthlyVialsIncluded = () => {
        const multipleVials =
            monthly?.vial_sizes && monthly?.vial_sizes.length > 1;
        const numVials = monthly?.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text = monthly?.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === monthly.vial_sizes.length - 1 ? '' : ', '
                    }`;
                })
                .join('');
        }

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-80`}
                    >
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );

            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-80`}
                    >
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );
        }
    };

    const displayMonthlyVialInformation = () => {
        const totalVialSize = sum(monthly?.vial_sizes);

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <BioType className={`inter-h5-regular text-sm text-black `}>
                        Semaglutide {totalVialSize} mg{' '}
                    </BioType>
                );

            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <BioType className={`inter-h5-regular text-sm text-black `}>
                        Tirzepatide {totalVialSize} mg{' '}
                    </BioType>
                );
        }
    };

    const displayIncludesMessagingMonthly = () => {
        const multipleVials =
            monthly?.vial_sizes && monthly?.vial_sizes.length > 1;
        const numVials = monthly?.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text = monthly?.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === monthly.vial_sizes.length - 1 ? '' : ', '
                    }`;
                })
                .join('');
        }

        const totalVialSize = sum(monthly?.vial_sizes);
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <ul className='ml-4'>
                        <li>
                            {multipleVials
                                ? `${numVials} Semaglutide vials in 1 package (${text})`
                                : '1 Semaglutide vial'}
                        </li>
                        <li>Injection needles</li>
                        <li>Alcohol pads</li>
                        <li>
                            Consistent support from your care team to ensure
                            you&apos;re achieving your weight loss goals
                        </li>
                    </ul>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <ul className='ml-4'>
                        <li>
                            {multipleVials
                                ? `${numVials} Tirzepatide vials in 1 package (${text})`
                                : '1 Tirzepatide vial'}
                        </li>
                        <li>Injection needles</li>
                        <li>Alcohol pads</li>
                        <li>
                            Consistent support from your care team to ensure
                            you&apos;re achieving your weight loss goals
                        </li>
                    </ul>
                );
            default:
                return null;
        }
    };

    const displayProductName = (name: string) => {
        switch (name) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return 'Semaglutide';
            case PRODUCT_HREF.TIRZEPATIDE:
                return 'Tirzepatide';
            case PRODUCT_HREF.METFORMIN:
                return 'Metformin';
            default:
                return name;
        }
    };

    const displayBundleLearnMoreUpdated = () => {
        return (
            <div className='flex flex-col space-y-4 mt-3'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-2'>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        Includes:
                    </BioType>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {bundle?.vial_sizes.length}{' '}
                                    {displayProductName(product_href)} vials in
                                    1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
                                    {bundle?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                bundle.instructions.length
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm `}
                                                        >
                                                            One{' '}
                                                            {
                                                                bundle
                                                                    .vial_sizes[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {displayProductName(
                                                                product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    bundle
                                                                        .instructions[0]
                                                                        .description
                                                                }
                                                            </span>
                                                        </BioType>
                                                    </li>
                                                );
                                            }
                                            return (
                                                <li key={index}>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                                    >
                                                        One{' '}
                                                        {
                                                            bundle.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {displayProductName(
                                                            product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary text-sm'>
                                                            {
                                                                bundle
                                                                    .instructions[
                                                                    index
                                                                ].description
                                                            }
                                                        </span>
                                                    </BioType>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Consistent support from your care team to
                                    ensure you&apos;re achieving your weight
                                    loss goals
                                </BioType>
                            </li>
                        </ol>
                    </BioType>
                </div>
                {/* Injection Instructions */}
                <div className='flex flex-col space-y-3'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-sm'>
                        {bundle?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 2) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                        >
                                            {instruction.header}:{' '}
                                            <span className='text-textSecondary'>
                                                {
                                                    instruction.injection_instructions
                                                }
                                            </span>
                                        </BioType>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
                {/* Source */}
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    {displaySource()}
                </BioType>
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure that you check in with your
                    medical provider at least once a month to adjust your dosing
                    as needed.
                </BioType>
            </div>
        );
    };

    const displayMonthlyLearnMoreV2 = () => {
        if (monthly?.vial_sizes.length === 1) {
            return (
                <div className='flex flex-col space-y-4 mt-3'>
                    {/* Includes Section */}
                    <div className='flex flex-col space-y-6'>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                        >
                            Includes:
                        </BioType>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                        >
                            <ol className='ml-4 flex flex-col space-y-2'>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                    >
                                        One {monthly?.vial_sizes[0]} mg{' '}
                                        {displayProductName(product_href)} vial.{' '}
                                        <span className='text-textSecondary'>
                                            {
                                                monthly.instructions[0]
                                                    .description
                                            }
                                        </span>
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                    >
                                        Injection needles
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                    >
                                        Alcohol pads
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                    >
                                        Consistent support from your care team
                                        to ensure you&apos;re achieving your
                                        weight loss goals
                                    </BioType>
                                </li>
                            </ol>
                        </BioType>
                    </div>
                    {/* Injection Instructions */}
                    <div className='flex flex-col space-y-3 pb-3'>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                        >
                            Injection instructions once prescribed:
                        </BioType>
                        <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                            <li className='ml-5'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                >
                                    {
                                        monthly?.instructions[0]
                                            .injection_instructions
                                    }
                                </BioType>
                            </li>
                        </ul>
                    </div>
                    <p className={`intake-v3-disclaimer-text text-weak`}>
                        {displaySourceMonthly()}
                    </p>
                </div>
            );
        }
        if (monthly?.vial_sizes && monthly?.vial_sizes.length >= 1) {
            return (
                <div className='flex flex-col space-y-4 mt-3'>
                    {/* Includes Section */}
                    <div className='flex flex-col space-y-6'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Includes:
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            <ol className='ml-4 flex flex-col space-y-2'>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        {monthly.vial_sizes.length}{' '}
                                        {displayProductName(product_href)} vials
                                        in 1 package
                                    </BioType>

                                    <ul className='list-disc ml-4'>
                                        {monthly.instructions.map(
                                            (
                                                instruction: Instruction,
                                                index: number
                                            ) => {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                        >
                                                            One{' '}
                                                            {
                                                                monthly
                                                                    .vial_sizes[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {displayProductName(
                                                                product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    instruction.description
                                                                }
                                                            </span>
                                                        </BioType>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Injection needles
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Alcohol pads
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Consistent support from your care team
                                        to ensure you&apos;re achieving your
                                        weight loss goals
                                    </BioType>
                                </li>
                            </ol>
                        </BioType>
                    </div>
                    {/* Injection Instructions */}
                    <div className='flex flex-col space-y-3'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Injection instructions once prescribed:
                        </BioType>
                        <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                            {monthly.instructions.map(
                                (instruction: Instruction, index: number) => {
                                    if (!instruction.injection_instructions) {
                                        return null;
                                    }
                                    return (
                                        <li className='ml-5' key={index}>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}  text-textSecondary`}
                                            >
                                                {
                                                    instruction.injection_instructions
                                                }
                                            </BioType>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                </div>
            );
        }
    };

    const displayBiannualLearnMore = () => {
        if (biannualPrice === null || biannual === null) {
            return null;
        }
        return (
            <div className='flex flex-col space-y-4 mt-3'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-2'>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        Includes:
                    </BioType>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {biannual?.vial_sizes.length}{' '}
                                    {displayProductName(product_href)} vials
                                    split into 2 shipments
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
                                    {biannual?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                biannual.instructions.length
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                        >
                                                            One{' '}
                                                            {
                                                                biannual
                                                                    .vial_sizes[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {displayProductName(
                                                                product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    biannual
                                                                        .instructions[0]
                                                                        .description
                                                                }
                                                            </span>
                                                        </BioType>
                                                    </li>
                                                );
                                            }
                                            return (
                                                <li key={index}>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                                    >
                                                        One{' '}
                                                        {
                                                            biannual.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {displayProductName(
                                                            product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary text-sm'>
                                                            {
                                                                biannual
                                                                    .instructions[
                                                                    index
                                                                ].description
                                                            }
                                                        </span>
                                                    </BioType>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Consistent support from your care team to
                                    ensure you&apos;re achieving your weight
                                    loss goals
                                </BioType>
                            </li>
                        </ol>
                    </BioType>
                </div>
                {/* Injection Instructions */}
                <div className='flex flex-col space-y-3'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-sm'>
                        {biannual?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 5) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                        >
                                            {instruction.header}:{' '}
                                            <span className='text-textSecondary'>
                                                {
                                                    instruction.injection_instructions
                                                }
                                            </span>
                                        </BioType>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
                {/* Source */}
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    {displaySourceBiannual()}
                </BioType>
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure that you check in with your
                    medical provider at least once a month to adjust your dosing
                    as needed.
                </BioType>
            </div>
        );
    };

    const displayAnnualLearnMore = () => {
        if (annualPrice === null || annual === null) {
            return null;
        }
        return (
            <div className='flex flex-col space-y-4 mt-3'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-2'>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        Includes:
                    </BioType>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {annual?.vial_sizes.length}{' '}
                                    {displayProductName(product_href)} vials in
                                    2 packages (shipped every 6 months)
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
                                    {annual?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                annual.instructions.length
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                        >
                                                            One{' '}
                                                            {
                                                                annual
                                                                    .vial_sizes[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {displayProductName(
                                                                product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    annual
                                                                        .instructions[0]
                                                                        .description
                                                                }
                                                            </span>
                                                        </BioType>
                                                    </li>
                                                );
                                            }
                                            return (
                                                <li key={index}>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                                    >
                                                        One{' '}
                                                        {
                                                            annual.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {displayProductName(
                                                            product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary text-sm'>
                                                            {
                                                                annual
                                                                    .instructions[
                                                                    index
                                                                ].description
                                                            }
                                                        </span>
                                                    </BioType>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Consistent support from your care team to
                                    ensure you&apos;re achieving your weight
                                    loss goals
                                </BioType>
                            </li>
                        </ol>
                    </BioType>
                </div>
                {/* Injection Instructions */}
                <div className='flex flex-col space-y-3'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-sm'>
                        {annual?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 11) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                        >
                                            {instruction.header}:{' '}
                                            <span className='text-textSecondary'>
                                                {
                                                    instruction.injection_instructions
                                                }
                                            </span>
                                        </BioType>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
                {/* Source */}
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    {displaySourceAnnual()}
                </BioType>
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure that you check in with your
                    medical provider at least once a month to adjust your dosing
                    as needed.
                </BioType>
            </div>
        );
    };

    const displayMonthlyCardV2 = () => {
        return (
            <>
            {displayMonthlyCardTopBanner()}
            <div
                className={`flex flex-col  pb-3 rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case  ${
                    box2Checked
                        ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                        : 'border-[#BDBDBD] border-2'
                } items-center`}
            >
                <Button
                    className={`flex flex-col normal-case text-black text-start w-full px-[1.1rem] md:px-[17px] pt-3 pb-2`}
                    onClick={() => {
                        if (selectedSupply !== 1) {
                            setSelectedSupply(1);
                            handleBox2CheckboxClick();
                            setBox1Checked(false);
                            setBiannualBoxChecked(false);
                            setAnnualBoxChecked(false);
                        }
                    }}
                >
                    <div className='flex flex-row w-full items-center'>
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between md:space-x-3 w-full'>
                            <div className='flex flex-col '>
                                <BioType className={`intake-subtitle mb-1`}>
                                    {displayCopyMonthly()}
                                </BioType>

                                <p className={`intake-subtitle-bold`}>
                                    1 month supply
                                </p>

                                {/* Show the product price if more than just monthly card exists */}
                                {bundle && (
                                    <BioType className={`intake-subtitle-bold`}>
                                        $
                                        {parseInt(
                                            String(monthly.product_price!) || '0'
                                        )}
                                        /month
                                    </BioType>
                                )}
                        
                                {/* Show the discounted price too if just monthly card exists */}
                                {monthly && !bundle && (
                                    <div className='flex flex-row gap-1'>
                                        <BioType className={`intake-subtitle-bold`}>
                                            $
                                            {parseInt(
                                                String(monthly?.product_price! - monthly?.discount_price?.discount_amount) || '0'
                                            )}
                                            /month
                                        </BioType>
                                    
                                        {monthly?.discount_price?.discount_amount! > 0 && (
                                            <s>
                                                <p
                                                    className={`intake-subtitle text-strong `} style={{fontWeight: 400}}
                                                    >
                                                        ${monthly?.product_price}/month
                                                </p>
                                            </s>
                                        )}

                                        <div
                                            className='flex flex-col justify-center items-center rounded-md py-1 px-2 max-h-[24px] ml-auto  mt-[-0.5rem] '
                                            style={{ border: '1.5px solid #000000' }}
                                        >
                                            <BioType className='text-black inter-h5-regular text-sm'>
                                                save ${monthly?.discount_price?.discount_amount}
                                            </BioType>
                                        </div>
                                        
                                    </div>
                                )}

                                <div className='flex flex-row gap-1 inter-h5-regular text-sm text-black mt-[0.62rem] md:mt-[10px]'>
                                    {displayMonthlyVialInformation()} vial
                                </div>
                                <div className='flex flex-row gap-1 intake-subtitle '>
                                    {displayMonthlyStartingDoseMessage()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {showMore1 && displayMonthlyLearnMoreV2()}
                </Button>

                <div className='w-full text-center text-start'>
                        {!showMore1 ? (
                            <Button
                                onClick={() => setShowMore1(!showMore1)}
                                className='relative underline  p-0'
                                endIcon={<ExpandMore />}
                                size='large'
                            >
                                <p className='text-[.8125rem] text-black normal-case inter-h5-regular font-bold px-[1.1rem] md:px-[17px]  '>
                                    Learn More
                                </p>
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setShowMore1(!showMore1)}
                                endIcon={<ExpandLessIcon />}
                                className='px-0 py-0'
                                size='large'
                            >
                                <p className='text-[.8125rem] text-black normal-case inter-h5-bold px-[1.1rem] md:px-[17px] '>
                                    See Less
                                </p>
                            </Button>
                        )}
                    </div>
            </div>
            </>
        );
    };

    const displayQuarterlyCard = () => {
        if (!bundle) {
            return null;
        }

        return (
            <>
                {displayQuarterlyCardTopBanner()}
                <div 
                    className={`flex flex-col  pb-3 rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case  ${
                        box1Checked
                            ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                            : 'border-[#BDBDBD] border-2'
                    } items-center `}
                >
                    <Button
                        className={`flex flex-col normal-case text-black text-start w-full px-[1.1rem] md:px-[17px] pt-3 pb-2`}
                        onClick={() => {
                            if (selectedSupply !== 3) {
                                setSelectedSupply(3);
                                handleBox1CheckboxClick();
                                setBox2Checked(false);
                                setBiannualBoxChecked(false);
                            }
                        }}
                    >
                        <div className='flex w-full  '>
                            <div className='bg-[#A5EC84] w-full flex justify-center items-center  rounded-md'>
                                <BioType className={`intake-v3-disclaimer-text `}>
                                    For a limited time, save{' '}
                                    {bundle?.savings.percent}%
                                </BioType>
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <div className='flex flex-col  '>
                                <div className='flex justify-center mt-1 normal-case'>
                                    <BioType className={`intake-subtitle `}>
                                        {displayCopy()}
                                    </BioType>
                                </div>

                                <div className='w-full flex justify-between'>
                                    <div>
                                        <div className='flex flex-col  '>
                                            <BioType
                                                className={`intake-subtitle-bold mt-[0.62rem] md:mt-[10px]`}
                                            >
                                                {bundle?.cadence === 'quarterly' ? (
                                                    <>3 month supply</>
                                                ) : null}
                                            </BioType>
                                            <BioType
                                                className={`intake-subtitle-bold `}
                                            >
                                                $
                                                {parseInt(
                                                    String(
                                                        bundle?.product_price_monthly
                                                    )
                                                )}
                                                /month{' '}
                                            </BioType>
                                            <s>
                                                <p
                                                    className={`intake-subtitle text-strong `}
                                                    style={{ fontWeight: 400 }}
                                                >
                                                    $
                                                    {parseInt(
                                                        String(
                                                            bundle?.savings.monthly
                                                        ) || '0'
                                                    )}
                                                    /month
                                                </p>
                                            </s>
                                        </div>
                                    </div>
                                    <div
                                        className='flex flex-col justify-center items-center rounded-md py-1 px-2 max-h-[24px] mt-[0.82rem] md:mt-[14px] '
                                        style={{ border: '1.5px solid #000000' }}
                                    >
                                        <BioType className='text-black inter-h5-regular text-sm'>
                                            save ${bundle?.savings.total}
                                        </BioType>
                                    </div>
                                </div>

                                <div className='mt-[0.62rem] md:mt-[10px]'>
                                    {displayBundleVialInformation()}
                                    {displayBundleStartingDoseMessage()}
                                </div>
                            </div>
                        </div>
                        {showMore3 && displayBundleLearnMoreUpdated()}
                    </Button>
                    <div className='w-full text-start'>
                        {!showMore3 ? (
                            <Button
                                onClick={() => setShowMore3(!showMore3)}
                                className='relative text-black underline px-0 py-0'
                                endIcon={<ExpandMore />}
                                size='large'
                            >
                                <div className='text-[.8125rem] text-black normal-case inter-h5-regular font-bold p-0 w-full flex flex-row px-[1.1rem] md:px-[17px] '>
                                    Learn More
                                </div>
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setShowMore3(!showMore3)}
                                endIcon={<ExpandLessIcon />}
                                className='relative text-black underline px-0 py-0'
                                size='large'
                            >
                                <p className='text-[.8125rem] text-black normal-case inter-h5-bold px-[1.1rem] md:px-[17px]'>
                                    See Less
                                </p>
                            </Button>
                        )}
                    </div>
                </div>
            </>
        );
    };

    const displayBiannualCard = () => {
        if (biannualPrice === null) {
            return null;
        }

        return (
            <>
                {displayBiannualCardTopBanner()}
                <div
                    className={`flex flex-col  pb-3 rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case  ${
                        biannualBoxChecked
                            ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                            : 'border-[#BDBDBD] border-2'
                    } items-center`}
                >
                    <Button
                        className={`flex flex-col normal-case text-black text-start w-full px-[1.1rem] md:px-[17px] pt-3 pb-2`}
                        onClick={() => {
                            if (selectedSupply !== 4) {
                                setSelectedSupply(4);
                                handleBiannualBoxCheckboxClick();
                                setBox2Checked(false);
                                setBox1Checked(false);
                                setAnnualBoxChecked(false);
                            }
                        }}
                    >
                        <div className='flex w-full  '>
                            <div className='bg-[#A5EC84] w-full flex justify-center items-center  rounded-md'>
                                <BioType className={`intake-v3-disclaimer-text`}>
                                    Lock in your 6 month plan with no price
                                    increases!
                                </BioType>
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <div className='flex flex-col  '>
                                <div className='flex justify-center mt-1 normal-case'>
                                    <BioType className={`intake-subtitle`}>
                                        {displayCopyBiannual()}
                                    </BioType>
                                </div>

                                <div className='w-full flex justify-between'>
                                    <div>
                                        <div className='flex flex-col '>
                                            <div
                                                className={`intake-subtitle-bold mt-[0.62rem] md:mt-[10px]`}
                                            >
                                                {biannual.cadence ===
                                                'biannually' ? (
                                                    <>6 month supply</>
                                                ) : null}
                                            </div>
                                            <div className={`intake-subtitle-bold`}>
                                                $
                                                {parseInt(
                                                    String(
                                                        biannual?.product_price_monthly
                                                    )
                                                )}
                                                /month{' '}
                                            </div>
                                            <s>
                                                <div
                                                    className={`intake-subtitle text-strong `}
                                                    style={{ fontWeight: 400 }}
                                                >
                                                    $
                                                    {parseInt(
                                                        String(
                                                            biannual?.savings
                                                                .monthly
                                                        ) || '0'
                                                    )}
                                                    /month
                                                </div>
                                            </s>
                                        </div>
                                    </div>
                                    <div
                                        className='flex flex-col justify-center rounded-md py-1 px-2 max-h-[24px] mt-[0.82rem] md:mt-[14px]'
                                        style={{ border: '1.5px solid #000000' }}
                                    >
                                        <BioType className='text-black inter-h5-regular text-sm'>
                                            save ${biannual?.savings.total}
                                        </BioType>
                                    </div>
                                </div>

                                <div className='mt-[0.62rem] md:mt-[10px] inter-h5-regular text-sm text-black'>
                                    Ships every 3 months
                                </div>

                                <div className='mt-[0.62rem] md:mt-[10px]'>
                                    {displayBiannualVialInformation()}
                                    {displayBiannualStartingDoseMessage()}
                                </div>
                            </div>
                        </div>

                        {showMore2 && displayBiannualLearnMore()}
                    </Button>
                    <div className='w-full text-start'>
                        {!showMore2 ? (
                            <Button
                                onClick={() => setShowMore2(!showMore2)}
                                className='relative text-black underline px-0 py-0'
                                endIcon={<ExpandMore />}
                                size='large'
                            >
                                <p className='text-[.8125rem] text-black normal-case inter-h5-regular font-bold   px-[1.1rem] md:px-[17px]'>
                                    Learn More
                                </p>
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setShowMore2(!showMore2)}
                                endIcon={<ExpandLessIcon />}
                                className='relative text-black underline px-0 py-0'
                                size='large'
                            >
                                <p className='text-[.8125rem] text-black normal-case inter-h5-bold  px-[1.1rem] md:px-[17px]'>
                                    See Less
                                </p>
                            </Button>  
                        )}
                    </div>
                </div>
            </>
        );
    };

    const displayAnnualCard = () => {
        if (annualPrice === null) {
            return null;
        }

        return (
            <>
                {displayAnnualCardTopBanner()}
                <div
                    className={`flex flex-col  pb-3 rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case ${
                        annualBoxChecked
                            ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                            : 'border-[#BDBDBD] border-2'
                    } items-center`}
                >
                    <Button
                        className={` flex flex-col normal-case text-black text-start w-full px-[1.1rem] md:px-[17px] pt-3 pb-2`}
                        onClick={() => {
                            if (selectedSupply !== 5) {
                                setSelectedSupply(5);
                                handleAnnualBoxCheckboxClick();
                                setBox2Checked(false);
                                setBox1Checked(false);
                                setBiannualBoxChecked(false);
                            }
                        }}
                    >
                        <div className='flex w-full  '>
                            <div className='bg-[#A5EC84] w-full flex justify-center items-center  rounded-md'>
                                <BioType
                                    className={`intake-v3-disclaimer-text`}
                                >
                                    Lock in your 12 month plan with no price
                                    increases!
                                </BioType>
                            </div>
                        </div>

                        <div className='flex items-center w-full'>
                            <div className='flex flex-col w-full '>
                                <div className='flex justify-center mt-1 normal-case'>
                                    <BioType className={`intake-subtitle mt-1`}>
                                        {displayCopyAnnual()}
                                    </BioType>
                                </div>

                                <div className='w-full flex justify-between'>
                                    <div>
                                        <div className='flex flex-col '>
                                            <div
                                                className={`intake-subtitle-bold mt-[0.62rem] md:mt-[10px]`}
                                            >
                                                {annual.cadence ===
                                                'annually' ? (
                                                    <>12 month supply</>
                                                ) : null}
                                            </div>
                                            <div
                                                className={`intake-subtitle-bold`}
                                            >
                                                $
                                                {parseInt(
                                                    String(
                                                        annual?.product_price_monthly
                                                    )
                                                )}
                                                /month{' '}
                                            </div>
                                            <s>
                                                <div
                                                    className={`intake-subtitle text-strong `}
                                                    style={{ fontWeight: 400 }}
                                                >
                                                    $
                                                    {parseInt(
                                                        String(
                                                            annual?.savings
                                                                .monthly
                                                        ) || '0'
                                                    )}
                                                    /month
                                                </div>
                                            </s>
                                        </div>
                                    </div>
                                    <div
                                        className='flex flex-col justify-center rounded-md py-1 px-2 max-h-[24px] mt-[0.82rem] md:mt-[14px]'
                                        style={{
                                            border: '1.5px solid #000000',
                                        }}
                                    >
                                        <BioType className='text-black inter-h5-regular text-sm'>
                                            save ${annual?.savings.total}
                                        </BioType>
                                    </div>
                                </div>

                                <div className='mt-[0.62rem] md:mt-[10px]'>
                                    {displayAnnualVialInformation()}
                                    {displayAnnualStartingDoseMessage()}
                                </div>
                            </div>
                        </div>
                        {showMore4 && displayAnnualLearnMore()}
                    </Button>

                    <div className='w-full text-start  '>
                        {!showMore4 ? (
                            <Button
                                onClick={() => setShowMore4(!showMore4)}
                                className='relative text-black underline px-0 py-0 w-full'
                                size='large'
                            >
                                <div className='text-[.8125rem] text-black normal-case inter-h5-regular font-bold p-0 w-full flex flex-row px-[1.1rem] md:px-[17px] '>
                                    <p>Learn More</p>
                                    <ExpandMore />
                                </div>
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setShowMore4(!showMore4)}
                                endIcon={<ExpandLessIcon />}
                                className='relative text-black underline px-0 py-0'
                                size='large'
                            >
                                <p className='text-[.8125rem] text-black normal-case inter-h5-bold px-[1.1rem] md:px-[17px] '>
                                    See Less
                                </p>
                            </Button>
                        )}
                    </div>
                </div>
            </>
        );
    };

    //end of display functions, start of main return:

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight pb-20 lg:pb-0 `}
            >
                <div className='flex flex-col  md:max-w-[447px]'>
                    <div className='relative w-full h-[4.5rem] md:h-[110px] mt-2'>
                        <Image
                            src={`/img/intake/wl/${bannerRef}`}
                            alt='product'
                            layout='fill'
                            objectFit='contain'
                            className='mx-auto'
                        />
                    </div>
                    <div className='flex flex-col w-full  mt-[1.15rem] md:mt-[28px]'>
                        <div className='md:max-w-[447px] mx-auto flex flex-col '>
                            <p className={`inter-h5-question-header `}>
                                {
                                    (monthly && !bundle && !biannual) 
                                        ? 'Your recommended personalized plan'
                                        :'How much medication would you like to receive?'
                                }
                            </p>

                            <BioType
                                className={`intake-subtitle mt-[0.75rem] md:mt-[12px]`}
                            >
                                {renderOfferSentence()}
                            </BioType>
                        </div>

                        <div className='flex flex-col gap-[22px] md:mb-[48px] pt-[1.61rem] md:pt-[29px]'>
                            {renderOfferCards()}
                        </div>
                        <div className='mt-[66px] sm:mt-0 '>
                            {allowModifyPlan && (
                                <div className='flex flex-col items-center justify-center relative'>
                                    <div
                                        className={`fixed bottom-20 md:static z-30 md:mb-3 `}
                                    >
                                        <Button
                                            variant='contained'
                                            fullWidth
                                            sx={{
                                                width: {
                                                    xs: 'calc(100vw - 44px)',
                                                    md: '490px',
                                                },
                                                height: '52px',
                                                zIndex: 30,
                                                backgroundColor: 'white',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'lightgray',
                                                },
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                color: 'black',
                                                border: '1px solid #000000',
                                            }}
                                            onClick={pushToModifyPlan}
                                            className=' h-[3rem] md:h-[48px] w-[20rem] md:w-[490px] intake-v3-form-label-bold'
                                        >
                                            Modify my plan
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className='flex flex-col items-center justify-center relative '>
                                <ContinueButtonV3
                                    onClick={pushToNextRoute}
                                    buttonLoading={buttonLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
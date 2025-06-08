'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_INPUT_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { ServerSideOrderData } from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AltCheckoutSummaryComponent from './alt-checkout-summary';
import Image from 'next/image';
import AltContinueButton from '../continue-button/alt-continue-button';
import useSWR from 'swr';
import {
    collectInformationToCreateAlternativeOrder,
    confirmAlternativeOrder,
} from '@/app/utils/actions/alternatives/weight-loss/alternative-weight-loss-actions';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { Status } from '@/app/types/global/global-enumerators';

interface AlternativeCheckoutProps {
    order_data: ServerSideOrderData;
}

export default function AlternativeCheckout({
    order_data,
}: AlternativeCheckoutProps) {
    const product_href = order_data.metadata.selected_alternative_product;
    const cadency = order_data.metadata.selected_alternative_cadence;

    const { data, isLoading, error } = useSWR(`alternate-checkout-data`, () =>
        collectInformationToCreateAlternativeOrder(order_data)
    );

    const [continueButtonLoading, setContinueButtonloading] =
        useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const router = useRouter();
    const path = usePathname();

    const handleContinueClick = async () => {
        setContinueButtonloading(true);

        setErrorMessage(undefined);

        try {
            const result = await confirmAlternativeOrder(
                data?.profileData!,
                order_data,
                data?.stripeData!
            );

            if (result === Status.Success) {
                const newPath = path.replace(/\/checkout$/, '/confirmation');
                router.push(newPath);
            } else if (result === Status.Failure) {
                setErrorMessage('There was a problem, please try again later.');
            }
        } catch (error) {
            setErrorMessage('There was a problem, please try again later.');
        }
    };

    interface ManualPricingStructure {
        [key: string]: {
            [key: string]: {
                [key: string]: string;
            };
        };
    }

    const getPriceData = (key: string) => {
        interface PriceStructure {
            [key: string]: {
                [key: string]: {
                    [key: string]: string;
                };
            };
        }

        const price_structure: PriceStructure = {
            metformin: {
                quarterly: {
                    savings: '20',
                    grayPrice: '75.00',
                    blackPrice: '55.00',
                },
            },
            'wl-capsule': {
                monthly: {
                    savings: '15',
                    grayPrice: '75.00',
                    blackPrice: '60.00',
                },
                quarterly: {
                    savings: '25',
                    grayPrice: '199.00',
                    blackPrice: '174.00',
                },
            },
        };

        return price_structure[product_href][cadency][key];
    };

    const mapCadencyToDays = (cadency: string) => {
        if (cadency === 'monthly') {
            return '30';
        } else if (cadency === 'bimonthly') {
            return '60';
        } else if (cadency === 'quarterly') {
            return '90';
        } else if (cadency === 'quarterly') {
            return '150';
        }
    };

    const renderTermsAndConditions = () => {
        return (
            <>
                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} !text-[16px] pt-2 !text-[#00000099]`}
                >
                    Prescription products require an evaluation with a licensed
                    medical professional who will determine if a prescription is
                    appropriate.
                </BioType>
                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2  text-[#00000099]`}
                >
                    By clicking $0 Due Today, you agree to the{' '}
                    <Link
                        href='https://www.gobioverse.com/privacy-policy'
                        className='!text-[#286BA2] no-underline hover:underline'
                    >
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                        href='https://www.gobioverse.com/privacy-policy'
                        className='!text-[#286BA2] no-underline hover:underline'
                    >
                        Privacy Policy
                    </Link>
                    . You also agree that, if prescribed, you will be charged $
                    {getPriceData('blackPrice')} for your first{' '}
                    {mapCadencyToDays(cadency)} days supply and $
                    {getPriceData('grayPrice')} every{' '}
                    {mapCadencyToDays(cadency)} days thereafter until you
                    cancel.
                </BioType>

                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} !text-[16px] text-[#00000099]`}
                >
                    Ongoing shipments may be charged and shipped up to 2 days
                    early to accommodate holidays or other operational reasons
                    to support treatment continuity.
                </BioType>

                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2 text-[#00000099]`}
                >
                    Your subscription will renew unless you cancel at least 2
                    days before the next processing date. You can view your
                    processing date and cancel your subscription(s) through your
                    online account or by contacting customer support at
                    support@gobioverse.com.
                </BioType>
            </>
        );
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!data || error) {
        return (
            <div>
                <BioType className='it-body md:itd-body'>
                    There was an issue with getting the details of the order.
                    Please try again later.
                </BioType>
            </div>
        );
    }

    return (
        <div
            className={`flex w-full justify-center overflow-hidden animate-slideRight mx-auto mt-36 sm:mt-16 sm:px-0`}
        >
            <div className='flex justify-center w-[90vw] md:w-full md:mx-0 max-w-[520px] mb-10'>
                <div className='flex flex-col gap-4 w-full'>
                    <div className='flex w-full flex-col gap-4'>
                        <AltCheckoutSummaryComponent
                            order_data={order_data}
                            profile_data={data.profileData}
                        />
                    </div>
                    <div className='col-span-6 md:col-span-6'>
                        <div className='max-w-[500px]'>
                            <AltContinueButton
                                onClick={() => {
                                    handleContinueClick();
                                }}
                                buttonLoading={continueButtonLoading}
                                altText='Confirm Order'
                            />
                            {errorMessage && (
                                <BioType className='text-red-500 it-body itd-body mt-2'>
                                    {errorMessage}
                                </BioType>
                            )}
                        </div>
                    </div>
                    {renderTermsAndConditions()}
                    <>
                        <div className='flex flex-row gap-2 mt-2 items-center justify-center'>
                            <div>
                                <Image
                                    src={'/img/checkout/visa-dark.png'}
                                    alt={''}
                                    width={40.8}
                                    height={25.5}
                                    unoptimized
                                />
                            </div>
                            <div>
                                <Image
                                    src={'/img/checkout/mc-light.png'}
                                    alt={''}
                                    width={40.8}
                                    height={25.5}
                                    unoptimized
                                />
                            </div>
                            <div>
                                <Image
                                    src={'/img/checkout/amex-dark.png'}
                                    alt={''}
                                    width={40.8}
                                    height={25.5}
                                    unoptimized
                                />
                            </div>
                            <div>
                                <Image
                                    src={'/img/checkout/discover-dark.png'}
                                    alt={''}
                                    width={40.8}
                                    height={25.5}
                                    unoptimized
                                />
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}

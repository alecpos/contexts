'use client';

import { FC, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ConfirmationCard from '../components/confirmation-card';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    DOSAGE_SELECTION_MAP,
    SINGLE_DOSE_PRODUCT_MAP,
} from '../utils/ed-selection-index';
import EDDosageSelection from './ed-dosage-selection';
import QuantityConfirmationList from './ed-quantity-selection';
import { BaseOrder } from '@/app/types/orders/order-types';
import { updateOrderMetadata } from '@/app/utils/database/controller/orders/orders-api';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../../intake-functions';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import { getUserStateEligibilityDosage } from '@/app/utils/functions/state-auth/utils';

interface EDConfirmationComponentProps {
    frequency: string;
    productHref: string;
    treatmentType: string;
    orderData: BaseOrder;
}

interface DosageRequiredProductInterface {
    [key: string]: PRODUCT_HREF[];
}

const DOSAGE_REQUIRED_PRODUCT_HREFS: DosageRequiredProductInterface = {
    daily: [PRODUCT_HREF.TADALAFIL],
    'as-needed': [
        PRODUCT_HREF.PEAK_CHEWS,
        PRODUCT_HREF.RUSH_CHEWS,
        PRODUCT_HREF.TADALAFIL,
        PRODUCT_HREF.SILDENAFIL,
        PRODUCT_HREF.CIALIS,
        PRODUCT_HREF.VIAGRA,
    ],
};

export default function EDConfirmationComponent({
    frequency,
    productHref,
    orderData,
    treatmentType,
}: EDConfirmationComponentProps) {
    let nonSelectableDosage: string | undefined = undefined;
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const isXEDFlow =
        fullPath.split('/')[3] === 'x-melts' ||
        fullPath.split('/')[3] === 'x-chews';

    if (
        !DOSAGE_REQUIRED_PRODUCT_HREFS[frequency].includes(
            productHref as PRODUCT_HREF,
        )
    ) {
        nonSelectableDosage = SINGLE_DOSE_PRODUCT_MAP[productHref][frequency];
    }

    const [selectedDosage, setSelectedDosage] = useState<string | undefined>(
        nonSelectableDosage,
    );
    const [selectedQuantity, setSelectedQuantity] = useState<
        number | undefined
    >(undefined);

    const setDosageSelection = (dosage: string) => {
        setSelectedDosage(dosage);
    };

    const setQuantitySelection = (quantity: number) => {
        setSelectedQuantity(quantity);
    };

    const [step, setStep] = useState<number>(
        DOSAGE_REQUIRED_PRODUCT_HREFS[frequency].includes(
            productHref as PRODUCT_HREF,
        )
            ? 0
            : 1,
    );

    const pushToNextRoute = () => {
        if (isXEDFlow) {
            router.push(
                `/intake/prescriptions/${productHref}/ed-pre-id?${search}`,
            );
            return;
        }

        if (fullPath.includes('ed-global')) {
            router.push(`/intake/prescriptions/ed-global/ed-pre-id?${search}`);
        } else {
            router.push(
                `/intake/prescriptions/${product_href}/ed-pre-id?${search}`,
            );
        }
    };

    const updateOrderInformation = async () => {
        const ed_metadata = {
            frequency: frequency,
            treatmentType: treatmentType,
            productHref: productHref,
            dosage: selectedDosage,
            quantity: frequency === 'daily' ? 30 : selectedQuantity,
        };

        await updateOrderMetadata(
            {
                edSelectionData: ed_metadata,
            },
            orderData.id,
        );
    };

    useEffect(() => {
        const handleInitialUpdate = async () => {
            if (
                frequency === 'daily' &&
                !DOSAGE_REQUIRED_PRODUCT_HREFS[frequency].includes(
                    productHref as PRODUCT_HREF,
                )
            ) {
                await updateOrderInformation();
                pushToNextRoute();
            }
        };

        handleInitialUpdate();
    }, [frequency, productHref]);

    if (
        frequency === 'daily' &&
        !DOSAGE_REQUIRED_PRODUCT_HREFS[frequency].includes(
            productHref as PRODUCT_HREF,
        )
    ) {
        return <LoadingScreen />;
    }

    const dosageMapArray =
        DOSAGE_SELECTION_MAP[productHref]?.[frequency] ?? undefined;
    console.log(orderData);

    const handleContinueButton = async () => {
        switch (step) {
            case 0:
                //TODO: if the frequency here is daily, it needs to push to next screen UNLESS the product href is tadalafil or rush chews
                if (frequency === 'daily') {
                    await updateOrderInformation();
                    pushToNextRoute();
                    return;
                }

                // For as needed
                const patientState =
                    orderData.state || searchParams.get('ptst');

                const isUserEligible = getUserStateEligibilityDosage(
                    productHref,
                    frequency,
                    selectedDosage,
                    patientState,
                );

                if (!isUserEligible) {
                    router.push(
                        `/intake/prescriptions/${productHref}/unavailable-in-state?${searchParams.toString()}`,
                    );
                    return;
                }

                //setting a half second timer for user experience
                setTimeout(() => {
                    setStep(1);
                }, 500);
                break;
            case 1:
                await updateOrderInformation();
                pushToNextRoute();
                return;

            default:
                return;
        }
    };

    const confirmationContinueButton = (): JSX.Element => {
        if (step === 0 || (step === 1 && selectedQuantity)) {
            return (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                        height: '60px',
                    }}
                    className="w-full my-4"
                    onClick={handleContinueButton}
                >
                    CONTINUE
                </Button>
            );
        } else {
            return <></>;
        }
    };

    return (
        <div className="animate-slideRight w-full pb-16 md:pb-0">
            {/* <GenericOnboardingStage title="Tell us how much medication you'd like to receive." /> */}

            <div className="inline-flex">
                <BioType className="it-h1 md:itd-h1 text-primary">
                    {step === 0
                        ? 'Choose a dosage strength'
                        : 'Tell us how much medication you would like to receive.'}
                </BioType>
            </div>

            <div className="mt-4">
                {step === 0 ? (
                    <>
                        <EDDosageSelection
                            dosageMapArray={dosageMapArray}
                            setDosageSelection={setDosageSelection}
                        />
                    </>
                ) : (
                    <QuantityConfirmationList
                        productHref={productHref}
                        dosage={selectedDosage}
                        setQuantitySelection={setQuantitySelection}
                        selectedQuantity={selectedQuantity}
                    />
                )}
            </div>

            <div className="flex mt-4 w-full pb-3">
                <div className="w-full relative">
                    {(step === 0 || (step === 1 && selectedQuantity)) && (
                        <ContinueButton
                            onClick={handleContinueButton}
                            buttonLoading={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

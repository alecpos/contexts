'use client';

import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { checkForRenewalOrder } from '@/app/utils/actions/provider/check-for-renewal-order';
import { updateRenewalOrderMetadata } from '@/app/utils/actions/provider/update-renewal-order-metadata';
import { getSuggestedDosages } from '@/app/utils/actions/provider/get-suggested-dosages';
import useSWR from 'swr';
import Dialog from '@mui/material/Dialog';
import {
    RenewalOrderStatus,
    RenewalOrderTabs,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { updateStripeProduct } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { onAlmostDoneScreenSubmit } from '@/app/services/pharmacy-integration/util/utils';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';

export default function CoordinatorConfirmDosage({
    order_data,
}: {
    order_data: RenewalOrderTabs;
}) {
    const {
        data: renewalOrderData,
        isLoading: fetchRenewalOrders,
        mutate: mutate_renewal,
    } = useSWR(`check-renewal-orders-${order_data.renewal_order_id}`, () =>
        checkForRenewalOrder(order_data.renewal_order_id),
    );
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [dosageSelections, setDosageSelections] = useState<any[]>([]);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState<
        number | null
    >(null);
    const [successSnackbarOpen, setSuccessSnackbarOpen] =
        useState<boolean>(false);
    const [failureSnackbarOpen, setFailureSnackbarOpen] =
        useState<boolean>(false);

    const handleSubmit = async () => {
        setLoading(true);

        try {
            if (!renewalOrderData?.data || selectedVariantIndex === null) {
                setFailureSnackbarOpen(true);
                return;
            }

            const { type: orderType, data: orderData } = await fetchOrderData(
                order_data.renewal_order_id,
            );
            const priceData = await getPriceDataRecordWithVariant(
                order_data.product_href,
                selectedVariantIndex,
            );
            const { data: patientData, error: patientDataError } =
                await getPatientInformationById(order_data.customer_id);

            if (!orderData || patientDataError || !priceData) {
                setFailureSnackbarOpen(true);
                return;
            }

            //update the renewal order row with the new dosage selection
            await onAlmostDoneScreenSubmit(
                orderData,
                selectedVariantIndex,
                patientData,
                priceData,
                'coordinator',
            );

            //will set 'coordinatorDosageSelected' to true in the metadata json field
            await updateRenewalOrderMetadata(order_data.renewal_order_id);

            //update the product in stripe
            let orderStatusDetails = getOrderStatusDetails(
                renewalOrderData.data.order_status,
            );
            let hasPaid = orderStatusDetails.isPaid;
            await updateStripeProduct(
                order_data.subscription_id,
                selectedVariantIndex,
                hasPaid,
                true,
            );
        } catch (error) {
            console.error('Error processing your request: ', error);
            setLoading(false);
            setFailureSnackbarOpen(true);
            return;
        }

        setLoading(false);
        setOpen(false);
        mutate_renewal();
        setSuccessSnackbarOpen(true);
    };

    useEffect(() => {
        const fetchSuggestedDosages = async () => {
            if (
                renewalOrderData?.data?.dosage_suggestion_variant_indexes
                    ?.length
            ) {
                let suggestedDosages = await getSuggestedDosages(
                    order_data.product_href,
                    renewalOrderData.data.dosage_suggestion_variant_indexes,
                );
                if (suggestedDosages.data) {
                    setDosageSelections([]);
                    suggestedDosages.data.forEach((dosage) => {
                        setDosageSelections((prev) => [
                            ...prev,
                            {
                                vial: dosage.vial,
                                cadence: dosage.cadence,
                                vial_dosages: dosage.vial_dosages,
                                dosages: dosage.dosages,
                                pharmacy: dosage.pharmacy,
                                variant_index: dosage.variant_index,
                                price_data: dosage.price_data,
                            },
                        ]);
                    });
                }
            }
        };
        fetchSuggestedDosages();
    }, [renewalOrderData]);

    const handleClickOpen = async () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // console.log("order_data inside CoordinatorConfirmDosage: ", order_data)
    // console.log("renewalOrderData inside CoordinatorConfirmDosage: ", renewalOrderData)

    if (
        !renewalOrderData?.data?.dosage_suggestion_variant_indexes?.length ||
        renewalOrderData.data.dosage_selection_completed ||
        order_data.order_status === RenewalOrderStatus.PharmacyProcessing
    ) {
        console.log(
            'No dosage suggestion variant indexes or dosage selection completed or pharmacy processing',
        );
        return null;
    }

    // console.log("the patient can choose from these options: ", renewalOrderData.data.dosage_suggestion_variant_indexes)
    // console.log("which are variants of this product: ", order_data.product_href)

    const makeFirstLetterUpperCase = (str: string) => {
        if (!str) return null;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const clipOffFirstAndLastChar = (str: string) => {
        return str.slice(1, -1);
    };

    return (
        <div className="px-6 py-6">
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                Confirm Dosage Selection
            </Button>

            <Dialog onClose={handleClose} open={open}>
                <div className="p-7 itd-body text-2xl">
                    <p>Confirm new dosage selection for this patient</p>
                    <p className="text-center my-1 font-bold">
                        {order_data.product_name}
                    </p>

                    {loading ? (
                        <>
                            <div className="flex flex-row justify-center my-16">
                                <p className="">Submitting</p>
                                <div className="loading-dots w-7">
                                    {' '}
                                    <style jsx>{`
                                        .loading-dots::after {
                                            content: '';
                                            display: inline-block;
                                            animation: dots 0.9s steps(3, end)
                                                infinite;
                                        }

                                        @keyframes dots {
                                            0%,
                                            20% {
                                                content: '';
                                            }
                                            40% {
                                                content: '.';
                                            }
                                            60% {
                                                content: '..';
                                            }
                                            80%,
                                            100% {
                                                content: '...';
                                            }
                                        }
                                    `}</style>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {dosageSelections &&
                                dosageSelections.map((dosageSelection) => (
                                    <div
                                        key={dosageSelection.variant_index}
                                        className={`border-t border-b my-3 rounded-md p-3 itd-body mx-3 cursor-pointer ${
                                            selectedVariantIndex ===
                                            dosageSelection.variant_index
                                                ? 'bg-slate-200' // Darker background for selected
                                                : 'bg-slate-100' // Default background
                                        }`}
                                    >
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="dosageSelection"
                                                value={
                                                    dosageSelection.variant_index
                                                }
                                                onChange={() =>
                                                    setSelectedVariantIndex(
                                                        dosageSelection.variant_index,
                                                    )
                                                }
                                                className="form-radio w-6 h-6 mx-4"
                                            />
                                            <div>
                                                <p>
                                                    Vial:{' '}
                                                    {dosageSelection.vial ||
                                                        '-'}
                                                </p>
                                                <p>
                                                    Cadence:{' '}
                                                    {makeFirstLetterUpperCase(
                                                        dosageSelection.cadence,
                                                    ) || '-'}
                                                </p>
                                                <p>
                                                    {dosageSelection.vial_dosages ? (
                                                        <p>
                                                            Vial Dosages:{' '}
                                                            <span>
                                                                {clipOffFirstAndLastChar(
                                                                    dosageSelection.vial_dosages,
                                                                )}
                                                            </span>
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                </p>
                                                <p>
                                                    {dosageSelection.dosages ? (
                                                        <p>
                                                            Dosages:{' '}
                                                            <span>
                                                                {clipOffFirstAndLastChar(
                                                                    dosageSelection.dosages,
                                                                )}
                                                            </span>
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                </p>
                                                <p>
                                                    Pharmacy:{' '}
                                                    {makeFirstLetterUpperCase(
                                                        dosageSelection.pharmacy,
                                                    ) || '-'}
                                                </p>
                                                <p>
                                                    Price:{' '}
                                                    {dosageSelection.price_data ? (
                                                        <span>
                                                            $
                                                            {
                                                                dosageSelection
                                                                    .price_data
                                                                    .product_price
                                                            }
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                ))}

                            <div className="w-full p-3 flex flex-row justify-center">
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    disabled={selectedVariantIndex === null}
                                >
                                    Submit
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Dialog>

            <BioverseSnackbarMessage
                open={successSnackbarOpen}
                setOpen={setSuccessSnackbarOpen}
                color={'success'}
                message={'Dosage selection has been confirmed for this patient'}
            />
            <BioverseSnackbarMessage
                open={failureSnackbarOpen}
                setOpen={setFailureSnackbarOpen}
                color={'error'}
                message={
                    'There was a problem with this. Please try again later'
                }
            />
        </div>
    );
}

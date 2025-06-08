'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    getOrderIdByPatientIdAndProductHref,
    getQuestionSetVersionForLastCompleteOrder,
    insertNewManualOrder,
    updateOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    RadioGroup,
    FormControlLabel,
    Radio,
    Input,
    InputLabel,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { WL_CHECKIN_RESEND } from '@/app/services/customerio/event_names';
import {
    SEMAGLUTIDE_VARIANT_DISPLAY_ARRAY,
    TIRZEPATIDE_VARIANT_DISPLAY_ARRAY,
} from '../../../../../../utils/glp-1-list';
import { getPriceForStripePriceId } from '@/app/utils/database/controller/orders/create-order';
import { getPriceIdForProductVariant } from '@/app/utils/database/controller/products/products';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    convertStripePriceToDollars,
    formatDateToMMDDYYYY,
    getURL,
} from '@/app/utils/functions/client-utils';
import {
    ManualOrderAction,
    OrderStatus,
    PaymentAction,
} from '@/app/types/orders/order-types';
import { isGLP1Product } from '@/app/utils/functions/pricing';
import Stripe from 'stripe';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import {
    isUserEligibleForManualOrderCreation,
    ManualCreateOrderInformation,
    handleUserThreadsOnManualCreateOrder,
} from '@/app/utils/database/controller/orders/create-manual-order';
import { GetInvoicesReturn } from '@/app/api/supabase/orders/getInvoices/route';
import { processAndCreateManualOrder } from '@/app/utils/database/controller/orders/process-manual-order';
import {
    getPriceVariantTableData,
    getProductVariantList,
} from '@/app/utils/database/controller/product_variants/product_variants';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { getAddressOfMostRecentOrder } from '@/app/utils/database/controller/orders/address-in-most-recent-order';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { cleanStaleOrders } from '@/app/utils/functions/clean-stale-orders/clean-stale-orders';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';

interface ManualOrderCreationProps {
    profile_data: APProfileData;
    stripe_data: any[];
    open: boolean;
    onClose: () => void;
    setShowSnackbar: Dispatch<SetStateAction<boolean>>;
    setSnackbarMessage: Dispatch<SetStateAction<string>>;
    setSnackbarStatus: Dispatch<SetStateAction<'success' | 'error'>>;
}

export default function ManualOrderCreationDialog({
    profile_data,
    stripe_data,
    open,
    onClose,
    setShowSnackbar,
    setSnackbarMessage,
    setSnackbarStatus,
}: ManualOrderCreationProps) {
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<number>(-1);
    const [selectedCadence, setSelectedCadence] = useState<string>();
    const [needsProviderReview, setNeedsProviderReview] =
        useState<string>('yes');

    const [shouldResetBillingCycle, setShouldResetBillingCycle] =
        useState<string>('yes');
    const [hasPaid, setHasPaid] = useState<string>('yes');

    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<string>();
    const [isLoadingOrderCreation, setIsLoadingOrderCreation] =
        useState<boolean>(false);
    const [selectedInvoice, setSelectedInvoice] = useState<string>('');
    const [refundAmount, setRefundAmount] = useState<string>('');

    const { data: hrefList } = useSWR(`product-href-list`, () =>
        getProductVariantList()
    );

    const { data: variant_list } = useSWR(
        selectedProduct ? `${selectedProduct}-variants` : null,
        () => getPriceVariantTableData(selectedProduct)
    );

    const {
        data: upcomingOrderInformation,
        mutate: mutateUpcomingOrderInformation,
    } = useSWR<ManualCreateOrderInformation>(
        selectedCadence &&
            selectedVariant >= 0 &&
            selectedProduct &&
            selectedPaymentMethod
            ? `${profile_data.id}-upcoming`
            : null,
        () =>
            fetch(`${getURL()}/api/supabase/orders/getManualOrderInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profile_data,
                    product_href: selectedProduct,
                    variant_index: selectedVariant,
                    hasPaid: hasPaid === 'yes' ? true : false,
                    cadence: selectedCadence,
                    selectedPaymentMethod,
                    metadata: {
                        invoiceId: selectedInvoice,
                        shouldResetBillingCycle:
                            shouldResetBillingCycle === 'yes' ? true : false,
                    },
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    return data;
                })
    );

    const { data: newPrice, mutate: mutateNewPrice } = useSWR<number | null>(
        hasPaid === 'yes' && isGLP1Product(selectedProduct) && selectedVariant
            ? `${profile_data.id}-newprice`
            : null,
        async () => {
            const priceID = await getPriceIdForProductVariant(
                selectedProduct as PRODUCT_HREF,
                selectedVariant,
                process.env.NEXT_PUBLIC_ENVIRONMENT!
            );
            return getPriceForStripePriceId(priceID || '');
        }
    );

    const { data: invoiceData, mutate: mutateGetInvoices } =
        useSWR<GetInvoicesReturn>(
            hasPaid === 'yes' && newPrice
                ? `${profile_data.id}-invoices`
                : null,
            () =>
                fetch(`${getURL()}/api/supabase/orders/getInvoices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        stripe_customer_id: profile_data.stripe_customer_id,
                        threshold:
                            upcomingOrderInformation?.paymentAction ===
                            PaymentAction.Refund
                                ? newPrice
                                : 0,
                    }),
                }).then((res) => res.json())
        );

    useEffect(() => {
        setSelectedVariant(-1);
        setSelectedCadence(undefined);
        // setApplyDiscount(true);
    }, [selectedProduct]);

    useEffect(() => {
        if (isGLP1Product(selectedProduct) && selectedVariant) {
            mutateNewPrice();
        }

        console.log(selectedVariant);
    }, [selectedProduct, selectedVariant]);

    useEffect(() => {
        if (
            upcomingOrderInformation?.paymentAction === PaymentAction.Refund ||
            upcomingOrderInformation?.paymentAction === PaymentAction.Credit
        ) {
            mutateGetInvoices();
        }
        if (upcomingOrderInformation?.paymentAction === PaymentAction.Refund) {
            setRefundAmount(String(upcomingOrderInformation.amount / 100));
        } else if (
            upcomingOrderInformation?.paymentAction === PaymentAction.Credit
        ) {
            setRefundAmount(String(upcomingOrderInformation.amount / 100));
        }
    }, [upcomingOrderInformation]);

    useEffect(() => {
        if (hasPaid === 'yes') {
            if (
                selectedCadence &&
                selectedVariant &&
                selectedProduct &&
                selectedPaymentMethod
            ) {
                console.log('FIRED??');
                mutateUpcomingOrderInformation();
            }
        } else {
            if (
                selectedCadence &&
                selectedVariant &&
                selectedProduct &&
                selectedPaymentMethod
            ) {
                mutateUpcomingOrderInformation();
            }
        }
    }, [
        selectedCadence,
        selectedVariant,
        selectedProduct,
        hasPaid,
        selectedPaymentMethod,
        shouldResetBillingCycle,
        mutateUpcomingOrderInformation,
    ]);

    const constructOrder = async (
        orderType: 'new-order' | 'reactivate' | 'new-order-void-old'
    ) => {
        setIsLoadingOrderCreation(true);

        if (!variant_list?.data) {
            return;
        }

        try {
            const variant_price_record = variant_list.data.find(
                (variant) => (variant.variant_index = selectedVariant)
            );

            let addressLine1 = profile_data.address_line1;
            let addressLine2 = profile_data.address_line2;
            let city = profile_data.city;
            let state = profile_data.state;
            let zip = profile_data.zip;

            if (orderType === 'reactivate') {
                const addressData = await getAddressOfMostRecentOrder(
                    profile_data.id
                );

                if (
                    !addressData ||
                    !addressData.data ||
                    addressData.data.length === 0
                ) {
                    throw new Error('No address found for the user');
                }

                addressLine1 = addressData.data[0].address_line1;
                addressLine2 = addressData.data[0].address_line2;
                city = addressData.data[0].city;
                state = addressData.data[0].state;
                zip = addressData.data[0].zip;
            }

            const question_set_version =
                await getQuestionSetVersionForLastCompleteOrder(
                    profile_data.id,
                    selectedProduct as PRODUCT_HREF
                );

            const pvc = new ProductVariantController(selectedProduct as PRODUCT_HREF, selectedVariant, state as USStates);
            const pvc_result = pvc.getConvertedVariantIndex();
            const new_variant_index = pvc_result.variant_index;

            if (!new_variant_index) {
                alert("Something went wrong. Please contact engineering.")
                return;
            }

            if (profile_data.state === USStates.California) {
                if (selectedCadence !== SubscriptionCadency.Monthly) {
                    alert("Error! You cannot create a multi-month order for a California patient.")
                    return;
                }
            }

            const newOrder: OrdersSBR = {
                customer_uid: profile_data.id,
                variant_index: new_variant_index,
                variant_text: variant_list!.data![new_variant_index].variant,
                subscription_type: selectedCadence,
                stripe_metadata: {
                    clientSecret: '',
                    setupIntentId: '',
                    paymentMethodId: selectedPaymentMethod,
                },
                order_status: OrderStatus.UnapprovedCardDown,
                product_href: selectedProduct,
                price_id:
                    variant_price_record?.stripe_price_ids[
                        process.env.NEXT_PUBLIC_ENVIRONMENT as 'dev' | 'prod'
                    ],
                discount_id: undefined,
                environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
                address_line1: addressLine1,
                address_line2: addressLine2,
                city: city,
                state: state,
                zip: zip,
                source: 'manual_create',
                question_set_version,
            };

            if (orderType === 'new-order-void-old') {
                const orderId = await getOrderIdByPatientIdAndProductHref(
                    profile_data.id,
                    selectedProduct
                );
                if (!orderId) {
                    throw new Error('Something went wrong');
                }
                await updateOrder(orderId, {
                    order_status: OrderStatus.Voided,
                });
            }
            await insertNewManualOrder(newOrder, false);
            await cleanStaleOrders(
                profile_data.id,
                selectedProduct as PRODUCT_HREF
            );
            await handleUserThreadsOnManualCreateOrder(
                profile_data.id,
                selectedProduct as PRODUCT_HREF
            );

            await logPatientAction(
                profile_data.id,
                PatientActionTask.MANUAL_ORDER_CREATED,
                { selectedProduct, selectedVariant }
            );

            if (orderType === 'reactivate') {
                //await sendCheckinFormToCustomer - should extract this to a function that subscription-accordian can import
                const resp = await triggerEvent(
                    profile_data.id,
                    WL_CHECKIN_RESEND,
                    {
                        checkin_url: `https://app.gobioverse.com/check-up/${selectedProduct}`,
                    }
                );

                await triggerEvent(
                    profile_data.id,
                    RudderstackEvent.WL_REACTIVATION_CHECKIN_REMINDER,
                    {
                        checkin_url: `https://app.gobioverse.com/check-up/${selectedProduct}`,
                    }
                );
                await logPatientAction(
                    profile_data.id,
                    PatientActionTask.CHECKIN_FORM_SENT,
                    { product_href: selectedProduct }
                );
            }

            await mutate(`orders-${profile_data.id}`);

            setSnackbarMessage(
                'The order was made successfully! Go Rockstar! 🎸💥‼️'
            );
            setSnackbarStatus('success');
            setShowSnackbar(true);
            setSelectedProduct('');
            setSelectedVariant(-1);
            setSelectedPaymentMethod(undefined);
            setIsLoadingOrderCreation(false);
            setSelectedCadence(undefined);
            onClose();
        } catch (error: any) {
            console.error(
                'constructOrder error in ManualOrderCreationDialog.tsx: ',
                error
            );

            setSnackbarMessage(
                'There was an issue with the creation of the order :('
            );
            setSnackbarStatus('error');
            setShowSnackbar(true);
            setIsLoadingOrderCreation(false);
        }
    };

    const onCreateOrder = async () => {
        try {
            setIsLoadingOrderCreation(true);

            const isEligible = await isUserEligibleForManualOrderCreation(
                profile_data.id,
                selectedProduct as PRODUCT_HREF
            );

            console.log('isEligible', isEligible);

            if (!isEligible) {
                throw new Error(
                    'User has an active subscription for this product.'
                );
            }

            if (
                upcomingOrderInformation?.paymentAction ===
                ManualOrderAction.NewBaseOrder
            ) {
                return await constructOrder('new-order');
            } else if (
                upcomingOrderInformation?.paymentAction ===
                ManualOrderAction.NewBaseOrderVoidOrder
            ) {
                return await constructOrder('new-order-void-old');
            } else if (
                upcomingOrderInformation?.paymentAction ===
                ManualOrderAction.ReactivateSubscription
            ) {
                return await constructOrder('reactivate');
            }

            if (isGLP1Product(selectedProduct)) {
                const variant_price_record = variant_list?.data?.find(
                    (variant) => (variant.variant_index = selectedVariant)
                );

                const { data: session_data, error } = await readUserSession();

                const metadata = {
                    variant_text: variant_price_record?.variant,
                    invoiceId: selectedInvoice,
                    amount: refundAmount,
                    created_by: session_data?.session?.user.id,
                };
                // throw new Error(
                //     'Something went wrong. Please refresh your page and try again.',
                // );

                if (
                    !selectedVariant ||
                    !selectedPaymentMethod ||
                    !selectedProduct ||
                    !selectedCadence ||
                    needsProviderReview.length === 1
                ) {
                    throw new Error(
                        'Something went wrong. Please refresh your page and try again.'
                    );
                }

                if (upcomingOrderInformation) {
                    await processAndCreateManualOrder(
                        upcomingOrderInformation,
                        profile_data,
                        selectedProduct as PRODUCT_HREF,
                        selectedVariant,
                        selectedCadence as SubscriptionCadency,
                        metadata,
                        needsProviderReview === 'yes' ? true : false
                    );
                    await logPatientAction(
                        profile_data.id,
                        PatientActionTask.MANUAL_ORDER_CREATED,
                        { selectedProduct, selectedVariant }
                    );
                    setSnackbarMessage('Successfully created new order');
                    setSnackbarStatus('success');
                    setShowSnackbar(true);
                }
            }
        } catch (error: unknown) {
            setSnackbarMessage((error as Error).message);
            setSnackbarStatus('error');
            setShowSnackbar(true);
        } finally {
            setIsLoadingOrderCreation(false);
            onClose();
        }
    };

    const displayInvoiceSelection = () => {
        if (invoiceData && invoiceData.invoices.length > 0) {
            if (
                upcomingOrderInformation?.paymentAction ===
                    ManualOrderAction.NewBaseOrder ||
                upcomingOrderInformation?.paymentAction ===
                    ManualOrderAction.NewBaseOrderVoidOrder ||
                upcomingOrderInformation?.paymentAction ===
                    ManualOrderAction.ReactivateSubscription
            ) {
                return null;
            }
            return (
                <>
                    <BioType className='inter_body_regular mt-2'>
                        Please select the invoice that the user paid for
                    </BioType>
                    <Select
                        fullWidth
                        value={selectedInvoice}
                        onChange={(e) => setSelectedInvoice(e.target.value)}
                    >
                        {invoiceData.invoices.map(
                            (invoice: Stripe.Invoice, index: number) => {
                                return (
                                    <MenuItem key={index} value={invoice.id}>
                                        <div className='flex flex-row justify-between w-full'>
                                            <BioType>
                                                {formatDateToMMDDYYYY(
                                                    convertEpochToDate(
                                                        invoice.created
                                                    )
                                                )}
                                            </BioType>
                                            <BioType>
                                                $
                                                {convertStripePriceToDollars(
                                                    invoice.amount_paid
                                                )}
                                            </BioType>
                                        </div>
                                    </MenuItem>
                                );
                            }
                        )}
                    </Select>
                    <FormControl sx={{ marginTop: '5px' }}>
                        <InputLabel htmlFor='refund-input'>
                            Please enter the{' '}
                            {upcomingOrderInformation?.paymentAction ===
                            PaymentAction.Credit
                                ? 'credit'
                                : 'refund'}{' '}
                            amount
                        </InputLabel>

                        <Input
                            id='refund-input'
                            value={refundAmount}
                            onChange={(event) =>
                                setRefundAmount(event.target.value)
                            }
                        />
                    </FormControl>
                </>
            );
        }
    };

    const displayController = () => {
        return (
            <>
                {displayInvoiceSelection()}
                {displayUpcomingOrderInformation()}
            </>
        );
    };

    const displayUpcomingOrderInformation = () => {
        console.log(upcomingOrderInformation);
        if (upcomingOrderInformation) {
            if (upcomingOrderInformation) {
                if (
                    upcomingOrderInformation.paymentAction ===
                    PaymentAction.Refund
                ) {
                    return (
                        <div>
                            <BioType>
                                You are refunding the user: ${refundAmount}
                            </BioType>
                            <BioType>Total user charge: $0.00</BioType>
                            {/* <BioType>
                                Subscription reschedules:{' '}
                                {
                                    upcomingOrderInformation.subscriptionRenewalDate
                                }
                            </BioType> */}
                        </div>
                    );
                }
                if (
                    upcomingOrderInformation.paymentAction ===
                    PaymentAction.Credit
                ) {
                    return (
                        <div>
                            <BioType>
                                Total charge of the product:{' '}
                                {upcomingOrderInformation.newPrice / 100}{' '}
                            </BioType>
                            <BioType>
                                Total charge after applied credit:{' '}
                                {(
                                    upcomingOrderInformation.newPrice / 100 -
                                    Number(refundAmount)
                                ).toFixed(2)}
                            </BioType>
                        </div>
                    );
                }

                if (
                    upcomingOrderInformation.paymentAction ===
                    PaymentAction.FullyPaid
                ) {
                    return (
                        <div>
                            <BioType>
                                This user will be charged $0 for this order
                            </BioType>
                        </div>
                    );
                }

                if (
                    upcomingOrderInformation.paymentAction ===
                        ManualOrderAction.NewBaseOrder ||
                    upcomingOrderInformation.paymentAction ===
                        ManualOrderAction.NewBaseOrderVoidOrder
                ) {
                    return (
                        <div>
                            <BioType>
                                This user will be charged $
                                {convertStripePriceToDollars(
                                    upcomingOrderInformation.amount
                                )}{' '}
                                once approved
                            </BioType>
                        </div>
                    );
                }
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>
                    <BioType className='inter_h5_regular'>
                        Create a new Order
                    </BioType>
                </DialogTitle>
                <DialogContent className=''>
                    <div className='flex flex-col gap-4 min-h-[200px] min-w-[500px]'>
                        <FormControl className='gap-2'>
                            {hrefList && (
                                <>
                                    <BioType className='inter_body_regular'>
                                        Product
                                    </BioType>
                                    <Select
                                        id='selected-medication-select'
                                        value={selectedProduct}
                                        onChange={(e) => {
                                            setSelectedProduct(e.target.value);
                                        }}
                                    >
                                        {hrefList.map(
                                            (row: any, index: number) => (
                                                <MenuItem
                                                    key={index}
                                                    value={row.href}
                                                >
                                                    {row.href}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </>
                            )}
                            {variant_list && variant_list.data && (
                                <>
                                    <BioType className='inter_body_regular mt-2'>
                                        Variant
                                    </BioType>
                                    <Select
                                        value={selectedVariant}
                                        onChange={(e) => {
                                            setSelectedVariant(
                                                e.target.value as number
                                            );
                                            const selected_variant_record =
                                                variant_list.data?.find(
                                                    (variant) =>
                                                        variant.variant_index ==
                                                        e.target.value
                                                );
                                            setSelectedCadence(
                                                selected_variant_record?.cadence
                                            );
                                        }}
                                    >
                                        {selectedProduct === 'semaglutide' ||
                                        selectedProduct === 'tirzepatide'
                                            ? variant_list.data.map(
                                                  (variant, index) => {
                                                      if (
                                                          selectedProduct ===
                                                              'semaglutide' &&
                                                          (!SEMAGLUTIDE_VARIANT_DISPLAY_ARRAY[
                                                              index
                                                          ] ||
                                                              SEMAGLUTIDE_VARIANT_DISPLAY_ARRAY[
                                                                  index
                                                              ] ==
                                                                  'not-implemented')
                                                      ) {
                                                          return null;
                                                      }

                                                      if (
                                                          selectedProduct ===
                                                              'tirzepatide' &&
                                                          (!TIRZEPATIDE_VARIANT_DISPLAY_ARRAY[
                                                              index
                                                          ] ||
                                                              TIRZEPATIDE_VARIANT_DISPLAY_ARRAY[
                                                                  index
                                                              ] ==
                                                                  'not-implemented')
                                                      ) {
                                                          return null;
                                                      }

                                                      return (
                                                          <MenuItem
                                                              key={index}
                                                              value={
                                                                  variant.variant_index
                                                              }
                                                              className='inter_body_regular'
                                                              sx={{
                                                                  fontFamily: 'Inter, sans-serif',
                                                              }}
                                                          >
                                                              {selectedProduct ===
                                                              'semaglutide'
                                                                  ? SEMAGLUTIDE_VARIANT_DISPLAY_ARRAY[
                                                                        index
                                                                    ]
                                                                  : TIRZEPATIDE_VARIANT_DISPLAY_ARRAY[
                                                                        index
                                                                    ]}
                                                          </MenuItem>
                                                      );
                                                  }
                                              )
                                            : variant_list.data.map(
                                                  (variant, index) => (
                                                      <MenuItem
                                                          key={index}
                                                          value={
                                                              variant.variant_index
                                                          }
                                                      >
                                                          {variant.variant}
                                                      </MenuItem>
                                                  )
                                              )}
                                    </Select>

                                    {/**
                                     * 11/6/24: Nathan Cho - removed cadence buttons since variant index itself holds cadence information.
                                     */}
                                    {/* <div className='flex flex-row gap-4 items-center'>
                                        {selectedVariant != -1 && (
                                            <div className='flex flex-col'>
                                                <ButtonGroup>
                                                    {variant_list.data[
                                                        selectedVariant
                                                    ].one_time && (
                                                        <Button
                                                            onClick={() =>
                                                                setSelectedCadence(
                                                                    'one_time'
                                                                )
                                                            }
                                                            variant={
                                                                selectedCadence ===
                                                                'one_time'
                                                                    ? 'contained'
                                                                    : 'outlined'
                                                            }
                                                        >
                                                            One Time
                                                        </Button>
                                                    )}
                                                    {variant_list.data[
                                                        selectedVariant
                                                    ].monthly && (
                                                        <Button
                                                            onClick={() =>
                                                                setSelectedCadence(
                                                                    'monthly'
                                                                )
                                                            }
                                                            variant={
                                                                selectedCadence ===
                                                                'monthly'
                                                                    ? 'contained'
                                                                    : 'outlined'
                                                            }
                                                        >
                                                            Monthly
                                                        </Button>
                                                    )}
                                                    {variant_list.data[
                                                        selectedVariant
                                                    ].quarterly && (
                                                        <Button
                                                            onClick={() =>
                                                                setSelectedCadence(
                                                                    'quarterly'
                                                                )
                                                            }
                                                            variant={
                                                                selectedCadence ===
                                                                'quarterly'
                                                                    ? 'contained'
                                                                    : 'outlined'
                                                            }
                                                        >
                                                            Quarterly
                                                        </Button>
                                                    )}
                                                </ButtonGroup>
                                            </div>
                                        )}
                                        
                                    </div> */}

                                    {selectedCadence && (
                                        <div>
                                            <BioType className='inter_body_regular my-2'>
                                                Select Payment Method:{' '}
                                            </BioType>
                                            <Select
                                                fullWidth
                                                value={selectedPaymentMethod}
                                                onChange={(e) => {
                                                    setSelectedPaymentMethod(
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                {stripe_data.map(
                                                    (payment_method, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={
                                                                payment_method.id
                                                            }
                                                        >
                                                            <div className='flex flex-row justify-between w-full'>
                                                                <BioType className='itd-body'>
                                                                    ••••{' '}
                                                                    {
                                                                        payment_method
                                                                            .card
                                                                            .last4
                                                                    }{' '}
                                                                </BioType>
                                                                <BioType className='itd-body'>
                                                                    exp:{' '}
                                                                    {
                                                                        payment_method
                                                                            .card
                                                                            .exp_month
                                                                    }
                                                                    /
                                                                    {
                                                                        payment_method
                                                                            .card
                                                                            .exp_year
                                                                    }
                                                                </BioType>
                                                            </div>
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </div>
                                    )}
                                    {selectedPaymentMethod &&
                                        upcomingOrderInformation?.paymentAction !==
                                            ManualOrderAction.ReactivateSubscription &&
                                        upcomingOrderInformation?.paymentAction !==
                                            ManualOrderAction.NewBaseOrder &&
                                        upcomingOrderInformation?.paymentAction !==
                                            ManualOrderAction.NewBaseOrderVoidOrder && (
                                            <div>
                                                <BioType className='it-subtitle'>
                                                    Has this user already paid?
                                                </BioType>
                                                <FormControl>
                                                    <RadioGroup
                                                        defaultValue={hasPaid}
                                                        name='has-paid-radio'
                                                        onChange={(event) =>
                                                            setHasPaid(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value='yes'
                                                            control={<Radio />}
                                                            label='Yes'
                                                        />
                                                        <FormControlLabel
                                                            value='no'
                                                            control={<Radio />}
                                                            label='No'
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        )}
                                    {selectedPaymentMethod &&
                                        upcomingOrderInformation?.paymentAction !==
                                            ManualOrderAction.ReactivateSubscription &&
                                        upcomingOrderInformation?.paymentAction !==
                                            ManualOrderAction.NewBaseOrder &&
                                        upcomingOrderInformation?.paymentAction !==
                                            ManualOrderAction.NewBaseOrderVoidOrder && (
                                            <div>
                                                <BioType className='it-subtitle'>
                                                    Does this order need
                                                    provider review?
                                                </BioType>
                                                <FormControl>
                                                    <RadioGroup
                                                        defaultValue={
                                                            needsProviderReview
                                                        }
                                                        name='needs-review-radio'
                                                        onChange={(event) =>
                                                            setNeedsProviderReview(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value='yes'
                                                            control={<Radio />}
                                                            label='Yes'
                                                        />
                                                        {/* <FormControlLabel
                                                            value="no"
                                                            control={<Radio />}
                                                            label="No"
                                                        /> */}
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        )}
                                </>
                            )}
                            {displayController()}
                            {/* {selectedVariant !== '' && (
                                <div>
                                    <BioType className='it-subtitle'>
                                        Please confrim the following order
                                        details:
                                    </BioType>
                                    <BioType>
                                        <span className='it-body font-twcsemibold'>
                                            Product:
                                        </span>{' '}
                                        <span className='it-body'>
                                            {selectedProduct}
                                        </span>
                                    </BioType>
                                    <BioType>
                                        <span className='it-body font-twcsemibold'>
                                            Variant:
                                        </span>{' '}
                                        <span className='it-body'>
                                            {
                                                variant_list!.data![
                                                    parseInt(selectedVariant)
                                                ].variant
                                            }
                                        </span>
                                    </BioType>
                                </div>
                            )} */}
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions className=''>
                    {selectedPaymentMethod && (
                        <Button
                            onClick={onCreateOrder}
                            variant='contained'
                            disabled={isLoadingOrderCreation}
                        >
                            {isLoadingOrderCreation ? (
                                <CircularProgress />
                            ) : (
                                'create order'
                            )}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

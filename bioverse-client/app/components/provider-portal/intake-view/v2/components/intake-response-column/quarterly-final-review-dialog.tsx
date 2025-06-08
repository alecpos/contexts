'use client';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import {
    StatusTag,
    StatusTagAction,
    StatusTagNotes,
} from '@/app/types/status-tags/status-types';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { useRouter } from 'next/navigation';
import { Status } from '@/app/types/global/global-enumerators';
import QuarterlyFinalReviewDialogContent from './quarterly-final-review-dialog/quarterly-final-review-dialog-content';
import { flatten } from 'lodash';
import {
    updateRenewalOrderByRenewalOrderId,
    updateRenewalOrderMetadataSafely,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getAutomaticMacroContent } from '@/app/utils/database/controller/messaging/messages/messages';
import { getSafeGuardProviderId } from '@/app/utils/database/controller/orders/orders-api';
import { createDosageSelectionActionItem } from '@/app/utils/database/controller/action-items/action-items-actions';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    getDoubleDosageDosingOptionByDosingQuarterlyReview,
    getSingleDosageDosingOptionByDosingQuarterlyReview,
} from './approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { DosageSelectionVariantIndexToDosage } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { onAlmostDoneScreenSubmit } from '@/app/services/pharmacy-integration/util/utils';

interface QuarterlyFinalReviewDialogProps {
    open: boolean;
    onClose: () => void;
    orderData: DBOrderData;
    patientData: DBPatientData;
    provider_id: string;
    mutateIntakeData: KeyedMutator<any>;
    activeProviderId: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
}

export default function QuarterlyFinalReviewDialog({
    open,
    onClose,
    orderData,
    patientData,
    provider_id,
    mutateIntakeData,
    activeProviderId,
    setMessageContent,
}: QuarterlyFinalReviewDialogProps) {
    // console.log('orderData', orderData);
    // console.log('patientData', patientData);
    // console.log('VID', variant_index);
    // console.log('is it swappable?', isSwappableVariant);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const [scriptMetadata, setScriptMetadata] = useState<{
        script: any;
        sigList: string[] | null;
    }>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [empowerDisplayName, setEmpowerDisplayName] = useState<string>();
    const [hallandaleDisplayName, setHallandaleDisplayName] =
        useState<string>();

    const [confirmationMessage, setConfirmationMessage] =
        useState<JSX.Element>();

    const router = useRouter();

    const handleOrderFailureStatusTagChange = async () => {
        const orderId = orderData.id;

        window.alert('Error occurred - please forward to engineering');

        setIsSubmitting(false);
        onClose();
    };

    const onApprove = async () => {
        setIsSubmitting(true);
        const variantIndexes = flatten(
            selectedOptions.map((option, index) => {
                let dosing;
                if (selectedOptions.length === 1) {
                    dosing =
                        getSingleDosageDosingOptionByDosingQuarterlyReview(
                            option
                        );
                } else {
                    dosing =
                        getDoubleDosageDosingOptionByDosingQuarterlyReview(
                            option
                        );
                }
                return dosing?.variant_indexes!;
            })
        );

        console.log('variantIndexes to be suggested: ', variantIndexes);

        if (!variantIndexes || variantIndexes.length === 0) {
            await handleOrderFailureStatusTagChange();
            return;
        }

        if (!orderData.renewal_order_id) {
            await handleOrderFailureStatusTagChange();
            return;
        }

        await updateRenewalOrderByRenewalOrderId(orderData.renewal_order_id, {
            dosage_suggestion_variant_indexes: variantIndexes,
        });

        await updateRenewalOrderMetadataSafely(
            {
                dosage_selection_provider: provider_id,
            },
            orderData.renewal_order_id
        );

        /**
         * For handling California patients who only get monthly variants,
         * so if they get suggested a single dosage, and it's the same dosage as before,
         * then there is no 'dosage-selection' to do, so we just call onAlmostDoneScreenSubmit with the suggested monthly variant index and resolve the status tag
         */
        if (
            selectedOptions.length === 1 && //make sure california patients never get a quarterly option in dosage-selection!
            orderData.state === 'CA'
        ) {
            let priceDataOfSelectedMonthlyVariant: Partial<ProductVariantRecord> | null =
                null;

            //get the monthly product_variant record(s) that corresponds to the dosage suggested by the provider
            const monthlyVariantsSuggestedByProvider = (
                await Promise.all(
                    variantIndexes.map(async (variantIndex) => {
                        //loop through all variants to find the one that is monthly (there should be only 1 monthly variant for 1 dosage)
                        const suggestedVariant =
                            await getPriceDataRecordWithVariant(
                                orderData.product_href,
                                variantIndex
                            );
                        if (suggestedVariant?.cadence === 'monthly') {
                            priceDataOfSelectedMonthlyVariant =
                                suggestedVariant as Partial<ProductVariantRecord>; //save this to pass it into onAlmostDoneScreenSubmit later on
                            const lastShippedVariant =
                                await getPriceDataRecordWithVariant(
                                    orderData.product_href,
                                    orderData.variant_index
                                );
                            const suggestedDosageIsSameAsLastShippedDosage = //we assume they are in the format ([startingdosage]....) - tech debt
                                suggestedVariant.dosages
                                    ?.slice(1)
                                    .match(/\d+(\.\d+)?/)?.[0] ===
                                lastShippedVariant?.dosages
                                    ?.slice(1)
                                    .match(/\d+(\.\d+)?/)?.[0];
                            return suggestedDosageIsSameAsLastShippedDosage
                                ? suggestedVariant
                                : null;
                        }
                        return null;
                    })
                )
            ).filter((variant) => variant !== null);

            //update the patient's stripe subscription schedule immediately for the suggested monthly variant using onAlmostDoneScreenSubmit
            if (
                monthlyVariantsSuggestedByProvider &&
                monthlyVariantsSuggestedByProvider.length === 1 && //only 1 monthly variant should correspond to the 1 dosage suggested by the provider
                monthlyVariantsSuggestedByProvider[0]?.variant_index &&
                priceDataOfSelectedMonthlyVariant
            ) {
                await createUserStatusTagWAction(
                    StatusTag.Resolved,
                    orderData.renewal_order_id,
                    StatusTagAction.REPLACE,
                    patientData.id,
                    StatusTagNotes.ResolvedAfterSendingDosageSuggestion,
                    provider_id ?? activeProviderId,
                    [StatusTag.Resolved]
                ); //run onAlmostDone AFTER the resolved status tag update in case the status changes again to engineer within onAlmostDone
                await onAlmostDoneScreenSubmit(
                    orderData,
                    monthlyVariantsSuggestedByProvider[0].variant_index,
                    patientData,
                    priceDataOfSelectedMonthlyVariant,
                    'automatic-CA-patient-monthly-DS'
                );
                setIsSubmitting(false);
                onClose();
                return; //just return because we're all done here
            }
            if (monthlyVariantsSuggestedByProvider.length === 0) {
                //should theoretically never happen:
                console.log(
                    'California patient still needs to do dosage selection because no monthly variants are recommended: ',
                    patientData?.id
                );
            } else {
                // this should theoretically never happen, as multiple monthly variants with the same dosage should never be suggested:
                console.log(
                    'California patient still needs to do dosage selection because multiple monthly variants are recommended: ',
                    patientData?.id
                );
            }
        } //end of california monthly variant handling

        const macroId = selectedOptions.reduce((maxId, option) => {
            let dosing;
            if (selectedOptions.length === 1) {
                dosing =
                    getSingleDosageDosingOptionByDosingQuarterlyReview(option);
            } else {
                dosing =
                    getDoubleDosageDosingOptionByDosingQuarterlyReview(option);
            }
            if (!dosing?.macro_id) {
                return maxId;
            }
            return Math.max(maxId, dosing?.macro_id);
        }, -1);

        if (macroId === -1) {
            console.error('Unable to get macro id');
            return;
        }

        const originalOrderId = orderData.renewal_order_id
            ? orderData.original_order_id
            : orderData.id;

        const failSafeProviderId =
            provider_id ??
            activeProviderId ??
            (await getSafeGuardProviderId(
                orderData.renewal_order_id
                    ? orderData.renewal_order_id
                    : originalOrderId
            ));

        const macroHtml = await getAutomaticMacroContent(
            orderData,
            patientData,
            failSafeProviderId,
            macroId
        );

        console.log('attempting to figure my life out - 3 Nathan: ', macroHtml);

        if (macroHtml === Status.Failure) {
            await handleOrderFailureStatusTagChange();
            return;
        }

        setMessageContent(macroHtml);

        if (!provider_id) {
            await updateRenewalOrderByRenewalOrderId(
                orderData.renewal_order_id,
                {
                    assigned_provider: failSafeProviderId,
                }
            );
        }

        await createUserStatusTagWAction(
            StatusTag.Resolved,
            orderData.renewal_order_id,
            StatusTagAction.REPLACE,
            patientData.id,
            StatusTagNotes.ResolvedAfterSendingDosageSuggestion,
            provider_id ?? activeProviderId,
            [StatusTag.Resolved]
        );

        // Create action item here
        await createDosageSelectionActionItem(
            patientData.id,
            orderData.product_href as PRODUCT_HREF,
            Number(orderData.subscription_id)
        );

        try {
            await trackRudderstackEvent(
                patientData.id,
                RudderstackEvent.DOSAGE_SUGGESTIONS_SENT,
                {
                    renewal_order_id: orderData.renewal_order_id,
                    product_name: orderData.product_href,
                    provider_id: provider_id,
                }
            );
        } catch (error) {
            console.error(
                'Error tracking Rudderstack event in quarterly-final-review-dialog.tsx',
                error
            );
        }

        setIsSubmitting(false);
        onClose();
        // window.location.reload();
    };

    return (
        <Dialog
            open={open}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            PaperProps={{
                style: {
                    minWidth: '800px',
                },
            }}
            className='max-h-80vh'
        >
            <DialogTitle id='alert-dialog-title'>
                <span className='inter-h5-question-header'>
                    What is the patient approved for?
                </span>
            </DialogTitle>
            <hr style={{ border: '.8px solid lightgray', width: '100%' }} />
            <DialogContent className='flex flex-col gap-4'>
                <QuarterlyFinalReviewDialogContent
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    orderData={orderData}
                />
                {confirmationMessage}
            </DialogContent>
            <DialogActions>
                <>
                    <Button
                        onClick={onClose}
                        autoFocus
                        variant='outlined'
                        color='error'
                        disabled={isSubmitting}
                        sx={{
                            borderRadius: '12px',
                            paddingX: '32px',
                            paddingY: '14px',
                            ':hover': {
                                backgroundColor: 'lightgray',
                            },
                        }}
                    >
                        <span className='normal-case provider-bottom-button-text  text-red-500'>
                            Cancel
                        </span>
                    </Button>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={onApprove}
                        disabled={selectedOptions.length === 0}
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: 'black',
                            paddingX: '32px',
                            paddingY: '14px',
                            ':hover': {
                                backgroundColor: 'darkslategray',
                            },
                        }}
                    >
                        {isSubmitting ? (
                            <CircularProgress
                                sx={{ color: '#FFFFFF' }}
                                size={22}
                            />
                        ) : (
                            <span className='normal-case provider-bottom-button-text  text-white'>
                                Approve
                            </span>
                        )}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
}

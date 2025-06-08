'use client';

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    SelectChangeEvent,
    CircularProgress,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DosageChangeEquivalenceCodes } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';
import {
    dosageChangeMacroReplacementTextMap,
    DOSING_SWAP_EQUIVALENCE_CONSTANTS,
    DosingChangeEquivalenceOptionMetadata,
    getDosingOptionByDosageChangeEquivalenceCode,
} from '@/app/utils/classes/DosingChangeController/DosageChangeConstantIndex';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { updateOrderMetadata } from '@/app/utils/database/controller/orders/orders-api';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { FIRST_TIME_DOSAGE_SELECTION_REMINDER } from '@/app/services/customerio/event_names';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { getFirstTimeDosageChangeMacro } from '../../../containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { MacroParameters } from '@/app/utils/database/controller/macros/macros-types';
import { updateStatusTagToResolved } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { USStates } from '@/app/types/enums/master-enums';

interface ProviderDosageChangeProps {
    provider_id: string;
    productHref: PRODUCT_HREF;
    patientData: DBPatientData;
    orderData: DBOrderData;
    setMessageContent: Dispatch<SetStateAction<string>>;
    onClose: () => void;
    setPrescribedInSession: Dispatch<SetStateAction<boolean>>;
}

export default function ProviderDosageChangeComponent({
    provider_id,
    productHref,
    patientData,
    orderData,
    onClose,
    setMessageContent,
    setPrescribedInSession,
}: ProviderDosageChangeProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [customDosingSelected, setCustomDosingSelected] =
        useState<DosageChangeEquivalenceCodes>(
            DOSING_SWAP_EQUIVALENCE_CONSTANTS[0].dosingEquivalence
        );
    const [dosingChangeSelectionMetadata, setDosingChangeSelectionMetadata] =
        useState<DosingChangeEquivalenceOptionMetadata>();

    useEffect(() => {
        setDosingChangeSelectionMetadata(
            getDosingOptionByDosageChangeEquivalenceCode(customDosingSelected)
        );
    }, [customDosingSelected]);

    const handleDosageSelectChange = (e: SelectChangeEvent) => {
        setCustomDosingSelected(e.target.value as DosageChangeEquivalenceCodes);
    };

    const handleDosingSwapFinalization = async () => {
        setIsLoading(true);

        //Update the metadata inside of the handle dosing swap
        const selection_metadata = {
            recommendedDosageCode: customDosingSelected,
        };
        await updateOrderMetadata(selection_metadata, orderData.id);

        //Fire the customer io campaign event.
        await triggerEvent(
            patientData.id,
            FIRST_TIME_DOSAGE_SELECTION_REMINDER,
            {
                click_url: `https://app.gobioverse.com/dosage/first-time/${orderData.id}`,
            }
        );

        //provider activity audit.
        await createNewProviderActivityAudit({
            provider_id: provider_id,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'dev',
            order_id: orderData.id,
            metadata: {
                recommendedDosageCode: customDosingSelected,
            },
            timestamp: Date.now(),
            action: 'first_time_dosage_recommendation',
        });

        //load macro and set as message content.
        let html_macro = await getFirstTimeDosageChangeMacro(
            productHref,
            customDosingSelected,
            patientData
        );

        html_macro = replaceHTMLMacroDosageParams(
            html_macro,
            customDosingSelected
        );
        setMessageContent(html_macro);

        await updateStatusTagToResolved(
            orderData.id,
            patientData.id,
            'Resolved after sending first time dosage selection macro'
        );

        setPrescribedInSession(true);
        setIsLoading(false);
        onClose();
    };

    const replaceHTMLMacroDosageParams = (
        htmlAsString: string,
        customDosingSelected: DosageChangeEquivalenceCodes
    ): string => {
        const macro_dosage_text =
            dosageChangeMacroReplacementTextMap[customDosingSelected];

        let htmlToReturn = htmlAsString.replace(
            MacroParameters.DosageChangeMacroPrices,
            macro_dosage_text
        );

        htmlToReturn = htmlToReturn.replace(
            MacroParameters.DosageChangeMacroURL,
            `<a href="https://app.gobioverse.com/dosage/first-time/${orderData.id}">Please click here to select your desired dosage</a>`
        );

        return htmlToReturn;
    };

    return (
        <>
            <div className='gap-2 flex p-2'>
                <FormControl>
                    <InputLabel id='dosing-adjustment-select'>
                        Dosing
                    </InputLabel>
                    <Select
                        fullWidth
                        labelId='dosing-adjustment-select'
                        label='Dosing'
                        onChange={handleDosageSelectChange}
                        value={customDosingSelected}
                    >
                        <MenuItem value={'n/a'} disabled>
                            Select Dosing
                        </MenuItem>
                        {DOSING_SWAP_EQUIVALENCE_CONSTANTS.map(
                            (
                                option: DosingChangeEquivalenceOptionMetadata,
                                index: number
                            ) => {
                                // if (
                                //     orderData.product_href !=
                                //     option.product_href
                                // ) {
                                //     return null;
                                // }

                                return (
                                    <MenuItem
                                        key={index}
                                        value={option.dosingEquivalence}
                                    >
                                        {option.dosing}
                                    </MenuItem>
                                );
                            }
                        )}
                    </Select>
                </FormControl>
                <Button
                    variant='outlined'
                    disabled={isLoading || orderData.state === USStates.California}
                    onClick={handleDosingSwapFinalization}
                    sx={{ height: '60px' }}
                >
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        'Prescribe & Load Macro'
                    )}
                </Button>
            </div>

            {orderData.state === USStates.California && (
                <div className='flex flex-col gap-2'>
                    <BioType className='inter_body_regular text-red-500 font-bold'>
                        This macro is disabled for California patients as we can only ship 1-month supplies to CA.
                    </BioType>
                    <BioType className='inter_body_regular text-red-500 font-bold'>
                        Please do not send the first time dosage selection macro to CA patients.
                    </BioType>
                </div>
            )}

            <div className='flex flex-col mt-2 gap-2'>
                {dosingChangeSelectionMetadata?.sigs &&
                    Object.entries(dosingChangeSelectionMetadata.sigs).map(
                        ([key, value]) => (
                            <div key={key} className='flex flex-col'>
                                <BioType className='it-subtitle'>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                                    Sig:
                                </BioType>
                                <div className='flex flex-col ml-4'>
                                    {value.map((sig_line, index) => {
                                        return (
                                            <BioType
                                                className='it-body'
                                                key={index}
                                            >
                                                {sig_line}
                                            </BioType>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    )}
            </div>
        </>
    );
}

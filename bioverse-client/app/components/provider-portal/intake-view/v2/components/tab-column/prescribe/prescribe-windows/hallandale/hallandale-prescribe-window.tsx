'use client';

/**
 * This component is deprecated and not used.
 */

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { sendHallendaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { OrderType } from '@/app/types/orders/order-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import {
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { convertHallandaleOrderToBase64 } from './utils/hallandale-base64-pdf';
import {
    HALLANDALE_VARIANT_SCRIPT_DATA,
    searchHallandaleItemCatalogByCode,
    searchHallandaleVariantScriptDataByDisplayName,
} from '@/app/services/pharmacy-integration/hallandale/hallandale-catalog';

interface HallandalePrescribeWindowProps {
    patientData: DBPatientData;
    orderData: DBOrderData;
    orderType: OrderType;
    allergyData: string;
}

export default function HallandalePrescribeWindow({
    patientData,
    orderData,
    orderType,
    allergyData,
}: HallandalePrescribeWindowProps) {
    const [selectedRx, setSelectedRx] = useState<string>('none');

    const [isSendingScript, setIsSendingScript] = useState<boolean>(false);

    const [order, setOrder] = useState<HallandaleOrderObject>({
        general: {},
        prescriber: {
            npi: '1013986835',
            lastName: 'Desai',
            firstName: 'Bobby',
            licenseState: 'FL',
            licenseNumber: 'ME80459',
        },
        practice: {
            id: parseInt(process.env.NEXT_PUBLIC_HALLANDALE_PRACTICE_ID!),
        },
        patient: {
            lastName: patientData.last_name,
            firstName: patientData.first_name,
            gender: parseHallandaleGender(patientData.sex_at_birth),
            dateOfBirth: patientData.date_of_birth,
            address1: patientData.address_line1,
            address2: patientData.address_line2,
            city: patientData.city,
            state: patientData.state,
            zip: patientData.zip,
            phoneHome: patientData.phone_number,
            email: patientData.email,
        },
        billing: {
            payorType: 'doc',
        },
        shipping: {
            recipientType: 'patient',
            recipientFirstName: patientData.first_name,
            recipientLastName: patientData.last_name,
            recipientPhone: patientData.phone_number,
            recipientEmail: patientData.email,
            addressLine1: patientData.address_line1,
            addressLine2: patientData.address_line2,
            city: patientData.city,
            state: patientData.state,
            zipCode: patientData.zip,
            country: 'US',
            service: 6230,
        },
        rxs: [],
    });

    const handleProviderPrescribeAudit = async () => {
        const time = new Date().getTime(); // Record start time

        const new_audit: ProviderActivityAuditCreateObject = {
            provider_id: (await readUserSession()).data.session?.user.id!,
            action: 'prescribe_intake',
            timestamp: time,
            metadata: {
                pharmacy: 'hallandale',
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            ...(orderType === OrderType.RenewalOrder
                ? {
                      renewal_order_id: orderData.renewal_order_id,
                      order_id: orderData.original_order_id!,
                  }
                : { order_id: orderData.id }),
        };

        await createNewProviderActivityAudit(new_audit);
    };

    const sendScript = async () => {
        setIsSendingScript(true);
        const base64pdf = convertHallandaleOrderToBase64(order, allergyData);

        const orderWithPdf: HallandaleOrderObject = {
            ...order,
            document: { pdfBase64: base64pdf },
        };

        const body_json: HallandaleScriptJSON = {
            message: { id: orderData.id, sentTime: new Date().toISOString() },
            order: orderWithPdf,
        };

        const provider_id = (await readUserSession()).data.session?.user.id!;

        const result = await sendHallendaleScript(
            body_json,
            orderData.id,
            provider_id,
            orderData.order_status,
            orderType,
            orderData.subscription_id
        );

        console.log(result);
        setIsSendingScript(false);
    };

    const handleRxSelection = (
        event:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string>
    ) => {
        const selectedValue = event.target.value;
        if (selectedValue === 'none') {
            return;
        }

        const selectedItem =
            searchHallandaleVariantScriptDataByDisplayName(selectedValue);

        if (selectedItem) {
            const newRxsList = selectedItem.array.map((rx_item) => {
                const rx_catalog_data = searchHallandaleItemCatalogByCode(
                    rx_item.catalogItemCode
                );

                return {
                    rxType: 'new',
                    drugName: rx_catalog_data.product_name,
                    drugStrength: rx_catalog_data.product_strength,
                    drugForm: rx_catalog_data.product_form,
                    lfProductID: rx_catalog_data.product_code,
                    quantity: rx_item.quantity,
                    directions: rx_item.sigText,
                    refills: 0,
                    dateWritten: getCurrentDate(),
                    daysSupply: rx_item.daysSupply,
                };
            });

            setOrder((prevOrder) => ({
                ...prevOrder,
                rxs: newRxsList,
            }));
        }

        setSelectedRx(selectedValue);
    };

    return (
        <>
            <Paper className='flex flex-col p-4 items-center gap-4'>
                <BioType className='text-primary it-h1'>
                    Prescribe Hallandale
                </BioType>

                <div>
                    <Select
                        value={selectedRx}
                        onChange={(event) => handleRxSelection(event)}
                        fullWidth
                    >
                        <MenuItem
                            sx={{ fontStyle: 'italic' }}
                            disabled
                            value='none'
                        >
                            Please Select
                        </MenuItem>
                        {HALLANDALE_VARIANT_SCRIPT_DATA.map((item) => (
                            <MenuItem
                                key={item.selectDisplayName}
                                value={item.selectDisplayName}
                            >
                                {`${item.selectDisplayName}`}
                            </MenuItem>
                        ))}
                    </Select>
                </div>

                <div>
                    <Button
                        onClick={sendScript}
                        variant='outlined'
                        disabled={isSendingScript}
                    >
                        {!isSendingScript ? (
                            'Send Script'
                        ) : (
                            <CircularProgress size={24} />
                        )}
                    </Button>
                </div>
            </Paper>
        </>
    );
}

function parseHallandaleGender(sex_at_birth: string): 'm' | 'f' | 'u' {
    switch (sex_at_birth) {
        case 'Male':
            return 'm';
        case 'Female':
            return 'f';
        default:
            return 'u';
    }
}

function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

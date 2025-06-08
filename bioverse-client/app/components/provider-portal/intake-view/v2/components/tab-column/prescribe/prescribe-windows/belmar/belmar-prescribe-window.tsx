'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    BELMAR_ITEM_SET_MAPPING,
    findBelmarItemByDisplayName,
} from '@/app/services/pharmacy-integration/belmar/belmar-item-list';
import { sendBelmarScript } from '@/app/services/pharmacy-integration/belmar/belmar-script-api';
import { OrderType } from '@/app/types/orders/order-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import {
    Button,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { convertBelmarOrderToBase64 } from '../../../../../utils/base64pdfGenerator/belmar-base64-pdf';

interface BelmarPrescribeWindowProps {
    patientData: DBPatientData;
    orderData: DBOrderData;
    allergyData: string;
    orderType: OrderType;
}

export default function BelmarPrescribeWindow({
    patientData,
    orderData,
    orderType,
    allergyData,
}: BelmarPrescribeWindowProps) {
    const [selectedRx, setSelectedRx] = useState<string>('please-select');

    const [order, setOrder] = useState<BelmarRequestOrder>({
        general: {
            statusId:
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod'
                    ? 'bc06d'
                    : 'b5f2c',
            referenceId: orderData.id,
        },
        document: {
            pdfBase64: '',
        },
        prescriber: {
            npi: '1689995771',
            lastName: 'Echeverry',
            firstName: 'German',
        },
        practice: {
            id: 1211488,
        },
        billing: {
            payorType: 'doc',
        },
        patient: {
            lastName: patientData.last_name,
            firstName: patientData.first_name,
            gender: parseBelmarGender(patientData.sex_at_birth),
            dateOfBirth: patientData.date_of_birth,
            address1: patientData.address_line1,
            address2: patientData.address_line2,
            city: patientData.city,
            state: patientData.state,
            zip: patientData.zip,
        },
        shipping: {
            recipientType: 'patient',
            recipientFirstName: patientData.first_name,
            recipientLastName: patientData.last_name,
            recipientPhone: patientData.phone_number,
            addressLine1: patientData.address_line1,
            addressLine2: patientData.address_line2,
            city: patientData.city,
            state: patientData.state,
            zipCode: patientData.zip,
            country: 'US',
            service: 7725,
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
                pharmacy: 'belmar',
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
        await handleProviderPrescribeAudit();

        // allergyData

        const base64pdf = convertBelmarOrderToBase64(order, allergyData);

        const orderWithPdf: BelmarRequestOrder = {
            ...order,
            document: { pdfBase64: base64pdf },
        };

        console.log(orderWithPdf);

        const body_json: BelmarRequestBody = {
            message: { id: orderData.id, sentTime: new Date().toISOString() },
            order: orderWithPdf,
        };

        const result = await sendBelmarScript(body_json, '', '');
        console.log('result: ', result);
    };

    const handleRxSelection = (
        event:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string>
    ) => {
        const selectedValue = event.target.value;
        const selectedItem = findBelmarItemByDisplayName(selectedValue);

        if (selectedItem) {
            setOrder((prevOrder) => ({
                ...prevOrder,
                rxs: selectedItem.productArray.map((item) => {
                    return {
                        rxType: 'new', // Example value, adjust based on actual data
                        lfProductID: item.product.product_code,
                        drugName: item.product.product_name,
                        drugStrength: item.product.product_strength,
                        drugForm: item.product.product_form,
                        quantity: item.quantity,
                        quantityUnits: item.product.units,
                        directions: item.sig,
                        dateWritten: getCurrentDate(),
                        refills: 0,
                        daysSupply: 28,
                    };
                }),
            }));
        }

        setSelectedRx(selectedValue);
    };

    return (
        <>
            <Paper className='flex flex-col p-4 items-center gap-4'>
                <BioType className='text-primary it-h1'>
                    Prescribe to Belmar
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
                            value='please-select'
                        >
                            Please Select
                        </MenuItem>
                        {BELMAR_ITEM_SET_MAPPING.map((item) => (
                            <MenuItem
                                key={item.displayName}
                                value={item.displayName}
                            >
                                {`${item.displayName}`}
                            </MenuItem>
                        ))}
                    </Select>
                </div>

                <div>
                    <Button onClick={sendScript} variant='outlined'>
                        Send Script
                    </Button>
                </div>
            </Paper>
        </>
    );
}

function parseBelmarGender(sex_at_birth: string): 'm' | 'f' | 'u' {
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

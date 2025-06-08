'use client';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { useState } from 'react';
import { createClinicalNoteTemplate } from '../../clinical-note-templates/clinical-template-functions';
import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';
import { mutate } from 'swr';
import {
    Alert,
    Button,
    CircularProgress,
    Snackbar,
    Switch,
} from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { OrderType } from '@/app/types/orders/order-types';
import ClinicalNoteTemplateComponent from './note-creation/template-preview';
import { Status } from '@/app/types/global/global-enumerators';

interface ClinicalTemplateCreationTabProps {
    patient_id: string;
    product_href: string;
    onClose: () => void;
    order_id: string | number;
    renewal_order_id?: string;
}

export default function ClinicalTemplateCreationTab({
    patient_id,
    product_href,
    onClose,
    order_id,
    renewal_order_id,
}: ClinicalTemplateCreationTabProps) {


    //TODO:
    //if renewal order ID is undefined, and a renewal order template is created, could cause confusion

    

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [orderTypeState, setOrderTypeState] = useState<OrderType>(
        renewal_order_id ? OrderType.RenewalOrder : OrderType.Order
    );
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);

    const addClinicalTemplate = async () => {
        setButtonLoading(true);

        const author_id = (await readUserSession()).data.session?.user.id;

        if (!author_id) {
            setErrorSnackbarOpen(true);
            setButtonLoading(false);
            return;
        }

        let order_type_override;

        if (
            orderTypeState ===
            (renewal_order_id ? OrderType.RenewalOrder : OrderType.Order)
        ) {
            order_type_override = undefined;
        } else {
            order_type_override = orderTypeState;
        }

        const result = await createClinicalNoteTemplate(
            product_href as PRODUCT_HREF,
            order_id,
            patient_id,
            author_id!,
            renewal_order_id,
            order_type_override
        );

        if (result === Status.Failure) {
            setErrorSnackbarOpen(true);
            setButtonLoading(false);
            return;
        }

        mutate(`${patient_id}-clinical-notes`, true);

        setButtonLoading(false);
        onClose();
    };

    const changeOrderTypeState = () => {
        if (orderTypeState === OrderType.RenewalOrder) {
            setOrderTypeState(OrderType.Order);
        } else {
            setOrderTypeState(OrderType.RenewalOrder);
        }
    };

    function getCurrentDateMMDDYYYY(): string {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();

        return `${month}/${day}/${year}`;
    }

    return (
        <div className='flex flex-col p-4 gap-2'>
            <div className='flex flex-col gap-0'>
                <div className='flex flex-row provider-dropdown-title items-center'>
                    <BioType>Intake</BioType>
                    <Switch
                        checked={orderTypeState === OrderType.RenewalOrder}
                        value={orderTypeState === OrderType.RenewalOrder}
                        onChange={() => changeOrderTypeState()}
                    ></Switch>
                    <BioType>Renewal</BioType>
                </div>
            </div>
            <div className='flex flex-col rounded-md bg-[#E5EDF4] w-full'>
                <div className='flex flex-row justify-between pt-2 px-2'>
                    <BioType className='provider-dropdown-title text-weak'>
                        Product
                    </BioType>
                    <div className='flex flex-col w-[20%]'>
                        <BioType className='provider-dropdown-title text-weak'>
                            Date
                        </BioType>
                    </div>
                </div>
                <div className='flex flex-row justify-between px-2 pb-2'>
                    <BioType
                     className='provider-dropdown-title text-strong'
                    >{PRODUCT_NAME_HREF_MAP[product_href]}</BioType>
                    <div className='flex flex-col w-[20%]'>
                        <BioType className='provider-dropdown-title text-strong'>
                            {getCurrentDateMMDDYYYY()}
                        </BioType>
                    </div>
                </div>
            </div>

            <div className='flex flex-col overflow-scroll max-h-[300px]'>
                <ClinicalNoteTemplateComponent
                    orderType={orderTypeState}
                    product_href={product_href}
                />
            </div>

            <div className='flex flex-col items-center mt-2'>
                <Button
                    variant='contained'
                    size='large'
                    sx={{ 
                        borderRadius: '12px', 
                        backgroundColor: 'black',
                        paddingX: '32px',
                        paddingY: '14px',
                        ":hover": {
                            backgroundColor: 'darkslategray',
                        }
                    }}
                    onClick={() => {
                        addClinicalTemplate();
                    }}
                >
                    {buttonLoading ? (
                        <CircularProgress sx={{ color: 'white' }} />
                    ) : (
                        <span className='normal-case provider-bottom-button-text  text-white'>Add Template</span>
                    )}
                </Button>
            </div>

            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setErrorSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setErrorSnackbarOpen(false)}
                    severity='error'
                    sx={{ width: '100%' }}
                >
                    There was an error in the application please refresh the
                    page and try again
                </Alert>
            </Snackbar>
        </div>
    );
}

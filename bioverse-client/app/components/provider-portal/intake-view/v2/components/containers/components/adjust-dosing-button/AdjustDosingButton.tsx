import { Button } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { KeyedMutator } from 'swr';
import AdjustDosingDialog from './v2-components/AdjustDosingDialog';

interface AdjustDosingButtonProps {
    patient_id: string;
    order_data: DBOrderData;
    mutateIntakeData: KeyedMutator<any>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    patientData: DBPatientData;
    currentMonth: number;
    currentDosage: string;
}

export default function AdjustDosingButton({
    patient_id,
    order_data,
    mutateIntakeData,
    setMessageContent,
    patientData,
    currentMonth,
    currentDosage,
}: AdjustDosingButtonProps) {
    const [openAdjustDosingDialog, setOpenAdjustDosingDialog] =
        useState<boolean>(false);

    const handleOnClick = () => {
        setOpenAdjustDosingDialog(true);
    };

    return (
        <>
            <Button 
                onClick={handleOnClick} 
                variant='contained'
                sx={{
                    borderRadius: '12px',
                    backgroundColor: 'black',
                    paddingX: '32px',
                    paddingY: '14px',
                    ":hover": {
                        backgroundColor: 'darkslategray',
                    }
                }}
            >
                <span className='normal-case provider-bottom-button-text  text-white'>Adjust Dosing</span>
            </Button>
            <AdjustDosingDialog
                open={openAdjustDosingDialog}
                onClose={() => setOpenAdjustDosingDialog(false)}
                orderData={order_data}
                mutateIntakeData={mutateIntakeData}
                setMessageContent={setMessageContent}
                patientData={patientData}
                currentMonth={currentMonth}
                currentDosage={currentDosage}
            />
        </>
    );
}

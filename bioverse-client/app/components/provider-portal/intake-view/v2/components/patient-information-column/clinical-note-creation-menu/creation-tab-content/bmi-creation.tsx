'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Status } from '@/app/types/global/global-enumerators';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createManualBMINote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { getPatientHeightColumnValue } from '@/app/utils/database/controller/profiles/profiles';
import {
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface BMICreationTabProps {
    patient_id: string;
    onClose: () => void;
}

export default function BMIClinicalNoteCreationTab({
    patient_id,
    onClose,
}: BMICreationTabProps) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);

    const [userInputWeight, setUserInputWeight] = useState<number | undefined>(
        undefined
    );

    const { data, error, isLoading } = useSWR(`${patient_id}-height`, () =>
        getPatientHeightColumnValue(patient_id)
    );

    const convertHeightInchesToFeetInches = (totalHeightInches: number) => {
        const heightFeet = Math.floor(totalHeightInches / 12);
        const heightInches = Math.round(totalHeightInches % 12);

        return `${heightFeet} ft. ${heightInches} in.`;
    };

    const calculateBMIValue = () => {
        if (!userInputWeight || !data) {
            return null;
        }

        const heightInMeters = data * 0.0254;
        const weightInKg = userInputWeight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return Math.round(bmi * 10) / 10;
    };

    const getTodayDate = (): string => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return today.toLocaleDateString('en-US', options);
    };

    const addBMINote = async () => {
        setButtonLoading(true);

        const current_provider_id = (await readUserSession()).data.session?.user
            .id;

        if (!current_provider_id) {
            setErrorSnackbarOpen(true);
            return;
        }

        const heightFeet = Math.floor(data / 12);
        const heightInches = Math.round(data % 12);

        const result = await createManualBMINote(
            patient_id,
            current_provider_id,
            heightFeet,
            heightInches,
            calculateBMIValue()!,
            userInputWeight!
        );

        if (result === Status.Success) {
            setButtonLoading(false);
            mutate(`${patient_id}-clinical-notes`);
            onClose();
        } else {
            setErrorSnackbarOpen(true);
            setButtonLoading(false);
            return;
        }
    };

    return (
        <div className='flex flex-col p-4 gap-2'>
            <div className='flex flex-col gap-0'>
                <BioType className='provider-dropdown-title '>Insert New BMI Record</BioType>
            </div>

            <div className='flex flex-col gap-2'>
                <BioType className='provider-dropdown-title '>Patient Height:</BioType>
                <BioType className='provider-dropdown-title '>
                    {isLoading
                        ? 'Loading...'
                        : convertHeightInchesToFeetInches(data)}
                </BioType>

                <div className=''>
                    <TextField
                        label='Weight (lbs.)'
                        variant='outlined'
                        type='number'
                        value={userInputWeight}
                        onChange={(e) =>
                            setUserInputWeight(parseInt(e.target.value))
                        }
                        margin='normal'
                        sx={{
                            '& .MuiInputBase-input': { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                            '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif' , fontSize: '14px' },
                        }}
                    />
                </div>

                <div className='flex flex-col bg-[#E5EDF4] rounded-[12px] p-4'>
                    <BioType className='provider-dropdown-title '>Note Preview:</BioType>
                    <BioType className='provider-clinical-notes-bmi-text '>Date:</BioType>
                    <BioType className='provider-clinical-notes-bmi-text '>{getTodayDate()}</BioType>
                    <BioType className='provider-clinical-notes-bmi-text '>BMI Data:</BioType>
                    <BioType className='provider-clinical-notes-bmi-text '>
                        Height: {convertHeightInchesToFeetInches(data)}, Weight:{' '}
                        {userInputWeight}, BMI: {calculateBMIValue()}
                    </BioType>
                </div>
            </div>

            <div className='flex flex-col items-center'>
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
                    disabled={calculateBMIValue() == null}
                    onClick={() => {
                        addBMINote();
                    }}
                >
                    {buttonLoading ? (
                        <CircularProgress sx={{ color: 'white' }} />
                    ) : (
                        <span className='normal-case provider-bottom-button-text  text-white'>Add BMI Note</span>
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

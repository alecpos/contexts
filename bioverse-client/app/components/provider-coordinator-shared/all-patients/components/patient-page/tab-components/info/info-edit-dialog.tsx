'use client';
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, InputLabel, TextField } from '@mui/material';
import { adminEditAccountInformation } from '@/app/utils/database/controller/profiles/profiles';
import { changeEmail } from '@/app/utils/actions/auth/change-email';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';
import { formatE164 } from '@/app/utils/functions/customerio/utils';

interface InfoEditDialogProps {
    onClose: () => void;
    onConfirm: () => void;
    profile_data: APProfileData;
    dialog_open: boolean;
}

export default function InfoEditDialog({
    onClose,
    onConfirm,
    profile_data,
    dialog_open,
}: InfoEditDialogProps) {
    const [firstName, setFirstName] = useState(profile_data.first_name);
    const [lastName, setLastName] = useState(profile_data.last_name);
    const [email, setEmail] = useState(profile_data.email);
    const [phoneNumber, setPhoneNumber] = useState(profile_data.phone_number);
    const [dob, setDob] = useState(preformatDate(profile_data.date_of_birth));
    const [emailChanged, setEmailChanged] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>();

    const handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Extract the current value from the event
        const currentValue = event.target.value;

        // Remove any non-numeric characters that might have been added
        const numericValue = currentValue.replace(/\D/g, '');

        // Initialize formattedValue with the numericValue
        let formattedValue = numericValue;

        // Check the length of numericValue and format accordingly
        if (numericValue.length > 2 && numericValue.length <= 4) {
            // Add a slash after the month if there are more than 2 digits
            formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(
                2
            )}`;
        } else if (numericValue.length > 4) {
            // Add slashes for both month and day if there are more than 4 digits
            formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(
                2,
                4
            )}/${numericValue.slice(4)}`;
        }

        // Limit the formattedValue to a maximum length of 10 characters
        formattedValue = formattedValue.slice(0, 10);

        // Update the state with the formatted value
        setDob(formattedValue);
    };

    const handlePhoneNumberChange = (value: string) => {
        // Limit the input to  10 digits
        value = value.replace(/[^\d]/g, '').slice(0, 10);
        // Format the phone number when the length is   10
        if (value.length === 10) {
            value = formatPhoneNumber(value);
        }
        setPhoneNumber(value);
    };

    const formatPhoneNumber = (value: string) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    };

    const submitAdminEdits = async () => {
        setErrorMessage(undefined);

        const newProfileData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            date_of_birth: dob,
        };

        if (newProfileData.phone_number.length !== 14) {
            setErrorMessage('Please check the phone number');
            return;
        }

        if (newProfileData.date_of_birth.length != 10) {
            setErrorMessage('Please check the date of birth');
            return;
        }

        if (emailChanged) {
            const { error } = await changeEmail(email, profile_data.id);
            await identifyUser(profile_data.id, {
                email,
                first_name: firstName,
                last_name: lastName,
                phone_number: formatE164(phoneNumber),
            });

            if (error) {
                setErrorMessage(
                    'There was an issue updating the email. This email may already be in use.'
                );
                return;
            }
        }

        const { error: profileChangeError } = await adminEditAccountInformation(
            newProfileData,
            profile_data.id
        );

        if (profileChangeError) {
            setErrorMessage(
                'There was an issue with changing the profile information. Please check the information and try again.'
            );
            return;
        }

        onConfirm();
        onClose();
    };

    return (
        <Dialog open={dialog_open} onClose={onClose}>
            <DialogTitle>
                <span className='h5'>Edit Patient Information</span>
            </DialogTitle>
            <DialogContent>
                {errorMessage && (
                    <div>
                        <BioType className='itd-body text-red-500'>
                            {errorMessage}
                        </BioType>
                    </div>
                )}
                <form>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='firstName'
                            label='First Name'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='lastName'
                            label='Last Name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='email'
                            label='Email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailChanged(true);
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='phoneNumber'
                            label='Phone Number'
                            value={phoneNumber}
                            onChange={(e) =>
                                handlePhoneNumberChange(e.target.value)
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='dob'
                            label='Date of Birth'
                            value={dob}
                            onChange={handleDOBChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                placeholder: 'MM/DD/YYYY',
                            }}
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        submitAdminEdits();
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const preformatDate = (dob: string) => {
    // Split the DOB string into an array of [year, month, day]
    const [year, month, day] = dob.split('-');

    // Convert the month and day to ensure they are two digits long
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');

    // Return the formatted date
    return `${formattedMonth}/${formattedDay}/${year}`;
};

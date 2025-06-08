'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Snackbar,
    TextField,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import { updateProfileData } from '@/app/utils/database/controller/profiles/profiles';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import DrawerConfirmationSuccess from './components/DrawerConfirmationSuccess';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';
import { changeEmail } from '@/app/utils/actions/auth/change-email';
import { isNull } from 'lodash';
import { formatE164 } from '@/app/utils/functions/customerio/utils';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';

interface Props {
    toggleNameDrawer: () => void;
    userID: string | undefined;
    setPersonalData: Dispatch<
        SetStateAction<AccountNameEmailPhoneData | undefined>
    >;
    personalData: AccountNameEmailPhoneData | undefined;
    setNameEditDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

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
        6,
    )}-${phoneNumber.slice(6, 10)}`;
};

interface FormErrors {
    email?: string;
    phone_number?: string;
}

export default function AccountEditDrawer({
    toggleNameDrawer,
    userID,
    setPersonalData,
    personalData,
    setNameEditDrawerOpen,
}: Props) {
    const [firstNameFormData, setFirstNameFormData] = useState<string>('');
    const [lastNameFormData, setLastNameFormData] = useState<string>('');
    const [emailFormData, setEmailFormData] = useState<string>('');
    const [phoneNumberFormData, setPhoneNumberFormData] = useState<string>('');
    const [birthdayFormData, setBirthdayFormData] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [screen, setScreen] = useState<number>(0);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    useEffect(() => {
        setFirstNameFormData(personalData?.first_name || '');
        setLastNameFormData(personalData?.last_name || '');
        setPhoneNumberFormData(personalData?.phone_number || '');
        setEmailFormData(personalData?.email || '');
        setBirthdayFormData(personalData?.date_of_birth || '');
    }, [personalData]);

    const handleInformationInputChange =
        (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;

            // Update the state based on the field name
            switch (fieldName) {
                case 'first_name':
                    setFirstNameFormData(value);
                    break;
                case 'last_name':
                    setLastNameFormData(value);
                    break;
                case 'email':
                    setEmailFormData(value);
                    break;
                case 'phone_number': // This case was added for phone number
                    const formattedPhoneNumber = formatPhoneNumber(value);
                    setPhoneNumberFormData(formattedPhoneNumber);
                    break;
                default:
                    break;
            }
        };

    const handleSave = async () => {
        // Dynamically create the schema based on the input
        setButtonLoading(true);
        const dynamicSchema = {
            email: Yup.string().email('Invalid email format'),
            phone_number: phoneNumberFormData
                ? Yup.string().matches(
                      /^(\(?\d{3}\)?[-. ]?)?\d{3}[-. ]?\d{4}$/,
                      'Invalid phone number.',
                  )
                : Yup.string(),
        };

        const validationSchema = Yup.object().shape(dynamicSchema);

        try {
            // Clear previous errors
            setErrors({});
            // Validate the form data
            await validationSchema.validate(
                {
                    // email: emailFormData,
                    phone_number: phoneNumberFormData,
                },
                {
                    abortEarly: false, // Get all errors at once
                },
            );

            // If validation is successful, handle the successful save here
            // Proceed with your save operation

            //Construct the Object:
            const newAccountData: AccountNameEmailPhoneData = {
                ...(firstNameFormData !== personalData?.first_name && {
                    first_name: firstNameFormData,
                }),
                ...(lastNameFormData !== personalData?.last_name && {
                    last_name: lastNameFormData,
                }),
                ...(phoneNumberFormData !== personalData?.phone_number && {
                    phone_number: phoneNumberFormData,
                }),
                ...(emailFormData !== personalData?.email && {
                    email: emailFormData,
                }),
                // date_of_birth: birthdayFormData,
            };

            await logPatientAction(
                userID!,
                PatientActionTask.PERSONAL_INFORMATION_UPDATED,
                {
                    ...(newAccountData.first_name && {
                        oldFirstName: personalData?.first_name,
                        newFirstName: firstNameFormData,
                    }),
                    ...(newAccountData.last_name && {
                        oldLastName: personalData?.last_name,
                        newLastName: lastNameFormData,
                    }),
                    ...(newAccountData.phone_number && {
                        oldPhoneNumber: personalData?.phone_number,
                        newPhoneNumber: phoneNumberFormData,
                    }),
                    ...(newAccountData.email && {
                        oldFirstName: personalData?.email,
                        newFirstName: emailFormData,
                    }),
                },
            );

            const updateStatus = await updateProfileData(
                newAccountData,
                userID!,
            );

            if (updateStatus === 'success') {
                // setSuccessAlertOpen(true);

                if (userID) {
                    if (personalData?.email !== emailFormData) {
                        const { error } = await changeEmail(
                            emailFormData,
                            userID,
                        );
                        if (isNull(error)) {
                            setPersonalData((prevData: any) => ({
                                ...prevData,
                                email: emailFormData,
                            }));
                            await identifyUser(userID, {
                                email: emailFormData,
                            });
                            window.rudderanalytics.identify(userID, {
                                email: emailFormData,
                            });
                        }
                    }
                    await identifyUser(userID, {
                        phone_number: formatE164(phoneNumberFormData),
                        ...(emailFormData !== personalData?.email && {
                            email: emailFormData,
                        }),
                    });
                    window.rudderanalytics.identify(userID, {
                        phone_number: formatE164(phoneNumberFormData),
                        ...(emailFormData !== personalData?.email && {
                            email: emailFormData,
                        }),
                    });
                }
                setPersonalData((prevData: any) => ({
                    ...prevData, // Spread the existing data to retain all previous fields
                    ...newAccountData, // Spread the new data to update fields (email field is not in newAccountData, so it's preserved)
                }));

                setScreen(1);
            }
            if (updateStatus === 'error') {
                setErrorAlertOpen(true);
            }
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: FormErrors = err.inner.reduce(
                    (acc: FormErrors, currentError: Yup.ValidationError) => {
                        if (currentError.path) {
                            acc[currentError.path as keyof FormErrors] =
                                currentError.message;
                        }
                        return acc;
                    },
                    {},
                );
                setErrors(newErrors);
            }
        } finally {
            setButtonLoading(false);
        }
    };

    const handleClose = () => {
        toggleNameDrawer();
    };

    const handleCloseSuccessAlert = () => {
        setSuccessAlertOpen(false);
    };

    const handleCloseErrorAlert = () => {
        setErrorAlertOpen(false);
    };

    const action_button_container_class =
        'flex flex-col mt-2 justify-center w-full md:self-end';

    return (
        <div className="w-full">
            <div
                className="flex justify-end items-center h-[50px] px-6"
                onClick={handleClose}
            >
                <BioType className="body1 text-[14px] cursor-pointer">
                    CLOSE
                </BioType>
                <CloseIcon
                    sx={{
                        fontSize: 24,
                        color: '#1B1B1B8F',
                        cursor: 'pointer',
                    }}
                />
            </div>
            <div className="w-full h-[1px] bg-[#1B1B1B1F]"></div>
            <div className="flex flex-col items-center w-full">
                <div className="w-[90%]">
                    {screen === 0 ? (
                        <>
                            <div className="flex flex-col space-y-4 mb-4 mt-6">
                                <BioType className="h6 text-[24px] text-black">
                                    Change Account Details
                                </BioType>
                                <BioType className="body1 text-[16px] text-[#D32F2F]">
                                    Please contact customer support to change
                                    your name and date of birth.
                                </BioType>
                            </div>
                            <div className="flex flex-col gap-2 space-y-4">
                                <FormControl className="">
                                    <TextField
                                        id="first_name"
                                        label="First Name"
                                        disabled
                                        value={firstNameFormData}
                                        onChange={handleInformationInputChange(
                                            'first_name',
                                        )}
                                    />
                                </FormControl>

                                <FormControl className="">
                                    <TextField
                                        id="last_name"
                                        label="Last Name"
                                        disabled
                                        value={lastNameFormData}
                                        onChange={handleInformationInputChange(
                                            'last_name',
                                        )}
                                    />
                                </FormControl>
                                <FormControl className="">
                                    <TextField
                                        id="email"
                                        label="Email"
                                        value={emailFormData}
                                        onChange={(e) =>
                                            setEmailFormData(e.target.value)
                                        }
                                    />
                                </FormControl>

                                <FormControl
                                    className=""
                                    error={!!errors.phone_number}
                                >
                                    <TextField
                                        id="phone_number"
                                        label="Phone Number"
                                        value={phoneNumberFormData}
                                        onChange={(e) =>
                                            setPhoneNumberFormData(
                                                formatPhoneNumber(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                    />
                                    <FormHelperText>
                                        {errors.phone_number}
                                    </FormHelperText>
                                </FormControl>

                                <FormControl className="">
                                    <TextField
                                        id="birthday"
                                        label="Date of Birth"
                                        value={birthdayFormData}
                                        disabled
                                    />
                                </FormControl>
                            </div>
                            <div
                                id="action-button-container"
                                className="mt-9 flex flex-col space-y-4"
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ height: 52 }}
                                    onClick={handleSave} // Save button now triggers validation
                                >
                                    {buttonLoading ? (
                                        <CircularProgress
                                            size={22}
                                            sx={{ color: 'white' }}
                                        />
                                    ) : (
                                        <BioType className="body1 text-[16px] text-white">
                                            SAVE
                                        </BioType>
                                    )}
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ height: 52 }}
                                    onClick={() => toggleNameDrawer()} // Save button now triggers validation
                                >
                                    <BioType className="body1 text-[16px] text-[#286BA2]">
                                        CANCEL
                                    </BioType>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <DrawerConfirmationSuccess
                            buttonText="Continue to Profile"
                            message="Thank you! Your account information has been successfully updated."
                            setOpenDrawer={setNameEditDrawerOpen}
                        />
                    )}
                </div>

                <Snackbar
                    open={successAlertOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccessAlert}
                >
                    <Alert
                        onClose={handleCloseSuccessAlert}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        Your account information has been updated.
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={errorAlertOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseErrorAlert}
                >
                    <Alert
                        onClose={handleCloseErrorAlert}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        There was an issue with updating your account. Please
                        try again later.
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}

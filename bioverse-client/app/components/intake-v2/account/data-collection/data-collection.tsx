'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Select,
    MenuItem,
    SelectChangeEvent,
    CircularProgress,
} from '@mui/material';
import * as Yup from 'yup';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { usePathname, useSearchParams } from 'next/navigation';
import ContinueButton from '../../buttons/ContinueButton';
import { updateUserProfileData } from '@/app/utils/database/controller/profiles/profiles';
import {
    identifyUser,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import { formatE164 } from '@/app/utils/functions/customerio/utils';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { getCookie } from 'cookies-next';
import { formatPhoneNumberToNumericString } from '@/app/utils/functions/client-utils';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';

const dataCollectionInputSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    sex_at_birth: Yup.string().required('Sex Assigned at Birth is required'),
    phone_number: Yup.string()
        .required('Required')
        .matches(
            /^\(\d{3}\) \d{3}-\d{4}$/,
            'Invalid phone number format (e.g. (123)   456-7890)'
        )
        .test(
            'first-digit-not-1-or-0',
            'Area code cannot start with a  1 or  0',
            (value) => {
                if (!value) return true; // Allow empty values to pass
                const digits = value.replace(/[^\d]/g, ''); // Remove non-digits
                const firstDigit = digits[0];
                return firstDigit !== '1' && firstDigit !== '0';
            }
        )
        .test(
            'no-555-in-middle',
            'There was a problem verifying the phone number.',
            (value) => {
                if (!value) return true; // Allow empty values to pass
                const digits = value.replace(/[^\d]/g, ''); // Remove non-digits
                const middleDigits = digits.slice(3, 6);
                return !(
                    middleDigits[0] === '5' &&
                    middleDigits[1] === '5' &&
                    middleDigits[2] === '5'
                );
            }
        )
        .test(
            'no-repeated-digits',
            'Phone number cannot contain all digits repeated',
            (value) => {
                if (!value) return true; // Allow empty values to pass
                const digits = value.replace(/[^\d]/g, ''); // Remove non-digits
                const uniqueDigits = new Set(digits);
                return uniqueDigits.size !== 1; // Check if all digits are not unique (i.e., repeated)
            }
        ),
});

interface Props {
    userProfileData: ProfileDataIntakeFlow;
    session_id: string;
    setUserProfileData: Dispatch<SetStateAction<ProfileDataIntakeFlow>>;
    pushToNext: () => void;
    hasName: boolean;
}

export default function DataCollectionInputV2({
    userProfileData,
    session_id,
    setUserProfileData,
    pushToNext,
    hasName,
}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlParams = new URLSearchParams(searchParams);

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    // State to manage the form data
    const [profileDataForm, setProfileDataForm] =
        useState<ProfileDataIntakeFlow>({
            first_name: userProfileData?.first_name ?? '',
            last_name: userProfileData?.last_name ?? '',
            sex_at_birth: userProfileData?.sex_at_birth ?? '',
            phone_number: userProfileData?.phone_number ?? '',
            stripe_customer_id: '',
            intake_completed: userProfileData?.intake_completed,
            text_opt_in: userProfileData?.text_opt_in,
            email: userProfileData?.email || '',
        });
    useEffect(() => {
        setProfileDataForm({
            first_name: userProfileData?.first_name ?? '',
            last_name: userProfileData?.last_name ?? '',
            sex_at_birth: userProfileData?.sex_at_birth ?? '',
            phone_number: userProfileData?.phone_number ?? '',
            stripe_customer_id: '',
            intake_completed: userProfileData?.intake_completed,
            text_opt_in: userProfileData?.text_opt_in,
            email: userProfileData?.email || '',
        });
    }, [userProfileData]);

    /**
     * What this state does
     * This state records whether continue was attempted and failed. If this is true, then validation error messages turn on and will not turn off.
     */
    const [continueAttempted, setContinueAttempted] = useState<boolean>(false);

    const [initialProfileDataForm, setInitialProfileDataForm] =
        useState<ProfileDataIntakeFlow | null>(null);

    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    const [isFormValid, setIsFormValid] = useState(false);
    const [sexAtBirth, setSexAtBirth] = useState(profileDataForm.sex_at_birth);

    const [textOptIn, setTextOptIn] = useState(profileDataForm.text_opt_in);
    const [leadEventId, setLeadEventId] = useLocalStorage('lead_event_id', '');

    useEffect(() => {
        setInitialProfileDataForm(profileDataForm);
    }, []);

    useEffect(() => {
        validateForm();
    }, [profileDataForm]);

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

    const handleDropdownChange =
        (fieldName: string) => (event: SelectChangeEvent<string>) => {
            const value = event.target.value;
            if (fieldName === 'sex_at_birth') {
                setSexAtBirth(value); // Update the sexAtBirth state
            }
            // Create a synthetic event object to pass to handleInputChange
            const syntheticEvent = {
                target: {
                    value: value,
                    name: fieldName,
                },
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(fieldName)(syntheticEvent); // Update the form data and validate
        };

    // const handleSexChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedSex = event.target.value;
    //     setSexAtBirth(selectedSex);
    //     // Update your form state or perform other actions as needed

    //     // Create a synthetic event object with the value
    //     const syntheticEvent: React.ChangeEvent<HTMLInputElement> = {
    //         target: {
    //             value: selectedSex,
    //             name: 'sex_at_birth',
    //         } as HTMLInputElement,
    //     } as React.ChangeEvent<HTMLInputElement>;

    //     handleInputChange('sex_at_birth')(syntheticEvent);
    // };

    const validateForm = () => {
        dataCollectionInputSchema
            .validate(profileDataForm, { abortEarly: false })
            .then(() => {
                setIsFormValid(true);
                setValidationErrors({}); // Clear any previous errors
            })
            .catch((error: { inner: any[] }) => {
                if (error instanceof Yup.ValidationError) {
                    const errors = error.inner.reduce((acc, curr) => {
                        if (curr.path) {
                            acc[curr.path] = curr.message;
                        }
                        return acc;
                    }, {} as Record<string, string>);
                    setIsFormValid(false);
                    setValidationErrors(errors);
                }
            });
    };

    const getIsFormValid = () => {
        dataCollectionInputSchema
            .validate(profileDataForm, { abortEarly: false })
            .then(() => {
                setIsFormValid(true);
                setValidationErrors({}); // Clear any previous errors
            })
            .catch((error: { inner: any[] }) => {
                console.log('fail error catch');
                if (error instanceof Yup.ValidationError) {
                    const errors = error.inner.reduce((acc, curr) => {
                        if (curr.path) {
                            acc[curr.path] = curr.message;
                        }
                        return acc;
                    }, {} as Record<string, string>);
                    setIsFormValid(false);
                    setValidationErrors(errors);
                    return false;
                }
            });
    };

    // const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const newState = event.target.value;
    //     setSelectedState(newState);
    //     // Create a synthetic event object
    //     const syntheticEvent: React.ChangeEvent<HTMLInputElement> = {
    //         target: {
    //             value: newState,
    //             name: 'state', // Ensure this matches the expected field name
    //         } as HTMLInputElement,
    //     } as React.ChangeEvent<HTMLInputElement>;

    //     handleInputChange('state')(syntheticEvent);
    // };

    const handleInputChange =
        (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            // Directly extract the string value from the event
            let value = event.target.value;

            // Apply specific formatting based on the field name
            if (fieldName === 'phone_number') {
                // Limit the input to  10 digits
                value = value.replace(/[^\d]/g, '').slice(0, 10);
                // Format the phone number when the length is   10
                if (value.length === 10) {
                    value = formatPhoneNumber(value);
                }
            } else if (fieldName === 'zip') {
                // Remove non-digits and limit to   5 characters for zip code
                value = value.replace(/[^\d]/g, '').slice(0, 5);
            }
            // Update the state with the new value for the specific field
            setProfileDataForm((prev) => ({ ...prev, [fieldName]: value }));
        };

    const handleUserDataFormUpdate = async () => {
        setIsButtonLoading(true);
        setContinueAttempted(true);
        getIsFormValid();
        if (isFormValid) {
            if (
                JSON.stringify(profileDataForm) !==
                JSON.stringify(initialProfileDataForm)
            ) {
                await updateUserProfileData(profileDataForm, session_id || '');
                setUserProfileData(profileDataForm);
            }

            await identifyUser(session_id, {
                text_opt_in: profileDataForm.text_opt_in,
                ...(profileDataForm.first_name && {
                    first_name: profileDataForm.first_name,
                }),
                ...(profileDataForm.last_name && {
                    last_name: profileDataForm.last_name,
                }),
                ...(profileDataForm.phone_number && {
                    phone_number: formatE164(profileDataForm.phone_number),
                }),
                ...(profileDataForm.sex_at_birth?.toLowerCase() && {
                    sex: profileDataForm.sex_at_birth?.toLowerCase(),
                }),
            });
            window.rudderanalytics.identify(session_id, {
                text_opt_in: profileDataForm.text_opt_in,
                ...(profileDataForm.first_name && {
                    first_name: profileDataForm.first_name,
                }),
                ...(profileDataForm.last_name && {
                    last_name: profileDataForm.last_name,
                }),
                ...(profileDataForm.phone_number && {
                    phone_number: formatE164(profileDataForm.phone_number),
                }),
                ...(profileDataForm.sex_at_birth?.toLowerCase() && {
                    sex: profileDataForm.sex_at_birth?.toLowerCase(),
                }),
            });

            // If coming from an unbounce landing page, trigger the lead event

            try {
                const splitted_paths = pathname.split('/');
                const product_href = splitted_paths[3];

                const fbp = getCookie('_fbp');
                const fbc = getCookie('_fbc');

                await trackRudderstackEvent(
                    session_id,
                    RudderstackEvent.PROFILE_INTAKE_COMPLETED,
                    {
                        currency: 'USD',
                        context: {
                            fbc,
                            fbp,
                            traits: {
                                email: profileDataForm.email,
                                firstName: profileDataForm.first_name,
                                lastName: profileDataForm.last_name,
                                phone: formatPhoneNumberToNumericString(
                                    profileDataForm.phone_number
                                ),
                            },
                            event_time: Math.floor(Date.now() / 1000),
                            event_id: leadEventId,
                        },
                        event_time: Math.floor(Date.now() / 1000),
                        custom_data: {
                            currency: 'USD',
                        },
                    }
                );
                await triggerEvent(session_id, `${product_href}-lead`, {
                    variant: urlParams.get('pvn'),
                });
                await trackRudderstackEvent(session_id, RudderstackEvent.LEAD, {
                    variant: urlParams.get('pvn'),
                    product_href,
                });
            } catch (error) {
                console.error(error);
            }

            pushToNext();
        } else {
            setIsButtonLoading(false);
        }
    };

    // const updateFormValidation = () => {
    //     dataCollectionInputSchema
    //         .validate(profileDataForm, { abortEarly: false })
    //         .then(() => {
    //             console.log('Form is valid');
    //             setIsFormValid(true);
    //         })
    //         .catch((err: { inner: any }) => {
    //             console.log('Validation errors', err.inner);
    //             setIsFormValid(false);
    //         });
    // };

    const handleCheckboxChange = (event: any) => {
        setTextOptIn(event.target.checked);
        setProfileDataForm((prev) => ({
            ...prev,
            ['text_opt_in']: event.target.checked,
        }));
    };

    // const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event.target;
    //     if (value) {
    //         // Convert the date from YYYY-MM-DD to yyyy-MM-dd format
    //         const date = new Date(value);
    //         const formattedDate = `${date.getFullYear()}-${String(
    //             date.getMonth() + 1
    //         ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    //         setProfileDataForm({
    //             ...profileDataForm,
    //             date_of_birth: formattedDate,
    //         });
    //     } else {
    //         // If the input is empty, clear the date_of_birth field
    //         setProfileDataForm({
    //             ...profileDataForm,
    //             date_of_birth: '',
    //         });
    //     }
    // };

    useEffect(() => {
        dataCollectionInputSchema
            .isValid(profileDataForm)
            .then((valid: boolean | ((prevState: boolean) => boolean)) =>
                setIsFormValid(valid)
            );
    }, [profileDataForm]);

    return (
        <>
            <div>
                <div
                    className={`flex flex-col gap-6 md:gap-6 justify-start animate-slideRight`}
                >
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Good news! We can provide you with care.
                    </BioType>
                    <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                        Next, we’ll need some personal information to get you
                        started and match you with a BIOVERSE provider.
                    </BioType>
                    {continueAttempted && (
                        <div className='hidden md:flex'>
                            {Object.entries(validationErrors).map(
                                ([key, errorMessage], index) => (
                                    <p
                                        key={index}
                                        className='error-message body1 text-red-500'
                                    >
                                        {errorMessage}
                                    </p>
                                )
                            )}
                        </div>
                    )}
                    {/* Row 1 */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <FormControl className='flex-1'>
                            <InputLabel htmlFor='firstName' required>
                                First Name
                            </InputLabel>
                            <OutlinedInput
                                id='firstName'
                                label='First Name'
                                value={profileDataForm.first_name}
                                onChange={handleInputChange('first_name')}
                                required
                                disabled={hasName}
                            />
                        </FormControl>

                        <FormControl className='flex-1'>
                            <InputLabel htmlFor='lastName' required>
                                Last Name
                            </InputLabel>
                            <OutlinedInput
                                id='lastName'
                                label='Last Name'
                                value={profileDataForm.last_name}
                                onChange={handleInputChange('last_name')}
                                required
                                disabled={hasName}
                            />
                        </FormControl>
                    </div>

                    {/* Row 2 */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <FormControl className='flex-1' variant='outlined'>
                            <InputLabel htmlFor='sexAtBirth'>
                                Sex Assigned at Birth
                            </InputLabel>
                            <Select
                                labelId='sexAtBirth-label'
                                id='sexAtBirth'
                                value={sexAtBirth}
                                onChange={handleDropdownChange('sex_at_birth')}
                                label='Sex Assigned at Birth'
                            >
                                <MenuItem value='Male'>Male</MenuItem>
                                <MenuItem value='Female'>Female</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className='flex-1'>
                            <InputLabel htmlFor='phoneNumber' required>
                                Phone Number
                            </InputLabel>
                            <OutlinedInput
                                id='phoneNumber'
                                label='Phone Number'
                                value={profileDataForm.phone_number}
                                onChange={handleInputChange('phone_number')}
                                required
                            />
                        </FormControl>
                    </div>

                    {/* Row 5 */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        {continueAttempted && (
                            <div className='flex md:hidden'>
                                {Object.entries(validationErrors).map(
                                    ([key, errorMessage], index) => (
                                        <p
                                            key={index}
                                            className='error-message body1 text-red-500'
                                        >
                                            {errorMessage}
                                        </p>
                                    )
                                )}
                            </div>
                        )}

                        <div className='flex flex-1'></div>
                    </div>

                    <div className='hidden md:flex flex-col gap-2'>
                        <label
                            htmlFor='optInCheckbox'
                            className='body2'
                            style={{ marginBottom: 0 }}
                        >
                            <p>
                                <input
                                    type='checkbox'
                                    id='optInCheckbox'
                                    checked={textOptIn}
                                    onChange={handleCheckboxChange}
                                    name='optIn'
                                    style={{
                                        marginRight: '10px', // Adds space between the checkbox and the text
                                    }}
                                />{' '}
                                Opt-in for SMS notifications for offers and
                                updates from BIOVERSE.
                            </p>
                            <br />
                            <p
                                style={{
                                    marginLeft: '30px',
                                }}
                            >
                                By selecting this box, you agree to receive
                                texts from BIOVERSE to the number you provided
                                that might be considered marking. Agreeing is
                                not required to purchase. Message and data rates
                                may apply. Message frequencies varies. Reply
                                HELP for help. Reply STOP to opt-out. Read
                                Bioverse&apos;s SMS policy{' '}
                                <a
                                    href='https://www.gobioverse.com/sms-terms-of-service'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary'
                                >
                                    here.
                                </a>
                            </p>
                        </label>
                        <div className='flex justify-center mt-4'>
                            <Button
                                variant='contained'
                                sx={{
                                    width: '100%',
                                    height: '42px',
                                    '@media (min-width:768px)': {
                                        width: '118px',
                                    },
                                }}
                                onClick={handleUserDataFormUpdate}
                            >
                                {isButtonLoading ? (
                                    <CircularProgress
                                        sx={{ color: 'white' }}
                                        size={22}
                                    />
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className='flex md:hidden flex-col gap-2'>
                        <label
                            htmlFor='optInCheckbox'
                            className='body2'
                            style={{ marginBottom: 0 }}
                        >
                            <p>
                                <input
                                    type='checkbox'
                                    id='optInCheckbox'
                                    name='optIn'
                                    onChange={handleCheckboxChange}
                                    checked={textOptIn}
                                    style={{
                                        marginRight: '10px', // Adds space between the checkbox and the text
                                    }}
                                />{' '}
                                Opt-in for SMS notifications for offers and
                                updates from BIOVERSE.
                            </p>
                            <br />
                            <p
                                style={{
                                    marginLeft: '30px',
                                }}
                            >
                                By selecting this box, you agree to receive
                                texts from BIOVERSE to the number you provided
                                that might be considered marking. Agreeing is
                                not required to purchase. Message and data rates
                                may apply. Message frequencies varies. Reply
                                HELP for help. Reply STOP to opt-out. Read
                                Bioverse&apos;s SMS policy{' '}
                                <a
                                    href='https://www.gobioverse.com/sms-terms-of-service'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary'
                                >
                                    here.
                                </a>
                            </p>
                        </label>
                        <div className='flex justify-center mt-[161px] md:mt-8'>
                            <ContinueButton
                                onClick={handleUserDataFormUpdate}
                                buttonLoading={isButtonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

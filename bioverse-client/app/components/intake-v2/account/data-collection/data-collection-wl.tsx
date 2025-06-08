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
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import {
    identifyUser,
    triggerLeadCommsEvent,
} from '@/app/services/customerio/customerioApiFactory';
import { formatE164 } from '@/app/utils/functions/customerio/utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { getCookie } from 'cookies-next';
import { formatPhoneNumberToNumericString } from '@/app/utils/functions/client-utils';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';

const dataCollectionInputSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
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
}

export default function DataCollectionInputWLV3({
    userProfileData,
    session_id,
    setUserProfileData,
    pushToNext,
}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlParams = new URLSearchParams(searchParams);

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const [leadEventId, setLeadEventId] = useLocalStorage('lead_event_id', '');

    // State to manage the form data
    const [profileDataForm, setProfileDataForm] =
        useState<ProfileDataIntakeFlow>({
            first_name: userProfileData?.first_name ?? '',
            last_name: userProfileData?.last_name ?? '',
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
    const [textOptIn, setTextOptIn] = useState(profileDataForm.text_opt_in);

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
            const syntheticEvent = {
                target: {
                    value: value,
                    name: fieldName,
                },
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(fieldName)(syntheticEvent); // Update the form data and validate
        };

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
        console.log('FUNCTION RAN');
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
                text_opt_in: textOptIn,
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
                text_opt_in: textOptIn,
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
                const properties = JSON.stringify({
                    variant: urlParams.get('pvn'),
                    is_bundle: true,
                    product_href,
                });

                await triggerLeadCommsEvent(
                    session_id,
                    product_href,
                    properties
                );
            } catch (error) {
                console.error(error);
            }
            pushToNext();
        } else {
            setIsButtonLoading(false);
        }
    };

    const handleCheckboxChange = (event: any) => {
        setTextOptIn(event.target.checked);
        setProfileDataForm((prev) => ({
            ...prev,
            ['text_opt_in']: event.target.checked,
        }));
    };

    useEffect(() => {
        dataCollectionInputSchema
            .isValid(profileDataForm)
            .then((valid: boolean | ((prevState: boolean) => boolean)) =>
                setIsFormValid(valid)
            );
    }, [profileDataForm]);

    const fullPath = usePathname();

    const renderTitle = () => {
        if (fullPath.includes('ed-global')) {
            return 'If the treatement is prescribed, who will receive the medication?';
        }

        return 'Good news! We can provide you with care.';
    };

    const renderSubtitle = () => {
        if (fullPath.includes('ed-global')) {
            return null;
        }
        return (
            <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                Next, create an account to get started and we&apos;ll match you
                with a BIOVERSE provider.
            </BioType>
        );
    };

    return (
        <>
            <div>
                <div
                    className={`flex flex-col gap-6 md:gap-6 justify-start animate-slideRight`}
                >
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        {renderTitle()}
                    </BioType>
                    {renderSubtitle()}
                    {continueAttempted && (
                        <div className='hidden md:flex flex-col'>
                            {Object.entries(validationErrors).map(
                                ([key, errorMessage], index) => (
                                    <BioType
                                        key={index}
                                        className='error-message body1 text-red-500'
                                    >
                                        {errorMessage}
                                    </BioType>
                                )
                            )}
                        </div>
                    )}
                    {/* Row 1 - 3 */}
                    <div className='flex flex-col md:flex-col gap-4'>
                        <FormControl className='flex-1'>
                            <InputLabel htmlFor='firstName'>
                                <BioType className='text-[1rem]'>
                                    First Name *
                                </BioType>
                            </InputLabel>
                            <OutlinedInput
                                id='firstName'
                                label='First Name *'
                                value={profileDataForm.first_name}
                                onChange={handleInputChange('first_name')}
                                required
                                sx={{
                                    height: { xs: '16.1vw', sm: '84px' },
                                    '& .MuiInputBase-input': {
                                        // Target the input element inside the OutlinedInput
                                        fontSize: '1rem', // Set the font size to your desired value
                                    },
                                }}
                            />
                        </FormControl>

                        <FormControl className='flex-1'>
                            <InputLabel htmlFor='lastName'>
                                <BioType className='text-[1rem]'>
                                    Last Name *
                                </BioType>
                            </InputLabel>
                            <OutlinedInput
                                id='lastName'
                                label='Last Name *'
                                value={profileDataForm.last_name}
                                onChange={handleInputChange('last_name')}
                                required
                                sx={{
                                    height: { xs: '16.1vw', sm: '84px' },
                                    '& .MuiInputBase-input': {
                                        // Target the input element inside the OutlinedInput
                                        fontSize: '1rem', // Set the font size to your desired value
                                    },
                                }}
                            />
                        </FormControl>

                        <FormControl className='flex-1'>
                            <InputLabel htmlFor='phoneNumber'>
                                <BioType className='text-[1rem]'>
                                    Phone Number *
                                </BioType>
                            </InputLabel>
                            <OutlinedInput
                                id='phoneNumber'
                                label='Phone Number *'
                                value={profileDataForm.phone_number}
                                onChange={handleInputChange('phone_number')}
                                required
                                sx={{
                                    height: { xs: '16.1vw', sm: '84px' },
                                    '& .MuiInputBase-input': {
                                        // Target the input element inside the OutlinedInput
                                        fontSize: '1rem', // Set the font size to your desired value
                                    },
                                }}
                            />
                        </FormControl>
                    </div>

                    {/* Row 4 */}

                    {continueAttempted && (
                        <div className='flex flex-row md:flex-row gap-4'>
                            <div className='flex md:hidden flex-col'>
                                {Object.entries(validationErrors).map(
                                    ([key, errorMessage], index) => (
                                        <BioType
                                            key={index}
                                            className='error-message body1 text-red-500'
                                        >
                                            {errorMessage}
                                        </BioType>
                                    )
                                )}
                            </div>{' '}
                        </div>
                    )}

                    <div
                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} hidden md:flex flex-col gap-2`}
                    >
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
                        <div className='mt-2'>
                            <ContinueButton
                                onClick={handleUserDataFormUpdate}
                                buttonLoading={isButtonLoading}
                            />
                        </div>
                    </div>

                    <div
                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} flex md:hidden flex-col gap-2 mt-4`}
                    >
                        <label
                            htmlFor='optInCheckbox'
                            className='body2'
                            style={{ marginBottom: 0 }}
                        >
                            <div className='flex flex-row gap-1'>
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
                                <p>
                                    Opt-in for SMS notifications for offers and
                                    updates from BIOVERSE.
                                </p>
                            </div>
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
                    </div>
                </div>
                <div className='md:hidden'>
                    <ContinueButton
                        onClick={handleUserDataFormUpdate}
                        buttonLoading={isButtonLoading}
                    />
                </div>
            </div>
        </>
    );
}

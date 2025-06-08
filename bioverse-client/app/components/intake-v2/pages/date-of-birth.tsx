'use client';

import {
    FormControl,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { updateUserDateOfBirth } from '@/app/utils/database/controller/profiles/profiles';
import ContinueButton from '../buttons/ContinueButton';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import { continueButtonExitAnimation } from '../intake-animations';
import { LoadingButtonCustom } from '../buttons/LoadingButtonCustom';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';

interface StateSelectionProps {
    date_of_birth: string | null;
    user_id: string;
}
export default function DateOfBirthSelectionClientComponent({
    date_of_birth,
    user_id,
}: StateSelectionProps) {
    const [userDateOfBirth, setUserDateOfBirth] = useState<string>(
        convertDatabaseDoBToComponentFormat(date_of_birth),
    );

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    //I have to set this here instead of using the loading button component
    //due to the fact that there is a verification check.
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                2,
            )}`;
        } else if (numericValue.length > 4) {
            // Add slashes for both month and day if there are more than 4 digits
            formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(
                2,
                4,
            )}/${numericValue.slice(4)}`;
        }

        // Limit the formattedValue to a maximum length of 10 characters
        formattedValue = formattedValue.slice(0, 10);

        // Update the state with the formatted value
        setUserDateOfBirth(formattedValue);
    };

    const pushToNextRouteWithAgeCheck = async () => {
        setIsButtonLoading(true);
        if (checkDateOfBirthValid(userDateOfBirth)) {
            const res = await updateUserDateOfBirth(user_id, userDateOfBirth);

            if (checkOverEightteen(userDateOfBirth)) {
                const nextRoute = getNextIntakeRoute(
                    fullPath,
                    product_href,
                    search,
                );
                const searchParams = new URLSearchParams(search);

                // Remove the 'nu' parameter
                searchParams.delete('nu');

                // Construct the new search string without the 'nu' parameter
                const newSearch = searchParams.toString();
                await continueButtonExitAnimation(150);
                await identifyUser(user_id, {
                    date_of_birth: new Date(userDateOfBirth).toISOString(),
                });
                router.push(
                    `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
                );
            } else {
                await continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/unavailable-age`,
                );
            }
        } else {
            setErrorMessage('Please check the date you have entered.');
            setIsButtonLoading(false);
        }
    };

    //Resets the error message when the user selects a state
    useEffect(() => {
        setErrorMessage('');
    }, [userDateOfBirth]);

    return (
        <>
            <div className={`flex flex-col gap-4 animate-slideRight`}>
                <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                    To verify your eligibility, please tell us your date of
                    birth.
                </BioType>
                <FormControl className="flex-1" variant="outlined">
                    <TextField
                        value={userDateOfBirth}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            placeholder: 'MM/DD/YYYY',
                        }}
                    />
                    <BioType className="!text-red-400 body1">
                        {errorMessage}
                    </BioType>
                    <div className="flex justify-center md:mt-8">
                        <LoadingButtonCustom
                            onClick={pushToNextRouteWithAgeCheck}
                            loading={isButtonLoading}
                        />
                    </div>
                </FormControl>
            </div>
        </>
    );
}

const convertDatabaseDoBToComponentFormat = (date_of_birth: string | null) => {
    if (!date_of_birth) {
        return '';
    }

    const dob_array = date_of_birth.split('-');
    const month = dob_array[1];
    const day = dob_array[2];
    const year = dob_array[0];

    return `${month}/${day}/${year}`;
};

/**
 *
 * @param date_of_birth
 * @returns true if dob is over 18, false if not.
 */
const checkOverEightteen = (date_of_birth: string): boolean => {
    const parts = date_of_birth.split('/');
    if (parts.length !== 3) {
        return false; // Incorrect format or unable to process
    }

    const [month, day, year] = parts.map(Number); // Convert string parts to numbers

    const dob = new Date(year, month - 1, day); // Months are 0-indexed in JavaScript Date
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        return age > 18;
    }

    return age >= 18;
};

/**
 *
 * @param date_of_birth
 * @returns true if date is valid string, false if not.
 */
const checkDateOfBirthValid = (date_of_birth: string): boolean => {
    const parts = date_of_birth.split('/');
    if (parts.length !== 3) {
        return false; // Incorrect format
    }

    const [month, day, year] = parts.map(Number); // Convert string parts to numbers

    // Validate year range
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        return false;
    }

    // Validate month range
    if (month < 1 || month > 12) {
        return false;
    }

    // Validate day range
    if (day < 1 || day > 31) {
        return false;
    }

    // Additional check for leap years and correct number of days in each month
    if (month === 2) {
        // February
        const isLeapYear =
            (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        if (isLeapYear && day > 29) {
            return false;
        } else if (!isLeapYear && day > 28) {
            return false;
        }
    } else if (
        (month === 4 || month === 6 || month === 9 || month === 11) &&
        day > 30
    ) {
        // April, June, September, November have 30 days
        return false;
    }

    return true;
};

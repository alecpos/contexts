'use client';

import { statesWithCodes } from '@/public/static-ts/states';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { updateUserState } from '@/app/utils/database/controller/profiles/profiles';
import ContinueButton from '../buttons/ContinueButton';
import {
    ALLOWED_STATES,
    CALIFORNIA_ALLOWED_PRODUCTS,
} from '../constants/constants';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { continueButtonExitAnimation } from '../intake-animations';
import React from 'react';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';
import { stateSelectionUserEligbility } from '@/app/utils/functions/state-auth/utils';

interface StateSelectionProps {
    state_of_residence: string | null;
    user_id: string;
}
export default function StateSelectionClientComponent({
    state_of_residence,
    user_id,
}: StateSelectionProps) {
    const [userResidenceState, setUserResidenceState] = useState<string>(
        state_of_residence ?? '',
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
    const handleResidenceStateChange = (event: SelectChangeEvent<string>) => {
        setUserResidenceState(event.target.value);
    };

    const pushToNextRouteWithStateCheck = async () => {
        setIsButtonLoading(true);
        if (userResidenceState !== '') {
            const res = await updateUserState(user_id, userResidenceState);

            if ((userResidenceState as USStates) === USStates.California) {
                if (
                    CALIFORNIA_ALLOWED_PRODUCTS.includes(
                        product_href as PRODUCT_HREF,
                    )
                ) {
                    const searchParams = new URLSearchParams(search);

                    // Remove the 'nu' parameter
                    searchParams.delete('nu');

                    // Construct the new search string without the 'nu' parameter
                    const newSearch = searchParams.toString();

                    const nextRoute = getNextIntakeRoute(
                        fullPath,
                        product_href,
                        search,
                    );
                    await continueButtonExitAnimation(150);
                    router.push(
                        `/intake/prescriptions/${product_href}/${nextRoute}?${searchParams}&ptst=${userResidenceState}`,
                    );
                    return;
                } else {
                    await continueButtonExitAnimation(150);
                    router.push(
                        `/intake/prescriptions/${product_href}/unavailable-in-state`,
                    );
                    return;
                }
            }

            if ((userResidenceState as USStates) === USStates.NorthCarolina) {
                if (
                    product_href === PRODUCT_HREF.B12_INJECTION ||
                    product_href === PRODUCT_HREF.GLUTATIONE_INJECTION ||
                    product_href === PRODUCT_HREF.NAD_INJECTION
                ) {
                    await continueButtonExitAnimation(150);
                    router.push(
                        `/intake/prescriptions/${product_href}/unavailable-in-state`,
                    );
                    return;
                }
            }

            if (ALLOWED_STATES.includes(userResidenceState as USStates)) {
                const searchParams = new URLSearchParams(search);

                if (
                    !stateSelectionUserEligbility(
                        product_href,
                        userResidenceState as USStates,
                    )
                ) {
                    router.push(
                        `/intake/prescriptions/${product_href}/unavailable-in-state`,
                    );
                    return;
                }
                // Remove the 'nu' parameter
                searchParams.delete('nu');

                // Construct the new search string without the 'nu' parameter
                const newSearch = searchParams.toString();

                const nextRoute = getNextIntakeRoute(
                    fullPath,
                    product_href,
                    search,
                );
                await identifyUser(user_id, {
                    stateAddress: userResidenceState,
                });

                await continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/${nextRoute}?${searchParams}&ptst=${userResidenceState}`,
                );
            } else {
                await continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/unavailable-in-area`,
                );
            }
        } else {
            setErrorMessage('Please select a state.');
            setIsButtonLoading(false);
        }
    };

    //Resets the error message when the user selects a state
    useEffect(() => {
        setErrorMessage('');
    }, [userResidenceState]);

    return (
        <>
            <div className={`flex flex-col gap-4 w-full animate-slideRight`}>
                {product_href === PRODUCT_HREF.METFORMIN ? (
                    <>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            First, let&apos;s make sure we have licensed
                            providers in your state:
                        </BioType>
                    </>
                ) : (
                    <>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            First, let’s make sure we have licensed providers in
                            your state:
                        </BioType>
                    </>
                )}
                <FormControl className="flex-1" variant="outlined">
                    <InputLabel htmlFor="state">State of Residence</InputLabel>
                    <Select
                        labelId="state-label"
                        id="state"
                        value={userResidenceState}
                        onChange={handleResidenceStateChange}
                        label="State of Residence     ."
                    >
                        <MenuItem key={'placeholder'} value="" disabled>
                            State of Residence
                        </MenuItem>
                        {statesWithCodes.map((stateData) => (
                            <MenuItem
                                key={stateData.fullState}
                                value={stateData.twoLetterCode}
                            >
                                {stateData.fullState}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className="md:flex md:justify-center md:mt-8">
                        <ContinueButton
                            onClick={pushToNextRouteWithStateCheck}
                            buttonLoading={isButtonLoading}
                        />
                    </div>
                </FormControl>
                <BioType className="!text-red-500 body1">
                    {errorMessage}
                </BioType>
            </div>
        </>
    );
}

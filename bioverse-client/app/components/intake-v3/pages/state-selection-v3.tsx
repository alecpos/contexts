'use client';

import { statesWithCodes } from '@/public/static-ts/states';
import {
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { updateUserState } from '@/app/utils/database/controller/profiles/profiles';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import React from 'react';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';
import {
    CALIFORNIA_ALLOWED_PRODUCTS,
    ALLOWED_STATES,
} from '../../intake-v2/constants/constants';
import { continueButtonExitAnimation } from '../../intake-v2/intake-animations';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';

interface StateSelectionProps {
    state_of_residence: string | null;
    user_id: string;
}
export default function StateSelectionClientComponentV3({
    state_of_residence,
    user_id,
}: StateSelectionProps) {
    const [userResidenceState, setUserResidenceState] = useState<string>(
        state_of_residence ?? ''
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
                        product_href as PRODUCT_HREF
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
                        search
                    );
                    await continueButtonExitAnimation(150);
                    router.push(
                        `/intake/prescriptions/${product_href}/${nextRoute}?${searchParams}&ptst=${userResidenceState}`
                    );
                    return;
                } else {
                    await continueButtonExitAnimation(150);
                    router.push(
                        `/intake/prescriptions/${product_href}/unavailable-in-state`
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
                        `/intake/prescriptions/${product_href}/unavailable-in-state`
                    );
                    return;
                }
            }

            if (ALLOWED_STATES.includes(userResidenceState as USStates)) {
                const searchParams = new URLSearchParams(search);

                // Remove the 'nu' parameter
                searchParams.delete('nu');

                // Construct the new search string without the 'nu' parameter
                const newSearch = searchParams.toString();

                const nextRoute = getNextIntakeRoute(
                    fullPath,
                    product_href,
                    search
                );
                await identifyUser(user_id, {
                    stateAddress: userResidenceState,
                });

                await continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/${nextRoute}?${searchParams}&ptst=${userResidenceState}`
                );
            } else {
                await continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/unavailable-in-area-v3`
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
            <div
                className={`flex flex-col w-full animate-slideRight mt-[1.25rem] md:mt-[48px]`}
            >
                {product_href === PRODUCT_HREF.METFORMIN ? (
                    <>
                        <p
                            className={`inter-h5-question-header mb-[1.25rem] md:mb-[48px]`}
                        >
                            First, let&apos;s make sure we have licensed
                            providers in your state:
                        </p>
                    </>
                ) : (
                    <>
                        <p
                            className={`inter-h5-question-header mb-[1.25rem] md:mb-[48px]`}
                        >
                            First, let’s make sure we have licensed providers in
                            your state:
                        </p>
                    </>
                )}

                <p className='intake-v3-form-label mb-1'>
                    State of Residence *
                </p>
                <FormControl className='flex-1   ' variant='outlined'>
                    <Select
                        labelId='state-label'
                        id='state'
                        value={userResidenceState}
                        onChange={handleResidenceStateChange}
                        className='intake-v3-form-label  h-[3rem] md:h-[48px]'
                    >
                        <MenuItem
                            key={'placeholder'}
                            value=''
                            disabled
                            className='intake-v3-form-label '
                        >
                            State of Residence
                        </MenuItem>
                        {statesWithCodes.map((stateData) => (
                            <MenuItem
                                key={stateData.fullState}
                                value={stateData.twoLetterCode}
                                className='intake-v3-form-label  text-[1rem] md:text-[16px]'
                            >
                                <span className='inter'>
                                    {stateData.fullState}
                                </span>
                            </MenuItem>
                        ))}
                    </Select>
                    <div className='md:flex md:justify-center mt-[1.25rem] md:mt-[48px]'>
                        <ContinueButtonV3
                            onClick={pushToNextRouteWithStateCheck}
                            buttonLoading={isButtonLoading}
                        />
                    </div>
                </FormControl>
                <BioType className='!text-red-500 inter-tight'>
                    {errorMessage}
                </BioType>
            </div>
        </>
    );
}

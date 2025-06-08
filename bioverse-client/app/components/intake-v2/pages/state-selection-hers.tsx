'use client';

import { statesWithCodes } from '@/public/static-ts/states';
import {
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    Checkbox,
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
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import ContinueButtonV3 from '../../intake-v3/buttons/ContinueButtonV3';

interface StateSelectionProps {}
export default function StateSelectionHersComponent({}: StateSelectionProps) {
    const [userResidenceState, setUserResidenceState] = useState<string>('');
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
    const [consent, setConsent] = useState<boolean>(false);

    const [answer, setAnswer] = useSessionStorage('state-selection', '');

    const handleResidenceStateChange = (event: SelectChangeEvent<string>) => {
        setUserResidenceState(event.target.value);
    };

    const pushToNextRouteWithStateCheck = async () => {
        setIsButtonLoading(true);
        if (userResidenceState !== '') {
            if (ALLOWED_STATES.includes(userResidenceState as USStates)) {
                const searchParams = new URLSearchParams(search);

                // Remove the 'nu' parameter
                searchParams.delete('nu');

                // Construct the new search string without the 'nu' parameter
                const newSearch = searchParams.toString();

                setAnswer(userResidenceState);

                const nextRoute = getNextIntakeRoute(
                    fullPath,
                    product_href,
                    search,
                );

                await continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/${nextRoute}?${searchParams}&ptst=${userResidenceState}`,
                );
            } else {
                await continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/unavailable-in-area-v3`,
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
    console.log('consent', consent);
    console.log(!consent && !Boolean(userResidenceState));
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

                <p className="intake-v3-form-label mb-1">
                    State of Residence *
                </p>
                <FormControl className="flex-1   " variant="outlined">
                    <Select
                        labelId="state-label"
                        id="state"
                        value={userResidenceState}
                        onChange={handleResidenceStateChange}
                        className="intake-v3-form-label  h-[3rem] md:h-[48px]"
                    >
                        <MenuItem
                            key={'placeholder'}
                            value=""
                            disabled
                            className="intake-v3-form-label "
                        >
                            State of Residence
                        </MenuItem>
                        {statesWithCodes.map((stateData) => (
                            <MenuItem
                                key={stateData.fullState}
                                value={stateData.twoLetterCode}
                                className="intake-v3-form-label  text-[1rem] md:text-[16px]"
                            >
                                <span className="inter">
                                    {stateData.fullState}
                                </span>
                            </MenuItem>
                        ))}
                    </Select>
                    <FormControl className="mt-8">
                        <div className="flex items-center">
                            <Checkbox
                                value={consent}
                                onChange={(event) =>
                                    setConsent(event.target.checked)
                                }
                            />
                            <BioType className="intake-subtitle text-black">
                                By clicking &apos;Continue,&apos; I agree to the{' '}
                                <a className="text-[#1E9CD2] hover:cursor-pointer hover:underline">
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a className="text-[#1E9CD2] hover:cursor-pointer hover:underline">
                                    Telehealth Consent
                                </a>{' '}
                                and acknowledge the{' '}
                                <a className="text-[#1E9CD2] hover:cursor-pointer hover:underline">
                                    Privacy Policy
                                </a>
                                .
                            </BioType>
                        </div>
                    </FormControl>
                    <div className="md:flex md:justify-center mt-[1.25rem] md:mt-[48px]">
                        <ContinueButtonV3
                            onClick={pushToNextRouteWithStateCheck}
                            buttonLoading={isButtonLoading}
                            disabled={!consent || !Boolean(userResidenceState)}
                        />
                    </div>
                </FormControl>
                <BioType className="!text-red-500 inter-tight">
                    {errorMessage}
                </BioType>
            </div>
        </>
    );
}

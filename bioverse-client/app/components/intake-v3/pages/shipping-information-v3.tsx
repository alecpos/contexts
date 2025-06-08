'use client';

import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';
import { statesArray } from '@/public/static-ts/states';
import VerifyShippingInformationModal from '../shipping-information/components/verify-shipping-information-modal';
import axios from 'axios';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { useRouter } from 'next/navigation';
import { CHECKOUT_REACHED } from '@/app/services/mixpanel/mixpanel-constants';
import {
    sendMixpanelRequest,
    trackMixpanelEvent,
} from '@/app/services/mixpanel/mixpanel-utils';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import { CHECKOUT_REACHED_GENERAL } from '@/app/services/customerio/event_names';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    isAdvertisedProduct,
    isVialProduct,
} from '@/app/utils/functions/pricing';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { generateUUIDFromStringAndNumber } from '@/app/utils/functions/generateUUIDFromStringAndNumber';
import {
    checkMixpanelEventFired,
    createMixpanelEventAudit,
} from '@/app/utils/database/controller/mixpanel/mixpanel';
import { continueButtonExitAnimation } from '../intake-animations';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

interface ShippingInformationProps {
    shippingInformation: ShippingInformation;
    userId: string | undefined;
}

export default function ShippingInformation({
    shippingInformation,
    userId,
}: ShippingInformationProps) {
    const [addressLineOne, setAddressLineOne] = useState<string>(
        shippingInformation.address_line1 || ''
    );
    const [addressLineTwo, setAddressLineTwo] = useState<string>(
        shippingInformation.address_line2 || ''
    );
    const [stateAddress, setStateAddress] = useState<string>(
        shippingInformation.state || ''
    );
    const [zip, setZip] = useState<string>(shippingInformation.zip || '');
    const [city, setCity] = useState<string>(shippingInformation.city || '');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState({
        addressLineOne: '',
        addressLineTwo: '',
        stateAddress: '',
        zip: '',
        city: '',
    });
    const [poBoxError, setPoBoxError] = useState<boolean>(false);
    const [validationStatus, setValidationStatus] = useState<boolean>(false);
    const [validationData, setValidationData] = useState({});
    const [previousResponseId, setPreviousResponseId] = useState<string>('');
    const fullPath = usePathname();
    const searchParams = useSearchParams();
    const url = useParams();
    const router = useRouter();
    const search = searchParams.toString();

    const { product_href, discountable } = getIntakeURLParams(
        url,
        searchParams
    );

    const sendAddressValidationRequest = async () => {
        const payload = {
            addressLineOne,
            addressLineTwo,
            stateAddress,
            zip,
            city,
            ...(previousResponseId !== '' && { previousResponseId }),
        };
        const response = await axios.post('/api/google', payload);

        const { data, success } = response.data;

        if (isVialProduct(product_href) && data.isPoBox) {
            setPoBoxError(true);
            setTimeout(() => {
                setPoBoxError(false);
            }, 5000);
            return;
        }

        setValidationStatus(success);
        setValidationData(data);

        setValidationStatus(success);
        setValidationData(data);

        if (previousResponseId === '') {
            setPreviousResponseId(data.responseId);
        }

        setModalOpen(true);
    };

    const pushToNextRoute = async () => {
        const { data, error } = await checkMixpanelEventFired(
            userId!,
            CHECKOUT_REACHED,
            product_href
        );

        if (!data && isAdvertisedProduct(product_href)) {
            const dateNow = Date.now();
            const insertId = generateUUIDFromStringAndNumber(
                userId!,
                CHECKOUT_REACHED,
                dateNow
            );
            const mixpanel_payload = {
                event: CHECKOUT_REACHED,
                properties: {
                    distinct_id: userId,
                    time: dateNow,
                    $insert_id: insertId,
                    product_name: product_href,
                },
            };

            await trackMixpanelEvent(CHECKOUT_REACHED, mixpanel_payload);
            await createMixpanelEventAudit(
                userId!,
                CHECKOUT_REACHED,
                product_href
            );
        }
        if (userId) {
            await triggerEvent(userId, CHECKOUT_REACHED_GENERAL, {
                redirect_url: `${window.location.origin}${window.location.pathname}${window.location.search}`,
                product_href,
            });
        }

        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
        );
    };

    const verifyAddress = async () => {
        setButtonLoading(true);
        // sendAddressValidationRequest();
        // setModalOpen(true);

        let isValid = true;
        const newErrors = {
            addressLineOne: '',
            addressLineTwo: '',
            stateAddress: '',
            zip: '',
            city: '',
        };

        if (!addressLineOne || !addressLineOne.trim()) {
            isValid = false;
            newErrors.addressLineOne = 'Address Line 1 is required';
        }
        if (addressLineOne.length >= 40) {
            isValid = false;
            newErrors.addressLineOne =
                'Address Line 1 must be less than 40 characters';
        }

        if (addressLineTwo.length >= 40) {
            isValid = false;
            newErrors.addressLineTwo =
                'Address Line 2 must be less than 40 characters';
        }

        if (city.length >= 20) {
            isValid = false;
            newErrors.city = 'City must be less than 20 characters';
        }

        if (!city || !city.trim()) {
            isValid = false;
            newErrors.city = 'City is required';
        }
        if (!stateAddress || !stateAddress.trim()) {
            isValid = false;
            newErrors.stateAddress = 'State is required';
        } else if (stateAddress !== shippingInformation.state) {
            isValid = false;
            newErrors.stateAddress =
                'Please input the same state you previously entered';
        }
        if (!zip || !zip.trim()) {
            isValid = false;
            newErrors.zip = 'Zip Code is required';
        }

        setErrors(newErrors);

        if (isValid) {
            await sendAddressValidationRequest();
            setButtonLoading(false);
        } else {
            setButtonLoading(false);
        }
    };

    //TODO change the placeholder to labels

    return (
        <div
            className={`w-full flex justify-center animate-slideRight mt-[1.25rem] md:mt-[48px]`}
        >
            <div className='flex flex-col w-full'>
                <div className=''>
                    <BioType className={`inter-h5-question-header`}>
                        Please confirm your shipping address.
                    </BioType>
                </div>
                <div className='w-full flex flex-col gap-y-4'>
                    <FormControl sx={{ marginTop: '20px' }}>
                        <TextField
                            id='address1'
                            placeholder='Street address*'
                            InputLabelProps={{ shrink: true }}
                            value={addressLineOne ? addressLineOne : null}
                            onChange={(val) => {
                                setAddressLineOne(val.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    addressLineOne: '',
                                }));
                            }}
                            inputProps={{
                                style: {
                                    textAlign: 'start',
                                    color: 'black',
                                    fontSize: '1.1em',
                                    height: '36px',
                                },
                            }}
                        />
                        {errors.addressLineOne && (
                            <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                {errors.addressLineOne}
                            </BioType>
                        )}
                    </FormControl>
                    <FormControl>
                        <TextField
                            id='address2'
                            placeholder='Apt, suite, unit, building (optional)'
                            value={addressLineTwo}
                            InputLabelProps={{ shrink: true }}
                            onChange={(val) => {
                                setAddressLineTwo(val.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    addressLineTwo: '',
                                }));
                            }}
                            inputProps={{
                                style: {
                                    textAlign: 'start',
                                    color: 'black',
                                    fontSize: '1.1em',
                                    height: '36px',
                                },
                            }}
                        />
                        {errors.addressLineTwo && (
                            <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                {errors.addressLineTwo}
                            </BioType>
                        )}
                    </FormControl>
                    <FormControl>
                        <TextField
                            id='city'
                            value={city ? city : null}
                            placeholder='City*'
                            InputLabelProps={{ shrink: true }}
                            onChange={(val) => {
                                setCity(val.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    city: '',
                                }));
                            }}
                            inputProps={{
                                style: {
                                    textAlign: 'start',
                                    color: 'black',
                                    fontSize: '1.1em',
                                    height: '36px',
                                },
                            }}
                        />
                        {errors.city && (
                            <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                {errors.city}
                            </BioType>
                        )}
                    </FormControl>
                    <div className='flex flex-col md:flex-col md:gap-x-4 gap-y-4'>
                        <FormControl className='flex-1' variant='outlined'>
                            <Select
                                id='state'
                                required
                                value={stateAddress ? stateAddress : 'State'}
                                onChange={(val) => {
                                    setStateAddress(val.target.value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        stateAddress: '',
                                    }));
                                }}
                                sx={{ height: '72px' }}
                            >
                                {statesArray.map((stateName) => (
                                    <MenuItem key={stateName} value={stateName}>
                                        {stateName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.stateAddress && (
                                <BioType className='body1 text-red-500 mt-0.5 text-[16px]'>
                                    {errors.stateAddress}
                                </BioType>
                            )}
                        </FormControl>
                        <FormControl className='flex-1'>
                            <TextField
                                id='zip'
                                sx={{ height: '58px' }}
                                InputLabelProps={{ shrink: true }}
                                value={zip ? zip : null}
                                placeholder='Zip Code*'
                                onChange={(val) => {
                                    setZip(val.target.value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        zip: '',
                                    }));
                                }}
                                inputProps={{
                                    style: {
                                        textAlign: 'start',
                                        color: 'black',
                                        fontSize: '1.1em',
                                        height: '36px',
                                    },
                                }}
                            />
                            {errors.zip && (
                                <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                    {errors.zip}
                                </BioType>
                            )}
                        </FormControl>
                    </div>
                </div>
                {poBoxError && (
                    <BioType className='body1 text-center text-red-500 mt-0.5 text-[16px] ml-0.5'>
                        You must enter a valid address here that can receive
                        shipped medication, which does not include PO boxes.
                    </BioType>
                )}
                <div className='md:flex md:justify-center md:mt-8'>
                    <ContinueButtonV3
                        onClick={verifyAddress}
                        buttonLoading={buttonLoading}
                    />
                </div>
            </div>
            <VerifyShippingInformationModal
                addressLineOne={addressLineOne}
                addressLineTwo={addressLineTwo}
                stateAddress={stateAddress}
                zip={zip}
                city={city}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                validationData={validationData}
                validationStatus={validationStatus}
                userId={userId || ''}
                pushToNextRoute={pushToNextRoute}
                setErrors={setErrors}
            />
        </div>
    );
}

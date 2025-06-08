'use client';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    useStripe,
    useElements,
    CardElement,
    ExpressCheckoutElement,
} from '@stripe/react-stripe-js';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import {
    createCustomerWithData,
    retrieveCustomerWithId,
    updateDefaultPaymentMethodForCustomer,
} from '@/app/services/stripe/customer';
import { updateSetupIntentWithSetupIntentId } from '@/app/services/stripe/setupIntent';
import {
    getBaseOrderById,
    getPriceForProduct,
    updateOrderAfterCardDown,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    getCustomerStripeId,
    getIDVerificationData,
    updateIntakeCompletedForPatient,
    updateStripeCustomerId,
} from '@/app/utils/database/controller/profiles/profiles';
import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import {
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
    mapProductToCode,
} from '@/app/services/tracking/constants';
import { constructPricingStructureV2 } from '@/app/utils/functions/pricing';
import { sendMixpanelRequest } from '@/app/services/mixpanel/mixpanel-utils';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import Image from 'next/image';
import { statesArray } from '@/public/static-ts/states';
import { trackPurchaseEvent } from '@/app/services/tracking/tracking';
import { getIntakeURLParams } from '../intake-functions';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import { postPaymentError } from '@/app/utils/database/controller/payment_error_audit/payment_error_audit';
import { createNewThreadForPatientProduct } from '@/app/utils/database/controller/messaging/threads/threads';
import { ORDER_RECEIVED } from '@/app/services/customerio/event_names';
import {
    shouldSendIDVerification,
    triggerEvent,
    triggerOrderConfirmCommsEvent,
} from '@/app/services/customerio/customerioApiFactory';
import WLOrderSummary from './order-summary/wl-order-summary';
import useSWR from 'swr';
import { getWLGoalAnswer } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { checkMixpanelEventFired } from '@/app/utils/database/controller/mixpanel/mixpanel';
import { CHECKOUT_COMPLETED } from '@/app/services/mixpanel/mixpanel-constants';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import {
    insertNewFbclid,
    insertNewGclid,
    insertNewUrl,
} from '@/app/(testing_and_development)/olivier-dev/utils';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    formatDateToMMDDYYYY,
    formatDateToMMDDYYYYFacebook,
    formatPhoneNumberToNumericString,
} from '@/app/utils/functions/client-utils';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';
import { AB_TESTS_IDS } from '../types/intake-enumerators';
import { createNewIDAndSelfieCheckPostCheckoutJob } from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

interface Props {
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    userProfileData: ProfileDataIntakeFlowCheckout;
    priceData: ProductVariantRecord[];
    userEmail: string | undefined;
    session_id: string;
    setupIntentId: string;
    clientSecret: string;
    currentOrderId: number;
    productInformationData: any;
    shouldDiscount: boolean;
    orderData: any;
    weightlossGoal: string;
    selectedDose: string;
    variantPriceData: Partial<ProductVariantRecord>;
}

export default function WLCheckoutV2({
    session_id,
    userEmail,
    product_data,
    userProfileData,
    priceData,
    setupIntentId,
    currentOrderId,
    clientSecret,
    productInformationData,
    shouldDiscount,
    orderData,
    weightlossGoal,
    selectedDose,
    variantPriceData,
}: Props) {
    const params = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();

    const urlParams = new URLSearchParams(searchParams);

    const { product_href: urlProduct } = getIntakeURLParams(
        params,
        searchParams
    );

    const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false);
    const [billingSameAsShipping, setBillingSameAsShipping] =
        useState<boolean>(true);
    const [name, setName] = useState<string>(
        userProfileData.first_name + ' ' + userProfileData.last_name
    );
    const [addressLineOne, setAddressLineOne] = useState<string>(
        orderData.address_line1
    );
    const [addressLineTwo, setAddressLineTwo] = useState<string | undefined>(
        orderData.address_line2
    );
    const [stateAddress, setStateAddress] = useState<string>(orderData.state);
    const [zip, setZip] = useState<string>(orderData.zip);
    const [city, setCity] = useState<string>(orderData.city);
    const [errors, setErrors] = useState({
        addressLineOne: '',
        addressLineTwo: '',
        stateAddress: '',
        zip: '',
        city: '',
    });

    const fullPath = usePathname();

    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    const [applePayVisible, setApplePayVisible] = useState<boolean>(false);

    const gclid = urlParams.get('gclid');
    const fbclid = urlParams.get('fbclid');

    useEffect(() => {
        if (billingSameAsShipping) {
            setName(
                userProfileData.first_name + ' ' + userProfileData.last_name
            );
            setAddressLineOne(orderData.address_line1);
            setAddressLineTwo(orderData.address_line2);
            setStateAddress(orderData.state);
            setZip(orderData.zip);
            setCity(orderData.city);
        } else {
            setName('');
            setAddressLineOne('');
            setAddressLineTwo('');
            setStateAddress('');
            setZip('');
            setCity('');
        }
    }, [billingSameAsShipping]);

    const [stripeCustomerData, setStripeCustomerData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [orderId, setOrderId] = useLocalStorage('orderId', '');
    const [metaPayload, setMetaPayload] = useLocalStorage('metaPayload', '');
    const [googlePayload, setGooglePayload] = useLocalStorage(
        'googlePayload',
        ''
    );
    const [errorMessage, setErrorMessage] = useState<string>('');
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);

            // Cleanup function to clear the timeout if the component unmounts
            // or if the errorMessage changes before the timer is up
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);
    const [valuesPayload, setValuesPayload] = useLocalStorage(
        'valuesPayload',
        ''
    );

    // Access _fbp and _fbc cookies
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    const pricingStructure = constructPricingStructureV2(
        product_data,
        priceData,
        shouldDiscount
    );

    function displayCitation() {
        if (product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF) {
            return '*This is based on data from a 2022 study published the American Medical Association titled "Weight Loss Outcomes Associated With Semaglutide Treatment for Patients With Overweight or Obesity".';
        } else if (product_data.product_href === TIRZEPATIDE_PRODUCT_HREF) {
            return '*This is based on data from a 2022 study published in the New England Journal of Medicine titled “Tirzepatide Once Weekly for the Treatment of Obesity".';
        }
        return '';
    }

    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const url = useParams();
    const { product_href } = getIntakeURLParams(url, searchParams);

    /**
     * SWR method to obtain user wl goal
     */
    const {
        data: wl_answer,
        error: wl_answer_error,
        isLoading: wl_answer_Loading,
    } = useSWR(`${session_id}-wl-answer`, () =>
        getWLGoalAnswer(session_id!, product_href)
    );

    useEffect(() => {
        getStripeCustomerDataSet();
    }, []);

    useEffect(() => {
        if (stripeCustomerData) {
            updateSetupIntentWithSetupIntentId(
                setupIntentId,
                stripeCustomerData.id
            );
        }
    }, [stripeCustomerData]);

    const mapCadencyToDays = (cadency: string) => {
        if (cadency === 'monthly') {
            return '30';
        } else if (cadency === 'quarterly') {
            return '90';
        }
    };

    const renderTermsAndConditions = (cadency: string) => {
        if (cadency === 'one_time') {
            return (
                <>
                    <BioType
                        className={`${INTAKE_INPUT_TAILWIND} pt-2 pb-2 !text-[#00000099]`}
                    >
                        Prescription products require an evaluation with a
                        licensed medical professional who will determine if a
                        prescription is appropriate.
                    </BioType>
                    <BioType className='body2 pb-2 !text-[#00000099]'>
                        By clicking $0 Due Today, you agree to the{' '}
                        <Link
                            href='https://www.gobioverse.com/privacy-policy'
                            className='!text-[#286BA2] no-underline hover:underline'
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href='https://www.gobioverse.com/privacy-policy'
                            className='!text-[#286BA2] no-underline hover:underline'
                        >
                            Privacy Policy
                        </Link>
                        . You also agree that, if prescribed, you will be
                        charged ${pricingStructure.total_price} for your order.
                    </BioType>

                    <BioType className='body2 pb-2 text-[#00000099]'>
                        You can cancel your order at any time before it is
                        shipped out by logging into your BIOVERSE account and
                        clicking &apos;Manage&apos; from your Orders tab.
                    </BioType>
                </>
            );
        } else {
            if (variantPriceData.cadence === 'quarterly') {
                return (
                    <>
                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] pt-2 pb-2 !text-[#00000099]`}
                        >
                            By clicking &apos;$0 Due Today,&apos; you agree to
                            our Terms of Service and Privacy Policy. If
                            prescribed, you are purchasing an automatically
                            renewing subscription, and you authorize us to
                            charge ${variantPriceData.price_data.product_price}
                            for your initial 90-day supply, which we expect to
                            last three months.
                        </BioType>
                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2 pb-2 text-[#00000099]`}
                        >
                            Please note that your provider may recommend dosage
                            adjustments, which could change the price. You will
                            not be responsible for any portion of this amount if
                            you are not prescribed. We will notify you of any
                            actions you need to take to ensure that the
                            prescription product(s) associated with your
                            subscription remains active.
                        </BioType>

                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] pb-2 text-[#00000099]`}
                        >
                            You are responsible for completing these actions.
                            Unless you have canceled, your subscription will
                            automatically renew even if you have not taken the
                            directed actions needed to ensure that the
                            prescription product(s) associated with your
                            subscription remains active.
                        </BioType>

                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2 pb-2 text-[#00000099]`}
                        >
                            Your subscription will renew unless you cancel at
                            least 2 days before the next renewal date. You can
                            view your renewal date and cancel your
                            subscription(s) through your online account or by
                            contacting customer support at
                            support@gobioverse.com. Any cancellation will take
                            effect at the end of the current subscription period
                            and, if applicable, you will continue to receive the
                            active prescription product(s) associated with your
                            subscription until the end of the subscription
                            period.
                        </BioType>
                    </>
                );
            } else if (variantPriceData.cadence === 'biannually') {
                return (
                    <>
                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] pt-2 pb-2 !text-[#00000099]`}
                        >
                            By clicking &apos;$0 Due Today,&apos; you agree to
                            our Terms of Service and Privacy Policy. If
                            prescribed, you are purchasing an automatically
                            renewing subscription, and you authorize us to
                            charge ${variantPriceData.price_data.product_price}
                            for your initial 180-day supply, which we expect to
                            last six months.
                        </BioType>
                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2 pb-2 text-[#00000099]`}
                        >
                            Please note that your provider may recommend dosage
                            adjustments, which could change the price. You will
                            not be responsible for any portion of this amount if
                            you are not prescribed. We will notify you of any
                            actions you need to take to ensure that the
                            prescription product(s) associated with your
                            subscription remains active.
                        </BioType>

                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] pb-2 text-[#00000099]`}
                        >
                            You are responsible for completing these actions.
                            Unless you have canceled, your subscription will
                            automatically renew even if you have not taken the
                            directed actions needed to ensure that the
                            prescription product(s) associated with your
                            subscription remains active.
                        </BioType>

                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2 pb-2 text-[#00000099]`}
                        >
                            Your subscription will renew unless you cancel at
                            least 2 days before the next renewal date. You can
                            view your renewal date and cancel your
                            subscription(s) through your online account or by
                            contacting customer support at
                            support@gobioverse.com. Any cancellation will take
                            effect at the end of the current subscription period
                            and, if applicable, you will continue to receive the
                            active prescription product(s) associated with your
                            subscription until the end of the subscription
                            period.
                        </BioType>
                    </>
                );
            } else {
                return (
                    <>
                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] pt-2 pb-2 !text-[#00000099]`}
                        >
                            By clicking &apos;$0 Due Today,&apos; you agree to
                            our Terms of Service and Privacy Policy. If
                            prescribed, you are purchasing an automatically
                            renewing subscription, and you authorize us to
                            charge ${variantPriceData.price_data.product_price}{' '}
                            for your initial 30-day supply, which we expect to
                            last one month. The prescription product(s)
                            associated with your subscription will be shipped to
                            you every 30 days.
                        </BioType>
                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2 pb-2 text-[#00000099]`}
                        >
                            Please note that your provider may recommend dosage
                            adjustments, which could change the price. You will
                            not be responsible for any portion of this amount if
                            you are not prescribed. We will notify you of any
                            actions you need to take to ensure that the
                            prescription product(s) associated with your
                            subscription remains active.
                        </BioType>

                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] pb-2 text-[#00000099]`}
                        >
                            You are responsible for completing these actions.
                            Unless you have canceled, your subscription will
                            automatically renew even if you have not taken the
                            directed actions needed to ensure that the
                            prescription product(s) associated with your
                            subscription remains active.
                        </BioType>

                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} !text-[16px] body2 pb-2 text-[#00000099]`}
                        >
                            Your subscription will renew unless you cancel at
                            least 2 days before the next renewal date. You can
                            view your renewal date and cancel your
                            subscription(s) through your online account or by
                            contacting customer support at
                            support@gobioverse.com. Any cancellation will take
                            effect at the end of the current subscription period
                            and, if applicable, you will continue to receive the
                            active prescription product(s) associated with your
                            subscription until the end of the subscription
                            period.
                        </BioType>
                    </>
                );
            }
        }
    };

    //When checkbox for billign & shipping are the same is toggled this function is invoked.
    const handleBillingShippingChange = () => {
        setBillingSameAsShipping((prev) => !prev);
    };

    const getStripeCustomerDataSet = async () => {
        const { data: customerIdData, error: customerStripeIdError } =
            await getCustomerStripeId(session_id);

        if (customerStripeIdError) {
            //setError here.
            return;
        }

        if (customerIdData.stripe_customer_id) {
            setStripeCustomerData(
                JSON.parse(
                    await retrieveCustomerWithId(
                        customerIdData.stripe_customer_id
                    )
                )
            );
        } else {
            const customerDataToLoadAfterCreation = JSON.parse(
                await createCustomerWithData({
                    name: `${userProfileData.first_name} ${userProfileData.last_name}`,
                    email: userEmail,
                    phone: userProfileData.phone_number,
                    address: {
                        line1: orderData.address_line1,
                        line2: orderData.address_line2,
                        city: orderData.city,
                        state: orderData.state,
                        postal_code: orderData.zip,
                        country: 'US',
                    },
                })
            );

            updateStripeCustomerId(
                customerDataToLoadAfterCreation.id,
                session_id
            );
            setStripeCustomerData(customerDataToLoadAfterCreation);
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        setIsLoading(true);

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        stripe
            .confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        address: {
                            line1: addressLineOne,
                            line2: addressLineTwo,
                            city: city,
                            state: stateAddress,
                            postal_code: zip,
                            country: 'US',
                        },
                        name: name,
                    },
                },
            })
            .then(async function (result) {
                if (result.error) {
                    // Inform the customer that there was an error.
                    setIsLoading(false);
                    setErrorMessage(
                        'There was an issue with the card, please check your details.'
                    );
                    await postPaymentError(session_id, result.error);
                    return;
                }

                if (result.setupIntent?.status === 'succeeded') {
                    const orderData = {
                        setupIntentId: setupIntentId,
                        paymentMethodId: result.setupIntent.payment_method,
                        clientSecret: clientSecret,
                    };

                    console.log('Updated Order Data', orderData);

                    await updateDefaultPaymentMethodForCustomer(
                        stripeCustomerData.id,
                        result.setupIntent.payment_method as string
                    );

                    const pvc = new ProductVariantController(
                        product_data.product_href as PRODUCT_HREF,
                        variantPriceData.variant_index!,
                        stateAddress as USStates
                    );

                    const pvc_result = pvc.getConvertedVariantIndex();
                    const order_update_status = await updateOrderAfterCardDown(
                        currentOrderId!,
                        orderData,
                        {
                            variant_index: pvc_result.variant_index,
                            subscription_type: variantPriceData.cadence,
                            assigned_pharmacy: pvc_result.pharmacy,
                            variant_text: variantPriceData.variant,
                        }
                    );

                    if (order_update_status === 'success') {
                        setOrderId(String(currentOrderId));
                        updateIntakeCompletedForPatient(session_id);
                        //Creating a chat group for the user to message care coordinators right after.
                        await createNewThreadForPatientProduct(
                            session_id,
                            product_href
                        );
                        // Meta Pixel Event here
                        const product = priceData[product_data.variant];
                        const discountedPrice = await getPriceForProduct(
                            currentOrderId
                        );
                        const values = {
                            firstName: userProfileData?.first_name,
                            lastName: userProfileData?.last_name,
                            phone_number: userProfileData?.phone_number,
                            email: userEmail,
                            city: userProfileData?.city,
                            zip: userProfileData?.zip,
                            state: userProfileData?.state?.toLowerCase(),
                            country: 'US',
                            fbc,
                            fbp,
                        };

                        if (urlProduct === PRODUCT_HREF.WEIGHT_LOSS) {
                            await triggerOrderConfirmCommsEvent(
                                session_id,
                                PRODUCT_HREF.WEIGHT_LOSS
                            );
                        } else {
                            await triggerOrderConfirmCommsEvent(
                                session_id,
                                product_data.product_href
                            );
                        }

                        const eventId = `${currentOrderId}-${Date.now()}`;

                        await triggerEvent(session_id, ORDER_RECEIVED, {
                            product: product_data.product_href,
                            subscriptionType: product_data.subscriptionType,
                            variant: product_data.variant,
                            estimated_total: pricingStructure.total_price,
                            subscriptionPrice:
                                parseFloat(
                                    product.price_data.product_price || 0
                                ).toFixed(2) || '',
                            order_id: currentOrderId,
                            value: pricingStructure.total_price,
                            currency: 'USD',
                            context: {
                                event_id: eventId,
                                fbc,
                                ...(!gclid && { fbp }),
                                traits: {
                                    email: userEmail,
                                    firstName: userProfileData.first_name,
                                    lastName: userProfileData.last_name,
                                    phone: formatPhoneNumberToNumericString(
                                        userProfileData.phone_number
                                    ),
                                    address: {
                                        zip: zip,
                                        state: stateAddress,
                                    },
                                    birthday: formatDateToMMDDYYYYFacebook(
                                        new Date(userProfileData.date_of_birth)
                                    ),
                                    gender:
                                        userProfileData.sex_at_birth === 'Male'
                                            ? 'm'
                                            : 'f',
                                },
                                event_time: Math.floor(Date.now() / 1000),
                            },
                            event_time: Math.floor(Date.now() / 1000),
                            custom_data: {
                                value: pricingStructure.total_price,
                                currency: 'USD',
                            },
                        });
                        // window.dataLayer?.push({
                        //     event: 'Purchase',
                        //     product_name: productData.productName,
                        //     subscriptionType: productData.subscriptionType,
                        //     variant: productData.variant,
                        //     value: discountedPrice,
                        //     transaction_id: currentOrderId,
                        //     currency: 'USD',
                        // });

                        const payload_meta = {
                            // content_ids: [product.id],
                            content_name: product_data.product_href,
                            // content_type: 'product',
                            // contents: [{ id: product.id, quantity: 1 }],
                            currency: 'USD',
                            value: discountedPrice,
                            product_href: product_data.product_href,
                            subscriptionType: product_data.subscriptionType,
                            ...(process.env.NEXT_PUBLIC_ENVIRONMENT ===
                                'dev' && {
                                test_event_code:
                                    process.env.NEXT_PUBLIC_PIXEL_TEST_EVENT_ID,
                            }),
                        };

                        const payload_google = {
                            value: discountedPrice,
                            id: currentOrderId,
                            product: product_data.product_href,
                            variant: product_data.variant,
                            subscriptionType: product_data.subscriptionType,
                            event_id: eventId,
                            fbp,
                            fbc,
                            email: userEmail,
                        };

                        setMetaPayload(JSON.stringify(payload_meta));
                        setGooglePayload(JSON.stringify(payload_google));
                        setValuesPayload(JSON.stringify(values));

                        trackPurchaseEvent(
                            payload_meta,
                            payload_google,
                            values
                        );

                        await logPatientAction(
                            session_id,
                            PatientActionTask.INTAKE_SUBMITTED,
                            {
                                product_href: product_data.product_href,
                                fbc: fbc,
                                fbp: fbp,
                                gclid: gclid,
                                fbclid: fbclid,
                            }
                        );

                        //add provider to the list of communicable users. CURRENTLY ADDS MAYLIN C.
                        await addProviderToPatientRelationship(
                            session_id,
                            '24138d35-e26f-4113-bcd9-7f275c4f9a47'
                        );
                        if (
                            !(searchParams.get('id_test') ===
                                AB_TESTS_IDS.WL_SHOW_ID_AFTER_CHECKOUT) 
                        ) {
                            const { license, selfie, name, gender } =
                                await getIDVerificationData(session_id);

                            if (!license || !selfie) {
                                await createUserStatusTagWAction(
                                    StatusTag.IDDocs,
                                    currentOrderId.toString(),
                                    StatusTagAction.INSERT,
                                    session_id,
                                    'Patient submitted an order without verifying their id',
                                    'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                                    [StatusTag.IDDocs]
                                );
                            } else {
                                const orderData = await getBaseOrderById(
                                    currentOrderId
                                );

                                if (!orderData) {
                                    console.error('No Order to assign to ');
                                    return;
                                }

                                if (
                                    orderData.metadata &&
                                    orderData.metadata.doctorLetterRequired ===
                                        true
                                ) {
                                    await createUserStatusTagWAction(
                                        StatusTag.DoctorLetterRequired,
                                        currentOrderId.toString(),
                                        StatusTagAction.INSERT,
                                        session_id,
                                        'New Order, requires doctor letter for GLP-1',
                                        'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                                        [StatusTag.DoctorLetterRequired]
                                    );
                                } else {
                                    await createUserStatusTagWAction(
                                        StatusTag.Review,
                                        currentOrderId.toString(),
                                        StatusTagAction.INSERT,
                                        session_id,
                                        'New Order to review',
                                        'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                                        [StatusTag.Review]
                                    );
                                }
                            }
                            await shouldSendIDVerification(session_id);
                        }

                        await addProviderToPatientRelationship(
                            session_id,
                            'da5b213d-7676-4792-bc73-11151d0da4e6'
                        );

                        const payload_mixpanel = {
                            value: discountedPrice,
                            order_id: currentOrderId,
                            product_name: product_data.product_href,
                            subscriptionType: product_data.subscriptionType,
                        };

                        const { data, error } = await checkMixpanelEventFired(
                            session_id,
                            CHECKOUT_COMPLETED,
                            product_href
                        );

                        if (gclid) {
                            await insertNewGclid(
                                session_id,
                                product_data.product_href,
                                gclid
                            );
                        }

                        if (fbclid) {
                            await insertNewFbclid(
                                session_id,
                                product_data.product_href,
                                fbclid
                            );
                        }

                        await insertNewUrl(session_id, searchParams.toString());

                        // if (!data && isAdvertisedProduct(product_href)) {
                        //     const dateNow = Date.now();
                        //     const insertId = generateUUIDFromStringAndNumber(
                        //         session_id,
                        //         CHECKOUT_COMPLETED,
                        //         dateNow,
                        //     );

                        //     const mixpanel_payload = {
                        //         event: CHECKOUT_COMPLETED,
                        //         properties: {
                        //             distinct_id: session_id,
                        //             time: dateNow,
                        //             $insert_id: insertId,
                        //             product_name: product_href,
                        //         },
                        //     };

                        //     await trackMixpanelEvent(
                        //         CHECKOUT_COMPLETED,
                        //         mixpanel_payload,
                        //     );
                        //     await createMixpanelEventAudit(
                        //         session_id,
                        //         CHECKOUT_COMPLETED,
                        //         product_href,
                        //     );
                        // }

                        const query = new URLSearchParams({
                            pn: mapProductToCode(product_data.product_href),
                        });

                        // 2) Conditionally append the wlcad/wldcad param depending on subscriptionType:
                        if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Monthly
                        ) {
                            query.set('wlcad', 'monthly');
                        } else if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Quarterly
                        ) {
                            query.set('wlcad', 'quarterly');
                        } else if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Biannually
                        ) {
                            query.set('wlcad', 'biannually');
                        } else if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Annually
                        ) {
                            query.set('wlcad', 'annually');
                        }

                        if (
                            (searchParams.get('id_test') ===
                                AB_TESTS_IDS.WL_SHOW_ID_AFTER_CHECKOUT
                            ) 
                        ) {
                            await createNewIDAndSelfieCheckPostCheckoutJob(
                                session_id,
                                String(currentOrderId),
                                product_data.product_href
                            );

                            const nextRoute = getNextIntakeRoute(
                                fullPath,
                                product_href,
                                search
                            );
                            router.push(
                                `/intake/prescriptions/${product_href}/${nextRoute}?${search}&${query.toString()}`
                            );
                        } else {
                            const url = `/intake-complete/confirmation-v3?${query.toString()}&orderId=${currentOrderId}`;
                            router.push(url);
                        }

                        //HEADSUP Checkout/ID swap code for reverting when checkout is before/after ID

                        //Code for when checkout is prior to ID
                    }
                }
            });
    };

    const confirmApplePay = async () => {
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(
                'There was an issue with the card, please check your details.'
            );
            return;
        }

        await stripe
            .confirmSetup({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: '',
                },
                redirect: 'if_required',
            })
            .then(async function (result) {
                if (result.error) {
                    // Inform the customer that there was an error.
                    setIsLoading(false);
                    setErrorMessage(
                        'There was an issue with the card, please check your details.'
                    );
                    await postPaymentError(session_id, result.error);
                    return;
                }

                if (result.setupIntent?.status === 'succeeded') {
                    const orderData = {
                        setupIntentId: setupIntentId,
                        paymentMethodId: result.setupIntent.payment_method,
                        clientSecret: clientSecret,
                    };

                    await updateDefaultPaymentMethodForCustomer(
                        stripeCustomerData.id,
                        result.setupIntent.payment_method as string
                    );

                    const pvc = new ProductVariantController(
                        product_data.product_href as PRODUCT_HREF,
                        variantPriceData.variant_index!,
                        stateAddress as USStates
                    );

                    const pvc_result = pvc.getConvertedVariantIndex();

                    const order_update_status = await updateOrderAfterCardDown(
                        currentOrderId!,
                        orderData,
                        {
                            variant_index: pvc_result.variant_index,
                            subscription_type: variantPriceData.cadence,
                            assigned_pharmacy: pvc_result.pharmacy,
                        }
                    );

                    if (order_update_status === 'success') {
                        setOrderId(String(currentOrderId));
                        updateIntakeCompletedForPatient(session_id);
                        //Creating a chat group for the user to message care coordinators right after.
                        await createNewThreadForPatientProduct(
                            session_id,
                            product_href
                        );
                        // Meta Pixel Event here
                        const product = priceData[product_data.variant];
                        const discountedPrice = await getPriceForProduct(
                            currentOrderId
                        );
                        const values = {
                            firstName: userProfileData?.first_name,
                            lastName: userProfileData?.last_name,
                            phone_number: userProfileData?.phone_number,
                            email: userEmail,
                            city: userProfileData?.city,
                            zip: userProfileData?.zip,
                            state: userProfileData?.state?.toLowerCase(),
                            country: 'US',
                            fbc,
                            fbp,
                        };

                        await triggerOrderConfirmCommsEvent(
                            session_id,
                            product_data.product_href
                        );

                        const eventId = `${currentOrderId}-${Date.now()}`;

                        await triggerEvent(session_id, ORDER_RECEIVED, {
                            product: product_data.product_href,
                            subscriptionType: product_data.subscriptionType,
                            variant: product_data.variant,
                            estimated_total: pricingStructure.total_price,
                            subscriptionPrice:
                                parseFloat(
                                    product.price_data.product_price || 0
                                ).toFixed(2) || '',
                            order_id: currentOrderId,
                            value: pricingStructure.total_price,
                            currency: 'USD',
                            context: {
                                event_id: eventId,
                                fbc,
                                ...(!gclid && { fbp }),
                                traits: {
                                    email: userEmail,
                                    firstName: userProfileData.first_name,
                                    lastName: userProfileData.last_name,
                                    phone: formatPhoneNumberToNumericString(
                                        userProfileData.phone_number
                                    ),
                                    address: {
                                        zip: zip,
                                        state: stateAddress,
                                    },
                                    birthday: formatDateToMMDDYYYYFacebook(
                                        new Date(userProfileData.date_of_birth)
                                    ),
                                    gender:
                                        userProfileData.sex_at_birth === 'Male'
                                            ? 'm'
                                            : 'f',
                                },
                                event_time: Math.floor(Date.now() / 1000),
                            },
                            event_time: Math.floor(Date.now() / 1000),
                            custom_data: {
                                value: pricingStructure.total_price,
                                currency: 'USD',
                            },
                        });

                        await logPatientAction(
                            session_id,
                            PatientActionTask.INTAKE_SUBMITTED,
                            {
                                product_href: product_data.product_href,
                                fbc: fbc,
                                fbp: fbp,
                                gclid: gclid,
                                fbclid: fbclid,
                            }
                        );

                        const payload_meta = {
                            content_name: product_data.product_href,
                            currency: 'USD',
                            value: discountedPrice,
                            product_href: product_data.product_href,
                            subscriptionType: product_data.subscriptionType,
                            ...(process.env.NEXT_PUBLIC_ENVIRONMENT ===
                                'dev' && {
                                test_event_code:
                                    process.env.NEXT_PUBLIC_PIXEL_TEST_EVENT_ID,
                            }),
                        };

                        const payload_google = {
                            value: discountedPrice,
                            id: currentOrderId,
                            product: product_data.product_href,
                            variant: product_data.variant,
                            subscriptionType: product_data.subscriptionType,
                        };

                        setMetaPayload(JSON.stringify(payload_meta));
                        setGooglePayload(JSON.stringify(payload_google));
                        setValuesPayload(JSON.stringify(values));

                        trackPurchaseEvent(
                            payload_meta,
                            payload_google,
                            values
                        );

                        //add provider to the list of communicable users. CURRENTLY ADDS MAYLIN C.
                        await addProviderToPatientRelationship(
                            session_id,
                            '24138d35-e26f-4113-bcd9-7f275c4f9a47'
                        );

                        if (
                            !(searchParams.get('id_test') ===
                                AB_TESTS_IDS.WL_SHOW_ID_AFTER_CHECKOUT) 
                        ) {
                            const { license, selfie, name, gender } =
                                await getIDVerificationData(session_id);

                            if (!license || !selfie) {
                                await createUserStatusTagWAction(
                                    StatusTag.IDDocs,
                                    currentOrderId.toString(),
                                    StatusTagAction.INSERT,
                                    session_id,
                                    'Patient submitted an order without verifying their id',
                                    'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                                    [StatusTag.IDDocs]
                                );
                            } else {
                                await createUserStatusTagWAction(
                                    StatusTag.Review,
                                    currentOrderId.toString(),
                                    StatusTagAction.INSERT,
                                    session_id,
                                    'New Order to review',
                                    'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                                    [StatusTag.Review]
                                );
                            }
                        }
                        await addProviderToPatientRelationship(
                            session_id,
                            'da5b213d-7676-4792-bc73-11151d0da4e6'
                        );

                        const payload_mixpanel = {
                            value: discountedPrice,
                            order_id: currentOrderId,
                            product_name: product_data.product_href,
                            subscriptionType: product_data.subscriptionType,
                        };

                        sendMixpanelRequest({
                            event_name: ORDER_RECEIVED,
                            user_id: session_id,
                            payload: payload_mixpanel,
                        });

                        const { data, error } = await checkMixpanelEventFired(
                            session_id,
                            CHECKOUT_COMPLETED,
                            product_href
                        );

                        // if (!data && isAdvertisedProduct(product_href)) {
                        //     const dateNow = Date.now();
                        //     const insertId = generateUUIDFromStringAndNumber(
                        //         session_id,
                        //         CHECKOUT_COMPLETED,
                        //         dateNow,
                        //     );

                        //     const mixpanel_payload = {
                        //         event: CHECKOUT_COMPLETED,
                        //         properties: {
                        //             distinct_id: session_id,
                        //             time: dateNow,
                        //             $insert_id: insertId,
                        //             product_name: product_href,
                        //         },
                        //     };

                        //     await trackMixpanelEvent(
                        //         CHECKOUT_COMPLETED,
                        //         mixpanel_payload,
                        //     );
                        //     await createMixpanelEventAudit(
                        //         session_id,
                        //         CHECKOUT_COMPLETED,
                        //         product_href,
                        //     );
                        // }

                        //HEADSUP Checkout/ID swap code for reverting when checkout is before/after ID
                        const query = new URLSearchParams({
                            pn: mapProductToCode(product_data.product_href),
                        });

                        // 2) Conditionally append the wlcad/wldcad param depending on subscriptionType:
                        if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Monthly
                        ) {
                            query.set('wlcad', 'monthly');
                        } else if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Quarterly
                        ) {
                            query.set('wlcad', 'quarterly');
                        } else if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Biannually
                        ) {
                            query.set('wlcad', 'biannually');
                        } else if (
                            product_data.subscriptionType ===
                            SubscriptionCadency.Annually
                        ) {
                            query.set('wlcad', 'annually');
                        }

                        if (
                            (
                            searchParams.get('id_test') === 
                                AB_TESTS_IDS.WL_SHOW_ID_AFTER_CHECKOUT
                            ) 
                        ) {
                            await createNewIDAndSelfieCheckPostCheckoutJob(
                                session_id,
                                String(currentOrderId),
                                product_data.product_href
                            );

                            const nextRoute = getNextIntakeRoute(
                                fullPath,
                                product_href,
                                search
                            );
                            router.push(
                                `/intake/prescriptions/${product_href}/${nextRoute}?${search}&${query.toString()}`
                            );
                        } else {
                            const url = `/intake-complete/confirmation-v3?${query.toString()}&orderId=${currentOrderId}`;
                            router.push(url);
                        }
                    }
                }
            });
    };

    const displayPaymentScreen = () => {
        return (
            <div className='flex flex-col'>
                <BioType
                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !text-primary mt-2`}
                >
                    Credit or debit card
                </BioType>

                {/* <ExpressCheckoutElement
                    onConfirm={() => {
                        confirmApplePay();
                    }}
                    options={{
                        buttonType: {
                            applePay: 'check-out',
                        },
                        buttonTheme: {
                            applePay: 'white-outline',
                        },
                        buttonHeight: 55,
                    }}
                /> */}

                {/** Stripe Payment Information Collection Box Location. */}
                <div className='p-4 rounded-md mt-2 border-solid !text-[#C4C4C4]'>
                    {/* <div className='mt-2'> */}
                    {/* <PaymentElement
                        id='payment-element'
                        options={{
                            business: { name: 'BIOVERSE' },
                            fields: {
                                billingDetails: {
                                    address: {
                                        postalCode: 'never',
                                        country: 'never',
                                    },
                                },
                            },
                        }}
                    /> */}

                    <CardElement
                        id='card-element'
                        options={{
                            hidePostalCode: true,
                            style: {
                                base: {
                                    color: '#32325d',
                                    fontSmoothing: 'antialiased',
                                    fontSize: '16px',
                                    '::placeholder': {
                                        color: '#666666',
                                    },
                                    // Add padding
                                    padding: '12px 20px', // Example padding, adjust as needed
                                    // Add border
                                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                                },
                                invalid: {
                                    color: '#fa755a',
                                    iconColor: '#fa755a',
                                },
                                complete: {
                                    color: '286BA2',
                                },
                            },
                        }}
                    />
                </div>

                {applePayVisible && (
                    <div className='flex flex-row mt-2 items-center gap-1'>
                        <HorizontalDivider
                            backgroundColor={'gray'}
                            height={1}
                        />
                        <BioType className='it-body text-gray-500'>or</BioType>
                        <HorizontalDivider
                            backgroundColor={'gray'}
                            height={1}
                        />
                    </div>
                )}

                <div className='flex flex-col mt-2'>
                    <ExpressCheckoutElement
                        onConfirm={() => {
                            confirmApplePay();
                        }}
                        options={{
                            buttonType: {
                                applePay: 'plain',
                            },
                            buttonTheme: {
                                applePay: 'white-outline',
                            },
                            buttonHeight: 55,
                        }}
                        onReady={(ev: any) => {
                            if (ev.availablePaymentMethods.applePay) {
                                setApplePayVisible(true);
                            }
                        }}
                    />
                </div>

                <div>
                    {/* <FormControlLabel
                        control={
                            <Checkbox
                                checked={billingSameAsShipping}
                                onChange={handleBillingShippingChange}
                            />
                        }
                        label={
                            <BioType className='body1'>
                                Billing information is the same as shipping
                                information
                            </BioType>
                        }
                    /> */}

                    <div className='my-2'>
                        {!billingSameAsShipping && (
                            <div className='w-full flex flex-col gap-y-4'>
                                <FormControl sx={{ marginTop: '20px' }}>
                                    <InputLabel htmlFor='name'>Name</InputLabel>
                                    <OutlinedInput
                                        label='Name'
                                        id='name'
                                        value={name}
                                        required
                                        onChange={(val) => {
                                            setName(val.target.value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                addressLineOne: '',
                                            }));
                                        }}
                                    />
                                    {errors.addressLineOne && (
                                        <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                            {errors.addressLineOne}
                                        </BioType>
                                    )}
                                </FormControl>
                                <FormControl sx={{}}>
                                    <InputLabel htmlFor='address1'>
                                        Street Address
                                    </InputLabel>
                                    <OutlinedInput
                                        label='Street Address'
                                        id='address1'
                                        value={addressLineOne}
                                        required
                                        onChange={(val) => {
                                            setAddressLineOne(val.target.value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                addressLineOne: '',
                                            }));
                                        }}
                                    />
                                    {errors.addressLineOne && (
                                        <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                            {errors.addressLineOne}
                                        </BioType>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor='address2'>
                                        Apt, suite, unit
                                    </InputLabel>
                                    <OutlinedInput
                                        label='Apt, suite, unit'
                                        id='address2'
                                        required
                                        placeholder='Apt, suite, unit, building (optional)*'
                                        value={addressLineTwo}
                                        onChange={(val) => {
                                            setAddressLineTwo(val.target.value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                addressLineTwo: '',
                                            }));
                                        }}
                                    />
                                    {errors.addressLineTwo && (
                                        <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                            {errors.addressLineTwo}
                                        </BioType>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor='city'>City</InputLabel>
                                    <OutlinedInput
                                        label='City'
                                        id='city'
                                        required
                                        placeholder='City*'
                                        value={city}
                                        onChange={(val) => {
                                            setCity(val.target.value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                city: '',
                                            }));
                                        }}
                                    />
                                    {errors.city && (
                                        <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                            {errors.city}
                                        </BioType>
                                    )}
                                </FormControl>
                                <div className='flex flex-col md:flex-row md:gap-x-4 gap-y-4'>
                                    <FormControl
                                        className='flex-1'
                                        variant='outlined'
                                    >
                                        <InputLabel
                                            id='state-label'
                                            className=''
                                        >
                                            State
                                        </InputLabel>
                                        <Select
                                            labelId='state-label'
                                            label='State'
                                            id='state'
                                            required
                                            value={stateAddress}
                                            onChange={(val) => {
                                                setStateAddress(
                                                    val.target.value
                                                );
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    stateAddress: '',
                                                }));
                                            }}
                                            placeholder='State'
                                            sx={{ height: '58px' }}
                                        >
                                            {statesArray.map((stateName) => (
                                                <MenuItem
                                                    key={stateName}
                                                    value={stateName}
                                                >
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
                                        <InputLabel htmlFor='zip'>
                                            Zip Code
                                        </InputLabel>
                                        <OutlinedInput
                                            label='Zip Code'
                                            id='zip'
                                            required
                                            sx={{ height: '58px' }}
                                            placeholder='Zip Code*'
                                            value={zip}
                                            onChange={(val) => {
                                                if (
                                                    val.target.value.length <= 5
                                                ) {
                                                    setZip(val.target.value);
                                                }
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    zip: '',
                                                }));
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
                        )}
                    </div>
                </div>
                {/* Pull through swr

                wl-goal-transition

                swr code that i should copy
                
                */}

                <div className='flex mt-2 md:mt-6 flex-col gap-2 justify-end'>
                    <BioType className='body1 text-red-500'>
                        {errorMessage && errorMessage}
                    </BioType>
                    <Button
                        fullWidth
                        variant='contained'
                        onClick={handleSubmit}
                        disabled={isLoading}
                        sx={{
                            height: {
                                xs: '11.6vw',
                                sm: '84px',
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                            },
                        }}
                    >
                        {isLoading ? (
                            <CircularIndeterminate />
                        ) : (
                            <>Pay $0 DUE TODAY</>
                        )}
                    </Button>
                </div>
                {renderTermsAndConditions(product_data.subscriptionType)}
                <div className='flex flex-row gap-2 mt-2 items-center justify-center'>
                    <div>
                        <Image
                            src={'/img/checkout/visa-dark.png'}
                            alt={''}
                            width={40.8}
                            height={25.5}
                            unoptimized
                        />
                    </div>
                    <div>
                        <Image
                            src={'/img/checkout/mc-light.png'}
                            alt={''}
                            width={40.8}
                            height={25.5}
                            unoptimized
                        />
                    </div>
                    <div>
                        <Image
                            src={'/img/checkout/amex-dark.png'}
                            alt={''}
                            width={40.8}
                            height={25.5}
                            unoptimized
                        />
                    </div>
                    <div>
                        <Image
                            src={'/img/checkout/discover-dark.png'}
                            alt={''}
                            width={40.8}
                            height={25.5}
                            unoptimized
                        />
                    </div>
                </div>
                <BioType
                    className={`${INTAKE_PAGE_BODY_TAILWIND} !text-[16px] text-[#666666] mt-[12px] mb-[10px]`}
                >
                    {displayCitation()}
                </BioType>
            </div>
        );
    };

    if (showLoadingScreen) {
        return (
            <div className='flex flex-col w-full mt-10 gap-y-4'>
                <div className='flex justify-center'>
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress size={30} />
                    </Box>
                </div>
                <div className='flex justify-center'>
                    <BioType className='h3 text-[#286BA2]'>One moment</BioType>
                </div>
                <div className='flex justify-center'>
                    <BioType className='body1'>
                        We’re searching our network for your medical provider
                    </BioType>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className={`flex justify-center overflow-hidden animate-slideRight mx-auto`}
            >
                <div className='flex justify-center w-full md:mx-0'>
                    <div className='flex flex-col gap-4 max-w-[456px]'>
                        <div className='flex w-full flex-col gap-4'>
                            <WLOrderSummary
                                user_name={userProfileData.first_name}
                                wl_goal={weightlossGoal}
                                product_name={productInformationData.name}
                                variantNumber={product_data.variant}
                                product_data={product_data}
                                priceData={priceData}
                                pricingStructure={pricingStructure}
                                selectedDose={selectedDose}
                                variantPriceData={variantPriceData}
                            />
                        </div>
                        <div className='col-span-6 md:col-span-6'>
                            {displayPaymentScreen()}
                        </div>
                        {/**
                         * Below is decision making for mobile rendering.
                         * If the screen is NOT a mobile screen it will render this information.
                         */}
                    </div>
                </div>
            </div>
        </>
    );
}

function CircularIndeterminate() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress size={20} />
        </Box>
    );
}

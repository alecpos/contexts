'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import {
    getActiveVariantsForProduct,
    ProductVariantRecord,
} from '@/app/utils/database/controller/product_variants/product_variants';
import {
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

interface ProductPurchaseMenuProps {
    product_href: string;
}

export default function PDPProductPurchaseMenu({
    product_href,
}: ProductPurchaseMenuProps) {
    const router = useRouter();

    const { data } = useSWR(`${product_href}-variants`, () =>
        getActiveVariantsForProduct(product_href),
    );
    const [cadenceArray, setCadenceArray] = useState<string[] | undefined>(
        undefined,
    );
    const [currentRecord, setCurrentRecord] = useState<
        ProductVariantRecord | undefined
    >(undefined);

    const [variantArray, setVariantArray] = useState<
        ProductVariantRecord[] | undefined
    >(undefined);

    const [saveCheckbox, setSaveCheckbox] = useState<boolean>(false);

    useEffect(() => {
        if (data?.data) {
            setVariantArray(data?.data);
            const nonOneTimeIndex = data.data.findIndex(
                (variant) => variant.cadence !== 'one_time',
            );
            const uniqueCadences = [
                ...new Set(data.data.map((variant) => variant.cadence)),
            ];
            setCadenceArray(uniqueCadences);

            setCurrentRecord(data.data[nonOneTimeIndex]);
        }
    }, [data]);

    if (!variantArray) {
        return <></>;
    }

    /**
     * Util functions to determine values and convert display strings
     */

    const isGLP1 = [
        PRODUCT_HREF.SEMAGLUTIDE,
        PRODUCT_HREF.TIRZEPATIDE,
    ].includes(product_href as PRODUCT_HREF);

    function formatNumberWithComma(number: number): string {
        const numberString = number.toString();
        if (numberString.length > 3) {
            // Insert a comma at the appropriate position for numbers greater than 999
            return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return numberString;
    }

    const productPriceAdjustment = (() => {
        switch (product_href) {
            case 'tirzepatide':
                return 50;
            case 'semaglutide':
                return 70;
            default:
                return 100;
        }
    })();

    const isWeightLossProduct = (name: string) => {
        const weightloss_products = [
            'ozempic',
            'wegovy',
            'semaglutide',
            'tirzepatide',
            'mounjaro',
        ];

        return weightloss_products.includes(name);
    };

    const determineCadenceOptions = (): {
        higherCadence: string;
        lowerCadence: string;
    } => {
        let high;
        let low;

        if (cadenceArray?.includes('one_time')) {
            low = 'one_time';
            high = cadenceArray.find((cadence) => cadence !== 'one_time') ?? '';
        } else {
            high = 'quarterly';
            low = 'monthly';
        }

        return { higherCadence: high, lowerCadence: low };
    };

    /**
     * Handler Functions
     */

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        /**
         * If the Switch is 'ON' then it is on the higher value between monthly, or quarterly.
         */
        const isSwitchedOn = event.target.checked;

        const { higherCadence, lowerCadence } = determineCadenceOptions();

        let newSubscriptionType = !isSwitchedOn ? lowerCadence : higherCadence;

        const newRecord = variantArray.find(
            (variant_record) => variant_record.cadence == newSubscriptionType,
        );

        console.log(newRecord);

        setCurrentRecord(newRecord);
    };

    const handleCheckboxChange = (event: any) => {
        if (saveCheckbox) {
            return;
        }
        setSaveCheckbox(true);
    };

    const handleSelectCadenceChange = (event: any) => {
        const newCadence = event.target.value;
        const newVariant = variantArray.find(
            (variant) => variant.cadence === newCadence,
        );

        setCurrentRecord(newVariant);
    };

    const beginIntake = () => {
        const variantLower = currentRecord?.variant?.toLowerCase() ?? undefined;

        const coupon_string =
            currentRecord?.cadence !== 'one_time' && saveCheckbox
                ? '&sd=23c'
                : '';

        router.push(
            `/intake/middlelayer/${product_href}?pvn=${currentRecord?.variant_index}&st=${currentRecord?.cadence}&pvt=${variantLower}${coupon_string}`,
        );
    };

    /**
     * Display functions to render front-end TSX
     */

    const displayBulletsJoined = () => {
        return currentRecord?.price_data.subcription_includes_bullets.join(' '); // Join with a space
    };

    const displayPrice = () => {
        if (!isGLP1) {
            return currentRecord?.cadence === 'quarterly'
                ? currentRecord.price_data.quarterly_display_price!
                : currentRecord?.price_data.custom_display_price != undefined
                ? currentRecord.price_data.custom_display_price
                : '$' +
                  (product_href === 'ozempic' ||
                  product_href === 'wegovy' ||
                  product_href === 'mounjaro' ||
                  product_href === 'semaglutide' ||
                  product_href === 'tirzepatide'
                      ? formatNumberWithComma(
                            currentRecord?.price_data.product_price -
                                productPriceAdjustment,
                        )
                      : formatNumberWithComma(
                            currentRecord?.price_data.product_price,
                        )) +
                  '.00'; /** product price contains price for all */
        }
        return currentRecord?.price_data?.price_text;
    };

    const displayButtonText = () => {
        if (isGLP1) {
            return (
                <BioType className="flex flex-row justify-center items-center">
                    GET STARTED
                </BioType>
            );
        }

        return (
            <BioType className="flex flex-row justify-center items-center">
                START YOUR FREE VISIT <KeyboardArrowRightOutlinedIcon />
            </BioType>
        );
    };

    return (
        <>
            <div className="flex w-full p-0 flex-col items-start gap-2 mt-4">
                <div
                    id="includeBulletContainer"
                    className={`flex flex-col mb-2`}
                >
                    <div className="body1bold">
                        {currentRecord?.cadence === 'one_time'
                            ? 'INCLUDES'
                            : 'SUBSCRIPTION INCLUDES'}
                    </div>

                    <BioType className={`body1 mt-1`}>
                        {displayBulletsJoined()}
                    </BioType>
                </div>

                <BioType className="body1 mt-1">
                    {product_href === 'ozempic' ||
                    product_href === 'wegovy' ||
                    product_href === 'mounjaro'
                        ? ''
                        : 'Actual product packaging may appear differently than shown.'}
                </BioType>

                <div
                    id="priceDisplayContainer"
                    className={`inline-flex flex-col items-start gap-0 relative flex-[0_0_auto] mb-2 body1`}
                >
                    <BioType className="h4 text-[28px]">
                        {displayPrice()}
                    </BioType>

                    {currentRecord?.price_data.blue_display_text && !isGLP1 && (
                        <BioType
                            className="savings text-primary"
                            id="blue-display-text"
                        >
                            {currentRecord.price_data.blue_display_text}
                        </BioType>
                    )}

                    {currentRecord?.price_data.gray_display_text && !isGLP1 && (
                        <BioType
                            className="body1 text-[#1b1b1b99]"
                            id="gray-display-text"
                        >
                            {currentRecord.price_data.gray_display_text}
                        </BioType>
                    )}
                </div>

                {/**
                 * Cadence selection switch
                 */}
                {cadenceArray?.includes('monthly') &&
                cadenceArray.includes('quarterly') &&
                !cadenceArray.includes('one_time') ? (
                    //if there is only monthly / quarterly
                    <div id="subscriptionSwitchContainer" className={`flex`}>
                        <FormLabel className="body1 flex flex-center self-center">
                            <BioType
                                className={
                                    currentRecord?.cadence === 'monthly'
                                        ? 'body1'
                                        : 'body1  text-[#1B1B1B61]'
                                }
                            >
                                Order Monthly
                            </BioType>
                        </FormLabel>
                        <Switch
                            className="flex flex-center self-center"
                            checked={currentRecord?.cadence === 'quarterly'}
                            onChange={handleSwitchChange}
                        />
                        <FormLabel className="flex flex-col text-center self-center">
                            <BioType
                                className={
                                    currentRecord?.cadence === 'quarterly'
                                        ? 'body1'
                                        : 'body1 text-[#1B1B1B61]'
                                }
                            >
                                Order Quarterly (Save)
                            </BioType>
                        </FormLabel>
                    </div>
                ) : (
                    <>
                        {cadenceArray?.includes('one_time') && (
                            <div
                                id="subscriptionSwitchContainer"
                                className={`flex`}
                            >
                                <FormLabel className="body1 flex flex-center self-center">
                                    <BioType
                                        className={
                                            currentRecord?.cadence !==
                                            'one_time'
                                                ? 'body1 text-[#1B1B1B61]'
                                                : `body1`
                                        }
                                    >
                                        One Time
                                    </BioType>
                                </FormLabel>
                                <Switch
                                    className="flex flex-center self-center"
                                    checked={
                                        currentRecord?.cadence !== 'one_time'
                                    }
                                    onChange={handleSwitchChange}
                                />
                                <FormLabel className="flex flex-col text-center self-center">
                                    <BioType
                                        className={
                                            currentRecord?.cadence !==
                                            'one_time'
                                                ? `body1`
                                                : 'body1 text-[#1B1B1B61]'
                                        }
                                    >
                                        Subscribe + Save
                                    </BioType>
                                </FormLabel>
                            </div>
                        )}
                    </>
                )}
                {/**
                 * Discount Checkbox
                 */}
                {['monthly', 'quarterly'].includes(
                    currentRecord?.cadence ?? '',
                ) &&
                    !isWeightLossProduct(product_href) &&
                    product_href !== PRODUCT_HREF.TRETINOIN && (
                        <div className="flex items-center">
                            <Checkbox
                                checked={saveCheckbox}
                                onChange={handleCheckboxChange}
                            />
                            <BioType
                                className={`body1 text-[15px] ${
                                    saveCheckbox
                                        ? 'text-[#286BA2]'
                                        : 'text-[#1b1b1b] opacity-60'
                                }`}
                            >
                                {saveCheckbox ? (
                                    <>
                                        $
                                        {currentRecord?.price_data
                                            ?.discount_price?.discount_amount
                                            ? currentRecord.price_data.discount_price.discount_amount.toFixed(
                                                  2,
                                              )
                                            : 0}{' '}
                                        coupon applied at checkout on your first
                                        Subscribe + Save order.
                                    </>
                                ) : (
                                    <>
                                        Limited Time: Save an extra $
                                        {currentRecord?.price_data
                                            ?.discount_price.discount_amount
                                            ? currentRecord.price_data?.discount_price.discount_amount.toFixed(
                                                  2,
                                              )
                                            : 0}{' '}
                                        on your first Subscribe + Save order.
                                    </>
                                )}
                            </BioType>
                        </div>
                    )}

                {!isGLP1 && currentRecord?.cadence !== 'one_time' && (
                    <div
                        id="subscriptionSelectContainer"
                        className={`flex flex-col md:w-[18.3vw] min-w-[263px] items-start gap-[12px] relative self-stretch w-full flex-[0_0_auto] mt-2`}
                    >
                        <FormControl fullWidth>
                            <InputLabel
                                id="subscription-label"
                                className="bg-white"
                            >
                                Subscription Frequency
                            </InputLabel>
                            <Select
                                labelId="subscription-label"
                                id="subscription-select"
                                value={currentRecord?.cadence}
                                onChange={handleSelectCadenceChange}
                            >
                                {cadenceArray?.map((option, index) => {
                                    if (option === 'one_time') {
                                        return null;
                                    }

                                    return (
                                        <MenuItem value={option} key={index}>
                                            {option.charAt(0).toUpperCase() +
                                                option.slice(1)}{' '}
                                            (Cancel anytime)
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </div>
                )}

                <div
                    id="startButtonContainer"
                    className={`w-full md:w-[18.3vw] min-w-[263px] mt-2`}
                >
                    <Button
                        onClick={beginIntake}
                        variant="contained"
                        style={{ height: 54 }}
                        fullWidth
                    >
                        {displayButtonText()}
                    </Button>
                </div>
            </div>
        </>
    );
}

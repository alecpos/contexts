'use client';
import { useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
} from '@mui/material';
import styles from './productpurchase.module.css';
import { useRouter } from 'next/navigation';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    className1: string;
    data: any;
}

interface PurchaseForm {
    itemId: string;
    variant: string;
    subscription: boolean;
    price: number;
}

/**
 *
 * Displays Price, discounted price if monthly option is selected.
 * Hosues all buttons and menu items for item selection.
 *
 */
export default function ProductPurchaseMenu({ className1, data }: Props) {
    const [variant, setVariant] = useState<string>('');
    const [isSubscription, setIsSubscription] = useState<boolean>(true);
    const [subscriptionTypeText, setSubscriptionTypeText] =
        useState<string>('');
    const [variantIndex, setVariantIndex] = useState<number>(0);
    const [subscriptionIndex, setSubscriptionIndex] = useState<number>(1);
    const [dosageIndex, setDosageIndex] = useState<number>(0);
    const [displayPrice, setDisplayPrice] = useState<number>(0);
    const [originalPrice, setOriginalPrice] = useState<number>(0);
    const [savingsAmount, setSavingsAmount] = useState<number>(0);
    const [dosageTypeText, setDosageTypeText] = useState<string>('');

    useEffect(() => {
        setDisplayPrice(
            data.price_variant_subscription_data.product.variants[variantIndex]
                .dosages[dosageIndex].subscriptionTypes[subscriptionIndex]
                .details.price
        );
        setOriginalPrice(
            data.price_variant_subscription_data.product.variants[variantIndex]
                .dosages[dosageIndex].subscriptionTypes[subscriptionIndex]
                .details.originalPrice
        );
        setVariant(
            data.price_variant_subscription_data.product.variants[variantIndex]
                .name
        );
        setSubscriptionTypeText(
            data.price_variant_subscription_data.product.variants[variantIndex]
                .dosages[dosageIndex].subscriptionTypes[subscriptionIndex].type
        );
        setDosageTypeText(
            data.price_variant_subscription_data.product.variants[variantIndex]
                .dosages[dosageIndex].name
        );
    }, [
        variantIndex,
        subscriptionIndex,
        dosageIndex,
        data.price_variant_subscription_data.product.variants,
    ]);

    useEffect(() => {
        setSavingsAmount(originalPrice - displayPrice);
    }, [originalPrice, displayPrice]);

    const router = useRouter();

    const handleVariantChange = (event: SelectChangeEvent) => {
        const selectedVariant = event.target.value as string; // Assuming value is the variant name

        // Find the index of the selected variant in the variants array
        const index =
            data.price_variant_subscription_data.product.variants.findIndex(
                (v: any) => v.name === selectedVariant
            );

        // Set the state for both variant name and index
        setVariant(selectedVariant);
        setVariantIndex(index);
    };

    const handleDosageChange = (event: SelectChangeEvent) => {
        const selectedDosage = event.target.value as string;

        // Find the index of the selected dosage in the dosages array
        const index = data.price_variant_subscription_data.product.variants[
            variantIndex
        ].dosages.findIndex((dosage: any) => dosage.name === selectedDosage);

        // Set the state for both dosage name and index
        setDosageTypeText(selectedDosage);
        setDosageIndex(index);
    };

    const handleSwitchChange = () => {
        setIsSubscription((prevSubscription) => !prevSubscription);
        if (isSubscription) {
            setSubscriptionIndex(0);
        } else {
            setSubscriptionIndex(1);
        }
    };

    const handleSubscriptionTypeChange = (event: SelectChangeEvent) => {
        const selectedSubscriptionType = event.target.value as string;

        // Find the index of the selected subscription type in the current variant and dosage's subscriptionTypes array
        const index = data.price_variant_subscription_data.product.variants[
            variantIndex
        ].dosages[dosageIndex].subscriptionTypes.findIndex(
            (subscription: any) =>
                subscription.type === selectedSubscriptionType
        );

        // Set the state for both subscription type text and index
        setSubscriptionTypeText(selectedSubscriptionType);
        setSubscriptionIndex(index);
    };

    const beginIntake = () => {
        const variantLower =
            typeof variant === 'string' ? variant.toLowerCase() : '';

        router.push(
            `/intake/middlelayer/${
                data.href
            }?pvn=${variantIndex}&psn=${subscriptionIndex}&st=${subscriptionTypeText.toLowerCase()}&pvt=${variantLower}`
        );
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <>
            <div className={className1}>
                <div className='flex flex-col gap-2 mb-4'>
                    <BioType>
                        Your {isSubscription ? 'subscription' : 'purchase'}{' '}
                        includes:
                    </BioType>

                    <BioType className='body1'>
                        {
                            data.price_variant_subscription_data.product
                                .variants[variantIndex].dosages[dosageIndex]
                                .subscriptionTypes[subscriptionIndex].details
                                .includes
                        }
                    </BioType>
                </div>

                <div className='inline-flex items-center gap-[8px] relative flex-[0_0_auto]'>
                    {/**
                     * Conditional Rendering: Original price is always shown.
                     * Line-through Tailwind CSS applied if subscription is set.
                     */}
                    <BioType className={`${styles.subscriptionCOP}`}>
                        ${originalPrice}
                    </BioType>

                    <BioType className='h4'>${displayPrice}</BioType>

                    <BioType className='savings text-[#FE0808DE]'>
                        Save ${savingsAmount}
                    </BioType>
                </div>

                <div className='flex flex-col items-start gap-[12px] relative self-stretch w-full flex-[0_0_auto]'>
                    {data.price_variant_subscription_data.product.variants[
                        variantIndex
                    ].dosages.length > 1 && (
                        <FormControl fullWidth style={{ gap: 16 }}>
                            <InputLabel id='dosage-label' className='bg-white'>
                                Dosage
                            </InputLabel>
                            <Select
                                labelId='dosage-label'
                                id='dosage-select'
                                value={dosageTypeText}
                                onChange={handleDosageChange}
                            >
                                {data.price_variant_subscription_data.product.variants[
                                    variantIndex
                                ].dosages.map(
                                    (dosageOption: any, index: number) => (
                                        <MenuItem
                                            value={dosageOption.name}
                                            key={index}
                                        >
                                            {capitalizeFirstLetter(
                                                dosageOption.name
                                            )}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    )}

                    {/**
                     *  SUBSCRIPTION OPTION BUTTON
                     */}
                    <div style={{ display: 'flex' }}>
                        <FormLabel className='body1 flex flex-center self-center'>
                            <BioType
                                className={
                                    !isSubscription
                                        ? `${styles.suisSubscriptionbscriptionBoldedFont}`
                                        : 'body1'
                                }
                            >
                                One Time
                            </BioType>
                        </FormLabel>
                        <Switch
                            className='flex flex-center self-center'
                            checked={isSubscription}
                            onChange={handleSwitchChange}
                        />
                        <FormLabel className='flex flex-col text-center self-center'>
                            <BioType
                                className={
                                    isSubscription
                                        ? `${styles.subscriptionBoldedFont}`
                                        : 'body1'
                                }
                            >
                                Subscribe & Save
                            </BioType>
                        </FormLabel>
                    </div>
                    {isSubscription && (
                        <FormControl fullWidth>
                            <InputLabel
                                id='quantity-label'
                                className='bg-white'
                            >
                                Subscription Frequency
                            </InputLabel>
                            <Select
                                labelId='quantity-label'
                                id='quantity-select'
                                value={subscriptionTypeText}
                                onChange={handleSubscriptionTypeChange}
                            >
                                {data.price_variant_subscription_data.product.variants[
                                    variantIndex
                                ].dosages[dosageIndex].subscriptionTypes
                                    .slice(1) // This skips the first subscription type
                                    .map(
                                        (
                                            subscriptionOption: any,
                                            index: number
                                        ) => (
                                            // Since we're skipping the first element, the index will be off by one,
                                            // so we need to add 1 to get the correct index.
                                            <MenuItem
                                                value={subscriptionOption.type}
                                                key={index + 1}
                                            >
                                                {capitalizeFirstLetter(
                                                    subscriptionOption.type
                                                )}
                                            </MenuItem>
                                        )
                                    )}
                            </Select>
                        </FormControl>
                    )}

                    {/**
                     * Variant Selection Options
                     */}
                    {data.price_variant_subscription_data.product.variants
                        .length > 1 && (
                        <FormControl fullWidth style={{ gap: 16 }}>
                            <InputLabel id='variant-label' className='bg-white'>
                                Prescription Information
                            </InputLabel>
                            <Select
                                labelId='variant-label'
                                id='variant-select'
                                value={variant}
                                onChange={handleVariantChange}
                            >
                                {/**
                                 * In below code we are passing the index value of the variant when
                                 * the user changes the selection.
                                 * There are some hoops to jump through here: state:number >> value string >> event.value:string >> cast:number
                                 * Select can only take strings as values,
                                 *  but we are TS guaranteed to not get type errors.
                                 */}
                                {data.price_variant_subscription_data.product.variants.map(
                                    (variantOption: any, index: number) => (
                                        <MenuItem
                                            value={variantOption.name}
                                            key={index}
                                        >
                                            {variantOption.name}
                                        </MenuItem>
                                    )
                                )}
                                ;
                            </Select>
                        </FormControl>
                    )}
                </div>
                <Button
                    onClick={beginIntake}
                    variant='contained'
                    style={{ height: 54 }}
                    fullWidth
                >
                    START YOUR FREE VISIT
                </Button>
            </div>
        </>
    );
}

'use client';

import { useEffect, useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
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
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    priceData: ProductPriceRecord[];
    productHref: string;
    data: any;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductPurchaseMobileDrawerMenuNew({
    priceData,
    productHref,
    data,
    setIsDrawerOpen,
}: Props) {
    //state variables
    const [variantIndex, setVariantIndex] = useState<number>(0);
    const [subscriptionType, setSubscriptionType] = useState<string>('');
    const [variantName, setVariantName] = useState<string>('');
    const [originalPrice, setOriginalPrice] = useState<string>(); //The Price to be displayed largest and in black

    const [hasOneTime, setHasOneTime] = useState<boolean>(false); //determines whether product has a one time purchase option

    //router hook
    const router = useRouter();

    //use effect hooks
    useEffect(() => {
        //on initialization & change in variant, use variantIndex (default 0) to set the subscription Type, variantName, marketPrice, originalPrice, & savedAmount

        //deliberately using if statements since we can take the first non-null jsonb field value only.

        if (priceData[variantIndex].monthly) {
            setSubscriptionType('monthly');
            setPriceNumberDataWithSubscription('monthly');
        } else if (priceData[variantIndex].quarterly) {
            setSubscriptionType('quarterly');
            setPriceNumberDataWithSubscription('quarterly');
        } else if (priceData[variantIndex].one_time !== null) {
            setSubscriptionType('one_time');
            //setting data with 'one_time' text since react does not update states until the end of useEffect
            setPriceNumberDataWithSubscription('one_time');
            //Only need to set one time true here since if this is false it is already false
            setHasOneTime(true);
        }

        setVariantName(priceData[variantIndex].variant);
    }, [variantIndex]);

    const setPriceNumberDataWithSubscription = (subscriptionType: string) => {
        //use switch case to handle different subscription types since they are in different columns.
        switch (subscriptionType) {
            case 'one_time':
                setOriginalPrice(
                    priceData[variantIndex].one_time?.custom_display_price
                        ? priceData[variantIndex].one_time?.custom_display_price
                        : '$' +
                              String(
                                  priceData[variantIndex].one_time
                                      ?.product_price
                              )
                );
                break;

            case 'monthly':
                setOriginalPrice(
                    priceData[variantIndex].monthly?.custom_display_price
                        ? priceData[variantIndex].monthly?.custom_display_price
                        : '$' +
                              String(
                                  priceData[variantIndex].monthly?.product_price
                              )
                );
                break;

            case 'quarterly':
                setOriginalPrice(
                    String(
                        priceData[variantIndex].quarterly
                            ?.quarterly_display_price
                    )
                );
                break;

            default:
                break;
        }
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Check the new state of the switch
        const isSwitchedOn = event.target.checked;

        if (isSwitchedOn) {
            // If the switch is turned on, select the next available subscription type
            // This assumes 'monthly' or 'quarterly' are the options after 'one_time'
            if (priceData[variantIndex].monthly) {
                setSubscriptionType('monthly');
                setPriceNumberDataWithSubscription('monthly');
            } else if (priceData[variantIndex].quarterly) {
                setSubscriptionType('quarterly');
                setPriceNumberDataWithSubscription('quarterly');
            }
        } else {
            // If the switch is turned off, set the subscription type to 'one_time'
            setSubscriptionType('one_time');
            setPriceNumberDataWithSubscription('one_time');
        }
    };

    const handleSubscriptionTypeChange = (event: SelectChangeEvent<string>) => {
        const newSubscriptionType = event.target.value;
        setSubscriptionType(newSubscriptionType);

        // If additional logic is needed based on the new subscription type,
        // you can call it here, e.g., updating prices or other related states
        setPriceNumberDataWithSubscription(newSubscriptionType);
    };

    const handleVariantChange = (event: SelectChangeEvent<string>) => {
        const newVariant = event.target.value as string;
        setVariantName(newVariant);

        const newIndex = variants.findIndex(
            (variant) => variant === newVariant
        );
        setVariantIndex(newIndex);
    };

    const beginIntake = () => {
        const variantLower = variantName.toLowerCase();

        router.push(
            `/intake/middlelayer/${productHref}?pvn=${variantIndex}&st=${subscriptionType.toLowerCase()}&pvt=${variantLower}`
        );
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const subscriptionOptions = Object.entries(priceData[variantIndex])
        .filter(
            ([key, value]) =>
                value !== null &&
                (key === 'monthly' || key === 'quarterly' || key === 'one_time')
        )
        .map(([key]) => key);

    const variants: string[] = Array.from(
        new Set(priceData.map((item: { variant: any }) => item.variant))
    );

    // const productPurchaseMenuContainerClass = "flex w-full md:w-[18.3vw] p-0 flex-col items-start gap-[1.11vw]";
    const productPurchaseMenuContainerClass =
        'flex w-full p-0 flex-col items-start gap-[1.11vw]';
    const includeBulletContainerClass = 'flex flex-col gap-2 mb-4';
    const includeBulletTypographyClass = 'body1';
    const priceDisplayContainerClass =
        'inline-flex items-center gap-[8px] relative flex-[0_0_auto]';
    const subscriptionSwitchContainerClass = 'flex';
    const oneTimeSwitchClass = '';
    const switchBoldedFontClass = '';
    const marketPriceClass =
        'text-gray-500 text-sm font-normal leading-6 tracking-wider line-through';
    const subscriptionSelectContainerClass =
        'flex flex-col md:w-[18.3vw] min-w-[263px] items-start gap-[12px] relative self-stretch w-full flex-[0_0_auto]';
    const variantSelectContainerClass =
        'flex flex-col md:w-[18.3vw] min-w-[263px] items-start gap-[12px] relative self-stretch w-full flex-[0_0_auto]';
    const startButtonContainerClass = 'w-full md:w-[18.3vw] min-w-[263px]';

    return (
        <div className='px-6 mt-4 flex flex-col gap-4'>
            <div
                className='flex self-end'
                onClick={() => setIsDrawerOpen(false)}
            >
                <BioType className='body1 flex flex-row justify-center items-center'>
                    Close <CloseIcon fontSize='small' className='flex' />
                </BioType>
            </div>
            <div className='flex flex-row'>
                <div
                    className={`relative w-full aspect-square`}
                    style={{
                        position: 'relative',
                        width: '13%',
                        height: '13%',
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${data.image_ref[0]}`}
                        fill
                        objectFit='cover'
                        alt={`Product Image ${data.image_ref}`}
                        quality={100}
                        priority
                        unoptimized
                    />
                </div>
                <div className='flex flex-col justify-center w-1/2'>
                    <div className='flex text-sm ml-3 items-center whitespace-nowrap'>
                        <BioType className='mr-1'>{data.name}</BioType>
                        <BioType className='text-[#767676]'>
                            <span className='mr-2'>|</span>
                            {originalPrice}
                        </BioType>
                    </div>
                    <div className='flex text-sm ml-3 text-[#767676] whitespace-nowrap'>
                        <BioType className='mr-1 '>{variantName}</BioType>
                        <BioType className=''>
                            <span className='mr-2'>|</span>Subscribe + Save
                        </BioType>
                    </div>
                </div>
            </div>
            {subscriptionType && (
                <>
                    <div
                        id='subscriptionSelectContainer'
                        className={subscriptionSelectContainerClass}
                    >
                        <FormControl fullWidth>
                            <InputLabel
                                id='subscription-label'
                                className='bg-white'
                            >
                                Subscription Frequency
                            </InputLabel>
                            <Select
                                labelId='subscription-label'
                                id='subscription-select'
                                value={subscriptionType}
                                onChange={handleSubscriptionTypeChange}
                            >
                                {subscriptionOptions.map((option, index) => (
                                    <MenuItem value={option} key={index}>
                                        {capitalizeFirstLetter(
                                            option.replace('_', ' ')
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div
                        id='variantSelectContainer'
                        className={variantSelectContainerClass}
                    >
                        <FormControl fullWidth style={{ gap: 16 }}>
                            <InputLabel id='variant-label' className='bg-white'>
                                Variant
                            </InputLabel>
                            <Select
                                labelId='variant-label'
                                id='variant-select'
                                value={variantName}
                                onChange={handleVariantChange}
                            >
                                {variants.map(
                                    (variant: string, index: number) => (
                                        <MenuItem value={variant} key={index}>
                                            {variant}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </div>

                    <div
                        id='startButtonContainer'
                        className={startButtonContainerClass}
                    >
                        <Button
                            onClick={beginIntake}
                            variant='contained'
                            style={{ height: 40 }}
                            fullWidth
                        >
                            START YOUR FREE VISIT
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

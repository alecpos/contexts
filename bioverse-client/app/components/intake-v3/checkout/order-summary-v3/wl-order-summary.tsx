import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import WLProductItemDisplay from './wl-product-item-display';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface Props {
    wl_goal: any;
    user_name: string;
    product_name: string;
    variantNumber: number;
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    priceData: any;
    pricingStructure?: any;
    selectedDose: string;
    variantPriceData: Partial<ProductVariantRecord>;
    userProfileData: any;
}

export default function WLOrderSummary({
    wl_goal,
    user_name,
    product_name,
    variantNumber,
    product_data,
    priceData,
    pricingStructure,
    selectedDose,
    variantPriceData,
    userProfileData,
}: Props) {
    const searchParams = useSearchParams();
    const checkoutTestParam: string | null | undefined = searchParams.get('checkout_test');
    const banner_image_ref =
        userProfileData.sex_at_birth === 'Male'
            ? 'wl-checkout-male-doctor.png'
            : 'purple_banner.png';

    const subscriptionTypeToMonthsMap = {
        'monthly': '1 month',
        'quarterly': '3 months',
        'pentamonthly': '5 months',
        'biannually': '6 months',
        'annually': '12 months',
    }
    const renderTitleSentence = () => {
        const monthsString = subscriptionTypeToMonthsMap[product_data?.subscriptionType as keyof typeof subscriptionTypeToMonthsMap];

        if (checkoutTestParam === '1' && monthsString)  {
            return (
                <>
                    <BioType
                        className={`inter-h5-question-header mt-[1rem] md:mt-[10px] mb-[5px] md:mb-0`}
                    >
                        {`Your discount for ${monthsString} of medication has been applied - complete checkout today to secure your discount.`}
                    </BioType>
                    <BioType
                        className={`inter_body_medium_regular text-weak mt-0 md:mt-[5px] mb-[6px]`}
                    >
                        You won&apos;t be charged unless your provider approves your Rx request, and we&apos;re ready to ship it to you.
                    </BioType>
                </>
            );
        }
        return (
            <>
                <BioType
                    className={`inter-h5-question-header mt-0 md:mt-2 mb-1 md:mb-0`}
                >
                    Save your payment details
                </BioType>
                <div className='flex w-full md:max-w-[490px]'>
                    <div className='w-full'>
                        <div className='w-full'>
                            <Image
                                src={`/img/intake/wl/${banner_image_ref}`}
                                alt='product'
                                width={490}
                                height={0}
                                style={{ width: '100%', height: 'auto' }}
                                className='mx-auto'
                                
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
        
            {renderTitleSentence()}

            <div>
                <div
                    className='flex flex-col mx-[0.4px] rounded-lg bg-white'
                    style={{ border: '1px solid #E5E5E5' }}
                >
                    <div className='flex flex-col p-6 md:p-6 gap-6'>
                        <WLProductItemDisplay
                            user_name={user_name}
                            wl_goal={wl_goal}
                            product_name={product_name}
                            variantNumber={variantNumber}
                            product_data={product_data}
                            priceData={priceData}
                            pricingStructure={pricingStructure}
                            variantPriceData={variantPriceData}
                        />
                    </div>
                </div>
                <div className='bg-gradient-to-r from-cyan-200 to-pink-200  w-fit mx-auto text-center rounded-b-lg py-1 px-3'>
                    <BioType className={`inter-h5-regular text-[14px] `}>
                        YOU WON&apos;T BE CHARGED UNTIL PRESCRIBED
                    </BioType>
                </div>
            </div>
        </>
    );
}

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import ShippingFrequencyOption from './shipping-frequency-option';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface SelectShippingFrequencyProps {
    selectedPriceIndex: number;
    setSelectedPriceIndex: React.Dispatch<React.SetStateAction<number>>;
    recommendedPrices: (Partial<ProductVariantRecord> | null)[];
    product_href: string;
    setOpenHSADialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SelectShippingFrequency({
    selectedPriceIndex,
    setSelectedPriceIndex,
    recommendedPrices,
    product_href,
    setOpenHSADialog,
}: SelectShippingFrequencyProps) {
    console.log('REC PRICES', recommendedPrices);
    const getStrikeThroughPrice = (price_data: any) => {
        if (!price_data) {
            return '';
        }
        if (
            product_href === PRODUCT_HREF.SEMAGLUTIDE ||
            product_href === PRODUCT_HREF.TIRZEPATIDE ||
            product_href === PRODUCT_HREF.WL_CAPSULE
        ) {
            return price_data.price_data.savings.monthly;
            // if (
            //     price_data?.cadence === 'quarterly' ||
            //     price_data?.cadence === 'biannually'
            // ) {
            //     return price_data?.price_data.savings.original_price;
            // } else {
            //     return price_data?.price_data.product_price;
            // }
        }
        return '';
    };

    const data = [
        {
            tag: '6 month plan',
            type: 2,
            crossedOutPrice: `${getStrikeThroughPrice(recommendedPrices[2])}`,
            totalPrice: recommendedPrices[2]?.price_data.product_price_monthly,
            planBreakdown: [
                `$${recommendedPrices[2]?.price_data.product_price} charged every 6 months`,
                `Equivalent to paying $${recommendedPrices[2]?.price_data.product_price_monthly}/mo`,
                `Includes 6 months of medication + injection supplies`,
                `Ships every 6 months`,
            ],
            valid: recommendedPrices[2],
        },
        {
            tag: '12 week plan',
            crossedOutPrice: `${getStrikeThroughPrice(recommendedPrices[1])}`,
            type: 1,
            totalPrice: recommendedPrices[1]?.price_data.product_price_monthly,
            planBreakdown: [
                `$${recommendedPrices[1]?.price_data.product_price} charged every 3 months`,
                `Equivalent to paying $${recommendedPrices[1]?.price_data.product_price_monthly}/mo`,
                `Includes 3 months of medication + injection supplies`,
                `Ships every 3 months`,
            ],
            valid: recommendedPrices[1],
        },
        {
            tag: '4 week plan',
            crossedOutPrice: ``,
            type: 0,
            totalPrice: recommendedPrices[0]?.price_data.product_price,
            planBreakdown: [
                `$${recommendedPrices[0]?.price_data.product_price} charged month`,
                `Includes one months of medication + injection supplies`,
                `Ships monthly`,
            ],
            valid: recommendedPrices[0],
        },
    ];

    const getLabelNames = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return {
                    title: 'Your shipping frequency',
                    subtitle:
                        "We'll ship your prescription to your door for free, delivered every 3 months.",
                };
            case PRODUCT_HREF.SEMAGLUTIDE:
            case PRODUCT_HREF.TIRZEPATIDE:
            case PRODUCT_HREF.WL_CAPSULE:
            default:
                return {
                    title: 'Select shipping frequency',
                    subtitle:
                        'Weight loss takes time. Choose a longer plan to save and get results that last.',
                };
        }
    };

    const labelNames = getLabelNames();

    return (
        <div className="flex flex-col">
            <BioType className="intake-v3-18px-20px-bold">
                {labelNames.title}
            </BioType>
            <BioType className="intake-v3-question-text mt-1">
                {labelNames.subtitle}
            </BioType>
            <div className="flex flex-col space-y-[21px] mt-[21px]">
                {data.map((item) => (
                    <ShippingFrequencyOption
                        key={item.tag}
                        data={item}
                        selected={selectedPriceIndex === item.type}
                        setSelectedPriceIndex={setSelectedPriceIndex}
                        biannualEnabled={data[0].valid ? true : false}
                        setOpenHSADialog={setOpenHSADialog}
                    />
                ))}
            </div>
        </div>
    );
}

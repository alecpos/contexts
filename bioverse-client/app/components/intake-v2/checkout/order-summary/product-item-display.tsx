import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';

interface Props {
    product_name: string;
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    priceData: any;
    pricingStructure?: any;
}

export default function ProductItemDisplay({
    product_name,
    product_data,
    priceData,
    pricingStructure,
}: Props) {
    return (
        <>
            <div className='flex flex-row p-0 gap-4 w-full -mt-2 md:-mt-4'>
                {priceData && (
                    <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                        <div className='flex justify-between gap-4'>
                            <div className='flex flex-col'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    {product_name}
                                </BioType>
                                {product_data.subscriptionType !==
                                    'one_time' && (
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                                    >
                                        Ships {product_data.subscriptionType}
                                    </BioType>
                                )}
                            </div>
                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                ${pricingStructure.total_price}
                            </BioType>
                        </div>

                        {/* <div className='flex justify-between'>
                            <BioType className='subtitle2 text-primary !font-[600]'>
                                You’ll only be charged if prescribed
                            </BioType>
                        </div> */}
                        <div className='w-full h-[1px] mb-1'>
                            <HorizontalDivider
                                backgroundColor={'#1B1B1B1F'}
                                height={1}
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Ongoing medical support & shipping
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='w-full h-[1px] my-1'>
                            <HorizontalDivider
                                backgroundColor={'#1B1B1B1F'}
                                height={1}
                            />
                        </div>
                        <div className='flex justify-between'>
                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} text-primary`}
                            >
                                DUE TODAY
                            </BioType>
                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} text-primary`}
                            >
                                $00.00
                            </BioType>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

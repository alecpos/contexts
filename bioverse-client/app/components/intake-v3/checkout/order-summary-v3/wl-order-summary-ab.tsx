import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import Image from 'next/image';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import WLProductItemDisplay from './wl-product-item-display-ab';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import WLProductItemDisplayAB from './wl-product-item-display-ab';
import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';

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
    selectedPriceIndex: number;
    setSelectedPriceIndex: React.Dispatch<React.SetStateAction<number>>;
    recommendedPrices: (Partial<ProductVariantRecord> | null)[];
}

export default function WLOrderSummaryAB({
    wl_goal,
    user_name,
    product_name,
    variantNumber,
    product_data,
    priceData,
    pricingStructure,
    selectedDose,
    selectedPriceIndex,
    setSelectedPriceIndex,
    recommendedPrices,
}: Props) {
    const params = useParams();
    const product_href = product_data.product_href;

    const getImageHref = () => {
        switch (product_data.product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '/img/intake/wl/metformin/metformin_lifestyle.png';
            case PRODUCT_HREF.TIRZEPATIDE:
                return '/img/intake/wl/tirzepatide/clear-tirzepatide-syringe-cropped.png';
            case PRODUCT_HREF.WL_CAPSULE:
                return '/img/intake/wl/wl-capsule.png';
            default:
                return '/img/intake/wl/semaglutide/clear-semaglutide-syringe-cropped.png';
        }
    };

    const getProductName = () => {
        switch (product_data.product_href) {
            case PRODUCT_HREF.METFORMIN:
                return 'Metformin';
            case PRODUCT_HREF.TIRZEPATIDE:
                return 'Compounded Tirzepatide';
            case PRODUCT_HREF.WL_CAPSULE:
                return 'Bioverse Weight Loss Capsules';
            case PRODUCT_HREF.SEMAGLUTIDE:
            default:
                return 'Compounded Semaglutide';
        }
    };

    const getHeaderText = (product_href: PRODUCT_HREF) => {
        const productInformationData = {
            [PRODUCT_HREF.SEMAGLUTIDE]: {
                activeIngredients:
                    'Same active ingredient as Wegovy® & Ozempic®',
                dosages: { lower: '0.25mg', higher: '2.5mg' },
            },
            [PRODUCT_HREF.TIRZEPATIDE]: {
                activeIngredients:
                    'Same active ingredient as Zepbound™ and Mounjaro®',
                dosages: { lower: '2.5mg', higher: '12.5mg' },
            },
            [PRODUCT_HREF.METFORMIN]: {
                activeIngredients: 'Designed to promote healthy weight loss',
                dosages: { lower: '', higher: '' },
            },
            [PRODUCT_HREF.WL_CAPSULE]: {
                activeIngredients: 'Designed to promote healthy weight loss',
                dosages: { lower: '', higher: '' },
            },
        };

        const activeData =
            productInformationData[
                product_data.product_href as
                    | PRODUCT_HREF.SEMAGLUTIDE
                    | PRODUCT_HREF.TIRZEPATIDE
                    | PRODUCT_HREF.WL_CAPSULE
                    | PRODUCT_HREF.METFORMIN
            ];

        return activeData.activeIngredients;
    };

    const getHersImageRef = () => {
        switch (product_data.product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '/img/intake/wl/metformin-cropped-vial.png';
            case PRODUCT_HREF.WL_CAPSULE:
                return '/img/intake/wl/capsules-cropped-vial.png';
            case PRODUCT_HREF.TIRZEPATIDE:
                return '/img/intake/wl/tirzepatide/clear-tirzepatide-syringe-cropped.png';
            case PRODUCT_HREF.SEMAGLUTIDE:
            default:
                return '/img/intake/wl/semaglutide-cropped-vial.png';
        }
    };

    const displayTreatmentHeader = () => {
        const productInformationData = {
            [PRODUCT_HREF.SEMAGLUTIDE]: {
                activeIngredients:
                    'Same active ingredient as Wegovy® & Ozempic®',
                dosages: { lower: '0.25mg', higher: '2.5mg' },
            },
            [PRODUCT_HREF.TIRZEPATIDE]: {
                activeIngredients:
                    'Same active ingredient as Zepbound™ and Mounjaro®',
                dosages: { lower: '2.5mg', higher: '12.5mg' },
            },
            [PRODUCT_HREF.METFORMIN]: {
                activeIngredients: 'Designed to promote healthy weight loss',
                dosages: { lower: '', higher: '' },
            },
            [PRODUCT_HREF.WL_CAPSULE]: {
                activeIngredients: 'Designed to promote healthy weight loss',
                dosages: { lower: '', higher: '' },
            },
        };

        const activeData =
            productInformationData[
                product_data.product_href as
                    | PRODUCT_HREF.SEMAGLUTIDE
                    | PRODUCT_HREF.TIRZEPATIDE
                    | PRODUCT_HREF.WL_CAPSULE
                    | PRODUCT_HREF.METFORMIN
            ];

        return (
            <div className="flex items-center pl-6 -mt-5 sm:mt-0">
                <div className="flex flex-col space-y-3 max-w-[280px]">
                    <BioType className={`intake-v3-18px-20px-bold mt-3 `}>
                        {product_name}
                    </BioType>
                    <BioType className="intake-subtitle text-black">
                        {![
                            PRODUCT_HREF.WL_CAPSULE,
                            PRODUCT_HREF.METFORMIN,
                        ].includes(product_data.product_href as PRODUCT_HREF) &&
                            'Same active ingredient as'}{' '}
                        {activeData.activeIngredients}
                    </BioType>
                    {![
                        PRODUCT_HREF.WL_CAPSULE,
                        PRODUCT_HREF.METFORMIN,
                    ].includes(product_data.product_href as PRODUCT_HREF) && (
                        <BioType className="intake-subtitle text-black">
                            Doses from {activeData.dosages.lower} -{' '}
                            {activeData.dosages.higher}
                        </BioType>
                    )}
                </div>
                <div className="relative mt-2 w-[108px] h-[149px] sm:w-[142px] sm:h-[141px] aspect-[1.23]">
                    <Image
                        src={getImageHref()}
                        className="mt-4"
                        alt={'Medicine Vial'}
                        fill
                        objectFit="contain"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <BioType
                className={`inter-h5-question-header md:text-[24px] mt-4 mb-6`}
            >
                Save your payment details
            </BioType>

            <div
                className="flex flex-col gap-4 px-6 pb-6 pt-2 md:p-6 rounded-lg bg-white"
                style={{ border: '1px solid #E5E5E5' }}
            >
                <BioType className={`inter-h5-question-header-bold mt-4`}>
                    {user_name}&apos;s treatment details:
                </BioType>
                <div className="flex flex-col">
                    <div className="h-[35px] sm:h-[40px] bg-[#FAFFB3]  flex justify-center items-center rounded-t-xl rounded-b-none ">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[16px] h-[16px] sm:w-[25px] sm:h-[25px]"
                                viewBox="0 0 25 25"
                                fill="none"
                            >
                                <path
                                    d="M22.5 11.5467V12.4667C22.4988 14.6231 21.8005 16.7213 20.5093 18.4485C19.2182 20.1756 17.4033 21.4391 15.3354 22.0506C13.2674 22.662 11.0573 22.5886 9.03447 21.8412C7.01168 21.0939 5.28465 19.7128 4.11096 17.9037C2.93727 16.0947 2.37979 13.9547 2.52168 11.803C2.66356 9.65123 3.49721 7.60299 4.89828 5.96373C6.29935 4.32448 8.19279 3.18204 10.2962 2.70681C12.3996 2.23157 14.6003 2.449 16.57 3.32666M22.5 4.46667L12.5 14.4767L9.5 11.4767"
                                    stroke="black"
                                    stroke-opacity="1"
                                    stroke-width="1.01733"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <BioType className="intake-v3-disclaimer-text sm:text-[18px]">
                                FSA/HSA{' '}
                                <span className="text-weak">
                                    eligible for reimbursement
                                </span>
                            </BioType>
                        </div>
                    </div>
                    <div className="flex items-center gap-[10px] self-stretch bg-[#D7E3EB] rounded-b-xl">
                        <div className="flex px-3 flex-col justify-center flex-1">
                            <BioType className="intake-v3-form-label-bold">
                                {getProductName()}
                            </BioType>
                            <BioType className="intake-subtitle text-black ">
                                {getHeaderText(
                                    product_data.product_href as PRODUCT_HREF,
                                )}
                            </BioType>
                        </div>
                        {product_data.product_href ===
                        PRODUCT_HREF.TIRZEPATIDE ? (
                            <div className="relative bottom-4 w-[108px] h-[149px] sm:w-[142px] sm:h-[141px] aspect-[1.23]">
                                <Image
                                    src={getImageHref()}
                                    className="mt-4"
                                    alt={'Medicine Vial'}
                                    fill
                                    objectFit="contain"
                                />
                            </div>
                        ) : (
                            <Image
                                src={getHersImageRef()}
                                width={173}
                                height={122}
                                objectFit="cover"
                                alt="vial"
                                className="relative left-5"
                            />
                        )}
                    </div>
                </div>
                {/* {displayTreatmentHeader()} */}
                <div className="flex flex-col gap-6">
                    <WLProductItemDisplayAB
                        user_name={user_name}
                        wl_goal={wl_goal}
                        product_name={product_name}
                        variantNumber={variantNumber}
                        product_data={product_data}
                        priceData={priceData}
                        pricingStructure={pricingStructure}
                        selectedPriceIndex={selectedPriceIndex}
                        setSelectedPriceIndex={setSelectedPriceIndex}
                        recommendedPrices={recommendedPrices}
                    />
                </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-200 to-pink-200  w-fit mx-auto text-center rounded-b-lg py-1 px-3">
                <BioType className={`inter-h5-regular text-[14px] `}>
                    YOU WON&apos;T BE CHARGED UNTIL PRESCRIBED
                </BioType>
            </div>
        </div>
    );
}

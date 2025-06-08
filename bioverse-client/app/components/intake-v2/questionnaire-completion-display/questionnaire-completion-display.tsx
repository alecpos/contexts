import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import Image from 'next/image';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { constructPricingStructure } from '@/app/utils/functions/pricing';

interface Props {
    databaseData: any;
    variantNumber: number;
    productData: ProductVariables;
    priceData: any;
    shouldDiscount: boolean;
}

export default function QuestionnaireCompletionDisplay({
    databaseData,
    productData,
    priceData,
    variantNumber,
    shouldDiscount,
}: Props) {
    const pricingStructure = constructPricingStructure(
        productData,
        priceData,
        shouldDiscount,
    );

    return (
        <>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${databaseData.review_image_ref}`}
                        alt={'product'}
                        width={108}
                        height={108}
                        unoptimized
                    />
                </div>
                <div className="w-full pr-10">
                    <div className="flex-grow ml-4 w-full">
                        <BioType className="subtitle2 md:subtitle1">
                            {databaseData.name}
                        </BioType>
                        <div className="flex flex-col ">
                            <div className="flex justify-between body1 text-[#1b1b1b] opacity-60 text-[16px]">
                                <BioType className="">Item:</BioType>
                                <BioType className="">
                                    ${pricingStructure.item_price}
                                </BioType>
                            </div>
                            {pricingStructure['subscribe_save_price'] && (
                                <div className="flex justify-between body1 text-[#1b1b1b] opacity-60 text-[16px]">
                                    <BioType>Subscribe + Save</BioType>
                                    <BioType>
                                        - $
                                        {
                                            pricingStructure[
                                                'subscribe_save_price'
                                            ]
                                        }
                                    </BioType>
                                </div>
                            )}

                            {shouldDiscount && (
                                <div className="flex justify-between body1 text-[#1b1b1b] opacity-60 text-[16px]">
                                    <BioType>Your Coupon Savings</BioType>
                                    <BioType>
                                        -${pricingStructure.coupon_price}
                                    </BioType>
                                </div>
                            )}
                            <div className="flex justify-between body1 text-[#1b1b1b] opacity-80 text-[16px]">
                                <BioType>Total (if perscribed)</BioType>
                                <BioType>
                                    ${pricingStructure.total_price}
                                </BioType>
                            </div>
                            {productData.subscriptionType === 'monthly' ||
                                (productData.subscriptionType ===
                                    'quarterly' && (
                                    <div className="flex justify-between body1 text-[#1b1b1b] opacity-80 text-[13px]">
                                        <BioType>First order only</BioType>
                                    </div>
                                ))}
                            <div className="flex justify-between body1bold text-[#1b1b1b] opacity-80 text-[16px] mt-2">
                                <BioType>DUE TODAY</BioType>
                                <BioType>$0.00</BioType>
                            </div>
                        </div>
                        {/* <BioType className="body1">
                            $
                            {
                                priceData[0][productData.subscriptionType]
                                    .product_price
                            }
                        </BioType>
                        <BioType className="body1">Only if perscribed</BioType> */}
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div className="w-[full] h-[1px]">
                        <HorizontalDivider
                            backgroundColor={'#1B1B1B1F'}
                            height={1}
                        />
                    </div>
                    <BioType className="body1bold !text-primary mt-5">
                        YOU’LL ALWAYS GET
                    </BioType>
                    <div className="flex flex-row gap-[24px] mt-5">
                        <AssignmentOutlinedIcon fontSize="large" />
                        <div className="mb-2">
                            <BioType className="body2 text-gray-700">
                                US-licensed medical providers{' '}
                            </BioType>
                            <BioType className="label2 text-gray-400">
                                Clinical intakes reviewed by experts{' '}
                            </BioType>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[24px] mt-3">
                        <CheckCircleOutlinedIcon fontSize="large" />
                        <div className="mb-2">
                            <BioType className="body2 text-gray-700">
                                No insurance required, no hidden fees{' '}
                            </BioType>
                            <BioType className="label2 text-gray-400">
                                What you see is what you get{' '}
                            </BioType>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[24px]">
                        <MedicationOutlinedIcon fontSize="large" />
                        <div className="mb-2">
                            <BioType className="body2 text-gray-700">
                                Free online visit{' '}
                            </BioType>
                            <BioType className="label2 text-gray-400">
                                Intake questions take &lt;10 minutes to
                                complete.{' '}
                            </BioType>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[24px]">
                        <Inventory2OutlinedIcon fontSize="large" />
                        <div className="mb-2">
                            <BioType className="body2 text-gray-700">
                                Prescription delivered by certified pharmacist{' '}
                            </BioType>
                            <BioType className="label2 text-gray-400">
                                Made in the USA
                            </BioType>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[24px]">
                        <AutorenewIcon fontSize="large" />
                        <div className="mb-2">
                            <BioType className="body2 text-gray-700">
                                Free discreet shipping and packaging{' '}
                            </BioType>
                            <BioType className="label2 text-gray-400">
                                Delivered right to your door{' '}
                            </BioType>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

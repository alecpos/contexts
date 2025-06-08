import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    PRODUCT_HREF,
    PRODUCT_NAME,
} from '@/app/types/global/product-enumerator';
import { getProductName } from '@/app/utils/functions/formatting';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import {
    getDoubleDosageDosingOptionByDosingQuarterlyReview,
    getDoubleDosageDosingOptionByProductQuarterlyReview,
    getSingleDosageDosingOptionByDosingQuarterlyReview,
    getSingleDosageDosingOptionByProductQuarterlyReview,
} from '../approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import { INTAKE_PAGE_BODY_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';

interface QuarterlyFinalReviewDialogContentProps {
    orderData: DBOrderData;
    selectedOptions: string[];
    setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

export default function QuarterlyFinalReviewDialogContent({
    orderData,
    selectedOptions,
    setSelectedOptions,
}: QuarterlyFinalReviewDialogContentProps) {
    const productName = getProductName(orderData.product_href);
    let dosingOptions;

    if (selectedOptions.length === 1) {
        dosingOptions = getSingleDosageDosingOptionByProductQuarterlyReview(
            orderData.product_href as PRODUCT_HREF,
        );
    } else {
        dosingOptions = getDoubleDosageDosingOptionByProductQuarterlyReview(
            orderData.product_href as PRODUCT_HREF,
        );
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        let currentSelection = [...selectedOptions]; // Make sure to use let for reassignment

        if (currentSelection.includes(value)) {
            // Correctly update currentSelection when removing an option
            currentSelection = currentSelection.filter(
                (option) => option !== value,
            );
        } else if (currentSelection.length < 2) {
            // Add the option if less than 2 options are selected
            currentSelection.push(value);
        }

        // Sort the selection based on the index property of DosingChangeQuarterlyReviewOption
        // Assuming the values in currentSelection can be directly compared to the index property
        currentSelection.sort((a, b) => {
            const optionAIndex = parseFloat(a); // Convert string to number if necessary
            const optionBIndex = parseFloat(b); // Convert string to number if necessary

            return optionAIndex - optionBIndex;
        });

        setSelectedOptions(currentSelection);
    };

    return (
        <div>
            <BioType
                className={`provider-intake-tab-title text-black opacity-60 `}
            >
                {productName} (select up to 2 options)
            </BioType>
            <div className="flex flex-col mt-1">
                {dosingOptions.map((option, index: number) => {
                    return (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={selectedOptions.includes(
                                        String(option.dosing),
                                    )}
                                    onChange={handleChange}
                                    value={option.dosing}
                                    disabled={
                                        !selectedOptions.includes(
                                            String(option.dosing),
                                        ) && selectedOptions.length >= 2
                                    }
                                />
                            }
                            label={
                                <BioType
                                    className={`provider-intake-tab-title text-black`}
                                >
                                    {option.dosing}
                                </BioType>
                            }
                        />
                    );
                })}
            </div>
            <div className="flex flex-col space-y-4">
                <div className="bg-[#1b1b1b1f] h-[1px] w-full"></div>
                <BioType
                    className={`provider-intake-tab-title text-[#00000099]`}
                >
                    The patient will choose one of the following options:
                </BioType>
                {selectedOptions.length === 0 && (
                    <div className="flex flex-col space-y-6">
                        <BioType
                            className={`provider-dropdown-title text-black opacity-[.38] text-[18px]`}
                        >
                            Sig ({productName})
                        </BioType>
                        <div className="bg-[#1b1b1b1f] h-[1px] w-full"></div>
                        <BioType
                            className={`provider-dropdown-titletext-black opacity-[.38] text-[18px]`}
                        >
                            Sig ({productName})
                        </BioType>
                        <div className="bg-[#1b1b1b1f] h-[1px] w-full"></div>
                        <BioType
                            className={`provider-dropdown-title text-black opacity-[.38] text-[18px]`}
                        >
                            Sig ({productName})
                        </BioType>
                        <div className="bg-[#1b1b1b1f] h-[1px] w-full"></div>
                        <BioType
                            className={`provider-dropdown-title text-black opacity-[.38] text-[18px]`}
                        >
                            Sig ({productName})
                        </BioType>
                        <div className="bg-[#1b1b1b1f] h-[1px] w-full"></div>
                    </div>
                )}

                {selectedOptions.map((option, index: number) => {
                    let dosingOption;

                    if (selectedOptions.length === 1) {
                        dosingOption =
                            getSingleDosageDosingOptionByDosingQuarterlyReview(
                                option,
                            );
                    } else {
                        dosingOption =
                            getDoubleDosageDosingOptionByDosingQuarterlyReview(
                                option,
                            );
                    }

                    return (
                        <div className="flex flex-col space-y-3" key={index}>
                            <div className="flex flex-col">
                                <BioType className="intake-v3-18px-20px text-black">
                                    {dosingOption?.header.monthly}
                                </BioType>
                                <BioType className="intake-subtitle text-textSecondary">
                                    Medication:{' '}
                                    <span className="intake-subtitle  text-black opacity-90">
                                        {
                                            dosingOption?.product_description
                                                .monthly
                                        }
                                    </span>
                                </BioType>
                                <BioType className="intake-subtitle text-textSecondary">
                                    Sig:{' '}
                                    <span className="intake-subtitle text-black opacity-90">
                                        {dosingOption?.sigs.monthly}
                                    </span>
                                </BioType>
                            </div>

                            <div className="flex flex-col">
                                <BioType className="intake-v3-18px-20px text-black">
                                    {dosingOption?.header.bundle}
                                </BioType>
                                <BioType className="intake-subtitle text-textSecondary">
                                    Medication:{' '}
                                    <span className="intake-subtitle  text-black opacity-90">
                                        {
                                            dosingOption?.product_description
                                                .bundle
                                        }
                                    </span>
                                </BioType>
                                <BioType className="intake-subtitle text-textSecondary">
                                    Sig:
                                </BioType>
                                <ul className="ml-5">
                                    {dosingOption?.sigs.bundle.map(
                                        (sig: string, index: number) => (
                                            <li key={index}>
                                                <BioType className="intake-subtitle  text-black opacity-90">
                                                    {sig}
                                                </BioType>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                            {dosingOption?.active_recs.maintenance && (
                                <div className="flex flex-col">
                                    <BioType className=" intake-v3-18px-20px  text-black">
                                        {dosingOption?.header.maintenance}
                                    </BioType>
                                    <BioType className="intake-subtitle text-textSecondary">
                                        Medication:{' '}
                                        <span className="intake-subtitle text-black opacity-90">
                                            {
                                                dosingOption
                                                    ?.product_description
                                                    .maintenance
                                            }
                                        </span>
                                    </BioType>
                                    <BioType className="intake-subtitle text-textSecondary">
                                        Sig:
                                    </BioType>
                                    <ul className="ml-5">
                                        {dosingOption?.sigs.maintenance?.map(
                                            (sig: string, index: number) => (
                                                <li key={index}>
                                                    <BioType className="intake-subtitle text-black opacity-90">
                                                        {sig}
                                                    </BioType>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                            {dosingOption?.active_recs.biannual_1 && (
                                <div className="flex flex-col">
                                    <BioType className="intake-v3-18px-20px  text-black">
                                        {dosingOption?.header.biannual_1}
                                    </BioType>
                                    <BioType className="intake-subtitle text-textSecondary">
                                        Medication:{' '}
                                        <span className="intake-subtitle text-black opacity-90">
                                            {
                                                dosingOption
                                                    ?.product_description
                                                    .biannual_1
                                            }
                                        </span>
                                    </BioType>
                                    <BioType className="intake-subtitle text-textSecondary">
                                        Sig:
                                    </BioType>
                                    <ul className="ml-5">
                                        {dosingOption?.sigs.biannual_1?.map(
                                            (sig: string, index: number) => (
                                                <li key={index}>
                                                    <BioType className="intake-subtitle text-black opacity-90">
                                                        {sig}
                                                    </BioType>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                            {dosingOption?.active_recs.biannual_2 && (
                                <div className="flex flex-col">
                                    <BioType className="intake-v3-18px-20px  text-black">
                                        {dosingOption?.header.biannual_2}
                                    </BioType>
                                    <BioType className="intake-subtitle text-textSecondary">
                                        Medication:{' '}
                                        <span className="intake-subtitle text-black opacity-90">
                                            {
                                                dosingOption
                                                    ?.product_description
                                                    .biannual_2
                                            }
                                        </span>
                                    </BioType>
                                    <BioType className="intake-subtitle  text-textSecondary">
                                        Sig:
                                    </BioType>
                                    <ul className="ml-5">
                                        {dosingOption?.sigs.biannual_2?.map(
                                            (sig: string, index: number) => (
                                                <li key={index}>
                                                    <BioType className="intake-subtitle  text-black opacity-90">
                                                        {sig}
                                                    </BioType>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                            {dosingOption?.active_recs.annual && (
                                <div className="flex flex-col">
                                    <BioType className="intake-v3-18px-20px  text-black">
                                        {dosingOption?.header.annual}
                                    </BioType>
                                    <BioType className="intake-subtitle text-textSecondary">
                                        Medication:{' '}
                                        <span className="intake-subtitle text-black opacity-90">
                                            {
                                                dosingOption
                                                    ?.product_description
                                                    .annual
                                            }
                                        </span>
                                    </BioType>
                                    <BioType className="intake-subtitle text-textSecondary">
                                        Sig:
                                    </BioType>
                                    <ul className="ml-5">
                                        {dosingOption?.sigs.annual?.map(
                                            (sig: string, index: number) => (
                                                <li key={index}>
                                                    <BioType className="intake-subtitle text-black opacity-90">
                                                        {sig}
                                                    </BioType>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                            {index === 0 && selectedOptions.length > 1 && (
                                <hr />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

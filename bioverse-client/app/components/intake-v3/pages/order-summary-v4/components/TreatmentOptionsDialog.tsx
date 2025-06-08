'use client';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import DividerHers from './DividerHers';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import ContinueButtonV3 from '../../../buttons/ContinueButtonV3';
import { useSearchParams } from 'next/navigation';
import { USStates } from '@/app/types/enums/master-enums';

interface TreatmentOptionProps {
    title: string;
    dosage: string;
    desc: string;
    price: string;
    selected: boolean;
    product_href: PRODUCT_HREF;
    setSelectedOption: Dispatch<SetStateAction<PRODUCT_HREF>>;
}

function TreatmentOption({
    title,
    dosage,
    desc,
    price,
    selected,
    product_href,
    setSelectedOption,
}: TreatmentOptionProps) {
    const searchParams = useSearchParams();

    const getPrice = () => {
        if (product_href === PRODUCT_HREF.METFORMIN) {
            return '$25/mo';
        } else if (product_href === PRODUCT_HREF.WL_CAPSULE) {
            return '$67mo';
        }

        if (
            [USStates.California, USStates.Michigan].includes(
                (searchParams.get('ptst') as USStates) || ('' as USStates),
            )
        ) {
            return '$159/mo';
        }
        return '$129/mo';
    };
    return (
        <div
            className={`flex p-6 flex-col md:justify-center self-stretch rounded-[12px] border-[1px] border-solid ${
                selected ? 'border-black' : 'border-[#66666633]'
            } bg-white hover:bg-[#66666633] hover:cursor-pointer`}
            onClick={() => setSelectedOption(product_href)}
        >
            <div className="flex flex-col justify-start md:flex-row md:justify-between items-center self-stretch">
                <BioType className="self-start order-2 md:order-1 intake-subtitle text-black">
                    {title}
                </BioType>
                <div className="flex mb-2 md:mb-0 self-start order-1 md:order-2 px-2 md:justify-center max-w-[100px] md:items-center gap-[10px]  rounded-[4px] bg-[#66666633]">
                    <BioType className="intake-v3-disclaimer-text">
                        From {getPrice()}
                    </BioType>
                </div>
            </div>

            <BioType className="intake-v3-disclaimer-text">{dosage}</BioType>
            <BioType className="intake-v3-disclaimer-text text-weak">
                {desc}
            </BioType>
        </div>
    );
}

interface SafetyInformationDialogProps {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
    currentProduct: PRODUCT_HREF;
    setPage: Dispatch<SetStateAction<PRODUCT_HREF>>;
}

export default function TreatmentOptionsDialog({
    openDialog,
    setOpenDialog,
    currentProduct,
    setPage,
}: SafetyInformationDialogProps) {
    const [selectedOption, setSelectedOption] =
        useState<PRODUCT_HREF>(currentProduct);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const handleClick = () => {
        setButtonLoading(true);
        setPage(selectedOption);
        setOpenDialog(false);
        setSelectedOption(currentProduct);
        setButtonLoading(false);
    };

    const getTreatmentMatchOptions = (product_href: PRODUCT_HREF) => {
        const options = {
            [PRODUCT_HREF.SEMAGLUTIDE]: {
                title: 'Compounded Semaglutide',
                dosage: 'Up to 2.5 mg',
                desc: 'Same active ingredient as Wegovy® and Ozempic®',
                price: '129',
                product_href: PRODUCT_HREF.SEMAGLUTIDE,
            },
            [PRODUCT_HREF.METFORMIN]: {
                title: 'Metformin',
                dosage: '1,000 mg/day',
                desc: '',
                price: '25',
                product_href: PRODUCT_HREF.METFORMIN,
            },
            [PRODUCT_HREF.WL_CAPSULE]: {
                title: 'Bioverse Weight Loss Capsules',
                dosage: '65 mg / 8 mg / 15 mg',
                desc: 'Buproprion, Naltrexone, Topiramate',
                price: '67',
                product_href: PRODUCT_HREF.WL_CAPSULE,
            },
        };

        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return {
                    eligible_treatment_match: options[PRODUCT_HREF.METFORMIN],
                    other_treatment_options: [
                        options[PRODUCT_HREF.SEMAGLUTIDE],
                        options[PRODUCT_HREF.WL_CAPSULE],
                    ],
                    tag: 'Other treatment options',
                };
            case PRODUCT_HREF.WL_CAPSULE:
                return {
                    eligible_treatment_match: options[PRODUCT_HREF.WL_CAPSULE],
                    other_treatment_options: [
                        options[PRODUCT_HREF.SEMAGLUTIDE],
                        options[PRODUCT_HREF.METFORMIN],
                    ],
                    tag: 'Other treatment options',
                };
            case PRODUCT_HREF.SEMAGLUTIDE:
            default:
                return {
                    eligible_treatment_match: options[PRODUCT_HREF.SEMAGLUTIDE],
                    other_treatment_options: [
                        options[PRODUCT_HREF.METFORMIN],
                        options[PRODUCT_HREF.WL_CAPSULE],
                    ],
                    tag: 'Medication kits',
                };
        }
    };

    const treatmentOptions = getTreatmentMatchOptions(currentProduct);

    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '16px', // Apply border-radius here
                    backgroundColor: '#FBFAFC',
                },
            }}
            PaperProps={{
                sx: {
                    width: '98%',
                    maxHeight: '95%',
                },
                md: {
                    maxWidth: '650px', // Apply maxWidth correctly
                    width: '650px',
                    minHeight: '766px',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: '#FBFAFC',
                }}
            >
                <CloseIcon
                    onClick={() => setOpenDialog(false)}
                    sx={{ color: '#4D4D4D73' }}
                    className="hover:cursor-pointer"
                />
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-12 px-6 py-8 bg-[#FBFAFC]">
                    <BioType className="inter-h5-question-header">
                        View other treatments
                    </BioType>
                    <div className="flex flex-col gap-[20px] self-stretch">
                        <BioType className="intake-v3-18px-20px">
                            Eligible treatment match
                        </BioType>
                        <TreatmentOption
                            title={
                                treatmentOptions.eligible_treatment_match.title
                            }
                            desc={
                                treatmentOptions.eligible_treatment_match.desc
                            }
                            dosage={
                                treatmentOptions.eligible_treatment_match.dosage
                            }
                            price={
                                treatmentOptions.eligible_treatment_match.price
                            }
                            selected={
                                selectedOption ===
                                treatmentOptions.eligible_treatment_match
                                    .product_href
                            }
                            setSelectedOption={setSelectedOption}
                            product_href={
                                treatmentOptions.eligible_treatment_match
                                    .product_href
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-[20px] self-stretch">
                        <BioType className="inter-h5-question-header">
                            {treatmentOptions.tag}
                        </BioType>
                        {treatmentOptions.other_treatment_options.map(
                            (option, index) => (
                                <TreatmentOption
                                    desc={option.desc}
                                    dosage={option.dosage}
                                    price={option.price}
                                    title={option.title}
                                    product_href={option.product_href}
                                    selected={
                                        selectedOption === option.product_href
                                    }
                                    setSelectedOption={setSelectedOption}
                                    key={index}
                                />
                            ),
                        )}
                    </div>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            zIndex: 30,
                            backgroundColor: '#000000',
                            '&:hover': {
                                backgroundColor: '#666666',
                            },
                            borderRadius: '12px',
                            textTransform: 'none',
                        }}
                        onClick={handleClick}
                        className={`h-[3rem] md:h-[48px]
                `}
                    >
                        {buttonLoading ? (
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={22}
                            />
                        ) : (
                            <BioType className="intake-v3-form-label-bold">
                                Continue
                            </BioType>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

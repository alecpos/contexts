'use client';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import AdjustDosingDialogContent from './AdjustDosingDialogContent';
import { DOSING_TYPE } from '../../../../intake-response-column/adjust-dosing-dialog/dosing-mappings';
import { getProviderMacroHTMLPrePopulatedForAdjustDosing } from '../../../utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { getDosagesForProductVariant, getVialUnitsPerMgForMonth } from '@/app/utils/database/controller/product_variants/product_variants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


interface AdjustDosingDialogProps {
    open: boolean;
    onClose: () => void;
    orderData: DBOrderData;
    mutateIntakeData: KeyedMutator<any>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    patientData: DBPatientData;
    currentMonth: number;
    currentDosage: string;
}

const sem_dosages = [0.25, 0.5, 1, 1.25, 2.5]
const tirz_dosages = [2.5, 5, 7.5, 10, 12.5]

export default function AdjustDosingDialog({
    open,
    onClose,
    orderData,
    mutateIntakeData,
    setMessageContent,
    patientData,
    currentMonth,
    currentDosage,
}: AdjustDosingDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [dosingAction, setDosingAction] = useState<DOSING_TYPE>(
        DOSING_TYPE.MAINTAIN
    );

    const [activeMonth, setActiveMonth] = useState<number>(currentMonth + 1); //this SHOULD be initialized to the upcoming month
    const [lastUsedDosage, setLastUsedDosage] = useState<number>(0.25); 
    const [dosagesArrayAsPrescribed, setDosagesArrayAsPrescribed] = useState<string[]>([]);
    //^this should be allowed to be null (if the patient messages rather than does checkin)
    //the provider should alsoalways be able to change it
    const [sigIsGenerating, setSigIsGenerating] = useState<boolean>(false);

    const getSig = async () => {
        setSigIsGenerating(true);

        const defaultSig = {
            increase: 'N/A',
            decrease: 'N/A',
            maintain: 'N/A',
        };

        const product_href = orderData.product_href;
        const variant_index = orderData.variant_index;
        // const variant_index = 12
        // const product_href = PRODUCT_HREF.TIRZEPATIDE;

        const dosages = await getDosagesForProductVariant(
            product_href,
            variant_index
        );
        const dosagesWithNoParentheses = dosages?.replace(/[()]/g, '');
        const dosagesArray = dosagesWithNoParentheses?.split(',');
        if (!dosagesArray || dosagesArray.length === 0) {
            console.error("dosagesArray is null")
            return defaultSig;
        }

        setDosagesArrayAsPrescribed(dosagesArray);
        const dosagesArrayWithOnlyNumbers = dosagesArray.map(
            (dosage) => {
                return Number(dosage.replace(/[mg]/g, '').trim()); //remove mg and trim whitespace
            }
        )

        //find which vial the patient should be using in the selected month (the upcoming month)
        const unitsPerMgForUpcomingMonth = await getVialUnitsPerMgForMonth(product_href, variant_index, activeMonth);
        if (!unitsPerMgForUpcomingMonth) {
            console.error("unitsPerMgForUpcomingMonth is null")
            setSigIsGenerating(false);
            return defaultSig;
        }
    
        const {
            continueMacroMgUnitString,
            maintainMacroMgUnitString,
            decreaseMacroMgUnitString,
        } = calculateMgsAndUnitsForMacro(
            dosagesArrayWithOnlyNumbers, //miligram array 'as prescribed'
            unitsPerMgForUpcomingMonth, 
            lastUsedDosage,
            product_href
        )
        
        setSigIsGenerating(false);
        return {
            increase: continueMacroMgUnitString,
            decrease: decreaseMacroMgUnitString,
            maintain: maintainMacroMgUnitString,
        }

    };


    const getOneGLP1DosageLower = (dosage: number, product_href: string) => {

        if (product_href === PRODUCT_HREF.SEMAGLUTIDE) {
            const indexOfDosage = sem_dosages.indexOf(dosage)
            return sem_dosages[indexOfDosage - 1]
        } else if (product_href === PRODUCT_HREF.TIRZEPATIDE) {
            const indexOfDosage = tirz_dosages.indexOf(dosage)
            return tirz_dosages[indexOfDosage - 1]
        }
        return 0;
    }

    /*
    *
    * Determines the number of units to display for each set of wording:
    * 
    * The increase/continue wording ('increase' is a misnomer) is "You are approved to continue on your titration schedule."
    * The maintain wording is "I recommend staying on the same dose."
    * The decrease wording is "I recommend to decrease your dose."
    * 
    * 
    * This method returns the number of mgs and units to put in these 3 macros such that they're all logically consistent
    * 
    * */
    const calculateMgsAndUnitsForMacro = (
        dosagesArray: number[],
        unitsPerMgForUpcomingMonth: number,
        lastUsedDosage: number,
        product_href: string
    ) => { //might need active month here, move this to the parent component
        console.log("inside calculateMgsAndUnitsForMacro")
        console.log('dosagesArray', dosagesArray)


        //let's start figuring out how many mgs for each option (continue/maintain/decrease), then we'll use vialUnitsPerMg to get the units for each
        let continuationMilligrams = 0;
        let maintainMilligrams = 0;
        let decreaseMilligrams = 0;
        const vialUnitsPerMg = unitsPerMgForUpcomingMonth

        //given the current month and the last used dosage, we can calculate the continuation, decrease, and maintain milligrams
        const prescribedMGs_UpcomingMonth = dosagesArray[activeMonth - 1]; 
        const prescribedMGs_CompletedMonth = dosagesArray[activeMonth - 2]; 
        const reportedMGs_CompletedMonth = lastUsedDosage

        // console.log("prescribedMGs_UpcomingMonth", prescribedMGs_UpcomingMonth)
        // console.log("prescribedMGs_CompletedMonth", prescribedMGs_CompletedMonth)
        // console.log("reportedMGs_CompletedMonth", reportedMGs_CompletedMonth)

        //#1
        const PRESCRIBED_UPCOMING_DOSAGE_SAME_AS_COMPLETED //the patient was 'prescribed' the same dosage for the upcoming month as they were in the completed month, and the dosage they reported matches what they were prescribed in the completed month
            = (prescribedMGs_UpcomingMonth === prescribedMGs_CompletedMonth) && (prescribedMGs_UpcomingMonth === reportedMGs_CompletedMonth)

        //#2
        const PRESCRIBED_UPCOMING_DOSAGE_SAME_AS_PRESCRIBED_COMPLETED_MISMATCH //the patient was 'prescribed' the same dosage for the upcoming month as they were in the completed month, but the dosage they reported does not match what they were prescribed in the completed month
            = (prescribedMGs_UpcomingMonth === prescribedMGs_CompletedMonth) && (prescribedMGs_CompletedMonth !== reportedMGs_CompletedMonth)

        //#3
        const PRESCRIBED_UPCOMING_DOSAGE_HIGHER_THAN_COMPLETED //the patient was 'prescribed' a higher dosage for the upcoming month than they were in the completed month, and the dosage they reported matches what they were prescribed in the completed month
            = (prescribedMGs_UpcomingMonth > prescribedMGs_CompletedMonth) && (prescribedMGs_CompletedMonth === reportedMGs_CompletedMonth)

        //#4
        const PRESCRIBED_UPCOMING_DOSAGE_HIGHER_THAN_AS_PRESCRIBED_COMPLETED_MISMATCH //the patient was 'prescribed' a higher dosage for the upcoming month than they were in the completed month, but the dosage they reported does not match what they were prescribed in the completed month
            = (prescribedMGs_UpcomingMonth > prescribedMGs_CompletedMonth) && (prescribedMGs_CompletedMonth !== reportedMGs_CompletedMonth)


        if (!PRESCRIBED_UPCOMING_DOSAGE_SAME_AS_COMPLETED && 
            !PRESCRIBED_UPCOMING_DOSAGE_SAME_AS_PRESCRIBED_COMPLETED_MISMATCH && 
            !PRESCRIBED_UPCOMING_DOSAGE_HIGHER_THAN_COMPLETED && 
            !PRESCRIBED_UPCOMING_DOSAGE_HIGHER_THAN_AS_PRESCRIBED_COMPLETED_MISMATCH) {
            // alert('activeMonth: ' + activeMonth + ' dosages: ' + dosagesArray + ' prescribedMGs_UpcomingMonth: ' + prescribedMGs_UpcomingMonth + ' prescribedMGs_CompletedMonth: ' + prescribedMGs_CompletedMonth + ' reportedMGs_CompletedMonth: ' + reportedMGs_CompletedMonth)
            alert("Error generating adjust dosing sig")
            return {
                continueMacroMgUnitString: 'Error generating adjust dosing sig',
                maintainMacroMgUnitString: 'Error generating adjust dosing sig',
                decreaseMacroMgUnitString: 'Error generating adjust dosing sig',
            }
        }

        //#1
        if ( //if they are prescribed to maintain the same dosage this month as last month - and they reported the same 
            PRESCRIBED_UPCOMING_DOSAGE_SAME_AS_COMPLETED
        ) {
            console.log("case #1")
            continuationMilligrams = dosagesArray[activeMonth - 1];
            maintainMilligrams = dosagesArray[activeMonth - 1];
            decreaseMilligrams = reportedMGs_CompletedMonth === 0.25 ? 0 : getOneGLP1DosageLower(reportedMGs_CompletedMonth, product_href);
        }

        //#2
        if (
            PRESCRIBED_UPCOMING_DOSAGE_SAME_AS_PRESCRIBED_COMPLETED_MISMATCH
        ) {
            console.log("case #2")
            if (reportedMGs_CompletedMonth < prescribedMGs_UpcomingMonth) { 
                continuationMilligrams = prescribedMGs_UpcomingMonth;
                maintainMilligrams = reportedMGs_CompletedMonth;
                decreaseMilligrams = reportedMGs_CompletedMonth === 0.25 ? 0 : getOneGLP1DosageLower(reportedMGs_CompletedMonth, product_href);
            }

            if (reportedMGs_CompletedMonth > prescribedMGs_UpcomingMonth) {
                continuationMilligrams = 0;
                maintainMilligrams = reportedMGs_CompletedMonth;
                decreaseMilligrams = prescribedMGs_UpcomingMonth;
            }
        }

        //#3
        if ( //if they should be titrating up this month and the last prescribed dosage is the same as the last reported dosage:
            PRESCRIBED_UPCOMING_DOSAGE_HIGHER_THAN_COMPLETED
        ) {
            console.log("case #3")
            continuationMilligrams = prescribedMGs_UpcomingMonth;
            maintainMilligrams = reportedMGs_CompletedMonth;
            decreaseMilligrams = reportedMGs_CompletedMonth === 0.25 ? 0 : getOneGLP1DosageLower(reportedMGs_CompletedMonth, product_href);
        }

        //#4    
        if ( //if they should be titrating up this month and the last prescribed dosage is not the same as the last reported dosage:
            PRESCRIBED_UPCOMING_DOSAGE_HIGHER_THAN_AS_PRESCRIBED_COMPLETED_MISMATCH
        ) {
            console.log("case #4")
            if (reportedMGs_CompletedMonth === prescribedMGs_UpcomingMonth) { //if what the patient just completed is the same as what they're prescribed in the upcoming month...
                continuationMilligrams = prescribedMGs_UpcomingMonth;
                maintainMilligrams = prescribedMGs_UpcomingMonth;
                decreaseMilligrams = reportedMGs_CompletedMonth === 0.25 ? 0 : getOneGLP1DosageLower(reportedMGs_CompletedMonth, product_href);
            }

            if (reportedMGs_CompletedMonth < prescribedMGs_UpcomingMonth) { 
                continuationMilligrams = prescribedMGs_UpcomingMonth;
                maintainMilligrams = reportedMGs_CompletedMonth;
                decreaseMilligrams = reportedMGs_CompletedMonth === 0.25 ? 0 : getOneGLP1DosageLower(reportedMGs_CompletedMonth, product_href);
            }

            if (reportedMGs_CompletedMonth > prescribedMGs_UpcomingMonth) {
                continuationMilligrams = 0;
                maintainMilligrams = reportedMGs_CompletedMonth;
                decreaseMilligrams = reportedMGs_CompletedMonth === 0.25 ? 0 : getOneGLP1DosageLower(reportedMGs_CompletedMonth, product_href);
            }
        }

        //do the math to get the units for the macro
        const continuationUnitsForMacro = (continuationMilligrams * vialUnitsPerMg).toFixed(0);
        const maintainUnitsForMacro = (maintainMilligrams * vialUnitsPerMg).toFixed(0);
        const decreaseUnitsForMacro = (decreaseMilligrams * vialUnitsPerMg).toFixed(0);

        //construct the final strings
        const continueMacroMgUnitString = continuationMilligrams !== 0 ? `Inject ${continuationUnitsForMacro} units (${continuationMilligrams}mg) weekly for 4 weeks` : 'N/A';
        const maintainMacroMgUnitString = `Inject ${maintainUnitsForMacro} units (${maintainMilligrams}mg) weekly for 4 weeks`;
        const decreaseMacroMgUnitString = decreaseMilligrams !== 0 ? `Inject ${decreaseUnitsForMacro} units (${decreaseMilligrams}mg) weekly for 4 weeks` : 'N/A';

        return {    
            continueMacroMgUnitString,
            maintainMacroMgUnitString,
            decreaseMacroMgUnitString,
        }
    }

    const [selectedSig, setSelectedSig] = useState<any>({
        increase: 'N/A',
        decrease: 'N/A',
        maintain: 'N/A',
    });

    useEffect(() => {

        const getTheSig = async () => {
            const sig = await getSig();
            setSelectedSig(sig);
        };

        getTheSig();
    }, [orderData, dosingAction, activeMonth, lastUsedDosage]);

    const onConfirm = async () => {
        // Autopopulate macro in message box
        setIsSubmitting(true);

        try {
            var macroId;

            if (dosingAction === DOSING_TYPE.DECREASE) {
                macroId = 251;
            } else if (dosingAction === DOSING_TYPE.INCREASE) {
                macroId = 249;
            } else {
                macroId = 250;
            }

            const macroHTML =
                await getProviderMacroHTMLPrePopulatedForAdjustDosing(
                    orderData.product_href,
                    patientData,
                    selectedSig[dosingAction] || '',
                    macroId
                );

            setMessageContent(macroHTML);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                PaperProps={{
                    style: {
                        minWidth: '800px',
                        minHeight: '800px',
                    },
                }}
                // Add this line
            >
                <DialogTitle id='alert-dialog-title'>
                    <span className='inter_h5_bold'>
                        How would you like to adjust this patient&apos;s titration schedule?
                    </span>
                </DialogTitle>

                <div className='flex flex-row gap-2 mb-5 mt-3 ml-[3px]'>
                    <div className='ml-[38px] mr-3 py-1 inter_body_bold'>Dosage Schedule in Bundle:</div>
                    {dosagesArrayAsPrescribed.map((dosage) => (
                        <div key={dosage} className='bg-gray-200 rounded-md px-2 py-1'>
                            {dosage}
                        </div>
                    ))}
                </div>

                <div className='flex flex-row'>
                    <p className='ml-9 mt-8 inter_body_bold'>Last Completed Dosage: </p>

                    <div className='w-[140px] mt-3'>
                    <FormControl className='w-[140px]' sx={{ mx: 3, mb: 2 }}>
                    
                        <Select
                            value={lastUsedDosage}
                            onChange={(e) => setLastUsedDosage(Number(e.target.value))}
                            className='inter_body_regular'
                            sx={{
                                '& .MuiSelect-select': {
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.87)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.87)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#286BA2'
                                }
                            }}
                        >
                            {orderData.product_href === 'semaglutide' ? (
                                sem_dosages.map((dosage) => (
                                    <MenuItem 
                                        key={dosage} 
                                        value={dosage}
                                        className='inter_body_regular'
                                        sx={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}
                                    >
                                        {dosage} mg
                                    </MenuItem>
                                ))
                            ) : orderData.product_href === 'tirzepatide' ? (
                                 tirz_dosages.map((dosage) => (
                                    <MenuItem 
                                        key={dosage} 
                                        value={dosage}
                                        className='inter_body_regular'
                                        sx={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}
                                    >
                                        {dosage} mg
                                    </MenuItem>
                                ))
                            ) : null}
                        </Select>
                    </FormControl>
                    </div>

                    
                    <div className="flex items-center gap-2 ml-9">
                        <WarningAmberIcon className="text-amber-500" />
                        <span className="text-sm text-gray-600 inter_body_regular w-[200px] ml-1">
                            No checkin data available. Make sure last completed dosage is correct
                        </span>
                    </div>

                </div>
                <DialogContent className='flex flex-col gap-4'>
                    <AdjustDosingDialogContent
                        orderData={orderData}
                        dosingAction={dosingAction}
                        setDosingAction={setDosingAction}
                        // calculateNextDosage={calculateNextDosage}
                        selectedSig={selectedSig}
                        setSelectedSig={setSelectedSig}
                        activeMonth={activeMonth}
                        setActiveMonth={setActiveMonth}
                        sigIsGenerating={sigIsGenerating}
                    />
                </DialogContent>
                <DialogActions>
                    <>
                        <Button
                            onClick={onClose}
                            autoFocus
                            sx={{ 
                                borderRadius: '12px', 
                                backgroundColor: 'white',
                                paddingX: '32px',
                                paddingY: '14px',
                                ":hover": {
                                    backgroundColor: 'lightgray',
                                }
                            }}
                        >
                            <span className='normal-case provider-bottom-button-text  text-red-500'>
                                Cancel
                            </span>
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onConfirm}
                            sx={{ 
                                borderRadius: '12px', 
                                backgroundColor: 'black',
                                paddingX: '32px',
                                paddingY: '14px',
                                ":hover": {
                                    backgroundColor: 'darkslategray',
                                }
                            }}
                        >
                            {isSubmitting ? (
                                <CircularProgress
                                    sx={{ color: '#FFFFFF' }}
                                    size={22}
                                />
                            ) : (
                                <span className='normal-case provider-bottom-button-text  text-white'>
                                    Load in Message Box
                                </span>
                            )}
                        </Button>
                    </>
                </DialogActions>
            </Dialog>
        </>
    );
}



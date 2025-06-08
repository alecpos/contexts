import {
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
} from '@mui/material';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    DosageMapping,
    DosageRanges,
    DOSING_TYPE,
    SEMAGLUTIDE_DOSAGE,
    SigDetails,
    TIRZEPATIDE_DOSAGE,
} from '../../../../intake-response-column/adjust-dosing-dialog/dosing-mappings';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { DosageInfo } from '@/app/types/questionnaires/questionnaire-types';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';

interface AdjustDosingDialogContentProps {
    orderData: DBOrderData;
    // orderDosage: SEMAGLUTIDE_DOSAGE | TIRZEPATIDE_DOSAGE;
    dosingAction: DOSING_TYPE;
    setDosingAction: Dispatch<SetStateAction<DOSING_TYPE>>;
    // calculateNextDosage: (
    //     action: DOSING_TYPE,
    // ) => SEMAGLUTIDE_DOSAGE | TIRZEPATIDE_DOSAGE;
    selectedSig: any;
    setSelectedSig: Dispatch<SetStateAction<any>>;
    activeMonth: number;
    setActiveMonth: Dispatch<SetStateAction<number>>;
    sigIsGenerating: boolean;
}

export enum DosingAction {
    Increase = 'increase',
    Decrease = 'decrease',
    Maintain = 'maintain',
}

export default function AdjustDosingDialogContent({
    orderData,
    dosingAction,
    setDosingAction,
    // calculateNextDosage,
    selectedSig,
    setSelectedSig,
    activeMonth,
    setActiveMonth,
    sigIsGenerating,
}: AdjustDosingDialogContentProps) {
    const { product_href } = orderData;

    const isDecreaseDisabled = false;
    // orderDosage ===
    // DosageRanges[
    //     product_href as PRODUCT_HREF.SEMAGLUTIDE | PRODUCT_HREF.TIRZEPATIDE
    // ]['minimum'];

    const isIncreaseDisabled = false;
    // orderDosage ===
    // DosageRanges[
    //     product_href as PRODUCT_HREF.SEMAGLUTIDE | PRODUCT_HREF.TIRZEPATIDE
    // ]['maximum'];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDosingAction(event.target.value as DOSING_TYPE);
    };

    const displaySigText = () => {
        if (dosingAction === DOSING_TYPE.INCREASE) {
            return (
                <>
                    <BioType className="inter_body_regular text-textSecondary">
                        Hi [PATIENT_FIRST_NAME], <br /> <br />
                        My name is [PROVIDER_NAME], I am a medical provider at
                        BIOVERSE. <br /> <br />
                        Thank you for taking the time to complete the check-in.{' '}
                        <br /> <br />I have reviewed your information and you
                        are approved to continue on your titration schedule. For
                        your convenience, below is your titration schedule:
                    </BioType>

                    {sigIsGenerating ? (
                        <BioType className="inter_body_regular text-primary">
                            <br />
                            Generating... <br />
                        </BioType>
                    ) : (
                        <BioType className="inter_body_regular text-primary">
                            <br />
                            {selectedSig[dosingAction]} <br />
                        </BioType>
                    )}
                    <BioType className="inter_body_regular text-textSecondary">
                        <br />
                        Let us know if you have any questions. We are here to
                        support you. <br /> <br />
                        [PROVIDER_SIGNATURE]
                    </BioType>
                </>
            );
        } else if (dosingAction === DOSING_TYPE.DECREASE) {
            return (
                <>
                    <BioType className="inter_body_regular text-textSecondary">
                        Hi [PATIENT_FIRST_NAME], <br /> <br />
                        My name is [PROVIDER_NAME], I am a medical provider at
                        BIOVERSE. <br /> <br />
                        Thank you for taking the time to complete the check-in.{' '}
                        <br /> <br />I have reviewed your information and based
                        on your response to the medication thus far, I recommend
                        to decrease your dose. Below is your updated recommended
                        titration schedule:
                    </BioType>

                    {sigIsGenerating ? (
                        <BioType className="inter_body_regular text-primary">
                            <br />
                            Generating... <br />
                        </BioType>
                    ) : (
                        <BioType className="inter_body_regular text-primary">
                            <br />
                            {selectedSig[dosingAction]} <br />
                        </BioType>
                    )}
                    <BioType className="inter_body_regular text-textSecondary">
                        <br />
                        Let us know if you have any questions. We are here to
                        support you. <br /> <br />
                        [PROVIDER_SIGNATURE]
                    </BioType>
                </>
            );
        } else if (dosingAction === DOSING_TYPE.MAINTAIN) {
            return (
                <>
                    <BioType className="inter_body_regular text-textSecondary">
                        Hi [PATIENT_FIRST_NAME], <br /> <br />
                        My name is [PROVIDER_NAME], I am a medical provider at
                        BIOVERSE. <br /> <br />
                        Thank you for taking the time to complete the check-in.{' '}
                        <br /> <br /> I have reviewed your information and based
                        on your response to the medication thus far, I recommend
                        staying on the same dose. Below is your recommended
                        updated titration schedule:
                    </BioType>  

                    {sigIsGenerating ? (
                        <BioType className="inter_body_regular text-primary">
                            <br />
                            Generating... <br />
                        </BioType>
                    ) : (
                        <BioType className="inter_body_regular text-primary">
                            <br />
                            {selectedSig[dosingAction]} <br />
                        </BioType>
                    )}
                    <BioType className="inter_body_regular text-textSecondary">
                        <br />
                        Let us know if you have any questions. We are here to
                        support you. <br />
                        <br />
                        [PROVIDER_SIGNATURE]
                    </BioType>
                </>
            );
        }
    };

    const handleChangeMonth = (event: any) => {
        setActiveMonth(Number(event.target.value));
    };

    return (
        <div className="flex flex-col">
            <FormControl>
            
                <RadioGroup value={dosingAction} onChange={handleChange} className='ml-3'>
                    
                    <FormControlLabel
                        value={DosingAction.Increase}
                        control={<Radio />}
                        label={`Continue along titration schedule`}
                        disabled={selectedSig.increase === "N/A"}
                        className='inter_body_regular'
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontFamily: 'Inter, sans-serif',
                            }
                        }}
                    />
                    <FormControlLabel
                        value={DosingAction.Maintain}
                        control={<Radio />}
                        label={`Maintain dosage of previous month`}
                        className='inter_body_regular'
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontFamily: 'Inter, sans-serif',
                            }
                        }}

                    />
                    <FormControlLabel
                        value={DosingAction.Decrease}
                        control={<Radio />}
                        label={`Decrease dosage of previous month`}
                        disabled={selectedSig.decrease === "N/A"}
                        className='inter_body_regular'
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontFamily: 'Inter, sans-serif',
                            }
                        }}
                    />
            
                    <div className='h-4'></div>
                </RadioGroup>
            </FormControl>


            <div className='flex flex-row'>
                <p className='ml-5 mt-8 mr-5 inter_body_bold'>Select Month</p>

                <div className='w-[140px] mt-3'>
                    <FormControl fullWidth>
                        
                    <Select
                        id="demo-simple-select"
                        value={activeMonth}
                        onChange={handleChangeMonth}
                        sx={{
                            '& .MuiSelect-select': {
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '16px',
                                color: 'rgba(0, 0, 0, 0.87)'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '16px',
                                color: 'rgba(0, 0, 0, 0.87)'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.87)'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#286BA2'
                            }
                        }}
                    >
                    <MenuItem value={2} sx={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Month 2</MenuItem>
                    <MenuItem value={3} sx={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Month 3</MenuItem>
                    <MenuItem value={4} sx={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Month 4</MenuItem>
                    <MenuItem value={5} sx={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Month 5</MenuItem>
                    <MenuItem value={6} sx={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Month 6</MenuItem>
                    </Select>
                </FormControl>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="w-full h-[1px] bg-gray-300 mt-4"></div>
                <BioType className="inter_body_bold text-[22px] mt-3 ml-1">Generated Sig</BioType>
                <BioType className="inter_body_regular mb-3 mt-1 ml-1">
                        You will be able to edit this sig once loaded in your
                        message box
                    </BioType>
                    <div className="  rounded-md flex flex-col space-y-2">
                        <div className="inter_body_regular text-weak p-5 bg-gray-50">
                            {displaySigText()}
                        </div>
                    </div>
                </div>
        </div>
    );
}

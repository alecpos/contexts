'use client';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import DividerHers from './DividerHers';

interface WLCapsuleSafetyInformationDialogProps {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

export default function WLCapsuleSafetyInformationDialog({
    openDialog,
    setOpenDialog,
}: WLCapsuleSafetyInformationDialogProps) {
    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '16px', // Apply border-radius here
                },
            }}
            PaperProps={{
                sx: {
                    maxWidth: '650px', // Apply maxWidth correctly
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <BioType className="intake-v3-18px-20px">
                    Important safety information
                </BioType>
                <div
                    onClick={() => setOpenDialog(false)}
                    style={{
                        borderRadius: '100px',
                        background: 'var(--background-paper-elevation-3, #FFF)',
                        boxShadow: `
      0px 1px 8px 0px rgba(0, 0, 0, 0.12), 
      0px 3px 4px 0px rgba(0, 0, 0, 0.14), 
      0px 3px 3px -2px rgba(0, 0, 0, 0.20)
    `,
                        padding: '16px', // Reduced padding by 20%
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '20px', // Adjust width (optional, depending on the original size)
                        height: '20px', // Adjust height (optional)
                    }}
                    className="hover:cursor-pointer"
                >
                    <CloseIcon sx={{ color: '#4D4D4D73' }} />
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-4 text-weak">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <BioType className="intake-subtitle-bold text-weak">
                                Serious Side Effects (Seek Medical Attention
                                Immediately)
                            </BioType>

                            <ul className="list-disc marker:text-[#333333bf] ml-6">
                                <li>
                                    <BioType className="intake-subtitle">
                                        Mood or Mental Health Changes: Bupropion
                                        and Naltrexone can sometimes lead to
                                        mood swings, depression, suicidal
                                        thoughts, or unusual behavioral changes.
                                        Seek immediate help if you or someone
                                        else notices these symptoms.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Allergic Reactions: Signs include rash,
                                        itching, swelling (especially of the
                                        face/tongue/throat), severe dizziness,
                                        or trouble breathing.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Seizures: Individuals with a history of
                                        seizures or predisposing factors (such
                                        as abrupt alcohol withdrawal or eating
                                        disorders) are at an increased risk.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Liver Issues: Symptoms include yellowing
                                        of the skin or eyes (jaundice), dark
                                        urine, severe abdominal pain, or
                                        persistent nausea.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Eye Conditions: Any sudden blurred
                                        vision, eye pain, or redness should be
                                        evaluated immediately, as Topiramate can
                                        cause serious ocular side effects.
                                    </BioType>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <DividerHers />
                    <div className="flex flex-col gap-4">
                        <BioType className="intake-subtitle-bold">
                            Who should avoid Bioverse Weight Loss Capsules?
                        </BioType>
                        <div className="flex flex-col">
                            <BioType className="intake-subtitle">
                                Do not take Bioverse Weight Loss Capsules if
                                you:{' '}
                            </BioType>

                            <ul className="list-disc marker:text-[#333333bf] ml-6">
                                <li>
                                    <BioType className="intake-subtitle">
                                        Have a history of seizures or epilepsy
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Have uncontrolled high blood pressure or
                                        heart disease
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Are pregnant, trying to become pregnant,
                                        or breastfeeding
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Have severe liver or kidney disease
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Are taking opioid medications or have a
                                        dependency on opioids
                                    </BioType>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

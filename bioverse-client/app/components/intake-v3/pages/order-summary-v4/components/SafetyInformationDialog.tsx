'use client';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import DividerHers from './DividerHers';

interface SafetyInformationDialogProps {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

export default function SafetyInformationDialog({
    openDialog,
    setOpenDialog,
}: SafetyInformationDialogProps) {
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
                            <BioType className="intake-subtitle-bold ">
                                INDICATION
                            </BioType>
                            <BioType className="intake-subtitle">
                                COMPOUNDED SEMAGLUTIDE (Wegovy™) is a
                                glucagon-like peptide-1 (GLP-1) receptor agonist
                                indicated as an adjunct to a reduced-calorie
                                diet and increased physical activity for chronic
                                weight management in adults with an initial body
                                mass index (BMI) of:
                            </BioType>
                        </div>
                        <ul className="list-disc marker:text-[#333333bf] ml-6">
                            <li>
                                <BioType className="intake-subtitle ml-2">
                                    &gt; 27 kg/m2 or greater (overweight or
                                    obesity)
                                </BioType>
                            </li>
                        </ul>
                        <div className="flex flex-col">
                            <BioType className="intake-subtitle">
                                Limitations of Use:
                            </BioType>
                            <ul className="list-disc marker:text-[#333333bf] ml-6">
                                <li>
                                    <BioType className="intake-subtitle">
                                        Co-administration with other COMPOUNDED
                                        SEMAGLUTIDE-containing products or any
                                        GLP-1 receptor agonist is not
                                        recommended.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        The safety and efficacy of
                                        coadministration with other products for
                                        weight management have not been
                                        established.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        COMPOUNDED SEMAGLUTIDE has not been
                                        studied in patients with a history of
                                        pancreatitis.
                                    </BioType>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <DividerHers />
                    <div className="flex flex-col gap-4">
                        <BioType className="intake-subtitle-bold">
                            IMPORTANT SAFETY INFORMATION
                        </BioType>
                        <div className="flex flex-col">
                            <BioType className="intake-subtitle">
                                WARNING: RISK OF THYROID C-CELL TUMORS
                            </BioType>
                            <BioType className="intake-subtitle">
                                See full prescribing information for complete
                                boxed warning.
                            </BioType>
                        </div>
                        <ul className="list-disc marker:text-[#333333bf] ml-6">
                            <li>
                                <BioType className="intake-subtitle">
                                    In rodents, SEMAGLUTIDE causes thyroid
                                    C-cell tumors in clinically relevant
                                    exposures. It is unknown whether SEMAGLUTIDE
                                    causes thyroid C-cell tumors, including
                                    medullary thyroid carcinoma (MTC), in humans
                                    as the human relevance of
                                    SEMAGLUTIDE-induced rodent thyroid C-cell
                                    tumors has not been determined
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-subtitle">
                                    SEMAGLUTIDE is contraindicated in patients
                                    with a personal or family history of MTC or
                                    in patients with Multiple Endocrine
                                    Neoplasia syndrome type 2 (MEN 2). Counsel
                                    patients regarding the potential risk of MTC
                                    and symptoms of thyroid tumors.
                                </BioType>
                            </li>
                        </ul>
                        <BioType className="intake-subtitle">
                            Do not take COMPOUNDED SEMAGLUTIDE if you:
                        </BioType>
                        <ul className="list-disc marker:text-[#333333bf] ml-6">
                            <li>
                                <BioType className="intake-subtitle">
                                    Have a personal or family history of
                                    medullary thyroid carcinoma (MTC) or in
                                    patients with Multiple Endocrine Neoplasia
                                    syndrome type 2 (MEN2).
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-subtitle">
                                    Have been diagnosed with Diabetes (Type 1 or
                                    2)
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-subtitle">
                                    Have been diagnosed with pancreatitis or
                                    history of pancreatitis{' '}
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-subtitle">
                                    Have severe problems with your stomach, such
                                    as slowed emptying of your stomach
                                    (gastroparesis) or problems with digesting
                                    food{' '}
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-subtitle">
                                    Have a known allergy to semaglutide/any
                                    other GLP-1 drug or any of the inactive
                                    ingredients in COMPOUNDED SEMAGLUTIDE.
                                    Inactive ingredients include: di-sodium
                                    hydrogen phosphate dihydrate, sodium
                                    chloride, benzyl alcohol, hydrochloric acid,
                                    sodium hydroxide pellets and water.
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-subtitle">
                                    Have a history of suicidal attempts or
                                    active suicidal ideation
                                </BioType>
                            </li>
                        </ul>
                    </div>
                    <DividerHers />
                    <BioType className="intake-subtitle-bold ">
                        WARNINGS AND PRECAUTIONS
                    </BioType>
                    <ul className="list-disc marker:text-[#333333bf] ml-6">
                        <li>
                            <BioType className="intake-subtitle">
                                Acute Pancreatitis: Has occurred in clinical
                                trials. Discontinue promptly if pancreatitis is
                                suspected. Do not restart if pancreatitis is
                                confirmed.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Acute Gallbladder Disease: Has occurred in
                                clinical trials. If cholelithiasis is suspected,
                                gallbladder studies and clinical follow-up are
                                indicated.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Hypoglycemia: Concomitant use with an insulin
                                secretagogue or insulin may increase the risk of
                                hypoglycemia, including severe hypoglycemia.
                                Reducing the dose of insulin secretagogue or
                                insulin may be necessary. Inform all patients of
                                the risk of hypoglycemia and educate them on the
                                signs and symptoms of hypoglycemia.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Acute Kidney Injury: Has occurred. Monitor renal
                                function when initiating or escalating doses of
                                COMPOUNDED SEMAGLUTIDE in patients reporting
                                severe adverse gastrointestinal reactions or in
                                those with renal impairment reporting severe
                                adverse gastrointestinal reactions.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Hypersensitivity Reactions: Anaphylactic
                                reactions and angioedema have been reported
                                postmarketing. Discontinue COMPOUNDED
                                SEMAGLUTIDE if suspected and promptly seek
                                medical advice.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Females and males of reproductive potential:
                                Discontinue COMPOUNDED SEMAGLUTIDE at least 2
                                months before a planned pregnancy because of the
                                long half-life of COMPOUNDED SEMAGLUTIDE.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Pregnancy: May cause fetal harm. When pregnancy
                                is recognized, discontinue COMPOUNDED
                                SEMAGLUTIDE immediately
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Diabetic Retinopathy Complications in Patients
                                with Type 2 Diabetes: Has been reported in
                                trials with COMPOUNDED SEMAGLUTIDE. Patients
                                with a history of diabetic retinopathy should be
                                monitored.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Heart Rate Increase: Monitor heart rate at
                                regular intervals.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Suicidal Behavior and Ideation: Monitor for
                                depression or suicidal thoughts. Discontinue
                                COMPOUNDED SEMAGLUTIDE if symptoms develop.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Side Effects
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Most common side effects (incidence ≥ 5%) in
                                adults or pediatric patients aged 12 years and
                                older are: nausea, diarrhea, vomiting,
                                constipation, abdominal pain, headache, fatigue,
                                dyspepsia, dizziness, abdominal distension,
                                eructation, hypoglycemia in patients with type 2
                                diabetes, flatulence, gastroenteritis,
                                gastroesophageal reflux disease, and
                                nasopharyngitis. To report SUSPECTED ADVERSE
                                REACTIONS, contact the FDA at 1-800-FDA-1088 or
                                www.fda.gov/medwatch.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                DRUG INTERACTIONS
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                COMPOUNDED SEMAGLUTIDE delays gastric emptying.
                                May impact absorption of concomitantly
                                administered oral medications. Use with caution.
                            </BioType>
                        </li>
                    </ul>
                    <DividerHers />
                    <BioType className="intake-subtitle-bold ">
                        USE IN SPECIFIC POPULATIONS
                    </BioType>
                    <ul className="list-disc marker:text-[#333333bf] ml-6">
                        <li>
                            <BioType className="intake-subtitle">
                                Pregnancy: May cause fetal harm. When pregnancy
                                is recognized, discontinue COMPOUNDED
                                SEMAGLUTIDE.
                            </BioType>
                        </li>
                        <li>
                            <BioType className="intake-subtitle">
                                Females and Males of Reproductive Potential:
                                Discontinue COMPOUNDED SEMAGLUTIDE at least 2
                                months before a planned pregnancy because of the
                                long half-life of COMPOUNDED SEMAGLUTIDE.
                            </BioType>
                        </li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}

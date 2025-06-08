import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dialog, DialogContent, DialogTitle, Paper } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface HSAInformationDialogProps {
    openHSADialog: boolean;
    setOpenHSADialog: Dispatch<SetStateAction<boolean>>;
    product_href: PRODUCT_HREF;
}

export default function HSAInformationDialogHardcoded({
    openHSADialog,
    setOpenHSADialog,
    product_href,
}: HSAInformationDialogProps) {
    const getSavingsAnswer = () => {
        const monthPlanText = '3 month plan';
        if (product_href === PRODUCT_HREF.METFORMIN) {
            return `FSAs and HSAs are funded with pre-tax dollars from your paycheck and exactly how much you save depends on your tax rate. The average savings is 30% based on average state and federal tax rates – so for example, 30% equals $16.50 with a ${monthPlanText} ($55 payable up front).`;
        } else {
            return `FSAs and HSAs are funded with pre-tax dollars from your paycheck and exactly how much you save depends on your tax rate. The average savings is 30% based on average state and federal tax rates – so for example, 30% equals $59.70 with a ${monthPlanText} ($199 payable up front).`;
        }
    };
    const HSAInformation = [
        {
            question: 'What is FSA/HSA?',
            answer: [
                'Both FSAs (Flexible Savings Accounts) and HSAs (Health Savings Accounts) allow you to set aside pre-taxed dollars from your paycheck to use for eligible medical expenses. You could save an average of 30% based on state and federal tax rates.',
            ],
        },
        {
            question: 'What is eligible for reimbursement?',
            answer: [
                'The full amount of your GLP-1 injectiable or oral weight loss medication kit is considered.',
            ],
        },
        {
            question: 'How much can I get reimbursed?',
            answer: [
                'The full amount of your weight loss medical expenses is eligible for reimbursement. Exactly how much you get reimbursed depends on funds available in your FSA or HSA. Please following the guidelines and terms/conditions of your plan.',
            ],
        },
        {
            question: 'How much can I save?',
            answer: [getSavingsAnswer()],
        },
        {
            question: 'Can I use my FSA/HSA card?',
            answer: [
                'We recommend using a valid credit card or debit card and submitting reimbursement.',
                'Payment with FSA/HSA card may require additional steps from your provider. If you happen to use your FSA/HSA card your provider may reach out to request a receipt for reimbursement before processing the payment.',
                'If this happens, head to the "orders" tab to find your receipt. From there, you can download your receipt and follow your HSA/FSAs provider\'s reimbursement instructions.',
            ],
        },
    ];

    return (
        <Dialog
            open={openHSADialog}
            onClose={() => setOpenHSADialog(false)}
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
            <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                    onClick={() => setOpenHSADialog(false)}
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
                <div className="flex justify-center md:px-8 pb-8 mt-2">
                    <div className="flex flex-col space-y-8">
                        {HSAInformation.map((item, index) => (
                            <div
                                className="flex flex-col space-y-4"
                                key={index}
                            >
                                <BioType className="intake-subtitle text-[20px] text-black">
                                    {item.question}
                                </BioType>
                                <div className="flex flex-col space-y-4">
                                    {item.answer.map((answer, index) => (
                                        <BioType
                                            key={index}
                                            className="intake-subtitle text-weak text-[16px]"
                                        >
                                            {answer}
                                        </BioType>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

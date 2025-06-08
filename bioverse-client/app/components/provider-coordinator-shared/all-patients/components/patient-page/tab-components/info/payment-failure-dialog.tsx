import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { fetchPaymentFailureLogsForOrder } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import useSWR from 'swr';
import CloseIcon from '@mui/icons-material/Close';

interface PaymentFailureHistoryDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    order_id: string;
}

export default function PaymentFailureHistoryDialog({
    open,
    setOpen,
    order_id,
}: PaymentFailureHistoryDialogProps) {
    const {
        data: paymentFailures,
        error: paymentFailuresError,
        isLoading: paymentFailuresLoading,
    } = useSWR(`payment-failure-${order_id}`, () =>
        fetchPaymentFailureLogsForOrder(order_id),
    );

    const formatCreatedDate = (date_str: string) => {
        const date = new Date(date_str);

        const formattedDate = date
            .toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            })
            .replace(',', ' at');

        return formattedDate;
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <BioType className="intake-subtitle text-black text-[24px] mt-2">
                    Payment Failure History
                </BioType>
                <div
                    onClick={() => setOpen(false)}
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
                <div className="flex flex-col px-4 mt-4">
                    {paymentFailures?.map((failure, index) => (
                        <div
                            key={index}
                            className={`flex w-full justify-between  py-6 ${
                                index % 2 == 1 ? 'bg-gray-100' : 'bg-[#d4e1ec]'
                            } ${index === 0 && 'rounded-t-md'} ${
                                index === paymentFailures.length - 1 &&
                                'rounded-b-md'
                            }`}
                        >
                            <BioType className="intake-subtitle text-black ml-4">
                                Attempt {paymentFailures.length - index}
                            </BioType>
                            <BioType className="intake-subtitle text-black mr-4">
                                {formatCreatedDate(failure.created_at)}
                            </BioType>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

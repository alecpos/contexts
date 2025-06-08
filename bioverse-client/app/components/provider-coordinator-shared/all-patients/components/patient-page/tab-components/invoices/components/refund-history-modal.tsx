import { getRefundAuditForPaymentIntent } from '@/app/utils/database/controller/stripe_audit/stripe_audit';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TableCell,
    TableHead,
    TableRow,
    Table,
    TableBody,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface RefundConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    payment_intent_id: string;
}

export default function RefundHistoryDialog({
    open,
    onClose,
    payment_intent_id,
}: RefundConfirmationDialogProps) {
    const [refunds, setRefunds] = useState<any[]>();
    const {
        data: refund_list_object,
        error: error_pi,
        isLoading: loading_pi,
    } = useSWR(`${payment_intent_id}-refund-audit`, () =>
        getRefundAuditForPaymentIntent(payment_intent_id)
    );

    useEffect(() => {
        if (refund_list_object && refund_list_object.refunds) {
            setRefunds(refund_list_object.refunds);
        }
    }, [refund_list_object]);

    function formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    }

    console.log('lelelele', refunds);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle id='alert-dialog-title'>Refund History</DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-2 p-2'>
                    <div>
                        <DialogContentText id='alert-dialog-description'>
                            {refunds && (
                                <>
                                    <Table>
                                        <TableHead>
                                            <TableCell>Date</TableCell>
                                            <TableCell>
                                                Amount Refunded
                                            </TableCell>
                                            <TableCell>Refunded By</TableCell>
                                            <TableCell>Reason</TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {refunds.map((refund) => (
                                                <TableRow key={refund.event_id}>
                                                    <TableCell>
                                                        {formatTimestamp(
                                                            refund.created_at
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {(
                                                            refund.request_data
                                                                .amount / 100
                                                        ).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {refund.profile
                                                            ? `${refund.profile.first_name} ${refund.profile.last_name}`
                                                            : 'Untracked'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {refund.metadata
                                                            ? refund.metadata
                                                                  .reason
                                                            : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                        </DialogContentText>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

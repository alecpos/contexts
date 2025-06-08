import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import {
    processAutomaticEmpowerScript,
    processCustomPrescriptionEmpowerScript,
} from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { getDisplayNameForVariantGLP1Swap } from '@/app/services/pharmacy-integration/variant-swap/glp1-variant-index-swap';
import { Status } from '@/app/types/global/global-enumerators';
import { ScriptSource } from '@/app/types/orders/order-types';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import {
    getAllGLP1OrdersForProduct,
    getAllOrdersForProduct,
} from '@/app/utils/database/controller/orders/orders-api';
import { formatDateToMMDDYYYY } from '@/app/utils/functions/client-utils';
import { formatDateNonAsync } from '@/app/utils/functions/formatting';
import { formatDate } from '@/app/utils/functions/provider-portal/messages/admin-message-center';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import useSWR from 'swr';

interface CustomPrescriptionConfirmationDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    script: EmpowerGeneratedScript | undefined;
    profile_data: APProfileData;
    product_href: string;
    mutateSnackbar: (message: string, type: 'success' | 'error') => void;
    setOpenSnackbar: Dispatch<SetStateAction<boolean>>;
    pharmacy: string;
    user_id: string;
}

export default function CustomPrescriptionConfirmationDialog({
    open,
    setOpen,
    script,
    profile_data,
    product_href,
    mutateSnackbar,
    setOpenSnackbar,
    user_id,
    pharmacy,
}: CustomPrescriptionConfirmationDialogProps) {
    const [selectedOrder, setSelectedOrder] = useState<number>(-1);
    const {
        data: ordersList,
        error,
        isLoading,
    } = useSWR(
        `${profile_data.id}-orders-list`,
        async () => await getAllOrdersForProduct(profile_data.id, product_href),
    );

    if (isLoading) {
        return <LoadingScreen />;
    }
    console.log(ordersList);

    const handleSendScript = async () => {
        if (selectedOrder === -1 || !ordersList) {
            mutateSnackbar('Please select an order to continue', 'error');
            setOpenSnackbar(true);
            return;
        }

        if (!script) {
            mutateSnackbar('Error loading script', 'error');
            setOpenSnackbar(true);
            return;
        }

        const order = ordersList[selectedOrder];

        if (pharmacy === PHARMACY.EMPOWER) {
            const status = await processCustomPrescriptionEmpowerScript(
                script,
                order.order_id,
                order.assigned_provider,
                ScriptSource.Engineer,
                user_id,
                product_href,
                profile_data.id,
            );

            if (status === Status.Success) {
                mutateSnackbar('Successfully sent script!', 'success');
                setOpenSnackbar(true);
                setOpen(false);
            }
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                <BioType className="">Confirm Prescription Script</BioType>
            </DialogTitle>
            <DialogContent>
                {script?.script.newRxs.map(
                    (rx: EmpowerNewRx, index: number) => {
                        return (
                            <div key={index} className="py-2 w-full">
                                <BioType className="intake-v3-question-text text-primary">
                                    Medication:{' '}
                                    <span className="intake-v3-question-text text-[#000000]">
                                        {rx.medication.drugDescription}
                                    </span>
                                </BioType>
                                <BioType className="intake-v3-question-text text-primary">
                                    Quantity:{' '}
                                    <span className="text-black">
                                        {rx.medication.quantity}
                                    </span>
                                </BioType>
                                <BioType className="intake-v3-question-text text-primary">
                                    Days Supply:{' '}
                                    <span className="text-black">
                                        {rx.medication.daysSupply}
                                    </span>
                                </BioType>
                                <BioType className="intake-v3-question-text text-primary">
                                    Sig:{' '}
                                    <span className="intake-v3-question-text text-[#000000]">
                                        {script.sigs[index]}
                                    </span>
                                </BioType>
                            </div>
                        );
                    },
                )}
                <div className="flex flex-col space-y-4 mt-4">
                    <BioType className="inter-h5-question-header-bold">
                        Select the order this is for
                    </BioType>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label-variant-orders">
                            Select an Order
                        </InputLabel>
                        <Select
                            label="Select Variant"
                            value={selectedOrder}
                            onChange={(e) =>
                                setSelectedOrder(e.target.value as number)
                            }
                        >
                            <MenuItem value={-1} disabled>
                                Select Order
                            </MenuItem>
                            {ordersList?.map(
                                (
                                    order: CustomPrescriptionOrder,
                                    index: number,
                                ) => (
                                    <MenuItem key={index} value={index}>
                                        {`${formatDateNonAsync(
                                            new Date(order.created_at),
                                        )} - #${order.order_id}`}
                                    </MenuItem>
                                ),
                            )}
                        </Select>
                    </FormControl>
                    <div className="flex justify-end space-x-2">
                        <Button variant="contained" color="error">
                            <BioType
                                className="intake-v3-question-text font-bold"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </BioType>
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendScript}
                        >
                            <BioType className="intake-v3-question-text font-bold">
                                Send Custom Script
                            </BioType>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

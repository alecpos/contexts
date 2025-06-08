'use client';

import { useState, useEffect, Fragment } from 'react';

import {
    createUserStatusTagWAction,
    getUserStatusTags,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    Button,
    Chip,
    FormControl,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dialog, Transition } from '@headlessui/react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import useSWR, { mutate } from 'swr';

import {
    StatusTagAction,
    StatusTagSelectLabel,
} from '@/app/types/status-tags/status-types';
import { statusInfo } from '@/app/constants/components/status-dropdown-constants';
import { useParams } from 'next/navigation';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { updateRenewalOrderByRenewalOrderId } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getOrderType } from '@/app/utils/actions/intake/order-util';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { OrderStatus } from '@/app/types/orders/order-types';

const ReviewModal = ({
    isModalOpen,
    setIsModalOpen,
    orderData,
    renewal_thread_data,
}: {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orderData: DBOrderData;
    renewal_thread_data: any;
}) => {
    const [userId, setUserId] = useState<string>('');
    const [noteMessage, setNoteMessage] = useState('');

    const [selectedOrderId, setSelectedOrderId] = useState<string>('');

    useEffect(() => {
        (async () => {
            const user_id = (await readUserSession()).data.session?.user.id;

            setUserId(user_id!);
        })();
    }, []);

    const handleSendToProvider = async (event: any) => {
        if (!selectedOrderId || !noteMessage) {
            return;
        }
        const orderType = await getOrderType(selectedOrderId);

        if (!selectedOrderId.includes('-')) {
            const updated_payload = {
                order_status: OrderStatus.UnapprovedCardDown,
            };

            await updateOrder(parseInt(selectedOrderId), updated_payload);
        }

        await createUserStatusTagWAction(
            StatusTagSelectLabel.Review,
            selectedOrderId,
            StatusTagAction.REPLACE,
            orderData.customer_uid,
            noteMessage,
            userId!,
            [StatusTagSelectLabel.Review],
            true,
        );
        setIsModalOpen(false);
        setSelectedOrderId('');
        setNoteMessage('');
    };

    return (
        <div>
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setIsModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-screen items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[410px] h-[410px] transform overflow-y-scroll rounded-md bg-white p-10 text-left align-middle shadow-xl transition-all flex flex-col items-center justify-center">
                                    <BioType className="h6 text-primary ">
                                        Details
                                    </BioType>

                                    <FormControl fullWidth margin="normal">
                                        <BioType className={`body1`}>
                                            Please select the order that you
                                            want to send to the provider.
                                        </BioType>
                                        {/* Now only show 1 order in drop down */}
                                        <Select
                                            value={selectedOrderId}
                                            onChange={(e) =>
                                                setSelectedOrderId(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {(!renewal_thread_data ||
                                                renewal_thread_data.length ===
                                                    0) && (
                                                <MenuItem
                                                    value={String(orderData.id)}
                                                >
                                                    {orderData.id} ---
                                                    {orderData.order_status}
                                                </MenuItem>
                                            )}

                                            {renewal_thread_data?.length >
                                                0 && (
                                                <MenuItem
                                                    value={
                                                        renewal_thread_data.at(
                                                            -1,
                                                        ).renewal_order_id
                                                    }
                                                >
                                                    {
                                                        renewal_thread_data.at(
                                                            -1,
                                                        ).renewal_order_id
                                                    }{' '}
                                                    ---{' '}
                                                    {
                                                        renewal_thread_data.at(
                                                            -1,
                                                        ).order_status
                                                    }
                                                </MenuItem>
                                            )}

                                            {/* {renewal_thread_data &&
                                                renewal_thread_data.map(
                                                    (
                                                        renewal_order: RenewalOrder,
                                                        index: number,
                                                    ) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={
                                                                renewal_order.renewal_order_id
                                                            }
                                                        >
                                                            {
                                                                renewal_order.renewal_order_id
                                                            }{' '}
                                                            ---{' '}
                                                            {
                                                                renewal_order.order_status
                                                            }
                                                        </MenuItem>
                                                    ),
                                                )} */}
                                        </Select>

                                        <BioType className={` body1 pt-4`}>
                                            Please provide a note for the
                                            provider.
                                        </BioType>
                                        <TextField
                                            multiline
                                            minRows={3}
                                            placeholder="Note"
                                            sx={{ width: 'full' }}
                                            value={noteMessage}
                                            required
                                            onChange={(e) =>
                                                setNoteMessage(e.target.value)
                                            }
                                        />
                                        <div className="flex justify-center mt-4">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                onClick={handleSendToProvider}
                                            >
                                                Send to provider for review
                                            </Button>
                                        </div>
                                    </FormControl>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ReviewModal;

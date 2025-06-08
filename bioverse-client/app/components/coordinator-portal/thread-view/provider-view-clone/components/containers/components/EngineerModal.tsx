'use client';

import { useState, useEffect, Fragment } from 'react';

import {
    createUserStatusTagWAction,
    getUserStatusTags,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { Button, Chip, TextField } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dialog, Transition } from '@headlessui/react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import useSWR, { mutate } from 'swr';

import {
    StatusTag,
    StatusTagAction,
    StatusTagSelectLabel,
} from '@/app/types/status-tags/status-types';
import { statusInfo } from '@/app/constants/components/status-dropdown-constants';
import { useParams } from 'next/navigation';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';

const EngineerModal = ({
    threadId,
    isModalOpen,
    setIsModalOpen,
    orderData,
    renewal_thread_data,
}: {
    threadId: number;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orderData: DBOrderData;
    renewal_thread_data:any
}) => {

    const [userId, setUserId] = useState<string>('');
    const [noteMessage, setNoteMessage] = useState('');

    const [statusTagSelected, setStatusTagSelected] = useState<string>('');

    const [userStatusTags, setUserStatusTags] = useState<string[]>([]);

    const {
        data: statusTags,
        error: statusTagsError,
        isLoading: statusTagsLoading,
        mutate: mutateTags,
    } = useSWR(`${orderData.customer_uid}-status-Tags`, () =>
        getUserStatusTags(orderData.customer_uid, orderData.id)
    );

    useEffect(() => {
        if (statusTags && statusTags.data && statusTags.data.status_tags) {
            setUserStatusTags(statusTags.data.status_tags);
        }
    }, [statusTags]);

    useEffect(() => {
        (async () => {
            const user_id = (await readUserSession()).data.session?.user.id;

            setUserId(user_id!);
        })();
    }, []);

    const handleTagInsert = async (event: any) => {
        event.preventDefault();

        const note =
        'Coordinator Message thread Url: ' +
        window.location.href +
        ' -------- ' +
        noteMessage;
        if(renewal_thread_data && renewal_thread_data.length>0){
            await createUserStatusTagWAction(
                StatusTagSelectLabel.Engineer,
                renewal_thread_data[renewal_thread_data.length-1].renewal_order_id,
                StatusTagAction.REPLACE,
                orderData.customer_uid,
                note,
                userId!,
                [StatusTagSelectLabel.Engineer]
            );
            
        }else{
            await createUserStatusTagWAction(
                StatusTagSelectLabel.Engineer,
                orderData.id,
                StatusTagAction.REPLACE,
                orderData.customer_uid,
                note,
                userId!,
                [StatusTagSelectLabel.Engineer]
            );

        }
        setNoteMessage('');
        setIsModalOpen(false);
        mutateTags();
    };
    return (
        <div>
            <div className='flex gap-1'>
                {statusTags &&
                    statusTags.data &&
                    statusTags.data.status_tags?.includes(StatusTag.Engineer) &&
                    statusTags?.data?.status_tags?.map((status, index) => (
                        <Chip
                            key={index}
                            // clickable
                            // onClick={() => {
                            //     setIsModalOpen(true);
                            // }}
                            label={
                                <BioType className='itd-body text-[18px]'>
                                    • In Engineer Queue for review
                                </BioType>
                            }
                            color='primary'
                            variant='outlined'
                            sx={{
                                borderColor: statusInfo[status].color,
                                color: statusInfo[status].color,
                                '& .MuiChip-deleteIcon': {
                                    color: statusInfo[status].color,
                                },
                            }}
                            // onDelete={() => {
                            //     handleStatusTagDelete(status);
                            // }}
                            // deleteIcon={<ClearIcon />}
                        />
                    ))}
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10'
                    onClose={() => setIsModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/25' />
                    </Transition.Child>

                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-screen items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-[410px] h-[410px] transform overflow-y-scroll rounded-md bg-white p-10 text-left align-middle shadow-xl transition-all flex flex-col items-center justify-center'>
                                    <BioType className='h6 text-primary '>
                                        Engineer Tag details
                                    </BioType>
                                    <BioType className={` body1 pb-4`}>
                                        Please provide any useful information
                                        that can help us solve the problem in
                                        the note
                                    </BioType>
                                    <form
                                        onSubmit={handleTagInsert}
                                        className='flex flex-col gap-6'
                                    >
                                        <TextField
                                            multiline
                                            minRows={3}
                                            placeholder='Note'
                                            sx={{ width: '366px' }}
                                            value={noteMessage}
                                            required
                                            onChange={(e) =>
                                                setNoteMessage(e.target.value)
                                            }
                                        />
                                        <div className='flex justify-center'>
                                            <Button
                                                type='submit'
                                                variant='contained'
                                            >
                                                SEND TO ENGINEER
                                            </Button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default EngineerModal;

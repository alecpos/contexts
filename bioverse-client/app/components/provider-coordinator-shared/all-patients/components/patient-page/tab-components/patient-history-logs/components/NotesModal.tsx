'use client';

import { Fragment } from 'react';
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { Dialog, Transition } from '@headlessui/react';

const NotesModal = ({
    isModalOpen,
    setIsModalOpen,
    notes,
}: {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    notes: any;
}) => {
    return (
        <div>
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
                                <Dialog.Panel className='max-w-[710px] mt-20 sm:mt-0 transform overflow-y-scroll rounded-md bg-white p-10 text-left align-middle shadow-xl transition-all flex flex-col items-center justify-center space-y-8'>
                                    <h2 className='text-lg font-medium text-gray-900 mb-4'>
                                        Notes
                                    </h2>
                                    <div className='w-full flex flex-col'>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ width: '100%' }}>
                                                <TableHead>
                                                    <TableCell>Field</TableCell>
                                                    <TableCell>Value</TableCell>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.keys(notes).map(
                                                        (key, index) => {
                                                            return (
                                                                <TableRow
                                                                    key={index}
                                                                >
                                                                    <TableCell>
                                                                        {key}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            notes[
                                                                                key
                                                                            ]
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        }
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};
export default NotesModal;

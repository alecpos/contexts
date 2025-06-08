'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import StatusDropdown from '@/app/components/provider-coordinator-shared/order-charts/components/StatusDropdown';
import { TableRow, TableCell, Button, TextField } from '@mui/material';
import Link from 'next/link';
import EngineeringAssignmentDropdown from '../dashboard/assignment-dropdown';
import EngPortalSpecialCaseDropDown from '../dashboard/special-case-dropdown';
import { KeyedMutator } from 'swr';
import { useState } from 'react';
import { setStatusTagMetadata } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

interface EngineeringTableItemProps {
    order: PatientOrderEngineerDetails;
    mutate_intake_list: KeyedMutator<PatientOrderEngineerDetails[]>;
    current_user_id: string;
}

export default function EngineeringTableItem({
    order,
    mutate_intake_list,
    current_user_id,
}: EngineeringTableItemProps) {
    const [isCommenting, setIsCommenting] = useState<boolean>(false);
    const [writtenComment, setWrittenComment] = useState<string>('');

    const addCommentToOrder = async () => {
        const current_comments = order.metadata.eng_comment ?? [];
        const new_comment_array = [writtenComment, ...current_comments];

        await setStatusTagMetadata(
            order.tag_id,
            'eng_comment',
            new_comment_array
        );

        setWrittenComment('');
        mutate_intake_list;
        setIsCommenting(false);
    };

    const convertCreatedAtToDaysOrHours = (
        timestamp: string | undefined
    ): string => {
        if (!timestamp) {
            return 'Not Tracked';
        }

        // Parse the timestamp into a Date object
        const createdAt = new Date(timestamp);

        // Get the current date and time
        const now = new Date();

        // Calculate the difference in milliseconds
        const differenceMs = now.getTime() - createdAt.getTime();

        // Convert the difference to days and hours
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        // Return the formatted string
        return `${days} D : ${hours} H`;
    };

    return (
        <TableRow
            key={order.tag_id}
            sx={{
                '&:last-child td, &:last-child th': {
                    border: 0,
                },
            }}
        >
            <TableCell component='th' scope='row'>
                <EngPortalSpecialCaseDropDown
                    tagId={order.tag_id!}
                    special_case_value={order.metadata.renewalSpecialCase}
                    mutate_intake_list={mutate_intake_list}
                />
            </TableCell>

            <TableCell component='th' scope='row'>
                <Link
                    target='_blank'
                    className='text-primary no-underline hover:underline'
                    href={`/provider/all-patients/${order.patient_id}`}
                >
                    <BioType className='body1 text-primary'>
                        BV-{order.order_id}
                    </BioType>
                </Link>
            </TableCell>

            <TableCell>
                <div className='flex flex-col'>
                    <BioType className='body1'>{order.note}</BioType>

                    {order.metadata.eng_comment && (
                        <div className='flex flex-col p-2'>
                            <BioType className='flex itd-input'>
                                Comments:{' '}
                            </BioType>
                            {order.metadata.eng_comment.map(
                                (comment_item: string) => {
                                    return (
                                        <>
                                            <BioType>{comment_item}</BioType>
                                        </>
                                    );
                                }
                            )}
                        </div>
                    )}

                    {isCommenting ? (
                        <div className='flex gap-2 flex-col p-2'>
                            <TextField
                                type='text'
                                value={writtenComment}
                                onChange={(e) =>
                                    setWrittenComment(e.target.value)
                                }
                            />
                            <div className='flex flex-row gap-2'>
                                <Button
                                    variant='outlined'
                                    size='small'
                                    onClick={() => addCommentToOrder()}
                                    disabled={!writtenComment}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='error'
                                    size='small'
                                    onClick={() => setIsCommenting(false)}
                                >
                                    cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className='p-2'>
                            <Button
                                variant='text'
                                sx={{
                                    minWidth: '60px',
                                    padding: '2px 4px',
                                    fontSize: '1rem',
                                }}
                                onClick={() => {
                                    setIsCommenting(true);
                                }}
                            >
                                Add comment
                            </Button>
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell>
                <BioType>
                    {convertCreatedAtToDaysOrHours(order.created_at)}
                </BioType>
            </TableCell>

            <TableCell>
                <EngineeringAssignmentDropdown
                    tagId={order.tag_id!}
                    assigned_engineer={order.metadata.assigned_engineer}
                    current_user_id={current_user_id}
                    mutate_intake_list={mutate_intake_list}
                />
            </TableCell>

            <TableCell>
                <BioType>
                    {order.last_modified_by_first_name}{' '}
                    {order.last_modified_by_last_name}{' '}
                </BioType>
            </TableCell>

            <TableCell>
                {order.patient_id && order.order_id ? (
                    <StatusDropdown
                        patient_id={order.patient_id}
                        order_id={order.order_id}
                        sharedMutate={mutate_intake_list}
                    />
                ) : (
                    'Order is missing Order-ID or Patient-ID'
                )}
            </TableCell>
        </TableRow>
    );
}

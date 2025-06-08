'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getQuestionnaireResponseForProduct_with_version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import { Fragment, useState } from 'react';
import useSWR from 'swr';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IntakeQAList from '../intakes-qa-display';

interface IntakesTabRowProps {
    order: {
        id: string;
        customer_uid: string;
        product_href: string;
        question_set_version: number;
        created_at: string;
        submission_time: string;
        order_status: string;
        action_item?: {
            type: string;
        };
    };
}

function IntakeTabRow({ order }: IntakesTabRowProps) {
    const [open, setOpen] = useState(false);

    const { data, error, isLoading } = useSWR(
        `order-${order.id}-response`,
        () =>
            getQuestionnaireResponseForProduct_with_version(
                order.customer_uid,
                order.product_href,
                order.question_set_version
            )
    );

    console.log('data', data);

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const convertStatus = (status: string) => {
        if (status === 'Incomplete') {
            return (
                <>
                    <BioType className='body1 text-red-600'>Incomplete</BioType>
                </>
            );
        }

        return (
            <>
                <BioType className='body1 text-primary'>Complete</BioType>
            </>
        );
    };

    return (
        <>
            <Fragment>
                <TableRow
                    sx={{
                        '& > *': { borderBottom: 'unset' },
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpen(!open)}
                >
                    <TableCell component='th' className='body1 text-primary'>
                        <BioType>{order.id}</BioType>
                    </TableCell>
                    <TableCell>{convertTimestamp(order.created_at)}</TableCell>
                    <TableCell>
                        {convertTimestamp(order.submission_time)}
                    </TableCell>
                    <TableCell>{order.product_href}</TableCell>
                    <TableCell>{convertStatus(order.order_status)}</TableCell>
                    <TableCell>
                        <IconButton aria-label='expand row' size='small'>
                            {open ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={5}
                    >
                        <Collapse in={open} timeout='auto' unmountOnExit>
                            <div className='flex flex-row justify-start items-start gap-20 px-8 py-6'>
                                <div className='flex flex-col justify-start items-start gap-2'>
                                    <div>
                                        <IntakeQAList
                                            list={data}
                                            version={'new'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        </>
    );
}

export default IntakeTabRow;

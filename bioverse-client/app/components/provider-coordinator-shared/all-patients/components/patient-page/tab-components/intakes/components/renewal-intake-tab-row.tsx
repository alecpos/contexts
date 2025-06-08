import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getRenewalQuestionAnswerForProductWithVersion } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import { Fragment, useState } from 'react';
import useSWR from 'swr';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IntakeQAList from '../intakes-qa-display';
import { ActionItemType } from '@/app/types/action-items/action-items-types';
import { isNull } from 'lodash';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface IntakesTabRowProps {
    actionItem: ActionItemType;
}

function RenewalIntakeTabRow({ actionItem }: IntakesTabRowProps) {
    const [open, setOpen] = useState(false);

    const { data, error, isLoading } = useSWR(
        `order-${actionItem.id}-response`,
        () =>
            getRenewalQuestionAnswerForProductWithVersion(
                actionItem.patient_id,
                actionItem.type,
                actionItem.question_set_version
            )
    );

    if (isLoading) {
        return (
            <div className='flex justify-center w-full'>
                <LoadingScreen />
            </div>
        );
    }

    const convertTimestamp = (timestamp: Date | null) => {
        if (!timestamp || isNull(timestamp)) {
            return 'N/A';
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
                        <BioType>{actionItem.id}</BioType>
                    </TableCell>
                    <TableCell>
                        {convertTimestamp(actionItem.created_at)}
                    </TableCell>
                    <TableCell>
                        {convertTimestamp(new Date(actionItem.submission_time))}
                    </TableCell>
                    <TableCell>{actionItem.product_href}</TableCell>
                    <TableCell>N/A</TableCell>

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

export default RenewalIntakeTabRow;

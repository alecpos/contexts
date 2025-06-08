import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from '@mui/material';
import { renderStatusTag } from '../utils/status-helpers';

interface StatusTagOrderItem {
    id: number;
    order_id: string;
    note: string;
    patient_id: string;
    status_tag: string;
}

interface Props {
    orderList: StatusTagOrderItem[] | undefined;
    handleOrderRedirect: (
        order_id: string,
        status_tag_id?: number,
        preassigned?: boolean
    ) => Promise<void>;
    isRedirecting: boolean;
}

export default function LeadProviderDashboardIntakeList({
    orderList,
    handleOrderRedirect,
    isRedirecting,
}: Props) {
    return (
        <Table
            sx={{ minWidth: 650, maxWidth: '100%' }}
            aria-label='dashboard table'
        >
            <TableHead>
                <TableRow>
                    <TableCell>
                        <BioType className='inter-body'>Order ID</BioType>
                    </TableCell>

                    <TableCell align='left'>
                        <BioType className='inter-body'>Tag</BioType>
                    </TableCell>

                    <TableCell align='left'>
                        <BioType className='inter-body'>Note</BioType>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orderList?.map((order, index) => {
                    return (
                        <TableRow
                            key={index}
                            sx={{
                                '&:nth-of-type(odd)': {
                                    backgroundColor: '#f8f8f8',
                                },
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        >
                            <TableCell component='th' scope='row'>
                                <a
                                    href={`/provider/intakes/${order.order_id}?skip=f`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    onClick={(e) => {
                                        // Check if command (metaKey) or control key is pressed
                                        if (!e.metaKey && !e.ctrlKey) {
                                            e.preventDefault();
                                            if (!isRedirecting) {
                                                handleOrderRedirect(
                                                    `${order.order_id}?skip=f`,
                                                    undefined,
                                                    true
                                                );
                                            }
                                        }
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#1A1A1A',
                                    }}
                                >
                                    <BioType className='inter-body'>
                                        BV-{order.order_id}
                                    </BioType>
                                </a>
                            </TableCell>

                            <TableCell align='left'>
                                <BioType className='inter-body'>
                                    {renderStatusTag(order.status_tag)}
                                </BioType>
                            </TableCell>

                            <TableCell align='left'>
                                <BioType className='inter-body'>
                                    {order.note}
                                </BioType>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

import { Button, Paper } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import DownloadIcon from '@mui/icons-material/Download';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import {
    getCurrentUserId,
    readUserSession,
} from '@/app/utils/actions/auth/session-reader';

interface Props {}

export default function ProtectedHealthInformationDownload({}: Props) {
    const prescriber_information_container_class =
        'flex flex-col mx-4 gap-4 md:ml-1 md:w-[40%]';
    const prescriber_text_data_container_class =
        'flex flex-col p-4 gap-4 md:mb-[10px]';
    const horizontal_divider_container_class = 'h-[1px] py-2';

    const handlePhiDownload = async () => {
        const data = await readUserSession();

        const userId = data.data.session?.user.id;

        if (userId) {
            try {
                const response = await fetch('/api/patient-portal/phi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'customers-data.pdf');
                document.body.appendChild(link);
                link.click();
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
    };

    return (
        <div className='flex flex-col space-y-4'>
            <BioType className='h6 text-[24px] text-[#00000099]'>
                Protected Health Information
            </BioType>
            <Paper className='flex flex-col space-y-4 px-7 py-6'>
                <div className='flex flex-col space-y-2'>
                    <BioType className='body1 text-[16px] text-[#00000099]'>
                        Download your data
                    </BioType>
                    <BioType className='body1 text-[16px] text-black font-[400]'>
                        You can download and export all of your previous doctor
                        consultations for your own records.
                    </BioType>
                </div>
                <Button
                    onClick={handlePhiDownload}
                    variant='outlined'
                    sx={{
                        height: 52,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <BioType className='body1 text-[13px] text-[#286BA2]'>
                        Download Your Data
                    </BioType>
                </Button>
            </Paper>
        </div>
    );
}

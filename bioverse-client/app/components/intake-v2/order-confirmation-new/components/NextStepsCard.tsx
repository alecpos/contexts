import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface NextStepsCardProps {
    borderColor: string;
    title: string;
    duration: string;
    description: string;
}

export default function NextStepsCard({
    borderColor,
    title,
    duration,
    description,
}: NextStepsCardProps) {
    return (
        <Paper
            className={`flex flex-col space-y-3 py-4 px-6 it-body md:itd-body mx-[0.4px] border-l-[2.5px] border-t-0 border-b-0 border-r-0 border-solid`}
            sx={{ borderColor }}
        >
            <BioType className='text-[20px] text-[#286BA2] body1'>
                {title}
            </BioType>
            <div className='flex items-start'>
                <Chip
                    sx={{ backgroundColor: '#59B7C1' }}
                    icon={<AccessTimeIcon style={{ color: 'black' }} />}
                    label={
                        <BioType className='body1 text-black text-[18px'>
                            {duration}
                        </BioType>
                    }
                />
            </div>
            <BioType className='body1 text-[18px] text-black'>
                {description}
            </BioType>
        </Paper>
    );
}

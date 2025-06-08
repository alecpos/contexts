import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

interface NextStepsCardProps {
    borderColor: string;
    title: string;
    duration: string;
    description: string;
}

export default function AltNextStepsCard({
    borderColor,
    title,
    duration,
    description,
}: NextStepsCardProps) {
    return (
        <Paper
            className={`flex flex-col space-y-3 py-4 px-6 it-body md:itd-body mx-[0.4px] border-l-[3px] border-t-0 border-b-0 border-r-0 border-solid`}
            sx={{ borderColor }}
        >
            <BioType className='text-[20px] text-[#286BA2] body1'>
                {title}
            </BioType>
            <div className='flex items-start'>
                <Chip
                    sx={{
                        background:
                            'linear-gradient(93deg, #3B8DC5 9.41%, #59B7C1 81.98%)',
                        '& .MuiChip-label': { color: 'white' },
                        padding: '4px',
                    }}
                    icon={
                        <TimerOutlinedIcon
                            style={{
                                color: 'white',
                            }}
                        />
                    }
                    label={
                        <BioType className='body1 text-white text-[18px]'>
                            {' '}
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

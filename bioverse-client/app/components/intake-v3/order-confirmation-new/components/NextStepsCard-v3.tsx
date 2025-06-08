import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface NextStepsCardProps {
    borderColor: string;
    title: string;
    duration: string;
    description: string;
}

export default function NextStepsCardV3({
    borderColor,
    title,
    duration,
    description,
}: NextStepsCardProps) {
    return (
        <Paper
            className={`flex flex-col space-y-3 py-4  rounded-lg px-5`}
            sx={{ borderColor }}
            style={{ border: `1px solid #e0e0e0` }}
        >
            <BioType className='intake-v3-18px-20px '>
                {title}
            </BioType>
            <div className='flex items-start'>
                <div className='flex items-center gap-2 bg-gradient-to-r from-cyan-200 to-pink-200 py-2 px-2 rounded-xl text-sm inter '>
                <AccessTimeIcon 
                    style={{ color: 'black' }} 
                    fontSize='small'
                />
               
                <BioType className=' intake-v3-disclaimer-text '>
                    {duration}
                </BioType>
                    
                </div>
            </div>
            <BioType className=' intake-subtitle  '>
                {description}
            </BioType>
        </Paper>
    );
}

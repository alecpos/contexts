import * as React from 'react';
import LinearProgress, {
    LinearProgressPropsColorOverrides,
    linearProgressClasses,
} from '@mui/material/LinearProgress';

interface BorderLinearProgressProps {
    val_linear: number;
    title_linear: string;
    color:
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'error'
        | 'info'
        | 'success'
        | 'warning';
}

export default function CustomizedProgressBar({
    val_linear,
    title_linear,
    color,
}: BorderLinearProgressProps) {
    return (
        <div className='flex-col mt-1 md:mt-0'>
            <div className='text-[12px] md:text-xs text-gray-500'>
                {title_linear}
            </div>
            <LinearProgress
                color={color}
                variant='determinate'
                value={val_linear}
                className='h-[6px] md:h-[8px]'
                sx={{ borderRadius: 5, backgroundColor: '#E6E0E9' }}
            ></LinearProgress>
        </div>
    );
}

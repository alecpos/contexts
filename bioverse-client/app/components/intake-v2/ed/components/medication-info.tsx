import Image from 'next/image';
import { Typography } from '@mui/material';

interface MedicationInfoProps {
    howDoesMedicationWork: string[];
}

export default function MedicationInfo({
    howDoesMedicationWork,
}: MedicationInfoProps) {
    return (
        <>
            <Typography variant='h5' align='center' gutterBottom>
                How does this medication work?
            </Typography>
            <div className='w-full'>
                <Image
                    src={'/img/intake/ed/blood-cells-flowing.png'}
                    height={300}
                    width={600}
                    alt='Blood flow illustration'
                    className='w-full'
                    unoptimized
                />
                <div className='mt-2' />
                <>
                    {howDoesMedicationWork.map((item, index) => {
                        return (
                            <Typography
                                variant='body1'
                                color='textSecondary'
                                paragraph
                                key={index}
                            >
                                {item}
                            </Typography>
                        );
                    })}
                </>
            </div>
        </>
    );
}

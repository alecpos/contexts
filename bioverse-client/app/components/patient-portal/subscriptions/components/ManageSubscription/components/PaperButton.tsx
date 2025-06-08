'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Paper } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PaperButtonProps {
    title: string;
    subtext: string;
    route: string;
}

export default function PaperButton({
    title,
    subtext,
    route,
}: PaperButtonProps) {
    const router = useRouter();

    return (
        <Link href={route} className='no-underline'>
            <Paper
                elevation={2}
                className='py-3 px-5 sm:w-[522px] flex justify-between items-center'
            >
                <div>
                    <BioType className='body1 text-[#00000099] text-[16px]'>
                        {title}
                    </BioType>
                    <BioType className='body1 text-black text-[16px]'>
                        {subtext}
                    </BioType>
                </div>
                <ChevronRight sx={{ color: 'black' }} fontSize='small' />
            </Paper>
        </Link>
    );
}

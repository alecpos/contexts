import { Paper } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_PAGE_BODY_TAILWIND } from '../styles/intake-tailwind-declarations';

interface RTBBannerProps {
    icon: JSX.Element;
    text: string;
}

export default function RTBBanner({ icon, text }: RTBBannerProps) {
    return (
        <>
            <Paper
                className={`flex flex-row py-2 md:py-4 px-1 md:px-2 it-input md:itd-input gap-2 mx-[0.6px] border-l-[4px] border-t-0 border-b-0 border-r-0 border-solid border-primary`}
            >
                <div className='flex flex-row items-center'>{icon}</div>
                <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                    {text}
                </BioType>
            </Paper>
        </>
    );
}

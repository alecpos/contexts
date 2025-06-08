import { Paper } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_PAGE_BODY_TAILWIND } from '../../intake-v2/styles/intake-tailwind-declarations';

interface RTBBannerProps {
    icon: JSX.Element;
    text: string;
}

export default function RTBBannerV3({ icon, text }: RTBBannerProps) {
    return (
        <>
            <div
                className={`flex flex-row space-x-[1rem] md:space-x-[16px] py-[1.251rem] md:py-[20px] px-[1.501rem] md:px-[24px] bg-[#E4EEF2] rounded-[12px]`}
            >
                <div className="flex items-center h-full w-[1.5rem] md:w-[24px]">{icon}</div>
               
                <p className={`intake-v3-rtb-text text-black `} style={{ alignSelf: 'stretch' }}>
                    {text}
                </p>
            </div>
        </>
    );
}

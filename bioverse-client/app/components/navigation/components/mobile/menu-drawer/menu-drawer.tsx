import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
} from '@mui/material';
import PortraitIcon from '@mui/icons-material/PortraitOutlined';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { analytics } from '@/app/components/analytics';

/*
MOBILE MENU DRAWER ON COLLECTIONS SITE

02/02/2024 - @Olivier
 - Added logout button to mobile drawer
*/

interface Props {
    className: string;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
    loggedIn: boolean;
}

const FOCUS_AREAS = [
    { label: 'All Focus Areas', href: '/collections' },
    { label: 'Weight Loss', href: '/collections?fpf=weight-loss' },
    {
        label: 'Health & Longevity',
        href: '/collections?fpf=health-and-longevity',
    },
    {
        label: 'Energy & Cognitive Function',
        href: '/collections?fpf=energy-and-cognitive-function',
    },
    {
        label: 'Autoimmune Support',
        href: '/collections?fpf=autoimmune-support',
    },
    {
        label: 'Heart Health & Blood Pressure',
        href: '/collections?fpf=heart-health-and-blood-pressure',
    },
    { label: 'NAD+ Support', href: '/collections?fpf=nad-support' },
    { label: 'GSH Support', href: '/collections?fpf=gsh-support' },
    { label: 'Health Monitoring', href: '/collections?fpf=health-monitoring' },
    { label: 'Skincare', href: '/collections?fpf=skincare' },
];

export default function MobileMenuDrawer({
    setMenuOpen,
    className,
    loggedIn,
}: Props) {
    const router = useRouter();

    const handleClose = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleRedirect = (href: string) => {
        setMenuOpen((prev) => !prev);
        router.push(href);
    };

    const handleLogoutClick = async () => {
        handleClose();
        analytics.reset();
        signOutUser();
    };

    const handleGetStartedClick = () => {
        handleClose();
        router.push(`/collections`);
    };

    const handlePortraitClick = () => {
        handleClose();
        router.push('/portal/account-information');
    };

    return (
        <div className={`flex flex-col w-[100vw] ${className}`}>
            <div
                onClick={handleClose}
                className='h-[50px] h7 flex flex-row justify-end items-center'
            >
                <BioType className='rubik-large flex flex-row items-center'>
                    CLOSE
                    <CloseIcon className='flex' />
                </BioType>
            </div>

            {/* <span className='h-8 bg-[#286BA2]' /> */}

            <div>
                <Accordion elevation={0}>
                    <AccordionSummary
                        expandIcon={
                            <span>
                                <ExpandMoreIcon />
                            </span>
                        }
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginLeft: '20px',
                        }}
                    >
                        <BioType className='rubik-large text-text mx-auto'>
                            FOCUS AREAS
                        </BioType>
                    </AccordionSummary>
                    <AccordionDetails
                        className='pl-[56px] gap-4 flex-col flex'
                        style={{ marginTop: '-16px' }}
                    >
                        {FOCUS_AREAS.map(({ label, href }) => (
                            <div
                                key={href}
                                onClick={() => handleRedirect(href)}
                                className='cursor-pointer hover:text-primary transition-colors'
                            >
                                {label}
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>

                <div className='flex flex-col items-center mt-2'>
                    <BioType className='rubik-large text-text mt-1 cursor-pointer'>
                        ABOUT
                    </BioType>
                    <Button
                        onClick={handleGetStartedClick}
                        className='w-[95%] mt-4 mb-3 h-[41px]'
                        variant='contained'
                    >
                        GET STARTED
                    </Button>
                    {/* <AccountMenu loggedIn={loggedIn} role={role} /> */}
                    <div className='inline-flex items-center text-center self-center overflow-auto'>
                        <div
                            className='inline-flex items-center gap-1 hover:cursor-pointer'
                            onClick={handlePortraitClick}
                        >
                            <PortraitIcon
                                sx={{ strokeWidth: 1, stroke: '#ffffff' }}
                                fontSize='large'
                            />
                        </div>
                    </div>
                    {loggedIn && (
                        <BioType
                            onClick={handleLogoutClick}
                            className='rubik-large text-text mt-2 cursor-pointer'
                        >
                            LOG OUT
                        </BioType>
                    )}
                </div>
            </div>
        </div>
    );
}

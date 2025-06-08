import CloseIcon from '@mui/icons-material/Close';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { analytics } from '@/app/components/analytics';

/*
MOBILE NAV DRAWER FOR PATIENT PORTAL

02/02/2024 - @Olivier
 - Added more links in nav bar & centered text

*/

interface Props {
    className: string;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
    loggedIn: boolean;
}

export default function PortalMobileMenuDrawer({
    setMenuOpen,
    className,
    loggedIn,
}: Props) {
    const router = useRouter();

    const path = usePathname();
    const encodedPathname = encodeURIComponent(path);

    const handleClose = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleRedirect = (href: string) => {
        setMenuOpen((prev) => !prev);
        router.push(href);
    };

    const handleLoginClick = () => {
        router.push(`/login?originalRef=${encodedPathname}`);
    };

    const handleLogoutClick = () => {
        analytics.reset();
        signOutUser();
    };

    const handleGetStartedClick = () => {
        router.push(`/signup?originalRef=${encodedPathname}`);
    };

    return (
        <div className={`flex flex-col w-[100vw] ${className}`}>
            <div
                onClick={handleClose}
                className='h-[50px] h7 flex flex-row justify-end items-center'
            >
                <BioType className='rubik-large flex flex-row'>
                    CLOSE
                    <CloseIcon className='flex' />
                </BioType>
            </div>

            {/* <span className='h-8 bg-[#286BA2]' /> */}

            <div>
                {/* <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ marginLeft: '22px' }}
                    >
                        <BioType className="rubik-large text-text mx-auto">
                            FOCUS AREAS
                        </BioType>
                    </AccordionSummary>
                    <AccordionDetails
                        className="pl-[56px] gap-4 flex-col flex"
                        style={{ marginTop: '-16px' }}
                    >
                        <div onClick={() => handleRedirect('/all-focus-areas')}>
                            All Focus Areas
                        </div>
                        <div onClick={() => handleRedirect('/weightloss')}>
                            Weight Loss
                        </div>
                        <div
                            onClick={() =>
                                handleRedirect('/health-and-longevity')
                            }
                        >
                            Health & Longevity
                        </div>
                        <div
                            onClick={() =>
                                handleRedirect('/energy-and-cognitive-function')
                            }
                        >
                            Energy & Cognitive Function
                        </div>
                        <div
                            onClick={() =>
                                handleRedirect('/autoimmune-support')
                            }
                        >
                            Autoimmune Support
                        </div>
                        <div
                            onClick={() =>
                                handleRedirect(
                                    '/heart-health-and-blood-pressure',
                                )
                            }
                        >
                            Heart Health & Blood Pressure
                        </div>
                        <div onClick={() => handleRedirect('/nad-support')}>
                            NAD+ Support
                        </div>
                        <div onClick={() => handleRedirect('/gsh-support')}>
                            GSH Support
                        </div>
                        <div
                            onClick={() =>
                                handleRedirect('/erectile-dysfunction')
                            }
                        >
                            Erectile Dysfunction
                        </div>
                        <div
                            onClick={() => handleRedirect('/health-monitoring')}
                        >
                            Health Monitoring
                        </div>
                        <div onClick={() => handleRedirect('/hair-loss')}>
                            Hair Loss
                        </div>
                        <div onClick={() => handleRedirect('/skincare')}>
                            Skincare
                        </div>
                    </AccordionDetails>
                </Accordion> */}

                <div className='flex flex-col items-center space-y-4'>
                    <BioType
                        onClick={() => handleRedirect('/portal/subscriptions')}
                        className='rubik-large text-text cursor-pointer'
                    >
                        SUBSCRIPTIONS
                    </BioType>
                    <BioType
                        onClick={() => handleRedirect('/portal/order-history')}
                        className='rubik-large text-text cursor-pointer'
                    >
                        ORDERS
                    </BioType>
                    <BioType
                        onClick={() => handleRedirect('/portal/message')}
                        className='rubik-large text-text cursor-pointer'
                    >
                        MESSAGES
                    </BioType>
                    {/* <Button
                        onClick={() => handleRedirect('/collections')}
                        className="w-[95%] h-[41px]"
                        variant="contained"
                    >
                        SHOP
                    </Button> */}
                </div>

                {!loggedIn ? (
                    <></>
                ) : (
                    <div className='flex flex-col items-center'>
                        {/* <div className="w-full mt-4 justify-center inline-flex items-center gap-[.83vw] mr-[0.83vw]">
                            <AccountMenu
                                authLevel={authLevel}
                                loggedIn={loggedIn}
                                closeMobileDrawer={handleClose}
                            />
                        </div> */}
                        <BioType
                            onClick={handleLogoutClick}
                            className='rubik-large text-text cursor-pointer mt-1.5'
                        >
                            LOG OUT
                        </BioType>
                    </div>
                )}
            </div>
        </div>
    );
}

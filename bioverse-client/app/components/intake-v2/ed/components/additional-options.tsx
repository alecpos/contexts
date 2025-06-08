import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    CardContent,
    Grid,
    CardActions,
    Card,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    ALTERNATIVE_ED_OPTIONS,
    ALTERNATIVE_ED_OPTIONS_INDIVIDUAL_FLOW,
} from './additional-options-map';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { setOrderProductHrefForED } from '../utils/ed-order-update';
import { getUserStateEligibilitySelectionScreen } from '@/app/utils/functions/state-auth/utils';

interface AdditionalOptionsProps {
    currentProductHref: string;
    treatment_type: string;
    frequency: string;
}

export default function AdditionalOptions({
    currentProductHref,
    treatment_type,
    frequency,
}: AdditionalOptionsProps) {
    const possibleOptions = ALTERNATIVE_ED_OPTIONS[frequency][treatment_type];
    const individualPossibleOptions = ALTERNATIVE_ED_OPTIONS_INDIVIDUAL_FLOW;
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const isEDGlobal = fullPath.includes('ed-global');
    const isXEDFlow =
        (fullPath.split('/')[3] === 'x-melts' ||
            fullPath.split('/')[3] === 'x-chews') &&
        fullPath.split('/')[4] === 'ed-selection'; //ed-selection is the ed-global route, ed-product-display is the individual ed route

    const patientState = searchParams.get('ptst');
    const pushToConfirmationRoute = async () => {
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();

        const isUserEligible = getUserStateEligibilitySelectionScreen(
            currentProductHref,
            frequency,
            patientState,
        );

        if (!isUserEligible) {
            router.push(
                `/intake/prescriptions/${currentProductHref}/unavailable-in-state?${newSearch}`,
            );
            return;
        }

        if (isXEDFlow) {
            await setOrderProductHrefForED(currentProductHref, frequency);
            router.push(`${fullPath}/confirmation?${newSearch}`);
            return;
        }

        if (isEDGlobal) {
            router.push(`${fullPath}/confirmation?${newSearch}`);
        } else {
            if (
                (currentProductHref as PRODUCT_HREF) ===
                    PRODUCT_HREF.PEAK_CHEWS &&
                frequency === 'daily'
            ) {
                //peak chews are only sold daily.
                await setOrderProductHrefForED(currentProductHref, frequency);

                router.push(
                    `/intake/prescriptions/${currentProductHref}/ed-pre-id?${newSearch}`,
                );
                return;
            } else {
                //other options need to route to a path that allows for frequency selection.
                router.push(
                    `/intake/prescriptions/${currentProductHref}/ed-ind-quantity-selection?${newSearch}`,
                );
                return;
            }
        }

        return;
    };

    const handleViewSwap = (product_href: string) => {
        const newSearch = searchParams.toString();
        if (isEDGlobal || isXEDFlow) {
            router.push(`${product_href}?${newSearch}`);
            return;
        } else {
            router.push(
                `/intake/prescriptions/${product_href}/ed-product-display?${newSearch}`,
            );
            return;
        }
    };

    return (
        <>
            <div className="flex justify-center my-6">
                <Button
                    onClick={pushToConfirmationRoute}
                    variant="contained"
                    sx={{
                        height: '70px',
                        width: '83%',
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}
                >
                    <Typography variant="caption" className="mt-1">
                        SELECT AS PREFERRED MEDICATION
                        <span className="hidden sm:inline ml-1">
                            AND CONTINUE
                        </span>
                    </Typography>
                </Button>
            </div>
            {
                <div className="p-4 max-w-md mx-auto w-[90%]">
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    transform: 'translateY(-1.5rem)',
                                },
                            }}
                        >
                            <div className="flex flex-col w-full">
                                <div className="flex gap-x-1">
                                    <Typography
                                        variant="subtitle1"
                                        color="textSecondary"
                                    >
                                        See other
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        options
                                    </Typography>
                                </div>
                                <div className="flex gap-x-1 bg-gray-200/20 mb-4 items-center pt-2 pl-2 w-full">
                                    <Typography variant="body2" gutterBottom>
                                        {(isEDGlobal || isXEDFlow
                                            ? possibleOptions
                                            : individualPossibleOptions
                                        ).length - 1}{' '}
                                        {(isEDGlobal || isXEDFlow
                                            ? possibleOptions
                                            : individualPossibleOptions
                                        ).length > 2
                                            ? 'options'
                                            : 'option'}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        found
                                    </Typography>
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {(isEDGlobal || isXEDFlow
                                    ? possibleOptions
                                    : individualPossibleOptions
                                ).map((option, index) => {
                                    if (
                                        option.productHref ===
                                        currentProductHref
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <div className="flex justify-center">
                                                        <Image
                                                            src={option.image}
                                                            alt={option.name}
                                                            height={80}
                                                            width={100}
                                                            className="mb-2"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="flex justify-center flex-col items-center">
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                display: 'flex',
                                                            }}
                                                        >
                                                            {option.name}
                                                            {/* <span>&#174;</span> */}
                                                            <Typography>
                                                                <sup
                                                                    className="text-xs align-top ml-1"
                                                                    style={{
                                                                        lineHeight:
                                                                            '2',
                                                                    }}
                                                                >
                                                                    ℞
                                                                </sup>
                                                            </Typography>
                                                        </Typography>
                                                        {option.subtitle && (
                                                            <BioType className="it-body md:itd-body mb-1">
                                                                {
                                                                    option.subtitle
                                                                }
                                                            </BioType>
                                                        )}
                                                    </div>

                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        sx={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {option.price}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        onClick={() =>
                                                            handleViewSwap(
                                                                option.productHref,
                                                            )
                                                        }
                                                        variant="outlined"
                                                        className="w-full text-black text-sm border-black mx-2 py-2 mb-2"
                                                    >
                                                        VIEW
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </div>
            }
        </>
    );
}

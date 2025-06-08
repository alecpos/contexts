import { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EDImportantSafetyInformation from './important-safety-information-modal';

interface DetailsAccordion {
    treatmentDetails: string;
    quickInfo: {
        bestFor: string;
        worksIn: number;
        lastsFor: string;
        lastsUpTo: string;
    };
    activeIngredients: string[];
    potentialSideEffects: string[];
    importantSafetyInformation: any[];
    frequency: string;
}

// Due to not fully knowing the fetched data shape, using hard coded info for now
// Defined a potential interface above
export default function DetailsAccordion({
    treatmentDetails,
    quickInfo,
    activeIngredients,
    potentialSideEffects,
    importantSafetyInformation,
    frequency,
}: DetailsAccordion) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const accordionStyles = {
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        margin: 0,
    };

    const accordionSummaryStyles = {
        backgroundColor: 'transparent',
        padding: 0,
    };

    const accordionDetailsStyles = {
        padding: 0,
    };

    return (
        <Box
            sx={{
                maxWidth: '600px',
                mx: 'auto',
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2,
                boxShadow:
                    '0 -4px 8px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant='h6' gutterBottom>
                Treatment Details
            </Typography>
            <Typography variant='body2' color='textSecondary'>
                {treatmentDetails}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '16px',
                    position: 'relative',
                }}
            >
                <Box sx={{ flex: 1, textAlign: 'start' }}>
                    <Typography variant='body2' color='textSecondary'>
                        Best for
                    </Typography>
                    <Typography variant='body2' fontWeight='bold'>
                        {frequency === 'daily'
                            ? 'Daily use'
                            : 'Spontaneous sex'}
                    </Typography>
                </Box>

                <Divider
                    orientation='vertical'
                    flexItem
                    sx={{ mx: 2, bgcolor: '#e0e0e0' }}
                />

                <Box sx={{ flex: 1, textAlign: 'start' }}>
                    <Typography variant='body2' color='textSecondary'>
                        Works in
                    </Typography>
                    <Typography variant='body2' fontWeight='bold'>
                        {quickInfo.worksIn}
                    </Typography>
                </Box>

                <Divider
                    orientation='vertical'
                    flexItem
                    sx={{ mx: 2, bgcolor: '#e0e0e0' }}
                />

                <Box sx={{ flex: 1, textAlign: 'start' }}>
                    <Typography variant='body2' color='textSecondary'>
                        Lasts for
                    </Typography>
                    <Typography variant='body2' fontWeight='bold'>
                        {quickInfo.lastsFor}
                    </Typography>
                </Box>
            </Box>
            <Divider />

            <Accordion sx={accordionStyles}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1-content'
                    id='panel1-header'
                    sx={accordionSummaryStyles}
                >
                    <Typography variant='subtitle1' fontWeight='bold'>
                        Active ingredients
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsStyles}>
                    <div className='flex flex-col gap-2'>
                        {activeIngredients.map((item, index) => {
                            return (
                                <Typography
                                    variant='body2'
                                    color='textSecondary'
                                    key={index}
                                >
                                    {item}
                                </Typography>
                            );
                        })}
                    </div>
                </AccordionDetails>
            </Accordion>

            <Divider />

            <Accordion sx={accordionStyles}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel2-content'
                    id='panel2-header'
                    sx={accordionSummaryStyles}
                >
                    <Typography variant='subtitle1' fontWeight='bold'>
                        What to know
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsStyles}>
                    <Typography variant='body2' color='textSecondary'>
                        {frequency === 'daily'
                            ? 'Taken daily.'
                            : 'Taken before sex, as needed.'}
                    </Typography>
                    <div className='flex justify-between mt-2 w-[70%]'>
                        <div>
                            <Typography variant='caption' color='textSecondary'>
                                Works in*
                            </Typography>
                            <Typography variant='body2'>
                                {quickInfo.worksIn}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant='caption' color='textSecondary'>
                                Lasts up to
                            </Typography>
                            <Typography variant='body2'>
                                {quickInfo.lastsUpTo}
                            </Typography>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Divider />

            <Accordion sx={accordionStyles}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel3-content'
                    id='panel3-header'
                    sx={accordionSummaryStyles}
                >
                    <Typography variant='subtitle1' fontWeight='bold'>
                        Potential side effects
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsStyles}>
                    <div className='flex flex-col gap-4'>
                        {potentialSideEffects.map((item, index) => {
                            return (
                                <Typography
                                    variant='body2'
                                    color='textSecondary'
                                    key={index}
                                >
                                    {item}
                                </Typography>
                            );
                        })}
                    </div>
                </AccordionDetails>
            </Accordion>

            <Divider />

            <Box
                onClick={handleOpen}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    mt: 2,
                    mb: 1,
                    color: 'text.primary',
                }}
            >
                <Typography
                    variant='subtitle1'
                    sx={{ flexGrow: 1 }}
                    fontWeight='bold'
                >
                    Important safety information
                </Typography>
                <ArrowForwardIcon sx={{ fontSize: 20, marginRight: 1 }} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
                id='modal-description'
                variant='body2'
                color='textSecondary'
                className='text-center'
            >
                A provider will review your responses and determine if
                treatment, including this option, is a good fit for you.
            </Typography>

            <EDImportantSafetyInformation
                open={open}
                handleClose={handleClose}
                importantSafetyInformation={importantSafetyInformation}
            />
        </Box>
    );
}

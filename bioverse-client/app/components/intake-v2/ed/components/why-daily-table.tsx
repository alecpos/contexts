import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Typography, Box, Paper, Grid } from '@mui/material';

interface WhyTableProps {
    frequency: string;
}

export default function WhyTable({ frequency }: WhyTableProps) {
    console.log(frequency);

    return (
        <div className='p-4 mx-auto flex flex-col items-center text-center gap-4'>
            <BioType className='flex it-h1 md:itd-h1'>
                {frequency === 'daily' ? 'Why daily?' : 'Why as needed?'}
            </BioType>

            <Grid container spacing={0} sx={{ height: '100%' }}>
                {/* Header row */}
                <Grid container item xs={12} alignItems='stretch'>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Box
                            sx={{
                                padding: '0px',
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px 8px 0 0',
                                boxShadow:
                                    '-12px -12px 24px -12px rgba(0, 0, 0, 0.15), 12px -12px 24px -12px rgba(0, 0, 0, 0.15)',
                                backgroundColor: 'white',
                                position: 'relative',
                                zIndex: 1,
                                border: '1px solid #E4E4E4',
                            }}
                        >
                            <BioType className='it-subtitle md:itd-subtitle'>
                                {frequency === 'daily' && 'Daily'}
                                {frequency === 'as-needed' && 'In the moment'}
                            </BioType>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box
                            sx={{
                                padding: '24px',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <BioType className='it-subtitle md:itd-subtitle'>
                                {frequency === 'as-needed' && 'Daily'}
                                {frequency === 'daily' && 'In the moment'}
                            </BioType>
                        </Box>
                    </Grid>
                </Grid>

                {/* Content rows */}
                {[
                    {
                        question: 'How do I use it?',
                        daily: 'Take daily',
                        moment: 'Take 1 hr before sex',
                    },
                    {
                        question: 'When can I get an erection?',
                        daily: "Whenever you're in the mood",
                        moment: 'For 4+ hours after taking medication when aroused',
                    },
                    {
                        question: "What's the dosage?",
                        daily: 'Consistency provided by a lower dosage',
                        moment: 'Higher dose that wears off',
                    },
                    {
                        question: 'Are there side effects?',
                        daily: 'Lower incidence of common side effects',
                        moment: 'Occasional incidence of headaches, nasal congestion, and dizziness',
                    },
                ].map((row, index) => (
                    <Grid
                        key={index}
                        container
                        item
                        xs={12}
                        alignItems='stretch'
                    >
                        <Grid
                            item
                            xs={4}
                            sx={{ borderTop: '1px solid #e0e0e0' }}
                        >
                            <Box
                                sx={{
                                    paddingX: '8px',
                                    height: '100%',
                                    minHeight: '100px', // Add minimum height
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <BioType className='it-body md:itd-body'>
                                    {row.question}
                                </BioType>
                            </Box>
                        </Grid>

                        <Grid
                            item
                            xs={4}
                            sx={{ borderTop: '1px solid #e0e0e0' }}
                        >
                            <Box
                                sx={{
                                    paddingY: '2px',
                                    paddingX: '6px',
                                    textAlign: 'center',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '0 0 0 0',
                                    backgroundColor: 'white',
                                    position: 'relative',
                                    zIndex: 1,
                                    border: '1px solid #E4E4E4',
                                    marginTop: '-1px',
                                    boxShadow:
                                        '-12px 0 24px -12px rgba(0, 0, 0, 0.15), 12px 0 24px -12px rgba(0, 0, 0, 0.15)',
                                }}
                            >
                                <BioType className='it-body md:itd-body'>
                                    {frequency === 'daily' && row.daily}
                                    {frequency === 'as-needed' && row.moment}
                                </BioType>
                            </Box>
                        </Grid>

                        <Grid
                            item
                            xs={4}
                            sx={{ borderTop: '1px solid #e0e0e0' }}
                        >
                            <Box
                                sx={{
                                    paddingY: '2px',
                                    paddingX: '8px',
                                    height: '100%',
                                    minHeight: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <BioType className='it-body md:itd-body'>
                                    {frequency === 'daily' && row.moment}
                                    {frequency === 'as-needed' && row.daily}
                                </BioType>
                            </Box>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

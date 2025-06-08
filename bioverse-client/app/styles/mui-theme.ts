'use client';
import { createTheme } from '@mui/material/styles';

const themeOptions = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#286BA2',
        },
        secondary: {
            main: '#59B7C1',
        },
        error: {
            main: '#D32F2F',
        },
        warning: {
            main: '#EF6C00',
        },
    },
    typography: {
        // Set the global typography styles
        fontFamily: 'Tw Cen MT Pro SemiMedium',
        fontSize: 16,
    },
    breakpoints: {
        values: {
            xs: 360,
            sm: 768,
            md: 1024,
            lg: 1280,
            xl: 1536,
        },
    },
    components: {
        MuiSelect: {
            styleOverrides: {
                select: {
                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                    fontSize: '1rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '1.5rem', // 150% of 16px
                    letterSpacing: '0.04167rem',
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    color: 'rgba(27, 27, 27, 0.87)', // The color you specified
                    backgroundColor: 'white',
                    '&:focus': {
                        backgroundColor: 'white', // To avoid the default background on focus
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: 'white',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                    fontSize: '1.125rem', //Figma shows 16, but I manually up-ed it to +2
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    letterSpacing: '0.046rem',
                    textTransform: 'uppercase',
                },
                contained: {
                    color: 'var(--primary-contrast, #FFF)',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                    fontSize: '1rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '1.5rem', // 150% of 16px
                    letterSpacing: '0.15px',
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    color: 'rgba(27, 27, 27, 0.87)', // The color you specified
                    backgroundColor: 'white',
                    '&:focus': {
                        backgroundColor: 'white', // To avoid the default background on focus
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: 'var(--text-secondary, rgba(27, 27, 27, 0.60))',
                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '24px',
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                    '&.Mui-selected': {
                        color: 'var(--primary-main, #286BA2)',
                        fontFamily: 'Tw Cen MT Pro SemiMedium',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '24px',
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase',
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: 'rgba(27, 27, 27, 0.87)', // The color you specified
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    fontFamily: 'Tw Cen MT Pro SemiMedium', // The font family you specified
                    fontSize: '1rem', // The font size you specified
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '1.5rem', // The line height you specified
                    letterSpacing: '0.15px', // The letter spacing you specified
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--borderRadius, 4px)',
                    background: 'var(--background-paper-elevation-1, #FFF)',
                    boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.12)', // Adjusted to have no vertical offset
                },
            },
        },
    },
});

export default themeOptions;

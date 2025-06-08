import { Breakpoints, createTheme } from '@mui/material';

export const intakeThemeOptions = createTheme({
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
                    fontFamily: 'Tw Cen MT Pro Medium',
                    fontSize: '1rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '1.375rem', // 150% of 16px
                    letterSpacing: 'normal',
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    color: 'rgba(27, 27, 27, 0.87)', // The color you specified
                    backgroundColor: 'white',
                    '&:focus': {
                        backgroundColor: 'white', // To avoid the default background on focus
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                    fontSize: '0.875rem',
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
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                    fontSize: '18px', //Figma shows 16, but I manually up-ed it to +2
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    letterSpacing: 'normal',
                    textTransform: 'uppercase',
                },
                contained: {
                    color: 'var(--primary-contrast, #FFF)',
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

export const intakeThemeOptionsV3 = createTheme({
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
                    fontFamily: 'Tw Cen MT Pro Medium',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '1.375rem', // 150% of 16px
                    letterSpacing: 'normal',
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    color: 'black', // The color you specified
                    backgroundColor: 'white',
                    '&:focus': {
                        backgroundColor: 'white', // To avoid the default background on focus
                    },
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: 'black', // Set the label's color to black
                },
            },
        },

        MuiAccordion: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // Removes the shadow
                    border: 'none', // Removes any borders
                    backgroundColor: 'transparent', // Removes background color
                    '&:before': {
                        display: 'none', // Removes default MUI border line
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontFamily: 'Inter Regular',
                    fontSize: '0.875rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '1.5rem', // 150% of 16px
                    letterSpacing: '0.15px',
                    borderRadius: '12px',
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    color: 'rgba(0, 6, 38, 0.90)', // The color you specified
                    backgroundColor: 'white',
                    '&:focus': {
                        backgroundColor: 'white', // To avoid the default background on focus
                    },
                    '&.Mui-focused': {
                        '& $notchedOutline': {
                            borderColor: 'black',
                        },
                    },
                },
                notchedOutline: {
                    borderColor: 'black', // Set your border color here
                },
                // Optional: Change the border color on focus
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    fontFamily: 'Tw Cen MT Pro SemiMedium',
                    fontSize: '18px', //Figma shows 16, but I manually up-ed it to +2
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    letterSpacing: 'normal',
                    textTransform: 'uppercase',
                },
                contained: {
                    color: 'var(--primary-contrast, #FFF)',
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

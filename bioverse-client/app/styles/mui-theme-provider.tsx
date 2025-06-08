'use client';

import { Theme, ThemeProvider } from '@mui/material';

export default function ThemeClient({
    children,
    themeOption,
}: {
    children: React.ReactNode;
    themeOption: Theme;
}) {
    return <ThemeProvider theme={themeOption}>{children}</ThemeProvider>;
}

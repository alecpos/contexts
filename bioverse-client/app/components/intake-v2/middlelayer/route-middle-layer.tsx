'use client';

import { Button, CircularProgress, Paper, useMediaQuery } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function RouteMiddleLayer() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const modifiedURL = pathname.replace(
            '/middlelayer/',
            '/prescriptions/',
        );
        const fullURL = `${modifiedURL}${
            searchParams.toString() ? `?${searchParams.toString()}` : ''
        }`;
        router.push(fullURL);
    }, []);

    return <></>;
}

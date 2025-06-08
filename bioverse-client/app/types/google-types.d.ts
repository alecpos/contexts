declare global {
    interface Window {
        dataLayer?: any; // Adjust the type according to your needs
        rudderanalytics: {
            page: () => void;
            load: (
                writeKey: string,
                dataPlaneUrl: string,
                options?: object
            ) => void;
            identify: (
                userId: string,
                traits?: object,
                options?: object,
                callback?: () => void
            ) => void;
            alias: (
                userId: string,
                previousId?: string,
                callback?: () => void
            ) => void;
            track: (
                event: string,
                properties?: object,
                callback?: () => void
            ) => void;
            getAnonymousId: (
                callback?: (anonymousId: string) => void
            ) => string;
            setAnonymousId: (anonymousId: string) => void;
            reset: () => void;
            [key: string]: (...args: any[]) => void;
        };
    }
}

export {};

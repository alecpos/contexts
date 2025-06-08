export interface StripePriceList {
    [key: string]: {
        [planId: string]: {
            [key: string]: string;
        };
    };
}

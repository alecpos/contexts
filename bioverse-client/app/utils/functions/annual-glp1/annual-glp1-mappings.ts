import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export interface AnnualGlp1Map {
    //Product Href Key
    [key: string]: {
        [key: number]: {
            firstShipmentVariant: number;
            secondShipmentVariant: number;
        };
    };
}

export const ANNUAL_GLP1_VARIANT_MAP: AnnualGlp1Map = {
    /**
     * These mappings correspond to two variant indices, but they are double mapped
     * to give the same results whether the first or second shipment variant index is used.
     */
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        37: {
            firstShipmentVariant: 37,
            secondShipmentVariant: 38,
        },
        38: {
            firstShipmentVariant: 37,
            secondShipmentVariant: 38,
        },
        39: {
            firstShipmentVariant: 39,
            secondShipmentVariant: 40,
        },
        40: {
            firstShipmentVariant: 39,
            secondShipmentVariant: 40,
        },
        41: {
            firstShipmentVariant: 41,
            secondShipmentVariant: 42,
        },
        42: {
            firstShipmentVariant: 41,
            secondShipmentVariant: 42,
        },
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        40: {
            firstShipmentVariant: 40,
            secondShipmentVariant: 41,
        },
        41: {
            firstShipmentVariant: 40,
            secondShipmentVariant: 41,
        },
    },
};

export interface AnnualGlp1AllowedMap {
    //product href
    [key: string]: number[];
}

export const AnnualGLP1VariantIndexMap: AnnualGlp1AllowedMap = {
    [PRODUCT_HREF.SEMAGLUTIDE]: [37, 38, 39, 40, 41, 42],
    [PRODUCT_HREF.TIRZEPATIDE]: [40, 41],
};

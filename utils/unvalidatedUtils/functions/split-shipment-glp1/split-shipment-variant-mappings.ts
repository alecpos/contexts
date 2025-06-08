import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export interface SplitShipmentGlp1Map {
    //Product Href Key
    [key: string]: {
        [key: number]: {
            firstShipmentVariant: number;
            secondShipmentVariant: number;
        };
    };
}

export const SPLIT_SHIPMENT_GLP1_VARIANT_MAP: SplitShipmentGlp1Map = {
    /**
     * These mappings correspond to two variant indices, but they are double mapped
     * to give the same results whether the first or second shipment variant index is used.
     */
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        //0.25mg x 6
        64: {
            firstShipmentVariant: 64,
            secondShipmentVariant: 65,
        },
        65: {
            firstShipmentVariant: 64,
            secondShipmentVariant: 65,
        },

        //0.5mg x 6
        66: {
            firstShipmentVariant: 66,
            secondShipmentVariant: 67,
        },
        67: {
            firstShipmentVariant: 66,
            secondShipmentVariant: 67,
        },

        //0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg
        68: {
            firstShipmentVariant: 68,
            secondShipmentVariant: 69,
        },
        69: {
            firstShipmentVariant: 68,
            secondShipmentVariant: 69,
        },

        //0.5mg, 0.5mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg
        70: {
            firstShipmentVariant: 70,
            secondShipmentVariant: 71,
        },
        71: {
            firstShipmentVariant: 70,
            secondShipmentVariant: 71,
        },

        //1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg
        72: {
            firstShipmentVariant: 72,
            secondShipmentVariant: 73,
        },
        73: {
            firstShipmentVariant: 72,
            secondShipmentVariant: 73,
        },
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        //2.5mg x 6
        57: {
            firstShipmentVariant: 57,
            secondShipmentVariant: 58,
        },
        58: {
            firstShipmentVariant: 57,
            secondShipmentVariant: 58,
        },

        //2.5mg, 2.5mg, 2.5mg, 5mg, 5mg, 5mg
        59: {
            firstShipmentVariant: 59,
            secondShipmentVariant: 60,
        },
        60: {
            firstShipmentVariant: 59,
            secondShipmentVariant: 60,
        }
    },
};

export interface SplitShipmentGlp1AllowedMap {
    //product href
    [key: string]: number[];
}

export const SplitShipmentGLP1VariantIndexMap: SplitShipmentGlp1AllowedMap = {
    [PRODUCT_HREF.SEMAGLUTIDE]: [64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
    [PRODUCT_HREF.TIRZEPATIDE]: [57, 58, 59, 60],
};

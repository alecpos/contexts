import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
/**
 * These are the possible dosage equivalencies.
 */
export enum DosageChangeEquivalenceCodes {
    SEMAGLUTIDE_0_25 = 'semaglutide-0.25',
    SEMAGLUTIDE_0_5 = 'semaglutide-0.5',
    SEMAGLUTIDE_1_25 = 'semaglutide-1.25',
    SEMAGLUTIDE_2_5 = 'semaglutide-2.5',

    TIRZEPATIDE_2_5 = 'tirzepatide-2.5',
    TIRZEPATIDE_5 = 'tirzepatide-5',
    TIRZEPATIDE_7_5 = 'tirzepatide-7.5',
    TIRZEPATIDE_10 = 'tirzepatide-10',
    TIRZEPATIDE_12_5 = 'tirzepatide-12.5',
}

/**
 * This map is used to determine the dosage change equivalence for a given product and variant index.
 * It consumes product_href and an equivalence code to return a set of variant indices that represents the base-line value.
 *
 * Using this to get the baseline variant_index -> PVC -> can obtain the correct variant index for the patient case.
 */
export const DOSAGE_EQUIVALENCE_MAP: DosageChangeEquivalenceMap = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_25]: {
            monthly: 2,
            quarterly: 6,
            biannually: 15,
            annually: 37,
        },
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_5]: {
            monthly: 3,
            quarterly: 8,
            biannually: 16,
            annually: 39,
        },
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_1_25]: {
            monthly: 4,
            quarterly: 7,
            biannually: 20,
            annually: 41,
        },
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_2_5]: {
            monthly: 5,
            quarterly: 10,
            //Biannual price for this concentration as 1st vial does not exist.
        },
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_2_5]: {
            monthly: 3,
            quarterly: 6,
            biannually: 24,
            annually: 40,
        },
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_5]: {
            monthly: 4,
            quarterly: 8,
        },
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_7_5]: {
            monthly: 5,
            quarterly: 9,
        },
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_10]: {
            monthly: 10,
            quarterly: 12,
            biannually: 25,
        },
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_12_5]: {
            monthly: 11,
            quarterly: 13,
        },
    },
};

/**
 * Consumes productHref and variantIndex to get the correct dosage equivalency. //NEEDS UPDATING W/ NEW VARIANT INDEXES
 * @param productHref
 * @param variantIndex
 * @returns
 */
export function getDosageEquivalenceCodeFromVariantIndex(
    productHref: PRODUCT_HREF,
    variantIndex: number
): DosageChangeEquivalenceCodes | undefined {
    /**
     * Within the switch, I am targeting variantIndex and if it matches a variant index case it will return the resultant equivalence code.
     * For variant indices of cadencies greater than monthly:
     * The first month's dosage corresponds to the equivalence it will provide.
     */

    // For Semaglutide
    if (productHref === PRODUCT_HREF.SEMAGLUTIDE) {
        switch (variantIndex) {
            case 2:
            case 6:
            case 12:
            case 15:
            case 18:
            case 22:
            case 26:
            case 33:
            case 37:
            case 38:
            case 45:
            case 49:
            case 56:
            case 60:
            case 64:
            case 65:
            case 68:  
            case 69:
                return DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_25;
            case 3:
            case 8:
            case 11:
            case 13:
            case 16:
            case 19:
            case 23:
            case 28:
            case 32:
            case 36:
            case 39:
            case 40:
            case 46:
            case 52:
            case 55:
            case 59:
            case 61:
            case 66:
            case 67:
            case 70:
            case 71:
                return DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_5;
            case 4:
            case 7:
            case 9: 
            case 14:
            case 17:
            case 20:
            case 21:
            case 24: 
            case 27:
            case 29:
            case 31:
            case 34:
            case 35:
            case 41:
            case 42:
            case 43:
            case 44:
            case 47:
            case 50:
            case 51:
            case 53:
            case 57:
            case 58:
            case 62:
            case 72:
            case 73:
                return DosageChangeEquivalenceCodes.SEMAGLUTIDE_1_25;
            case 5:
            case 9:
            case 10:
            case 25:
            case 30:
            case 44:
            case 48:
            case 54:
            case 63:
                return DosageChangeEquivalenceCodes.SEMAGLUTIDE_2_5;
        }
    }

    // For Tirzepatide
    if (productHref === PRODUCT_HREF.TIRZEPATIDE) {
        switch (variantIndex) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 6:
            case 14:
            case 16:
            case 24:
            case 26:
            case 27:
            case 30:
            case 35:
            case 40:
            case 41:
            case 42:
            case 47:
            case 52:
            case 57:
            case 58:
            case 59:
            case 60: 
                return DosageChangeEquivalenceCodes.TIRZEPATIDE_2_5;
            case 4:
            case 7:
            case 8:
            case 17:
            case 18:
            case 19:
            case 31:
            case 36:
            case 43:
            case 48:
            case 53:
                return DosageChangeEquivalenceCodes.TIRZEPATIDE_5;
            case 5:
            case 8:
            case 9:
            case 20:
            case 37:
            case 32:
            case 44:
            case 49:
            case 54:
                return DosageChangeEquivalenceCodes.TIRZEPATIDE_7_5;
            case 10:
            case 12:
            case 15:
            case 21:
            case 25:
            case 28:
            case 38:
            case 33:
            case 45:
            case 50:
            case 55:
                return DosageChangeEquivalenceCodes.TIRZEPATIDE_10;
            case 11:
            case 13:
            case 22:
            case 23:
            case 29:
            case 39:
            case 34:
            case 46:
            case 51:
            case 56:
                return DosageChangeEquivalenceCodes.TIRZEPATIDE_12_5;
        }
    }

    return undefined;
}

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { ProductVariantController } from '../ProductVariant/ProductVariantController';
import {
    DOSAGE_EQUIVALENCE_MAP,
    DosageChangeEquivalenceCodes,
} from './DosageChangeEquivalenceMap';
import { USStates } from '@/app/types/enums/master-enums';

/**
 * @author Nathan Cho
 * Dosage change controller is primarily used to consume a product href + variant index and find the equivalencies for it.
 *
 * The intent is to consume a dosage type value from a variant index and then understand the different equivalent dosages per cadence.
 *
 * If we have 0.25 mg semaglutide dosing, we want to be able to relate that to a monthly, quarterly, biannual, annual variant for that dosage.
 * So no matter which variant index we put in, if it's equivalency is determined to be equal to a specific value, we know the
 * equivalent variants for every cadence that is available.
 */
export class DosageChangeController {
    private product_href: PRODUCT_HREF;
    private dosage_equivalence: DosageCadenceEquivalence;

    public constructor(
        product_href: PRODUCT_HREF,
        dosage_code: DosageChangeEquivalenceCodes
    ) {
        this.product_href = product_href;
        this.dosage_equivalence = this.findDosageCadenceEquivalentWithCode(
            product_href,
            dosage_code
        );
    }

    private findDosageCadenceEquivalentWithCode(
        productHref: PRODUCT_HREF,
        dosageCode: DosageChangeEquivalenceCodes
    ): DosageCadenceEquivalence {
        const found = DOSAGE_EQUIVALENCE_MAP[productHref][dosageCode];
        return found;
    }

    public getDosageEquivalence(): DosageCadenceEquivalence {
        return this.dosage_equivalence;
    }

    public getMonthlyVariantFromEquivalenceWithPVC(
        patient_state: USStates
    ): number {
        const productVariantController = new ProductVariantController(
            this.product_href,
            this.dosage_equivalence.monthly,
            patient_state
        );

        const monthlyVariant =
            productVariantController.getConvertedVariantIndex();

        if (!monthlyVariant.variant_index) {
            throw new Error('No monthly variant found');
        }

        return monthlyVariant.variant_index;
    }
}

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { VARIANT_PHARMACY_MAP } from '../ProductVariant/constants/VariantPharmacyMap';
import { getEmpowerCatalogObject } from '@/app/services/pharmacy-integration/empower/empower-variant-product-script-data';
import { getHallandaleCatalogObject } from '@/app/services/pharmacy-integration/hallandale/hallandale-variant-product-script-data';
import {
    BOOTHWYN_VARIANT_MAP,
    BOOTHWYN_VARIANT_PRODUCT_DESCRIPTOR_MAP,
} from '@/app/services/pharmacy-integration/boothwyn/boothwyn-variant-mapping';
import {
    REVIVE_PRODUCT_DESCRIPTOR_MAP,
    REVIVE_PRODUCT_VARIANT_MAP,
} from '@/app/services/pharmacy-integration/revive/revive-variant-mappings';

export class SigVizualizer {
    private _product_href: PRODUCT_HREF;
    private _variant_index: number;
    private _assigned_pharmacy: string;

    constructor(product_href: PRODUCT_HREF, variant_index: number) {
        this._product_href = product_href;
        this._variant_index = variant_index;
        this._assigned_pharmacy =
            VARIANT_PHARMACY_MAP[product_href][variant_index];

        // console.log(
        //     'sig visualizer log: ',
        //     this._product_href,
        //     this._variant_index,
        //     this._assigned_pharmacy,
        //     VARIANT_PHARMACY_MAP[product_href][variant_index]
        // );
    }

    // Getters
    get product_href(): string {
        return this._product_href;
    }

    get variant_index(): number {
        return this._variant_index;
    }

    get assigned_pharmacy(): string {
        return this._assigned_pharmacy;
    }

    // Setters
    set product_href(value: PRODUCT_HREF) {
        this._product_href = value;
    }

    set variant_index(value: number) {
        this._variant_index = value;
    }

    set assigned_pharmacy(value: string) {
        this._assigned_pharmacy = value;
    }

    public getSigs(): SigObject {
        switch (this._assigned_pharmacy) {
            case 'empower':
                return this.getEmpowerSigs(
                    this._product_href,
                    this._variant_index
                );
            case 'hallandale':
                return this.getHallandaleSigs(
                    this._product_href,
                    this._variant_index
                );
            case 'boothwyn':
                return this.getBoothwynSigs(
                    this._product_href,
                    this._variant_index
                );
            case 'revive':
                return this.getReviveSigs(
                    this._product_href,
                    this._variant_index
                );
            default:
                return {
                    productName: 'Unknown Pharmacy',
                    sigs: ['No pharmacy selected'],
                };
        }
    }

    private getEmpowerSigs(
        product_href: PRODUCT_HREF,
        variant_index: number
    ): SigObject {
        try {
            const empowerVariantObject = getEmpowerCatalogObject(
                product_href,
                variant_index
            );

            if (
                !empowerVariantObject?.array ||
                !empowerVariantObject?.selectDisplayName
            ) {
                return {
                    productName: 'Not Found',
                    sigs: ['No data available'],
                };
            }

            const sigs = empowerVariantObject.array.map((item) => item.sigText);
            const productName = empowerVariantObject.selectDisplayName;
            return { productName, sigs };
        } catch (error) {
            return {
                productName: 'Error',
                sigs: ['Failed to fetch Empower data'],
            };
        }
    }

    private getHallandaleSigs(
        product_href: PRODUCT_HREF,
        variant_index: number
    ): SigObject {
        try {
            const hallandaleVariantObject = getHallandaleCatalogObject(
                this._product_href,
                this._variant_index
            );

            if (
                !hallandaleVariantObject?.array ||
                !hallandaleVariantObject?.selectDisplayName
            ) {
                return {
                    productName: 'Not Found',
                    sigs: ['No data available'],
                };
            }

            const sigs = hallandaleVariantObject.array.map(
                (item) => item.sigText
            );
            const productName = hallandaleVariantObject.selectDisplayName;
            return { productName, sigs };
        } catch (error) {
            return {
                productName: 'Error',
                sigs: ['Failed to fetch Hallandale data'],
            };
        }
    }

    private getBoothwynSigs(
        product_href: PRODUCT_HREF,
        variant_index: number
    ): SigObject {
        try {
            const productName =
                BOOTHWYN_VARIANT_PRODUCT_DESCRIPTOR_MAP[product_href]?.[
                    variant_index
                ];
            const boothwynVariantObject =
                BOOTHWYN_VARIANT_MAP[product_href]?.[variant_index];

            if (!productName || !boothwynVariantObject) {
                return {
                    productName: 'Not Found',
                    sigs: ['No data available'],
                };
            }

            const sigs = boothwynVariantObject.map((item) => item.instructions);
            return { productName, sigs };
        } catch (error) {
            return {
                productName: 'Error',
                sigs: ['Failed to fetch Boothwyn data'],
            };
        }
    }

    private getReviveSigs(
        product_href: PRODUCT_HREF,
        variant_index: number
    ): SigObject {
        try {
            const productName =
                REVIVE_PRODUCT_DESCRIPTOR_MAP[product_href]?.[variant_index];
            const reviveVariantObject =
                REVIVE_PRODUCT_VARIANT_MAP[product_href]?.[variant_index];

            if (!productName || !reviveVariantObject) {
                return {
                    productName: 'Not Found',
                    sigs: ['No data available'],
                };
            }

            const sigs = reviveVariantObject.map((item) => item.sig);
            return { productName, sigs };
        } catch (error) {
            return {
                productName: 'Error',
                sigs: ['Failed to fetch Revive data'],
            };
        }
    }
}

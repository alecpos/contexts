interface PharmacyVariantMap {
    [key: string]: number;
}

interface ProductEquivalence {
    productHref: string;
    dosage: string;
    cadence: string;
    pharmacyMap: PharmacyVariantMap;
    equivalenceCode: EquivalenceCodes;
}

interface ProductVariantRecord {
    product_href: string;
    id: number;
    created_at: string;
    variant: string;
    price_data: any;
    variant_index: number;
    cadence: string;
    stripe_price_ids: {
        dev: string;
        prod: string;
    };
    active: boolean;
    vial: string;
    vial_dosages: string;
    dosages: string;
    phamracy: string;
}

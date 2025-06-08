export interface CadencePriceInformation {
    cadence: string;
    product_price: number;
    discount_price: {
        discount_type: string;
        discount_amount: number;
    };
    stripe_price_id: string;
    blue_display_text: string;
    gray_display_text: string | null;
    stripe_product_id: string;
    quarterly_display_price: string | null;
    subscription_includes_bullets: string[];
}

export interface ProductPrice {
    variant: string;
    one_time: CadencePriceInformation;
    monthly: CadencePriceInformation;
    quarterly: CadencePriceInformation;
    product_href: string;
    variant_index: number;
}

export interface DosageInstructions {
    header: string;
    subtitle: string;
}

export type Environment = 'dev' | 'prod';

export interface StripePriceId {
    dev: string;
    prod: string;
}

export interface BundleProductPrice {
    cadence: string;
    savings: {
        daily: number;
        total: number;
        percent: number;
        original_price: number;
        monthly: number;
        yearly?: number;
        exact_total: number;
    };
    total_mg: number;
    is_bundle: boolean;
    vial_sizes: number[];
    product_price: number;
    discount_price: {
        discount_type: string;
        discount_amount: number;
    };
    instructions: Instruction[];
    stripe_price_id: StripePriceId;
    blue_display_text: string | null;
    gray_display_text: string | null;
    stripe_product_id: string;
    dosage_instructions: DosageInstructions[];
    product_price_monthly: number;
    quarterly_display_price: null;
    subscription_includes_bullets: string[];
}

export interface Instruction {
    header?: string;
    subtitle?: string;
    description: string;
    dosage_instructions: string;
    injection_instructions: string;
}

export interface MonthlyProductPrice {
    cadence: string;
    is_bundle: boolean;
    product_price: number;
    daily_price: number;
    discount_price: {
        discount_type: string;
        discount_amount: number;
    };
    instructions: Instruction[];
    stripe_price_id: StripePriceId;
    vial_sizes: number[];
    blue_display_text: string | null;
    gray_display_text: string | null;
    stripe_product_id: string;
    dosage_instructions: string;
    quarterly_display_price: string | null;
    subscription_includes_bullets: string[];
}

export interface VariantProductPrice {
    active?: boolean;
    variant: string;
    quarterly?: BundleProductPrice | null;
    monthly?: MonthlyProductPrice | null;
    bimonthly?: BundleProductPrice | null;
    pentamonthly?: BundleProductPrice | null;
    variant_index: number | string;
    cadence: string;
    vial: string;
    isBundle?: boolean;
    vial_dosages?: string;
    dosages: string[];
    pharmacy: string;
}

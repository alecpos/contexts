type ProductPriceRecord = {
    id: string;
    created_at: string;
    last_modified: string;
    reference_id: string;
    variant: string;
    one_time: CadenceData | null;
    monthly: CadenceData | null;
    quarterly: CadenceData | null;
    product_href: string;
    variant_index: number;
    active: boolean;
};

interface CadenceData {
    cadence: string;
    product_price: number;
    discount_price: {
        discount_type: string;
        discount_amount: number;
    };
    stripe_price_id: string;
    blue_display_text: string;
    gray_display_text: string;
    price_text: string;
    custom_display_price?: string;
    stripe_product_id: string;
    quarterly_display_price?: string;
    subcription_includes_bullets: string[];
}

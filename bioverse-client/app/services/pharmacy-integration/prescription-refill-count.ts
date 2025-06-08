interface RefillObject {
    product_href: string;
    refill_count: number;
    cadence: string;
}

const PRODUCT_REFILL_LIST: RefillObject[] = [
    { product_href: 'nad-injection', refill_count: 5, cadence: 'monthly' },
    { product_href: 'nad-nasal-spray', refill_count: 5, cadence: 'monthly' },
    { product_href: 'nad-patches', refill_count: 1, cadence: 'monthly' },
    { product_href: 'wegovy', refill_count: 0, cadence: 'monthly' },
    { product_href: 'mounjaro', refill_count: 0, cadence: 'monthly' },
    { product_href: 'ozempic', refill_count: 0, cadence: 'monthly' },
    { product_href: 'semaglutide', refill_count: 0, cadence: 'monthly' },
    { product_href: 'tirzepatide', refill_count: 0, cadence: 'monthly' },
    { product_href: 'cgm-sensor', refill_count: 2, cadence: 'monthly' },
    { product_href: 'metformin', refill_count: 1, cadence: 'quarterly' },
    { product_href: 'acarbose', refill_count: 0, cadence: 'quarterly' },
    { product_href: 'telmisartan', refill_count: 0, cadence: 'quarterly' },
    { product_href: 'atorvastatin', refill_count: 2, cadence: 'monthly' },
    { product_href: 'atorvastatin', refill_count: 0, cadence: 'quarterly' },
    { product_href: 'b12-injection', refill_count: 5, cadence: 'monthly' },
    { product_href: 'b12-injection', refill_count: 1, cadence: 'quarterly' },
    {
        product_href: 'glutathione-injection',
        refill_count: 5,
        cadence: 'monthly',
    },
    {
        product_href: 'finasterine-and-minoxidil-spray',
        refill_count: 5,
        cadence: 'monthly',
    },
    {
        product_href: 'tadalafil-as-needed',
        refill_count: 5,
        cadence: 'monthly',
    },
    {
        product_href: 'tadalafil-as-needed',
        refill_count: 1,
        cadence: 'quarterly',
    },
    { product_href: 'tadalafil-daily', refill_count: 5, cadence: 'monthly' },
    { product_href: 'tadalafil-daily', refill_count: 1, cadence: 'quarterly' },
    { product_href: 'nad-face-cream', refill_count: 5, cadence: 'monthly' },
    { product_href: 'tretinoin', refill_count: 1, cadence: 'quarterly' },
];

export function getRefillCount(
    product_href: string,
    cadence: string
): number | undefined {
    const product = PRODUCT_REFILL_LIST.find(
        (item) => item.product_href === product_href && item.cadence === cadence
    );
    return product ? product.refill_count : undefined;
}

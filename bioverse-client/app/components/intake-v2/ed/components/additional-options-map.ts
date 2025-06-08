interface AlternativeOptionMap {
    [key: string]: {
        [key: string]: {
            name: string;
            subtitle?: string;
            price: string;
            image: string;
            productHref: string;
        }[];
    };
}

interface IndividualFlowOptionMap {
    name: string;
    subtitle?: string;
    price: string;
    image: string;
    productHref: string;
}

export const ALTERNATIVE_ED_OPTIONS_INDIVIDUAL_FLOW: IndividualFlowOptionMap[] =
    [
        {
            name: 'Peak Chews',
            price: 'As low as $1.99/use',
            image: '/img/product-images/prescriptions/peak-chews.png',
            productHref: 'peak-chews',
        },
        {
            name: 'X Chews',
            price: 'As low as $3.33/use',
            image: '/img/product-images/prescriptions/x-chews.png',
            productHref: 'x-chews',
        },
        {
            name: 'X Melts',
            price: 'As low as $3.33/use',
            image: '/img/product-images/prescriptions/x-melts.png',
            productHref: 'x-melts',
        },
    ];

//why does Rush Melts not have a daily option?
export const ALTERNATIVE_ED_OPTIONS: AlternativeOptionMap = {
    daily: {
        'fast-acting': [
            {
                name: 'Peak Chews',
                price: 'As low as $1.99/use',
                image: '/img/product-images/prescriptions/peak-chews.png',
                productHref: 'peak-chews',
            },
            {
                name: 'X Chews',
                price: 'As low as $3.33/use',
                image: '/img/product-images/prescriptions/x-chews.png',
                productHref: 'x-chews',
            },
            {
                name: 'X Melts',
                price: 'As low as $3.33/use',
                image: '/img/product-images/prescriptions/x-melts.png',
                productHref: 'x-melts',
            },
            {
                name: 'Rush Chews',
                price: 'As low as $2.05/use',
                image: '/img/product-images/prescriptions/rush-chews.png',
                productHref: 'rush-chews',
            },
        ],
        standard: [
            // {
            //     name: 'Cialis®',
            //     price: 'As low as $84.84/use',
            //     image: '/img/product-images/prescriptions/cialis.png',
            //     productHref: 'cialis',
            // },
            {
                name: 'Tadalafil',
                price: 'As low as $1.05/use',
                image: '/img/product-images/prescriptions/tadalafil.png',
                productHref: 'tadalafil',
            },
        ],
    },
    'as-needed': {
        'fast-acting': [
            {
                name: 'Rush Melts',
                price: 'As low as $4.26/use',
                image: '/img/product-images/prescriptions/rush-melts.png',
                productHref: 'rush-melts',
            },
            {
                name: 'X Chews',
                price: 'As low as $5.93/use',
                image: '/img/product-images/prescriptions/x-chews.png',
                productHref: 'x-chews',
            },
            {
                name: 'X Melts',
                price: 'As low as $4.78/use',
                image: '/img/product-images/prescriptions/x-melts.png',
                productHref: 'x-melts',
            },
            {
                name: 'Peak Chews',
                price: 'As low as $4.97/use',
                image: '/img/product-images/prescriptions/roundYellow.png',
                productHref: 'peak-chews',
            },
            {
                name: 'Rush Chews',
                price: 'As low as $2.29/use',
                image: '/img/product-images/prescriptions/rush-chews.png',
                productHref: 'rush-chews',
            },
        ],
        standard: [
            {
                name: 'Tadalafil',
                subtitle: 'Generic Cialis®',
                price: 'As low as $3.98/use',
                image: '/img/product-images/prescriptions/tadalafil.png',
                productHref: 'tadalafil',
            },
            {
                name: 'Sildenafil',
                subtitle: 'Generic Viagra®',
                price: 'As low as $7.33/use',
                image: '/img/product-images/prescriptions/sildenafil.png',
                productHref: 'sildenafil',
            },
            {
                name: 'Cialis®',
                subtitle: 'Tadalafil',
                price: 'As low as $84.84/use',
                image: '/img/product-images/prescriptions/cialis.png',
                productHref: 'cialis',
            },
            {
                name: 'Viagra®',
                subtitle: 'Sildenafil',
                price: 'As low as $163.55/use',
                image: '/img/product-images/prescriptions/viagra.png',
                productHref: 'viagra',
            },
        ],
    },
};

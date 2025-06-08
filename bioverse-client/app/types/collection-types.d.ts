interface CollectionsFilterSearchParams {
    typePrefilter: string;
    focusPrefilter: string;
}

interface FocusFilter {
    displayText: string;
    filterText: string;
}

const focusFilters: FocusFilter[] = [
    {
        displayText: 'Health & Longevity',
        filterText: 'health-and-longevity',
    },
    {
        displayText: 'Weight Loss',
        filterText: 'weight-loss',
    },
    {
        displayText: 'Energy & Cognitive Function',
        filterText: 'energy-and-cognitive-function',
    },
    {
        displayText: 'Autoimmune Support',
        filterText: 'autoimmune-support',
    },
    {
        displayText: 'Heart Health & Blood Pressure',
        filterText: 'heart-health-and-blood-pressure',
    },
    {
        displayText: 'NAD Support',
        filterText: '   ',
    },
    // {
    //     displayText: 'Hair Loss',
    //     filterText: 'hair-loss',
    // },
    {
        displayText: 'GSH Support',
        filterText: 'gsh-support',
    },
    // {
    //     displayText: 'Erectile Dysfunction',
    //     filterText: 'erectile-dysfunction',
    // },
    {
        displayText: 'Health Monitoring',
        filterText: 'health-monitoring',
    },
    {
        displayText: 'Skincare',
        filterText: 'skincare',
    },
];

interface IconFilter {
    filterValue: string;
    iconRef: string;
}

const filterElements: IconFilter[] = [
    //   {
    //     filterValue: "Consultation",
    //     iconRef: "/img/type-icons/consultation.svg",
    //   },
    {
        filterValue: 'Cream',
        iconRef: '/img/type-icons/cream.svg',
    },
    {
        filterValue: 'Injection',
        iconRef: '/img/type-icons/injection.svg',
    },
    {
        filterValue: 'Patch',
        iconRef: '/img/type-icons/patch.svg',
    },
    {
        filterValue: 'Pill',
        iconRef: '/img/type-icons/pill.svg',
    },
    {
        filterValue: 'Powder',
        iconRef: '/img/type-icons/powder.svg',
    },
    {
        filterValue: 'Spray',
        iconRef: '/img/type-icons/spray.svg',
    },
    // {
    //     filterValue: 'Test Kit',
    //     iconRef: '/img/type-icons/test-kit.svg',
    // },
];

interface mobileFilterStates {
    focusAreas: Set;
    types: Set;
}

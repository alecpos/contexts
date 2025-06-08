export const findMedicationById = (id: string) => {
    return TMCMedicationList.find((medication) => medication.id === id);
};

export const findMedicationByHref = (href: string) => {
    return TMCMedicationList.find((medication) => medication.href === href);
};

interface TMC_PRODUCT_OBJECT {
    name: string;
    strength: string;
    size: string;
    id: string;
    sig: string;
    href: string;
}

export const TMCMedicationList: TMC_PRODUCT_OBJECT[] = [
    {
        name: 'Methylcobalamin B12 Injection ',
        strength: '1000mcg/ml',
        size: '10ml',
        id: '01t36000003zHJ1AAM',
        sig: `Start by injecting 1ml/cc 1-2 times per week. If desired, you can slowly increase up to 2ml/cc 1-2 times per week, or as prescribed. Should you ramp up to 2ml/cc, contact our team to adjust your ongoing Rx.`,
        href: 'b12-injection',
    },
    // {
    //     name: 'Methionine/Inositol B12',
    //     strength: '1000mcg/ml',
    //     size: '10ml',
    //     id: '01tDn000005qeOCIAY',
    // },
    {
        name: 'Glutathione Injection',
        strength: '200mg/ml',
        size: '10ml',
        id: '01t36000003SgojAAC',
        sig: 'Inject 0.5ml subcutaneously up to 5x per week.',
        href: 'glutathione-injection',
    },
    // {
    //     name: 'NAD+ IontoPatch Patches (Includes 6 patches)',
    //     strength: '600mg/ml (1 patch)  3600mg bundle',
    //     size: '6 patches',
    //     id: '01t1R000007Xx7GQAS',
    // },
    {
        name: 'NAD+ Injection',
        strength: '200mg/ml',
        size: '5ml',
        id: '01tDn000005pzDAIAY',
        sig: 'Inject 0.1ml subcutaneously and slowly increase to 0.5ml up to 3x per week.',
        href: 'nad-injection',
    },
];

export const findSecondaryItemById = (id: string) => {
    return TMCSecondaryItemList.find(
        (secondary_item) => secondary_item.id === id
    );
};

interface TMC_SECONDARY_ITEM_OBJECT {
    name: string;
    id: string;
}

export const TMCSecondaryItemList: TMC_SECONDARY_ITEM_OBJECT[] = [
    {
        name: '0.5cc Insulin Syringe w/ 30G X 1/2" Needle (Pack of 10)',
        id: '01t1R000007FvGmQAK',
    },
    {
        name: '1mL Luer Lock Syringe w/ 20G X 1" and 25G X 1" Needles (IM Kit)',
        id: '01tDn0000002CERIA2',
    },
    {
        name: '1mL Luer Lock Syringe w/ 20G X 1" and 27G X 1/2" Needles (Female IM Kit)',
        id: '01t36000005sZ6vAAE',
    },
];

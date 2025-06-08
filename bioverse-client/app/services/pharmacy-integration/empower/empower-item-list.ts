/**
 *
 * ██████╗░░█████╗░  ███╗░░██╗░█████╗░████████╗  ██╗░░░██╗░██████╗███████╗
 * ██╔══██╗██╔══██╗  ████╗░██║██╔══██╗╚══██╔══╝  ██║░░░██║██╔════╝██╔════╝
 * ██║░░██║██║░░██║  ██╔██╗██║██║░░██║░░░██║░░░  ██║░░░██║╚█████╗░█████╗░░
 * ██║░░██║██║░░██║  ██║╚████║██║░░██║░░░██║░░░  ██║░░░██║░╚═══██╗██╔══╝░░
 * ██████╔╝╚█████╔╝  ██║░╚███║╚█████╔╝░░░██║░░░  ╚██████╔╝██████╔╝███████╗
 * ╚═════╝░░╚════╝░  ╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░  ░╚═════╝░╚═════╝░╚══════╝
 * 🄳🄴🄿🅁🄴🄲🄰🅃🄴🄳
 * File is deprecated.
 * @author Nathan Cho
 * Comments: empower-catalog.ts has replaced this file in usage. Please refer to that file.
 * Once All empower interfaces do not use item-list this file may be removed.
 */

interface EmpowerItem {
    id: string;
    itemDesignatorId: string;
    drugDescription: string;
    dosage: string;
    quantity: string;
    form: string;
    price: string;
    isGeneric: boolean;
    isBrand: boolean;
    identifier: string;
    metadata: {
        script_sig: string;
        display_sig: string;
        quantity: string;
        days_in_duration: string;
    };
}

export const itemList: EmpowerItem[] = [
    // {
    //     itemDesignatorId: '1C671C3C2027523571CB9889BE8914B3',
    //     drugDescription: 'NAD+ Nasal Spray',
    //     dosage: '300 mg/ml',
    //     quantity: '15 ml',
    //     form: 'NASAL SPRAY',
    //     price: '$48.94',
    //     isGeneric: false,
    //     isBrand: true,
    // },
    {
        id: 'semaglutide-1',
        itemDesignatorId: 'A25CCAF5A59AE9D9764A59DA9BCEB5EE',
        drugDescription: 'Semaglutide / Cyanocobalamin (0.25 mg)',
        dosage: '1mg /0.5mg /ml',
        quantity: '1 ml',
        form: 'INJECTABLE',
        price: '$69.16',
        isGeneric: false,
        isBrand: true,
        identifier: 'semaglutide-1/0.5/1/1',
        metadata: {
            script_sig:
                'Inject 25 units subcutaneously once a week for four weeks',
            display_sig:
                'Inject 25 units (0.25mg) subcutaneously once a week for four weeks',
            quantity: '1',
            days_in_duration: '28',
        },
    },
    {
        id: 'semaglutide-2',
        itemDesignatorId: '2E856CB5BEF400773849E2576305CF02',
        drugDescription: 'Semaglutide / Cyanocobalamin (1.25 mg)',
        dosage: '5mg /0.5mg /ml',
        quantity: '1 ml',
        form: 'INJECTABLE',
        price: '$119.80',
        isGeneric: false,
        isBrand: true,
        identifier: 'semaglutide-5/0.5/1/1',
        metadata: {
            script_sig:
                'Inject 25 units subcutaneously once a week for four weeks',
            display_sig:
                'Inject 25 units (1.25mg) subcutaneously once a week for four weeks',
            quantity: '1',
            days_in_duration: '28',
        },
    },
    {
        id: 'semaglutide-3',
        itemDesignatorId: 'CFD8712D2EF9495087967973E5CCDEE9',
        drugDescription: 'Semaglutide / Cyanocobalamin (0.5 mg)',
        dosage: '1mg /0.5mg /ml',
        quantity: '2.5 ml',
        form: 'INJECTABLE',
        price: '$91.39',
        isGeneric: false,
        isBrand: true,
        identifier: 'semaglutide-1/0.5/1/2.5',
        metadata: {
            script_sig:
                'Inject 50 units subcutaneously once a week for four weeks',
            display_sig:
                'Inject 50 units (0.5mg) subcutaneously once a week for four weeks',
            quantity: '1',
            days_in_duration: '28',
        },
    },
    {
        id: 'semaglutide-4',
        itemDesignatorId: '6F743FC0E60CFDC817A1912351824286',
        drugDescription: 'Semaglutide / Cyanocobalamin (12.5 mg)',
        dosage: '5mg /0.5mg /ml',
        quantity: '2.5 ml',
        form: 'INJECTABLE',
        price: '$218.98',
        isGeneric: false,
        isBrand: true,
        identifier: 'semaglutide-1/0.5/1/2.5',
        metadata: {
            script_sig:
                'Inject 50 units subcutaneously once a week for four weeks',
            display_sig:
                'Inject 50 units (2.5 mg)  subcutaneously once a week for four weeks',
            quantity: '1',
            days_in_duration: '28',
        },
    },
    // {
    //     itemDesignatorId: '6F743FC0E60CFDC817A1912351824286',
    //     drugDescription: 'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION',
    //     dosage: '5mg /0.5mg /ml',
    //     quantity: '2.5 ml',
    //     form: 'INJECTABLE',
    //     price: '$184.02',
    //     isGeneric: false,
    //     isBrand: true,
    // },
    {
        id: 'tirzepatide-1',
        itemDesignatorId: 'B1961EA2BDFA7A1AF0168EBC969E4A99',
        drugDescription: 'Tirzepatide / Niacinamide (7.5 mg)',
        dosage: '17mg /2mg /ml',
        quantity: '2 ml',
        form: 'INJECTABLE',
        price: '$214.70',
        isGeneric: false,
        isBrand: false,
        identifier: 'tirzepatide-17/2/1/2',
        metadata: {
            script_sig:
                'Inject 44 units subcutaneously once a week for four weeks',
            display_sig:
                'Inject 44 units (7.5mg) subcutaneously once a week for four weeks',
            quantity: '1',
            days_in_duration: '28',
        },
    },
    {
        id: 'tirzepatide-2',
        itemDesignatorId: 'C33D31DFC3AEBBAC2B127876340292F7',
        drugDescription: 'Tirzepatide / Niacinamide (5 mg)',
        dosage: '8mg /2mg /ml',
        quantity: '2.5 ml',
        form: 'INJECTABLE',
        price: '$175.75',
        isGeneric: false,
        isBrand: false,
        identifier: 'tirzepatide-8/2/1/2.5/5-5',
        metadata: {
            script_sig:
                'Inject 60 units subcutaneously once a week for four weeks',
            display_sig:
                'Inject 60 units (5mg) subcutaneously once a week for four weeks',
            quantity: '1',
            days_in_duration: '28',
        },
    },
    {
        id: 'tirzepatide-3',
        itemDesignatorId: 'C33D31DFC3AEBBAC2B127876340292F7',
        drugDescription: 'Tirzepatide / Niacinamide (2.5 mg)',
        dosage: '8mg /2mg /ml',
        quantity: '2.5 ml',
        form: 'INJECTABLE',
        price: '$175.75',
        isGeneric: false,
        isBrand: false,
        identifier: 'tirzepatide-8/2/1/2.5/2.5-2.5',
        metadata: {
            script_sig:
                'Inject 30 units subcutaneously once a week for four weeks',
            display_sig:
                'Inject 30 units (2.5mg) subcutaneously once a week for four weeks',
            quantity: '1',
            days_in_duration: '28',
        },
    },
];

export const needleList = [];

export const syringeList = [
    {
        itemDesignatorId: 'D47C68C8F762F8DA97DEF2FFB11933D2',
        drugDescription: 'SYRINGE 30G 1/2 0.5CC (EASY TOUCH)',
    },
    {
        itemDesignatorId: 'CB6B0488C2FBEAE2424311F114F7DC0A',
        drugDescription: 'SYRINGE 30G 1/2 1CC (EASY TOUCH)',
    },
    {
        itemDesignatorId: '164E03AAC77A9C31601F4F93A294D65F',
        drugDescription: 'ALCOHOL PREP PADS (EASY TOUCH)',
    },
    {
        itemDesignatorId: 'CDFC44A758FE9EE5932D317B9EA7101C',
        drugDescription: 'SYRINGE 31G  5/16 1CC (EASY TOUCH)',
    },
];

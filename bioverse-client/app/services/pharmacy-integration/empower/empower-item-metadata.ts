interface ITEM_METADATA {
    identifier: string;
    metadata: {
        script_sig: string;
        display_sig: string;
        quantity: string;
        days_in_duration: string;
    };
}

export const EMPOWER_ITEM_METADATA: ITEM_METADATA[] = [
    {
        //'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION' , '1mg /0.5mg /ml' 1mL
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
    //'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION', '5mg /0.5mg /ml' 1mL
    {
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
    //'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION', '1mg /0.5mg /ml' 2.5 mL
    {
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
    // 'TIRZEPATIDE / NIACINAMIDE INJECTION (2.5 mg Dose)', '8mg /2mg /ml', '2.5 ml',
    {
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
    // 'TIRZEPATIDE / NIACINAMIDE INJECTION (5 mg Dose)', '8mg /2mg /ml', '2.5 ml',
    {
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
    // 'TIRZEPATIDE / NIACINAMIDE INJECTION', '17mg /2mg /ml', '2 ml',
    {
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
];

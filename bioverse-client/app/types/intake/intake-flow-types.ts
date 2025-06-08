export enum IntakeProductNames {
    Semaglutide = 'Compounded Semaglutide',
    Tirzepatide = 'Compounded Tirzepatide',
    Wegovy = 'Wegovy® (Semaglutide)',
    Ozempic = 'Ozempic® (Semaglutide)',
    Rybelsus = 'Rybelsus® (Semaglutide)',
    Mounjaro = 'Mounjaro® (Tirzepatide)',
    Zepbound = 'Zepbound™ (Tirzepatide)',
    Saxenda = 'Saxenda® (Liraglutide)',
    Trulicity = 'Trulicity® (Dulaglutide)',
    Victoza = 'Victoza® (Liraglutide)',
}

export enum DosageDurationAnswers {
    OneWeek = '1 week',
    TwoWeeks = '2 weeks',
    ThreeWeeks = '3 weeks',
    OneMonth = '1 month',
    OneMonthPlus = 'More than 1 month',
}

interface DosageMapping {
    higher_dosage: number;
    regular_dosage: number;
}

interface ProductMapping {
    [dosage: string]: DosageMapping;
}

export interface ProductMappings {
    [productHref: string]: ProductMapping;
}

/**
 *
 * Purpose of file: Many compounds sent by Dosespot have a name unique to them, and we need to match them to our product-href's
 *
 * This way we can pinpoint the order that is paired with the specific patient prescription.
 * There are 3 different matchers that we can fall back on.
 *
 * They are sorted in terms of use - top to bottom : most likely match to less likely match
 *
 * 1st Stage: Generic Drug Name
 * 2nd Stage: Lexicomp Drug ID
 * 3rd Stage: NDC number.
 */

/**
 * interfaces:
 */
interface DrugNamePairs {
    [key: string]: string;
}
interface DrugIdPairs {
    [key: string]: string;
}
interface DrugNDCPairs {
    [key: string]: string;
}
interface DrugCompoundPairs {
    [key: string]: string;
}
interface DrugDisplayNamePairs {
    [key: string]: string;
}
interface DispensableDrugIdPairs {
    [key: number]: string;
}

/**
 * Uses Generic Drug Name
 */

export const DOSE_SPOT_GENERIC_DRUG_NAME_PAIRS: DrugNamePairs = {
    metFORMIN: 'metformin',
    telmisartan: 'telmisartan',
    atorvastatin: 'atorvastatin',
    tadalafil: 'tadalafil',
    acarbose: 'acarbose',
    tirzepatide: 'mounjaro',
};

/**
 * Uses LexiGenDrugId
 */
export const DOSE_SPOT_LEXICOMP_DRUG_ID_PAIRS: DrugIdPairs = {
    d03807: 'metformin',
    d04364: 'telmisartan',
    d04105: 'atorvastatin',
    d04896: 'tadalafil',
    d03846: 'acarbose',
};

/**
 * Uses NDC
 */

export const DOSE_SPOT_NDC_PAIRS: DrugNDCPairs = {
    '82009011710': 'metformin',
    '00378292077': 'telmisartan',
    '00093505610': 'atorvastatin',
    '00093301856': 'tadalafil',
    '00054014025': 'acarbose',
    '57599000200': 'cgm-sensor',
    '00169452514': 'wegovy',
    '00169413212': 'ozempic',
    '00002150680': 'mounjaro',
};

/**
 * Uses CompoundID
 */

export const DOSE_SPOT_COMPOUND_PAIRS: DrugNDCPairs = {
    '45553': 'finasterine-and-minoxidil-spray',
    '45560': 'nad-face-cream',
    '45563': 'tretinoin',
};

export const DOSE_SPOT_DISPLAY_NAME_PAIRS: DrugDisplayNamePairs = {
    'Acarbose Oral Tablet 25 MG': 'acarbose',
    'metFORMIN HCl Oral Tablet 1000 MG': 'metformin',
    'metFORMIN HCl ER Oral Tablet Extended Release 24 Hour 500 MG': 'metformin',
    'Tadalafil Oral Tablet 2.5 MG': 'tadalafil-daily',
    'Ondansetron HCl Oral Tablet 4 MG': 'zofran',
    'AA2 - tretinoin 0.03%/Azelaic Acid 4%/Niacinamide 4% compounded cream':
        'tretinoin',
    'FreeStyle Libre 3 Sensor  Miscellaneous': 'cgm-sensor',

    'Tadalafil Oral Tablet 5 MG': 'tadalafil',
    'Tadalafil Oral Tablet 10 MG': 'tadalafil',
    'Tadalafil Oral Tablet 20 MG': 'tadalafil',

    'Sildenafil 81mg/Tadalafil 12mg Troche': 'rush-melts',

    'Viagra Oral Tablet 50 MG': 'viagra',
    'Viagra Oral Tablet 100 MG': 'viagra',

    'Cialis Oral Tablet 10 MG': 'cialis',
    'Cialis Oral Tablet 20 MG': 'cialis',
    'Cialis Oral Tablet 5 MG': 'cialis',

    'Sildenafil Citrate Oral Tablet 25 MG': 'sildenafil',
    'Sildenafil Citrate Oral Tablet 50 MG': 'sildenafil',
};

export const DOSE_SPOT_DISPENSABLE_DRUG_ID_PAIRS: DispensableDrugIdPairs = {
    26: 'metformin',
    31254: 'metformin',
    9051: 'zofran',

    17088: 'tadalafil',
    80297: 'tadalafil',
    15433: 'tadalafil',

    79616: 'viagra',
    1701: 'viagra',

    77603: 'cialis',
    18476: 'cialis',
    6133: 'cialis',

    1660: 'sildenafil',
};

import { SEMAGLUTIDE_TIRZEPATIDE_COMBINED_DISPLAY_ARRAY } from '@/app/components/provider-coordinator-shared/all-patients/utils/glp-1-list';
import { Status } from '@/app/types/global/global-enumerators';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { replaceParameters } from '@/app/utils/database/controller/macros/macros';
import { getMacroById } from '@/app/utils/database/controller/macros/macros-api';
import { MacroParameters } from '@/app/utils/database/controller/macros/macros-types';
import { getProviderFromId } from '@/app/utils/database/controller/providers/providers-api';
import {
    GLP1_NAMES_TO_INDEX,
    SEMAGLUTIDE_DOSAGE,
} from '../../../intake-response-column/adjust-dosing-dialog/dosing-mappings';
import { DosageChangeEquivalenceCodes } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';

export async function getProviderMacroHTMLPrePopulated(
    product_href: string,
    variant_index: number = 0,
    patientData: DBPatientData,
    target_provider_id?: string
) {
    let provider_id = target_provider_id;

    if (!target_provider_id) {
        provider_id = (await readUserSession()).data.session?.user.id;
    }

    const productMapping = prodcutMacroMapping[product_href];
    if (!productMapping) {
        console.error(`No mapping found for ${product_href}`);
        return '';
    }
    const macroId = productMapping[variant_index];

    const { status, data, error } = await getMacroById(macroId);

    const provider_data = await getProviderFromId(provider_id!);

    if (status === Status.Success) {
        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name ?? '{{***Name Not Found***}}',
            data?.macroHtml,
            provider_data?.credentials ?? ''
        );

        return replacedHTML;
    } else {
        console.error('Could not get Macro By ID.');
        return '';
    }
}

export async function getAutoShipMacroPopulated(
    product_href: string,
    patientData: DBPatientData,
    isBundlePatient: boolean
) {
    //todo set this
    const macroId = isBundlePatient ? 253 : 254;

    const { status, data, error } = await getMacroById(macroId);

    const provider_data = await getProviderFromId(
        'e756658d-785d-46d5-85ab-22bf11256a59' //Hard coded Customer Support
    );

    if (status === Status.Success) {
        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name ?? '{{***Name Not Found***}}',
            data?.macroHtml,
            provider_data?.credentials ?? '',
            product_href!
        );

        return replacedHTML;
    } else {
        console.error('Could not get Macro By ID.');
        return '';
    }
}

export async function getProviderMacroHTMLDefault(
    product_href: string,
    patientData: DBPatientData,
    macroId: number
) {
    const productMapping = prodcutMacroMapping[product_href];
    if (!productMapping) {
        console.error(`No mapping found for ${product_href}`);
        return '';
    }

    const { status, data, error } = await getMacroById(macroId);

    const provider_id = (await readUserSession()).data.session?.user.id;
    const provider_data = await getProviderFromId(provider_id!);

    if (status === Status.Success) {
        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name ?? '{{***Name Not Found***}}',
            data?.macroHtml,
            provider_data?.credentials ?? ''
        );

        return replacedHTML;
    } else {
        console.error('Could not get Macro By ID.');
        return '';
    }
}

export async function getProviderMacroHTMLPrePopulatedForAdjustDosing(
    product_href: string,
    patientData: DBPatientData,
    sig: string,
    macroId: number
) {
    var macroHTML = await getProviderMacroHTMLDefault(
        product_href,
        patientData,
        macroId
    );

    macroHTML = macroHTML.replace(MacroParameters.SigsForDosage, sig);

    return macroHTML;
}

export async function getProviderMacroHTMLPrePopulatedForDosageSelection(
    product_href: string,
    variant_index: number = 0,
    patientData: DBPatientData,
    provider_id: string
) {
    const productMapping = prodcutMacroMapping[product_href];
    if (!productMapping) {
        console.error(`No mapping found for ${product_href}`);
        return undefined;
    }
    const macroId = productMapping[variant_index];

    const { status, data, error } = await getMacroById(macroId);

    const provider_data = await getProviderFromId(provider_id!);

    if (status === Status.Success) {
        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name ?? '{{***Name Not Found***}}',
            data?.macroHtml,
            provider_data?.credentials ?? ''
        );

        return replacedHTML;
    } else {
        console.error('Could not get Macro By ID.');
        return '';
    }
}

export async function getDosageChangeMacro(
    product_href: string,
    dosageChangeIndex: number,
    patientData: DBPatientData
) {
    const productMapping = dosageChangeRequestMapping[product_href];
    if (!productMapping) {
        console.error(`No mapping found for ${product_href}`);
        return undefined;
    }
    const macroId = productMapping[dosageChangeIndex];

    console.log('DOSAGE CHANGE INDEX', dosageChangeIndex);

    const { status, data, error } = await getMacroById(macroId);

    const provider_id = (await readUserSession()).data.session?.user.id;
    const provider_data = await getProviderFromId(provider_id!);

    if (status === Status.Success) {
        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name ?? '{{***Name Not Found***}}',
            data?.macroHtml,
            provider_data?.credentials ?? ''
        );

        return replacedHTML;
    } else {
        console.error('Could not get Macro By ID.');
        return '';
    }
}

export async function getFirstTimeDosageChangeMacro(
    product_href: PRODUCT_HREF,
    dosageEquivalence: DosageChangeEquivalenceCodes,
    patientData: DBPatientData
) {
    const { status, data, error } = await getMacroById(307);

    const provider_id = (await readUserSession()).data.session?.user.id;
    const provider_data = await getProviderFromId(provider_id!);

    if (status === Status.Success) {
        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name ?? '{{***Name Not Found***}}',
            data?.macroHtml,
            provider_data?.credentials ?? ''
        );

        return replacedHTML;
    } else {
        console.error('Could not get Macro By ID.');
        return '';
    }
}

interface ProductMacroMappingType {
    [productHref: string]: { [variantIndex: number]: number };
}
export const prodcutMacroMapping: ProductMacroMappingType = {
    tretinoin: {
        0: 286,
        1: 286,
        2: 286,
        3: 286,
        4: 286,
    },
    'nad-injection': {
        0: 32,
    },
    // 'nad-nasal-spray': {
    //     0: ,
    // },
    'wl-capsule': {
        0: 239,
    },
    'glutathione-injection': {
        0: 35,
    },
    'b12-injection': {
        0: 34,
        1: 34,
    },
    semaglutide: {
        //empower
        0: 327,
        1: 4,
        2: 333,
        3: 333,
        4: 331,
        5: 334,
        6: 337,
        8: 338,
        9: 340,
        7: 339,
        10: 341,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_22_5_MG_EMPOWER]: 283,

        //Revive
        32: 311,
        33: 312,
        34: 313,
        35: 314,
        36: 315,
        55: 347,
        56: 348,
        57: 349,
        58: 350,
        59: 351,
        64: 362,
        66: 363,
        68: 364,
        70: 365,
        72: 366,

        //Boothwyn
        22: 287,
        23: 288,
        24: 289,
        25: 290,
        26: 291,
        27: 292,
        28: 293,
        29: 294,
        30: 295,
        31: 306,
        45: 352,
        46: 353,
        47: 354,
        48: 355,
        49: 356,
        50: 357,
        51: 358,
        52: 359,
        53: 360,
        54: 361,

        //Hallandale
        11: 220,
        12: 219,
        13: 214,
        14: 215,
        37: 316,
        39: 317,
        41: 318,
        43: 323,
        44: 324,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_0_25_DOSING]: 265,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_15_MG_HALLANDALE]: 266,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_1_25_DOSING]: 267,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_17_5_MG_HALLANDALE]: 268,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_37_5_MG_HALLANDALE]: 269,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_50_MG_HALLANDALE]: 270,
    },
    tirzepatide: {
        0: 13, // unused
        1: 15, //unspecified
        3: 13, // 2.5 mg monthly
        4: 14, //5 mg monthly
        10: 16, // 10 mg monthly
        11: 17, //12.5 mg monthly
        5: 15, //7.5 mg monthly
        6: 342, //60 mg total bundle
        7: 28, // 60 mg total bundle check in w/ provider
        8: 343, // 88 mg bundle
        9: 344, // 102 mg bundle
        12: 345, // 120 mg bundle
        13: 255, //150 mg bundle
        14: 216, //2.5 monthly hallandale
        15: 217,
        23: 218,
        16: 221,
        18: 222,
        19: 223,
        20: 224,
        21: 225,
        22: 226,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER]: 345,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER]: 346,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_60_MG_HALLANDALE]: 271,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_240_MG_HALLANDALE]: 272,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_140_MG_HALLANDALE]: 273,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_90_MG_HALLANDALE]: 281,

        //Boothwyn
        30: 296,
        31: 297,
        32: 298,
        33: 299,
        34: 300,
        35: 301,
        36: 302,
        37: 303,
        38: 304,
        39: 305,
        42: 326,
        43: 328,
        44: 329,
        45: 330,
        46: 332,

        //Hallandale
        40: 319,

        //Revive
        57: 367,
        59: 368,
    },
    sermorelin: {
    0: 370, // Boothwyn Sermorelin monthly (first month)
        1: 371, // Boothwyn Sermorelin monthly
        2: 372, // Boothwyn Sermorelin quarterly
        3: 373, // Boothwyn Sermorelin biannual
    },
};

const dosageChangeRequestMapping: ProductMacroMappingType = {
    semaglutide: {
        0: 231, // 0.5mg
        1: 232, // 1.25mg
        2: 233, // 2.5mg
    },
    tirzepatide: {
        4: 234, // 5mg
        5: 235, // 7.5mg
        6: 236, // 10mg
        7: 237, // 12.5mg
    },
};

// variant: macro id

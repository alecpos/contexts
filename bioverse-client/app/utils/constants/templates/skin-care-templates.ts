import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const SKIN_CARE_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Patient denies pregnancy/breastfeeding.',
                'Medication, allergies, med/surgical hx reviewed.',
                'Patient denied facial eczema, psoriasis, open lesions or photosensitivity,',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx:',
            setting: 'Dx',
            values: [
                'L90.0 Atrophic disorder of skin',
                'L70.9 Acne',
                'L81.4 Melanin hyperpigmentation',
                'L90.5 Scar conditions and fibrosis of skin',
                'R23.4 Changes in skin texture',
                'L98.8 Other specified disorders of the skin and subcutaneous tissue',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Anti-aging cream:',
            values: [
                'Approved. Follow-up in 3 months or prn',
                'Denied. Refer to PCP. ',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.DROPDOWN,
            title: 'Topical approved (select one):',
            values: [
                'Tretinoin 0.015% / Azelaic Acid 4% / Niacinamide 4%',
                'Tretinoin 0.03% / Azelaic Acid 4% / Niacinamide 4%',
                'Tretinoin 0.067% / Azelaic Acid 4% / Niacinamide 4%',
                'NAD+ 10%',
                'None. Refer to PCP',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            title: '',
            values: [
                'Patient was provided information regarding medication instructions, precautions, side effects and lifestyle recommendations.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};

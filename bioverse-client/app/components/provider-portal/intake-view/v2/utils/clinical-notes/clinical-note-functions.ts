import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '@/app/utils/constants/clinical-note-template-latest-versions';

export function isNoteEditable(note_data: ClinicalNotesV2Supabase): boolean {
    const created_date = new Date(note_data.created_at ?? new Date());
    const current_date = new Date();
    const differenceInTime = current_date.getTime() - created_date.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays < 1.1;
}

export function isNoteEditableCheckProvider(
    note_data: ClinicalNotesV2Supabase,
    provider_id: string
): boolean {
    if (provider_id !== note_data.created_by) {
        return false;
    }

    const created_date = new Date(note_data.created_at ?? new Date());
    const current_date = new Date();
    const differenceInTime = current_date.getTime() - created_date.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays < 7;
}

export function createClinicalNoteValuesFromTemplate(
    template: ClinicalNoteTemplate,
    question_answers?: any
): any[] {
    const processedTemplate: any[] = [];

    // console.log('LPDPDP TEMPLATE', template);

    template.render.forEach((item, index) => {
        switch (item.type) {
            case ClinicalNoteTemplateOptionType.MULTISELECT:
                const multiSelectDefinition: {
                    type: ClinicalNoteTemplateOptionType.MULTISELECT;
                    values: boolean[];
                } = {
                    type: ClinicalNoteTemplateOptionType.MULTISELECT,
                    values: [],
                };

                if (item.custom === 'GLP1DX') {
                    //Code for extracting question answers & populating:
                    multiSelectDefinition.values =
                        mapGLP1ValuesArrayWithQuestionData(question_answers);
                } else {
                    if (item.default) {
                        const defaultValue = item.default;
                        item.values.forEach(() => {
                            multiSelectDefinition.values.push(defaultValue);
                        });
                    } else {
                        item.values.forEach(() => {
                            multiSelectDefinition.values.push(false);
                        });
                    }
                }
                processedTemplate.push(multiSelectDefinition);
                break;
            case ClinicalNoteTemplateOptionType.SELECT:
                const selectDefinition = {
                    type: ClinicalNoteTemplateOptionType.SELECT,
                    values: [] as string[],
                };
                if (item.custom?.defaultSelectValue) {
                    selectDefinition.values.push(
                        item.custom.defaultSelectValue
                    );
                }
                processedTemplate.push(selectDefinition);
                break;
            case ClinicalNoteTemplateOptionType.DROPDOWN:
                const dropDownDefinition = {
                    type: ClinicalNoteTemplateOptionType.DROPDOWN,
                    values: [],
                };
                processedTemplate.push(dropDownDefinition);
                break;
            case ClinicalNoteTemplateOptionType.NOTE:
                break;
            // Add more cases for other types as needed
            default:
                console.warn(`Unhandled template type: ${item.type}`);
                break;
        }
    });

    return processedTemplate;
}

function mapGLP1ValuesArrayWithQuestionData(question_data: any): boolean[] {
    const templateStringValues = [
        //Not Tracked
        'E66.3 Overweight',
        'E66.9 Obesity',
        'E66.01 Morbid Obesity',

        //Question 1943
        'Type 2 diabetes',
        'Prediabetes',
        'Impaired fasting glucose',
        'Metabolic syndrome',
        'Gasto-esophageal reflux disease',

        //Question 1944
        'High cholesterol (hyperlipidemia)',
        'High triglycerides',
        'High blood pressure (hypertension)',
        'Chronic atrial fibrillation',
        'Chronic kidney disease',
        'Non-alcoholic fatty liver disease (NAFLD)',
        'Polycistic ovarian syndrome (PCOS)',

        //Question 1945
        'Major depressive disorder',
        'Generalized anxiety disorder',
        'Neuralgia or neuritis',
        'Sleep apnea',
        'Osteoarthritis',
        'Low back pain',
        'Pain in joints',

        //Not tracked
        'Z72.4 Inappropriate Diet and Eating Habits',
        'R11.0 Nausea',
        'None of the above',
    ];

    var return_template = new Array(templateStringValues.length).fill(false);

    if (
        question_data &&
        question_data.question1943Data.answer &&
        question_data.question1943Data.answer.answer &&
        question_data.question1944Data.answer &&
        question_data.question1944Data.answer.answer &&
        question_data.question1945Data.answer &&
        question_data.question1945Data.answer.answer
    ) {
        question_data.question1943Data.answer.answer.formData.forEach(
            (value: string) => {
                const index = templateStringValues.findIndex(
                    (templateValue) => templateValue === value
                );
                if (index !== -1) {
                    return_template[index] = true;
                }
            }
        );
        question_data.question1944Data.answer.answer.formData.forEach(
            (value: string) => {
                const index = templateStringValues.findIndex(
                    (templateValue) => templateValue === value
                );
                if (index !== -1) {
                    return_template[index] = true;
                }
            }
        );
        question_data.question1945Data.answer.answer.formData.forEach(
            (value: string) => {
                const index = templateStringValues.findIndex(
                    (templateValue) => templateValue === value
                );
                if (index !== -1) {
                    return_template[index] = true;
                }
            }
        );
    }

    return return_template;
}

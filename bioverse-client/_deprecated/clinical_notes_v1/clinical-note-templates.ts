const GLP1_CLINICAL_NOTE_TEMPLATE = `Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt’s identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older 
 
S: Patient with hx of excessive weight seeking care for weight loss. Pt has tried diet and exercise in the past.  Pt denies family and personal hx of MEN2, MTC. Denies personal history of gastroparesis, type 1 diabetes, recent pancreatitis. Pt is not on insulin, sulfonylurea or GLP1.  Pt is not pregnant or breastfeeding.
 
O: 
PMH: 
PSH: 
Pt provided BMI of ***
Medication, allergies reviewed. 
 
A:
Overweight E66.3
Obesity E66.9
Morbid Obesity E66.01
 
P: Pt appears to be a good candidate for GLP1, benefit outweighs risk. Initiate semaglutide/tirzepatide ***mg q weekly x 4 weeks with plan to increase per standard dosing titration schedule if appropriate. Goal is to achieve steady, healthy weight loss, no less than BMI 20. Precautions given. Pt to notify PCP regarding new medication. Will f/u in 4 weeks or prn.`;

const METFORMIN_CLINICAL_NOTE_TEMPLATE = `Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt’s identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older 
 
S: Pt seeking medications for longevity benefits, diabetes prevention, weight loss, reduce cravings and/or appetite. Pt acknowledges regular follow-up with PCP. Denies severe renal/hepatic damage, congestive heart failure, acute/chronic metabolic acidosis. Pt denies pregnancy/breastfeeding. 

 
O: 
PMH:
PSH:
Medication, allergies, med/surgical hx reviewed. BMI: 
 
A:
R63.8 Other symptoms and signs concerning food and fluid intake
R73.01 Impaired Fasting Glucose
R73.03 Pre-diabetes
E11.9 Type 2 diabetes mellitus without complications
R73.8 Hyperglycemia
E88.819 Insulin resistance
E66.01 Morbid Obesity due to excess calories
E66.3 Overweight
E66.9 Obesity
Z72.3 Lack of physical exercise
Z83.3 Family history of diabetes mellitus
Z82.49 Family history of ischemic heart disease and other diseases of the circulatory system.
I10 Essential hypertension
 
P: Pt to start Metformin ER 1000mg daily. Precautions given. Pt to notify PCP re: new medication. Refer to PCP and/or endocrinologist for overall management of glycemic concern. Follow-up prn.`;

const NAD_CLINICAL_NOTE_TEMPLATE = `Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt’s identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older 
 
S: Pt requesting prescription for NAD+ injections to improve cognitive function, improve mood, increase energy, increase physical endurance, longevity benefits. Pt denies pregnancy/breastfeeding. 
 
O: Medication, allergies, medical/surgical hx reviewed. 
 
A:
R41.9 Unspecified symptoms and signs involving cognitive functions and awareness
R53.8 Other malaise and fatigue
F39 Unspecified mood disorder
 
P: Start NAD+ injection 20mg sc, and as desired, gradually increase to 100mg up to 3x per week. Precautions given. Pt to notify PCP re: new medication. Follow-up prn.`;

const GLUTATHIONE_CLINICAL_NOTE_TEMPLATE = `Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt’s identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older 
 
S: Pt requesting glutathione injections for wellness and improving immune function. Pt denies pregnancy/breastfeeding.
 
O: Medication, allergies, med/surgical hx reviewed. No sulfa allergy noted. 
 
A:
L81.4 Melanin hyperpigmentation
R23.4 Changes in skin texture
R53.8 Other malaise and fatigue
R63.5 Abnormal weight gain
E88.819 Insulin resistance
R41.9 Unspecified symptoms and signs involving cognitive functions and awareness
 
P: Pt appears to be a good candidate for glutathione injection. Start Glutathione 100mg up to 5 times a week. Precautions given. Pt to inform PCP regarding new medication. Follow-up prn.
`;

interface TemplateMap {
    [key: string]: string;
}

export const TEMPLATE_NAME_TO_TEMPLATE: TemplateMap = {
    GLP1: GLP1_CLINICAL_NOTE_TEMPLATE,
    METFORMIN: METFORMIN_CLINICAL_NOTE_TEMPLATE,
    NADINJ: NAD_CLINICAL_NOTE_TEMPLATE,
    GSHINJ: GLUTATHIONE_CLINICAL_NOTE_TEMPLATE,
};

export const TEMPLATES_ARRAY = [
    { template_name: 'GLP1', select_text: 'GLP-1 Template' },
    { template_name: 'METFORMIN', select_text: 'Metformin Tempalte' },
    { template_name: 'NADINJ', select_text: 'NAD+ Injection Template' },
    { template_name: 'GSHINJ', select_text: 'Glutathione Injection Template' },
];

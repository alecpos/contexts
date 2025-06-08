export enum INTAKE_ROUTE {
    REGISTRATION = 'registration',
    STATE_SELECTION = 'state-selection',
    DATE_OF_BIRTH = 'date-of-birth',

    DEMOGRAPHIC_INFORMATION = 'demographic-information', //Old version With titles and sex at birth question

    DEMOGRAPHIC_COLLECTION = 'demographic-collection', // New version Without the titles, comes after pre-demographic

    GOOD_TO_GO = 'good-to-go',
    QUESTIONS = 'questions',
    PATIENT_MATCH = 'patient-match',
    PATIENT_MATCH_ONE_MOMENT = 'patient-match-one-moment',
    PRE_ID_VERIFICATION = 'pre-id',
    PRE_ID_VERIFICATION_B = 'pre-id-b',
    ID_VERIFICATION = 'id-verification',
    PRODUCT_OVERVIEW = 'product-overview',
    ORDER_SUMMARY = 'order-summary',
    SHIPPING_INFORMATION = 'shipping-information',
    CHECKOUT = 'checkout',

    GENERAL_ORDER_SUMMARY = 'general-order-summary',

    SKINCARE_INTRO = 'skincare-intro',
    SKINCARE_RESULTS = 'skincare-results',
    SKINCARE_UP_NEXT_HEALTH = 'skincare-up-next-health',
    SKINCARE_SEE_OTHERS = 'skin-care-see-others',

    SKINCARE_UP_NEXT_UPLOAD = 'skincare-up-next-upload',
    SKINCARE_UPLOAD = 'skincare-upload',
    SKINCARE_UP_NEXT_ID = 'skincare-up-next-id',
    SKINCARE_FREQUENCY = 'skincare-frequency',

    NEW_CHECKOUT = 'new-checkout',
    WEIGHT_LOSS_INTRO_1 = 'wl-intro-1',
    WEIGHT_LOSS_INTRO_2 = 'wl-intro-2',
    WEIGHT_LOSS_GRAPH = 'wl-graph',
    REASONS_TO_BELIEVE = 'rtb',
    DATA_COLLECTION_V2 = 'data-collection-new',
    SKINCARE_PRE_DEMOGRAPHIC = 'skincare-pre-demographic',
    WEIGHT_LOSS_DEMOGRAPHICS = 'demographic-wl',
    GREETING = 'greeting',
    UP_NEXT = 'up-next',
    WEIGHT_LOSS_INTRO_3 = 'wl-intro-3',
    WEIGHT_LOSS_SUPPLY = 'wl-supply',
    WEIGHT_LOSS_SUPPLY_V2 = 'wl-supply-v2',
    WEIGHT_LOSS_CHECKOUT = 'wl-checkout',
    WEIGHT_LOSS_CHECKOUT_V2 = 'wl-checkout-v2',

    ENHANCE_ENERGY = 'enhance-energy',
    GLUTATHIONE_ADVANTAGES = 'glutathione-advantages',
    GLUTATHIONE_PROCESS = 'glutathione-process',

    B12_ADVANTAGES = 'b12-advantages',
    B12_REVIEWS = 'b12-reviews',

    SELECT_SUPPLY = 'select-supply',

    IMPROVE_FUNCTION = 'improve-function',
    IMPROVE_HEALTH = 'improve-health',
    ON_YOUR_WAY = 'on-your-way',
    FATIGUE_STAT = 'fatigue-stat',
    NAD_BENEFITS = 'nad-benefits',

    UP_NEXT_3_HEALTH = 'up-next-3-health',
    UP_NEXT_4_HEALTH = 'up-next-4-health',

    UP_NEXT_HEALTH = 'up-next-health',
    UP_NEXT_ID = 'up-next-id',
    UP_NEXT_PREVIEW = 'up-next-preview',

    WEIGHT_LOSS_CALCULATING = 'wl-calculating',
    WEIGHT_LOSS_INTRO_SCREEN = 'wl-intro-screen',
    WEIGHT_LOSS_INTRO_OPTIONS = 'wl-intro-options',
    WEIGHT_LOSS_INTRO_GRAPH = 'wl-intro-graph',
    WEIGHT_LOSS_INTRO_SPECIALISTS = 'wl-intro-specialists',
    START_WEIGHT_LOSS_JOURNEY = 'start-wl-journey',
    WEIGHT_LOSS_IN_GOOD_HANDS = 'wl-in-good-hands',
    WEIGHT_LOSS_INFORM_1 = 'wl-inform-1',
    WEIGHT_LOSS_INFORM_2 = 'wl-inform-2',
    WEIGHT_LOSS_INFORM_3 = 'wl-inform-3',
    WEIGHT_LOSS_INTRO_QUESTION_1 = 'wl-intro-question-1',
    WEIGHT_LOSS_INTRO_QUESTION_2 = 'wl-intro-question-2',
    WEIGHT_LOSS_INTRO_QUESTION_3 = 'wl-intro-question-3',
    WEIGHT_LOSS_INTRO_QUESTION_4 = 'wl-intro-question-4',
    WEIGHT_LOSS_REVIEWS = 'wl-reviews',
    WEIGHT_LOSS_STAT = 'wl-stat',
    PRE_DEMOGRAPHIC = 'pre-demographic',
    WEIGHT_LOSS_UP_NEXT_PROFILE = 'wl-up-next-profile',
    WEIGHT_LOSS_UP_NEXT_PREVIEW = 'wl-up-next-preview',

    // ED
    ED_INTRO = 'ed-intro',
    ED_SELECTION = 'ed-selection',
    ED_PRE_ID = 'ed-pre-id',
    ED_CHECKOUT = 'ed-checkout',
    ED_MATCH_TRANSITION = 'ed-match',
    ED_PRODUCT_DISPLAY = 'ed-product-display',
    ED_OPTION_SELECTION = 'ed-options',

    UNAVAILABLE_IN_AREA = 'unavailable-in-area',
    WEIGHT_LOSS_CHECKLIST = 'wl-checklist',
    COMBINED_WEIGHT_LOSS_DEMOGRAPHIC = 'combined-wl-demographic',

    // SERMORELIN
    UP_NEXT_V3_AP = 'up-next-v3-ap',

}

export enum AB_TESTS_IDS {
    WL_FUNNEL_W_TRANSITIONS = 'wl-wt',
    WL_FUNNEL_V3 = 'wl-v3',
    WL_FUNNEL_OG = 'wl-og',
    WL_NEW_SCREEN_TEST = 'wl-ns-test',
    WL_FUNNEL_WO_TRANSITIONS = 'wl-wot',
    WL_FUNNEL_NO_6 = 'wl-no6',
    WL_SHOW_ID_AFTER_CHECKOUT = 'wl-po-co', //we have turned this into a test that checks for the query param 'id_test' in the url, rather than local storage
    WL_GLOBAL_SHOW_ID_AFTER_CHECKOUT = 'wl-g-po-co',
    WL_SHOW_GRAPH_FIRST = 'wl-gr-first',
    SEM_FUNNEL_SBSB = 'sem-sbsb', //sbsb = 'state-based-sticky-bar'
    WL_HERS_FUNNEL = 'wl-hers',
    ZEALTHY_BEST_PRACTICES = 'zbp',
    WL_RO_TEST = 'wl-ro-test',
    SEM_SL = 'sem-sl', //semaglutide spring sale (ends may 16th, 2025) - also using this for global weight loss as well!
    COMP_COMPARE = 'comp-compare', 
    SEM_6MB = 'sem6mb', //ab test for a new 6 month biannual variant semaglutide revive
}

export enum INTAKE_ROUTE_V3 {
    WEIGHT_LOSS_INTRO_1 = 'wl-intro-1-v3',
    WEIGHT_LOSS_INTRO_2 = 'wl-intro-2-v3',
    REASONS_TO_BELIEVE = 'rtb-v3',
    WL_INTRO_SPECIALISTS = 'wl-intro-specialists-v3',
    REGISTRATION = 'registration-v3',
    STATE_SELECTION = 'state-selection-v3',
    DATE_OF_BIRTH = 'date-of-birth-v3',
    GOOD_NEWS = 'good-news-v3',
    WEIGHT_LOSS_DEMOGRAPHICS = 'demographic-wl-v3',
    GREETING = 'greeting-v3',
    UP_NEXT = 'up-next-v3',
    QUESTIONS = 'questions-v3',
    PATIENT_MATCH = 'patient-match-v3',
    WEIGHT_LOSS_GRAPH = 'wl-graph-v3',
    WEIGHT_LOSS_INTRO_3 = 'wl-intro-3-v3',
    WEIGHT_LOSS_SUPPLY = 'wl-supply-v3',
    ORDER_SUMMARY = 'order-summary-v3',
    WEIGHT_LOSS_REVIEWS = 'wl-reviews-v3',
    PRE_ID_VERIFICATION = 'pre-id-v3',
    ID_VERIFICATION = 'id-verification-v3',
    SHIPPING_INFORMATION = 'shipping-information-v3',
    WEIGHT_LOSS_CHECKOUT = 'wl-checkout-v3',
    WEIGHT_LOSS_DATA_PROCESSING = 'wl-data-processing',
}

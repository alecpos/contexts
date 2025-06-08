import {
    LATEST_INTAKE_VERSIONS,
    STANDARD_INTAKE_ROUTES,
    NAD_INTAKE_ROUTES,
    COMBINED_WEIGHT_LOSS_ROUTES,
    GLUTATHIONE_INTAKE_ROUTES,
    B12_INTAKE_ROUTES,
    SKINCARE_INTAKE_ROUTES,
    METFORMIN_INTAKE_ROUTES,
    NAD_NASAL_SPRAY_INTAKE_ROUTES,
    ED_GLOBAL_INTAKE_ROUTES,
    ED_PRODUCT_INTAKE_ROUTES,
    SEMAGLUTIDE_ROUTES,
    ED_X_PRODUCTS_INTAKE_ROUTES,
    TIRZEPATIDE_ROUTES,
    RUSH_MELTS_INTAKE_ROUTES,
} from '@/app/components/intake-v2/constants/route-constants';
import {
    INTAKE_ROUTE,
    INTAKE_ROUTE_V3,
    AB_TESTS_IDS,
} from '@/app/components/intake-v2/types/intake-enumerators';
//^INTAKE_ROUTE_V3 should be imported from intake-v3/types instead of intake-v2/types
//^constants, ab test id enums could also be moved to a shared location
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { isEmpty } from 'lodash';
import {
    VWO_ACTIVE_TEST_ROUTE_MAPPING,
    VWO_REVERSION_MAPPING,
} from '../constants/VWO/vwo_test_mappings';

/**
 *
 * @param currentPath the entire current path that the client is on.
 * @param product_href the href of the product
 * @param first only applicable to pre-screen, to send to the correct first value.
 * @returns string of the next path's route that is NOT a dead-end. (i.e. Unavailable in area page)
 */
export function getNextIntakeRoute(
    currentPath: string,
    product_href: string,
    searchParams: string,
    first: boolean = false,
    subscription_cadence: string = 'none',
    selected_product?: string
): string {
    /**
     * We need to determine the current route based on the full url path.
     * Since the 'questions' routes have extra index in their array of url components (i.e. .../questions/166?...)...
     * ...we need to first check if the current path is a questions route so we know to access the second to last index (instead of the last index).
     * To check if the current path is a questions route, we first need to figure out what the questions route would be called given the current test_id.
     */
    const searchParamsFormat = new URLSearchParams(searchParams);
    const test_id = searchParamsFormat.get('test_id');

    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    const pathArray = currentPath.split('/');

    const testIDtoQuestionsRouteNameMapping: {
        //deprecated
        [key: string]: INTAKE_ROUTE | INTAKE_ROUTE_V3;
    } = {
        'wl-v3': INTAKE_ROUTE_V3.QUESTIONS, //deprecated
        default: INTAKE_ROUTE.QUESTIONS,
    };

    //determine what the questions route would be called given the current test_id
    var questionsRoute: string =
        test_id && testIDtoQuestionsRouteNameMapping[test_id]
            ? testIDtoQuestionsRouteNameMapping['test_id']
            : testIDtoQuestionsRouteNameMapping['default'];

    //////
    // delete soon
    if (
        product_href === 'semaglutide' ||
        product_href === 'tirzepatide' ||
        product_href === 'weight-loss' ||
        product_href === PRODUCT_HREF.B12_INJECTION ||
        product_href === PRODUCT_HREF.NAD_INJECTION
    ) {
        questionsRoute = INTAKE_ROUTE_V3.QUESTIONS;
    }
    //////

    let next_route_string: string;

    console.log('PATH ARRAY', pathArray);

    //determine the current route
    let currentRoute =
        pathArray[pathArray.length - 2] === questionsRoute
            ? questionsRoute
            : pathArray[pathArray.length - 1];

    // Temp fix:
    if (pathArray.includes(INTAKE_ROUTE_V3.PRE_QUESTIONS)) {
        currentRoute = INTAKE_ROUTE_V3.PRE_QUESTIONS;
    }

    //if the current route is a vwo replacement route, replace it with the equivalent non-test route to ensure the system works as if the test never happened.
    const vwo_reversion_result =
        replaceVWOSplitRouteWithOriginalIfNecessary(currentRoute);

    if (vwo_reversion_result.replaced) {
        currentRoute = vwo_reversion_result.replacement_route;
    }

    /**
     * determine the type of flow the product is in via elimination.
     */
    switch (product_href) {
        case PRODUCT_HREF.WEIGHT_LOSS: {
            //indicator of first route is given as true or false
            const current_version =
                LATEST_INTAKE_VERSIONS.combined_weight_loss.latest_version;

            // console.log(
            //     'WL Route Object',
            //     COMBINED_WEIGHT_LOSS_ROUTES[current_version]
            // );

            const combined_route_array = getRouteArrayForTest(
                COMBINED_WEIGHT_LOSS_ROUTES[current_version],
                vwo_test_ids
            );
            // console.log('combined_route_array', combined_route_array);

            if (first) {
                next_route_string = combined_route_array[0];
                break;
            }

            const indexFound = combined_route_array.indexOf(currentRoute);

            //skip over the supply page if they have picked metformin
            if (selected_product === PRODUCT_HREF.METFORMIN) {
                if (
                    currentRoute === INTAKE_ROUTE.WEIGHT_LOSS_IN_GOOD_HANDS ||
                    currentRoute === INTAKE_ROUTE_V3.WEIGHT_LOSS_INTRO_3
                ) {
                    next_route_string = combined_route_array[indexFound + 2];
                    break;
                }
                //temp fix to skip calculating and graph screens if they picked metformin once they've finished up their questions
                //811 is the "anything else you want to tell provider" and 290 is florida consent
                if (
                    currentPath.includes('questions/811') ||
                    currentPath.includes('questions-v3/811') ||
                    currentPath.includes('questions-v3/290') ||
                    currentPath.includes('questions/290')
                ) {
                    if (test_id !== 'wl-wot') {
                        next_route_string =
                            combined_route_array[indexFound + 3];
                        break;
                    }
                }
            }

            /**
             * Hard coding here the route for the WL capsule product cadence selection.
             * This is because the WL capsule product has a different cadence selection route than the other products.
             */
            if (selected_product === PRODUCT_HREF.WL_CAPSULE) {
                if (currentRoute === INTAKE_ROUTE_V3.WEIGHT_LOSS_INTRO_3) {
                    next_route_string =
                        INTAKE_ROUTE_V3.WL_CAPSULE_CADENCE_SELECTION;
                    break;
                }
            }

            next_route_string = combined_route_array[indexFound + 1];
            break;
        }

        case PRODUCT_HREF.SEMAGLUTIDE: {
            const current_version =
                LATEST_INTAKE_VERSIONS.semaglutide.latest_version;

            const route_array = getRouteArrayForTest(
                SEMAGLUTIDE_ROUTES[current_version],
                vwo_test_ids
            );

            if (first) {
                next_route_string = route_array[0];
                break;
            }

            const indexFound = route_array.indexOf(currentRoute);
            if (!indexFound || indexFound === -1) {
                console.error('Route not found in the route array');
            }
            console.log('INDEX', indexFound);

            if (
                subscription_cadence === 'quarterly' &&
                currentRoute === INTAKE_ROUTE.WEIGHT_LOSS_SUPPLY
            ) {
                next_route_string = route_array[indexFound + 2];
                break;
            }

            next_route_string = route_array[indexFound + 1];
            console.log('NEXT ROUTE STRING', next_route_string);
            break;
        }
        case PRODUCT_HREF.TIRZEPATIDE: {
            const current_version =
                LATEST_INTAKE_VERSIONS.tirzepatide.latest_version;

            const route_array = getRouteArrayForTest(
                TIRZEPATIDE_ROUTES[current_version],
                vwo_test_ids
            );

            if (first) {
                next_route_string = route_array[0];
                break;
            }

            const indexFound = route_array.indexOf(currentRoute);
            if (!indexFound || indexFound === -1) {
                console.error('Route not found in the route array');
            }

            if (
                subscription_cadence === 'quarterly' &&
                currentRoute === INTAKE_ROUTE.WEIGHT_LOSS_SUPPLY
            ) {
                next_route_string = route_array[indexFound + 2];
                break;
            }

            //we don't have a 'reviews' route for tirzepatide yet, so just skip it in v3 funnel
            // if (
            //     product_href === PRODUCT_HREF.TIRZEPATIDE &&
            //     (currentRoute === INTAKE_ROUTE_V3.ORDER_SUMMARY ||
            //         currentRoute === INTAKE_ROUTE.ORDER_SUMMARY)
            // ) {
            //     return route_array[indexFound + 2];
            // }

            next_route_string = route_array[indexFound + 1];
            break;
        }

        case PRODUCT_HREF.NAD_INJECTION: {
            const current_version = LATEST_INTAKE_VERSIONS.nad.latest_version;
            if (first) {
                next_route_string =
                    NAD_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                NAD_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                NAD_INTAKE_ROUTES[current_version].route_array[indexFound + 1];
            break;
        }

        case PRODUCT_HREF.GLUTATIONE_INJECTION: {
            const current_version =
                LATEST_INTAKE_VERSIONS.glutathione.latest_version;
            if (first) {
                next_route_string =
                    GLUTATHIONE_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                GLUTATHIONE_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                GLUTATHIONE_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }

        case PRODUCT_HREF.B12_INJECTION: {
            const current_version = LATEST_INTAKE_VERSIONS.b12.latest_version;
            if (first) {
                next_route_string =
                    B12_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                B12_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                B12_INTAKE_ROUTES[current_version].route_array[indexFound + 1];
            break;
        }

        case PRODUCT_HREF.METFORMIN: {
            const current_version =
                LATEST_INTAKE_VERSIONS.metformin.latest_version;
            if (first) {
                next_route_string =
                    METFORMIN_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                METFORMIN_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                METFORMIN_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }

        case PRODUCT_HREF.NAD_NASAL_SPRAY: {
            const current_version =
                LATEST_INTAKE_VERSIONS.nad_nasal.latest_version;
            if (first) {
                next_route_string =
                    NAD_NASAL_SPRAY_INTAKE_ROUTES[current_version]
                        .route_array[0];
                break;
            }

            const indexFound =
                NAD_NASAL_SPRAY_INTAKE_ROUTES[
                    current_version
                ].route_array.indexOf(currentRoute);
            next_route_string =
                NAD_NASAL_SPRAY_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }

        case PRODUCT_HREF.ED_GLOBAL: {
            const current_version = LATEST_INTAKE_VERSIONS.ed.latest_version;
            if (first) {
                next_route_string =
                    ED_GLOBAL_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                ED_GLOBAL_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                ED_GLOBAL_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }
        case PRODUCT_HREF.RUSH_MELTS: {
            const current_version =
                LATEST_INTAKE_VERSIONS[product_href].latest_version;
            if (first) {
                next_route_string =
                    RUSH_MELTS_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                RUSH_MELTS_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                RUSH_MELTS_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }

        case PRODUCT_HREF.PEAK_CHEWS:

        case PRODUCT_HREF.RUSH_CHEWS: {
            const current_version =
                LATEST_INTAKE_VERSIONS[product_href].latest_version;
            if (first) {
                next_route_string =
                    ED_PRODUCT_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                ED_PRODUCT_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                ED_PRODUCT_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }

        case PRODUCT_HREF.X_MELTS:
        case PRODUCT_HREF.X_CHEWS: {
            const current_version =
                LATEST_INTAKE_VERSIONS[product_href].latest_version;
            if (first) {
                next_route_string =
                    ED_X_PRODUCTS_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                ED_X_PRODUCTS_INTAKE_ROUTES[
                    current_version
                ].route_array.indexOf(currentRoute);
            next_route_string =
                ED_X_PRODUCTS_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }
        case PRODUCT_HREF.TRETINOIN: {
            const current_version =
                LATEST_INTAKE_VERSIONS['skincare'].latest_version;
            if (first) {
                next_route_string =
                    SKINCARE_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }

            const indexFound =
                SKINCARE_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                SKINCARE_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }

        default: {
            const current_version =
                LATEST_INTAKE_VERSIONS.standard.latest_version;
            console.log('current_version', current_version);

            if (first) {
                next_route_string =
                    STANDARD_INTAKE_ROUTES[current_version].route_array[0];
                break;
            }
            const indexFound =
                STANDARD_INTAKE_ROUTES[current_version].route_array.indexOf(
                    currentRoute
                );
            next_route_string =
                STANDARD_INTAKE_ROUTES[current_version].route_array[
                    indexFound + 1
                ];
            break;
        }
    }

    console.log('CHECK CHEK CHECK', vwo_test_ids);

    if (!isEmpty(vwo_test_ids) && !vwo_reversion_result.replaced) {
        next_route_string = convertIntakeRouteToVWOStitchedRoute(
            vwo_test_ids,
            next_route_string,
            product_href as PRODUCT_HREF
        );
    }

    return next_route_string;
}

function convertIntakeRouteToVWOStitchedRoute(
    vwo_test_ids: string[],
    next_anticipated_route: string,
    product_href: PRODUCT_HREF
) {
    /**
     * Conceptual idea of this function:
     * VWO Test ID's will exist in an array to point to different routes that need to be replaced in order to conduct the tests correctly.
     *
     * We will consume the next anticipated route along with the product.
     *
     * There will be an interface that will be searched upon ordered from outside->inside (top->bottom) as:
     * 1. vwo_test_id
     * 2. product_href
     * 3. next_anticipated_route
     *
     * Within the final, there will be an object that has key - "replacement_route" which will point to a route which is intended to replace the original route.
     */

    // Loop through each VWO test ID to find a matching replacement route
    for (const test_id of vwo_test_ids) {
        // Use optional chaining to safely navigate through the nested objects
        const replacement_route =
            VWO_ACTIVE_TEST_ROUTE_MAPPING[test_id]?.[product_href]?.[
                next_anticipated_route
            ]?.replacement_route;

        // If we found a replacement route, return it
        if (replacement_route) {
            return replacement_route;
        }
    }

    // If no replacement route is found, return the original route
    return next_anticipated_route;
}

/**
 * This function's purpose is the following:
 * when getNextIntakeRoute is hit, there is a possibility there is a VWO test going on and potentially the ids at the top may not reflect that fully.
 * If we detect that a test is in progress using mapped enums and interfaces that are updated we can seemlessly stitch the original route back together.
 *
 * We are basically mocking the input of the currentRoute to be the equivalent had the patient never gone through the Split URL test.
 * This logic is based on the fact that the VWO smart code will tell if the unique user that they are looking at will go through route A or B itself
 *
 * @param current_route current route from getNextIntakeRoute
 */
function replaceVWOSplitRouteWithOriginalIfNecessary(current_route: string): {
    replacement_route: string;
    replaced: boolean;
} {
    // Check if the current route exists as a key in VWO_REVERSION_MAPPING
    // and ensure the original property exists
    if (
        current_route in VWO_REVERSION_MAPPING &&
        VWO_REVERSION_MAPPING[current_route]?.original
    ) {
        // If it exists, return the original route and mark as replaced
        return {
            replacement_route: VWO_REVERSION_MAPPING[current_route].original,
            replaced: true,
        };
    }

    // If no mapping found, return the current route and mark as not replaced
    return {
        replacement_route: current_route,
        replaced: false,
    };
}

/**
 * Only works at the moment for nad-nasal spray, metformin & b12 injection
 */
export function getCurrentIntakeProgressBySection(
    currentPath: string,
    product_href: string
) {
    let routesArray;
    // console.log(`logging current path ${currentPath}`);
    const currentPathArray = currentPath.split('/');

    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    let currentRoute = '';
    if (currentPathArray.includes(INTAKE_ROUTE_V3.PRE_QUESTIONS)) {
        currentRoute = INTAKE_ROUTE_V3.PRE_QUESTIONS;
    } else if (
        product_href === PRODUCT_HREF.WEIGHT_LOSS ||
        vwo_test_ids.includes(AB_TESTS_IDS.WL_HERS_FUNNEL) ||
        product_href === PRODUCT_HREF.SEMAGLUTIDE ||
        product_href === PRODUCT_HREF.TIRZEPATIDE ||
        product_href === PRODUCT_HREF.B12_INJECTION ||
        product_href === PRODUCT_HREF.NAD_INJECTION
    ) {
        currentRoute =
            currentPathArray[currentPathArray.length - 2] ===
            INTAKE_ROUTE_V3.QUESTIONS
                ? INTAKE_ROUTE_V3.QUESTIONS
                : currentPathArray[currentPathArray.length - 1];
    } else {
        currentRoute =
            currentPathArray[currentPathArray.length - 2] ===
            INTAKE_ROUTE.QUESTIONS
                ? INTAKE_ROUTE.QUESTIONS
                : currentPathArray[currentPathArray.length - 1];
    }

    if (currentPath.includes('ed-selection')) {
        currentRoute = INTAKE_ROUTE.ED_SELECTION;
        //since the ed-global architecture appends more url components to the currentPath array at ed-selection, the [currentPathArray.length - 1] logic won't work
    }

    switch (product_href) {
        case PRODUCT_HREF.METFORMIN:
            routesArray = METFORMIN_INTAKE_ROUTES[1].route_array;
            break;
        case PRODUCT_HREF.B12_INJECTION:
            routesArray = B12_INTAKE_ROUTES[2].route_array;
            break;
        case PRODUCT_HREF.TRETINOIN:
            routesArray = SKINCARE_INTAKE_ROUTES[2].route_array;
            break;
        case PRODUCT_HREF.NAD_NASAL_SPRAY:
            routesArray = NAD_NASAL_SPRAY_INTAKE_ROUTES[1].route_array;
            break;
        case PRODUCT_HREF.ED_GLOBAL:
            routesArray = ED_GLOBAL_INTAKE_ROUTES[1].route_array;
            break;
        case PRODUCT_HREF.PEAK_CHEWS:
            routesArray = ED_PRODUCT_INTAKE_ROUTES[1].route_array;
            break;
        case PRODUCT_HREF.X_CHEWS:
        case PRODUCT_HREF.X_MELTS:
            routesArray = ED_X_PRODUCTS_INTAKE_ROUTES[1].route_array;
            break;
        case PRODUCT_HREF.RUSH_MELTS:
            routesArray = RUSH_MELTS_INTAKE_ROUTES[1].route_array;
            break;
        case PRODUCT_HREF.SEMAGLUTIDE:
            const currentVersion =
                LATEST_INTAKE_VERSIONS.semaglutide.latest_version;
            routesArray = getRouteArrayForTest(
                SEMAGLUTIDE_ROUTES[currentVersion],
                vwo_test_ids
            );
            break;
        case PRODUCT_HREF.TIRZEPATIDE:
            const current_version =
                LATEST_INTAKE_VERSIONS.tirzepatide.latest_version;

            routesArray = getRouteArrayForTest(
                TIRZEPATIDE_ROUTES[current_version],
                vwo_test_ids
            );
            break;
        case PRODUCT_HREF.WEIGHT_LOSS:
            const current_version_WL =
                LATEST_INTAKE_VERSIONS.combined_weight_loss.latest_version;

            routesArray = getRouteArrayForTest(
                COMBINED_WEIGHT_LOSS_ROUTES[current_version_WL],
                vwo_test_ids
            );
            break;
        case PRODUCT_HREF.NAD_INJECTION:
            routesArray = NAD_INTAKE_ROUTES[2].route_array;
            break;
        default:
            routesArray = NAD_NASAL_SPRAY_INTAKE_ROUTES[1].route_array;
            break;
    }

    if (
        DO_NOT_SHOW_PROGRESS_BAR_ROUTES.includes(currentRoute as INTAKE_ROUTE)
    ) {
        return {
            progress: -1,
            currentSection: -1,
        };
    }

    let calculated_progress: number = 0;
    let calculated_section: number = 0;

    const questions_index_number = routesArray.indexOf(
        product_href === PRODUCT_HREF.WEIGHT_LOSS ||
            vwo_test_ids.includes(AB_TESTS_IDS.WL_HERS_FUNNEL) ||
            product_href === PRODUCT_HREF.SEMAGLUTIDE ||
            product_href === PRODUCT_HREF.TIRZEPATIDE ||
            product_href === PRODUCT_HREF.B12_INJECTION ||
            product_href === PRODUCT_HREF.NAD_INJECTION
            ? INTAKE_ROUTE_V3.QUESTIONS
            : INTAKE_ROUTE.QUESTIONS
    );

    let current_index_number = routesArray.indexOf(currentRoute);
    if (currentPath.includes('ed-ind-quantity-selection')) {
        current_index_number = 11; //this route is not in the ED_PRODUCT_INTAKE_ROUTES, because it's not always shown
        //we need to hardcode this value for the intake progress bar to show anything on this screen
    }

    console.log('CURRENT INDEX', current_index_number);
    console.log('QUESTION INDEX', questions_index_number);

    if (current_index_number < questions_index_number) {
        calculated_section = 0;
        if (currentRoute === INTAKE_ROUTE_V3.PRE_QUESTIONS) {
            const initialProgress = Math.floor(
                (100 / questions_index_number) * (current_index_number + 1)
            );
            const current_question_id = parseInt(
                currentPathArray[currentPathArray.length - 1]
            );

            const current_question_id_index =
                HERS_PRE_QUESTIONS_ID_LIST.indexOf(current_question_id);

            calculated_progress = Math.floor(
                (current_question_id_index /
                    HERS_PRE_QUESTIONS_ID_LIST.length) *
                    100
            );
            const finalProgress = initialProgress + calculated_progress / 11;
            calculated_progress = finalProgress;
        } else {
            calculated_progress = Math.floor(
                (100 / questions_index_number) * (current_index_number + 1)
            );
        }
    } else if (current_index_number > questions_index_number) {
        calculated_section = 2;
        calculated_progress = Math.floor(
            100 -
                (100 / (routesArray.length - questions_index_number)) *
                    (routesArray.length - current_index_number)
        );
    } else {
        calculated_section = 1;

        let question_id_array: number[];
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                question_id_array = METFORMIN_QUESTION_ID_LIST;
                break;
            case PRODUCT_HREF.B12_INJECTION:
                question_id_array = B12_QUESTION_ID_LIST;
                break;
            case PRODUCT_HREF.NAD_NASAL_SPRAY:
                question_id_array = NAD_NASAL_SPRAY_QUESTION_ID_LIST;
                break;
            case PRODUCT_HREF.NAD_INJECTION:
                question_id_array = NAD_INJECTION_QUESTION_ID_LIST;
                break;
            case PRODUCT_HREF.ED_GLOBAL:
                question_id_array = ED_GLOBAL_QUESTION_ID_LIST;
                break;
            case PRODUCT_HREF.X_CHEWS:
            case PRODUCT_HREF.X_MELTS:
            case PRODUCT_HREF.PEAK_CHEWS:
            case PRODUCT_HREF.RUSH_MELTS:
                question_id_array = ED_X_QUESTION_ID_LIST;
                break;
            case PRODUCT_HREF.TRETINOIN:
                question_id_array = SKINCARE_QUESTION_ID_LIST;
                break;
            case PRODUCT_HREF.SEMAGLUTIDE:
            case PRODUCT_HREF.TIRZEPATIDE:
                if (vwo_test_ids.includes(AB_TESTS_IDS.WL_HERS_FUNNEL)) {
                    question_id_array = HERS_SEMAGLUTIDE_QUESTION_ID_LIST;
                } else if (
                    vwo_test_ids.includes(AB_TESTS_IDS.WL_NEW_SCREEN_TEST)
                ) {
                    question_id_array = WL_NEW_SCREENS_QUESTION_ID_LIST;
                } else if (
                    vwo_test_ids.includes(AB_TESTS_IDS.COMP_COMPARE)
                ) {
                    question_id_array = SEM_COMPETITOR_COMPARISON_QUESTION_ID_LIST;
                } 
                else {
                    question_id_array = WL_QUESTION_ID_LIST;
                }
                break;
            case PRODUCT_HREF.WEIGHT_LOSS:
                if (vwo_test_ids.includes(AB_TESTS_IDS.WL_NEW_SCREEN_TEST)) {
                    question_id_array =
                        WEIGHT_LOSS_NEW_SCREENS_QUESTION_ID_LIST;
                } else {
                    question_id_array = WEIGHT_LOSS_QUESTION_ID_LIST;
                }
                break;
            default:
                question_id_array = SKINCARE_QUESTION_ID_LIST;
                break;
        }

        const current_question_id = parseInt(
            currentPathArray[currentPathArray.length - 1]
        );

        const current_question_id_index =
            question_id_array.indexOf(current_question_id);

        calculated_progress = Math.floor(
            (current_question_id_index / question_id_array.length) * 100
        );
    }

    /**
     * For calculated section the options are 0, 1, and 2.
     * 0 represents section prior to questions
     * 1 represents during the quesitons
     * 2 represents section after questions.
     */
    return {
        progress: calculated_progress,
        currentSection: calculated_section,
    };
}

export function getRouteArrayForTest(
    routeObject: RouteObject,
    test_ids: string[]
): string[] {
    // If `test_ids` is not provided or empty, return the default route_array
    if (!test_ids || test_ids.length === 0) {
        return routeObject.route_array;
    }

    // Find all ab_tests that match any of the test_ids
    const matchingTests = routeObject.ab_tests.filter((abTest) =>
        test_ids.includes(abTest.id)
    );

    if (matchingTests.length > 1) {
        // More than one matching test → throw an error or handle as needed
        // If we're dealing with this case, priority code needs to be added here

        return routeObject.route_array;
    }

    // If exactly one match, return its route_array
    if (matchingTests.length === 1) {
        return matchingTests[0].route_array;
    }

    // If no matches, return the default route_array
    return routeObject.route_array;
}
/**
 * Hard coding the values for the metformin and nad funnel question ID's for ease of coding.
 * Otherwise I would have to make this an async function.
 */
const METFORMIN_QUESTION_ID_LIST = [
    275, 276, 277, 1173, 167, 174, 278, 279, 2, 1088, 6, 1156, 1094, 1096, 1097,
    1098, 1174, 1175, 1095, 1101, 288, 289, 81, 1176, 290,
];
const NAD_NASAL_SPRAY_QUESTION_ID_LIST = [
    275, 276, 277, 507, 162, 1088, 1178, 509, 9, 1432, 288, 289, 1179,
];

const B12_QUESTION_ID_LIST = [
    275, 276, 277, 2623, 1089, 1090, 1137, 1091, 1092, 1093, 1094, 1095, 1658, 1096,
    1097, 1098, 1100, 1102, 1103,
];

const SKINCARE_QUESTION_ID_LIST = [
    275, 276, 277, 534, 530, 531, 539, 540, 541, 542, 543, 544, 545, 546, 547,
    548, 549, 551, 509, 552, 554, 555, 553,
];

const ED_GLOBAL_QUESTION_ID_LIST = [
    1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980,
    1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 168, 1990, 1991, 1992,
    1993, 1994, 1995, 1996, 6, 1997, 1998, 1999, 811,
];

const ED_X_QUESTION_ID_LIST = [
    1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980,
    1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 168, 1990, 1991, 1992,
    1993, 1994, 1995, 1996, 6, 1997, 1998, 1999, 811,
];

//for semaglutide and tirzepatide
const WL_QUESTION_ID_LIST = [
    275, 276, 277, 167, 174, 278, 279, 2, 166, 164, 172, 6, 280, 281, 282, 284,
    285, 286, 505, 287, 506, 895, 803, 804, 805, 168, 10, 11, 12, 1943, 1947,
    1944, 1945, 1946, 171, 15, 1948, 1949, 173, 44, 288, 289, 808, 809, 810,
    811, 290,
];

//for the 14-new-screens test (semaglutide and tirzepatide)
const WL_NEW_SCREENS_QUESTION_ID_LIST = [
    275, 276, 277, 167, 174, 278, 279, 2, 166, 164, 172, 6, 280, 281, 282, 284,
    285, 286, 505, 287, 506, 895, 803, 804, 805, 168, 10, 11, 12, 1943, 1947,
    1944, 1945, 1946, 171, 15, 1948, 1949, 173, 44, 2460, 2461, 2462, 2463,
    2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2473, 288, 289, 808,
    809, 810, 811, 290,
];

const SEM_COMPETITOR_COMPARISON_QUESTION_ID_LIST = [
    275, 276, 277, 167, 174, 278, 279, 2, 166, 164, 172, 2615, 2614, 2616, 2617, 2618, 2619, 2620, 2621, 2622, 6, 280, 281, 282, 284,
    285, 286, 505, 287, 506, 895, 803, 804, 805, 168, 10, 11, 12, 1943, 1947,
    1944, 1945, 1946, 171, 15, 1948, 1949, 173, 44, 288, 289, 808, 809, 810,
    811, 290,
];

//for global weight loss
const WEIGHT_LOSS_QUESTION_ID_LIST = [
    275, 276, 277, 167, 174, 173, 278, 279, 2, 799, 164, 172, 800, 801, 802,
    166, 280, 281, 282, 284, 285, 506, 505, 286, 287, 6, 895, 803, 804, 805,
    168, 807, 11, 12, 169, 2397, 2398, 170, 171, 15, 44, 288, 289, 808, 809,
    810, 811, 290,
];

//for the 14-new-screens test (global weight loss)
const WEIGHT_LOSS_NEW_SCREENS_QUESTION_ID_LIST = [
    275, 276, 277, 167, 174, 173, 278, 279, 2, 799, 164, 172, 800, 801, 802,
    166, 280, 281, 282, 284, 285, 506, 505, 286, 287, 6, 895, 803, 804, 805,
    168, 807, 11, 12, 169, 2397, 2398, 170, 171, 15, 44, 2460, 2461, 2462, 2463,
    2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2473, 288, 289, 808,
    809, 810, 811, 290,
];

const HERS_PRE_QUESTIONS_ID_LIST = [
    2290, 2291, 279, 2292, 2293, 2294, 2295, 2296, 2297, 2298, 2299, 2300,
];

const HERS_SEMAGLUTIDE_QUESTION_ID_LIST = [
    166, 2302, 2303, 2304, 2305, 2306, 2307, 2308, 2309, 2310, 2311, 2312, 2313,
    2314, 2315, 2316, 2317, 2318, 2319, 2320, 2321, 2322, 2323, 2324, 2325,
    2326, 2327, 2328, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337,
    2338, 2339, 2340, 2341, 2342, 2343, 2357, 2358, 2359, 2360, 2361, 2362,
    2363, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374,
    2375, 2376, 2343, 2344, 2345, 2346, 2347, 2348, 2349, 2350, 2351, 2352,
    2353, 2354, 2355, 2356,
];

const NAD_INJECTION_QUESTION_ID_LIST = [
    275, 276, 277, 507, 161, 162, 163, 166, 5, 1088, 1178, 509, 9, 15, 2593
];

const DO_NOT_SHOW_PROGRESS_BAR_ROUTES = [
    INTAKE_ROUTE.WEIGHT_LOSS_INTRO_SCREEN,
    INTAKE_ROUTE.REASONS_TO_BELIEVE,
    INTAKE_ROUTE.REGISTRATION,
    INTAKE_ROUTE.UP_NEXT_3_HEALTH,
    INTAKE_ROUTE.UP_NEXT_4_HEALTH,
    INTAKE_ROUTE.PATIENT_MATCH,
    INTAKE_ROUTE.WEIGHT_LOSS_UP_NEXT_PREVIEW,
    INTAKE_ROUTE.GENERAL_ORDER_SUMMARY,
    // INTAKE_ROUTE.NEW_CHECKOUT,
    INTAKE_ROUTE.IMPROVE_HEALTH,
    INTAKE_ROUTE.ON_YOUR_WAY,
    INTAKE_ROUTE.FATIGUE_STAT,
    INTAKE_ROUTE.NAD_BENEFITS,
    INTAKE_ROUTE.SELECT_SUPPLY,
    // INTAKE_ROUTE.IMPROVE_FUNCTION,
    // INTAKE_ROUTE.B12_ADVANTAGES,
    // INTAKE_ROUTE.B12_REVIEWS,
    INTAKE_ROUTE.PRE_ID_VERIFICATION,
];

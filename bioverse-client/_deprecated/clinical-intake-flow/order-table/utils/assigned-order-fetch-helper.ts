// 'use server';

// import { USStates } from '@/app/types/enums/master-enums';
// import { readUserSession } from '@/app/utils/actions/auth/session-reader';
// import {
//     prescriptionRequestToProviderDashboardv2,
//     renewalOrderToProviderDashboard,
// } from '@/app/utils/actions/provider/parsers';
// import { getAssignedOrdersForProviderOrderTable } from '@/app/utils/database/controller/orders/orders-api';
// import { getProviderLicensedStates } from '@/app/utils/database/controller/providers/providers-api';
// import { getAssignedRenewalOrdersForProviderOrderTable } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
// import { concat } from 'lodash';

// export async function fetchAssignedIntakesAndRenewals() {
//     try {
//         const userId = (await readUserSession()).data.session!.user.id;

//         const { data: completeOrderData, error: orderError } =
//             await getAssignedOrdersForProviderOrderTable(userId);

//         const renewalOrderData =
//             await getAssignedRenewalOrdersForProviderOrderTable(userId);

//         const generalOrders = prescriptionRequestToProviderDashboardv2(
//             completeOrderData ?? []
//         );

//         const renewalOrders = renewalOrderToProviderDashboard(renewalOrderData);

//         const mergedOrders = concat(renewalOrders, generalOrders);

//         const licensed_states = await getProviderLicensedStates();

//         const stateFilteredOrders = mergedOrders.filter((order) => {
//             console.log('order: ', order.id, 'state: ', order.deliveryState);
//             return licensed_states?.includes(order.deliveryState as USStates);
//         });

//         return stateFilteredOrders;
//     } catch (error: any) {
//         console.error(error);
//         return [];
//     }
// }

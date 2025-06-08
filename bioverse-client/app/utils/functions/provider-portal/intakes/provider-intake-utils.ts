import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { OrderStatus, OrderType } from '@/app/types/orders/order-types';
import {
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { StatusTag } from '@/app/types/status-tags/status-types';
import { isGLP1Product } from '../../pricing';

export enum IntakeButtonTypes {
    ApprovalButtons = 'Approval-Buttons',
    AdjustDosing = 'Adjust-Dosing',
    None = 'None',
}

//used only for non-GLP1 products
export function showButtonController(
    order_status: string,
    status_tag: string | undefined,
    order_cadence: SubscriptionCadency,
    employeeAuthorization: BV_AUTH_TYPE | null,
    order_data: DBOrderData,
    orderType: OrderType
) {
    // console.log('Show button controller all props: ', order_status, status_tag);

    if (
        !status_tag ||
        employeeAuthorization === BV_AUTH_TYPE.REGISTERED_NURSE
    ) {
        return IntakeButtonTypes.None;
    }

    if (status_tag === StatusTag.Resolved || status_tag === StatusTag.None) {
        return IntakeButtonTypes.None;
    }

    let cadence = order_cadence;

    //If it's a new order and it's not the typical 'review' status, we may need to show the approval button anyway
    if (orderType === OrderType.Order) {
        if (
            status_tag === StatusTag.ProviderMessage ||
            status_tag === StatusTag.Overdue ||
            status_tag === StatusTag.Engineer
        ) {
            return IntakeButtonTypes.ApprovalButtons;
        }
    }

    if (cadence === SubscriptionCadency.Quarterly) {
        if (
            order_status === OrderStatus.UnapprovedCardDown ||
            order_status === OrderStatus.PaymentCompleted
        ) {
            if (
                status_tag === StatusTag.Review ||
                status_tag === StatusTag.LeadProvider ||
                status_tag === StatusTag.Overdue ||
                status_tag === StatusTag.Engineer
            ) {
                console.log(
                    '[Quarterly] Approval Buttons because status is UnapprovedCardDown or PaymentCompleted '
                );
                return IntakeButtonTypes.ApprovalButtons;
            }
            console.log(
                '[Quarterly] None because status is UnapprovedCardDown or PaymentCompleted and status tag is not Review, LeadProvider, Overdue, or Engineer'
            );
            return IntakeButtonTypes.None;
        }

        if (
            status_tag === StatusTag.FinalReview ||
            status_tag === StatusTag.Review ||
            status_tag === StatusTag.LeadProvider ||
            status_tag === StatusTag.Overdue ||
            status_tag === StatusTag.Engineer
        ) {
            console.log(
                '[Quarterly] Approval Buttons because status was not UnapprovedCardDown or PaymentCompleted and status tag is FinalReview, Review, LeadProvider, Overdue, or Engineer'
            );
            return IntakeButtonTypes.ApprovalButtons;
        }

        if (
            status_tag === StatusTag.ReviewNoPrescribe ||
            status_tag === StatusTag.OverdueNoPrescribe ||
            status_tag === StatusTag.ProviderMessage
        ) {
            if (
                (order_data.product_href as PRODUCT_HREF) ===
                PRODUCT_HREF.METFORMIN
            ) {
                console.log(
                    '[Quarterly] Approval Buttons because product href is METFORMIN, though no approval action is needed'
                );
                return IntakeButtonTypes.ApprovalButtons;
            }

            if (
                (order_data.product_href as PRODUCT_HREF) ===
                    PRODUCT_HREF.TIRZEPATIDE &&
                [16, 17, 18, 19, 20, 21, 22].includes(order_data.variant_index)
            ) {
                console.log(' none 2 '); //DELETE THIS WHOLE IF STATEMENT ONCE ADJUST DOSING IS READY FOR THESE VARIANTS
                return IntakeButtonTypes.None;
            } else {
                return IntakeButtonTypes.AdjustDosing;
            }
        }

        return IntakeButtonTypes.None;

        //end of quarterly order cadence handling
    } else if (cadence === SubscriptionCadency.Monthly) {
        if (
            status_tag === StatusTag.FinalReview ||
            status_tag === StatusTag.Review ||
            status_tag === StatusTag.Overdue ||
            status_tag === StatusTag.Engineer
        ) {
            console.log(
                '[Monthly] Approval Buttons because status tag is FinalReview, Review, Overdue, or Engineer'
            );
            return IntakeButtonTypes.ApprovalButtons;
        }

        if (
            order_status === OrderStatus.UnapprovedCardDown ||
            order_status ===
                RenewalOrderStatus.CheckupComplete_Unprescribed_Paid ||
            order_status ===
                RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid
        ) {
            console.log(
                '[Monthly] Approval Buttons because status is UnapprovedCardDown, CheckupComplete_Unprescribed_Paid, or CheckupComplete_Unprescribed_Unpaid'
            );
            return IntakeButtonTypes.ApprovalButtons;
        }
    } else if (
        (cadence === SubscriptionCadency.Biannually ||
            cadence === SubscriptionCadency.Annually) &&
        isGLP1Product(order_data.product_href)
    ) {
        if (
            order_status === OrderStatus.UnapprovedCardDown ||
            order_status === OrderStatus.PaymentCompleted
        ) {
            if (
                status_tag === StatusTag.Review ||
                status_tag === StatusTag.LeadProvider ||
                status_tag === StatusTag.Engineer
            ) {
                console.log('Approval buttons 6 ');
                return IntakeButtonTypes.ApprovalButtons;
            }
            return IntakeButtonTypes.None;
        }

        if (
            status_tag === StatusTag.FinalReview ||
            status_tag === StatusTag.Review ||
            status_tag === StatusTag.LeadProvider
        ) {
            console.log('Approval buttons 7 ');
            return IntakeButtonTypes.ApprovalButtons;
        }

        if (
            status_tag === StatusTag.ReviewNoPrescribe ||
            status_tag === StatusTag.OverdueNoPrescribe ||
            status_tag === StatusTag.ProviderMessage
        ) {
            return IntakeButtonTypes.AdjustDosing;
        }

        return IntakeButtonTypes.None;
    } else if (cadence === SubscriptionCadency.Biannually) {
        if (
            order_status === OrderStatus.UnapprovedCardDown ||
            order_status === OrderStatus.PaymentCompleted
        ) {
            if (
                status_tag === StatusTag.Review ||
                status_tag === StatusTag.LeadProvider ||
                status_tag === StatusTag.Overdue ||
                status_tag === StatusTag.Engineer
            ) {
                console.log(
                    '[Biannually] Approval Buttons because status tag is Review, LeadProvider, Overdue, or Engineer'
                );
                return IntakeButtonTypes.ApprovalButtons;
            }
            return IntakeButtonTypes.None;
        }

        if (
            status_tag === StatusTag.FinalReview ||
            status_tag === StatusTag.Review ||
            status_tag === StatusTag.LeadProvider ||
            status_tag === StatusTag.Overdue ||
            status_tag === StatusTag.Engineer
        ) {
            console.log(
                '[Biannually] Approval Buttons because status tag is FinalReview, Review, LeadProvider, Overdue, or Engineer'
            );
            return IntakeButtonTypes.ApprovalButtons;
        }

        if (
            status_tag === StatusTag.ReviewNoPrescribe ||
            status_tag === StatusTag.OverdueNoPrescribe ||
            status_tag === StatusTag.ProviderMessage
        ) {
            if (
                (order_data.product_href as PRODUCT_HREF) ===
                PRODUCT_HREF.METFORMIN
            ) {
                console.log(
                    '[Biannually] Approval Buttons because product href is METFORMIN, though no approval action is needed'
                );
                return IntakeButtonTypes.ApprovalButtons;
            }

            if (
                (order_data.product_href as PRODUCT_HREF) ===
                    PRODUCT_HREF.TIRZEPATIDE &&
                [16, 17, 18, 19, 20, 21, 22].includes(order_data.variant_index)
            ) {
                return IntakeButtonTypes.None;
            } else {
                return IntakeButtonTypes.AdjustDosing;
            }
        }

        return IntakeButtonTypes.None;
    } //end of non-glp1 biannually order cadence handling

    if (cadence === SubscriptionCadency.OneTime) {
        console.log('[OneTime] Approval Buttons because cadence is OneTime');
        return IntakeButtonTypes.ApprovalButtons;
    }

    return IntakeButtonTypes.None;
}

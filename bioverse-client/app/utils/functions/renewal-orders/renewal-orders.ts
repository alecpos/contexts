export function getOrderStatusDetails(orderStatus: string): {
    isCheckupComplete: boolean;
    isProviderApproved: boolean;
    isPaid: boolean;
    isPrescribed: boolean;
    isFailedPayment: boolean;
} {
    const details: {
        isCheckupComplete: boolean;
        isProviderApproved: boolean;
        isPaid: boolean;
        isPrescribed: boolean;
        isFailedPayment: boolean;
    } = {
        isCheckupComplete: false,
        isProviderApproved: false,
        isPaid: false,
        isPrescribed: false,
        isFailedPayment: false,
    };

    // Check if the order status indicates a checkup completion
    if (
        orderStatus.includes('CheckupComplete') ||
        orderStatus.includes('CheckupWaived')
    ) {
        details.isCheckupComplete = true;
    } else {
        details.isCheckupComplete = false;
    }

    // Check if the order status indicates provider approval
    if (orderStatus.includes('ProviderApproved')) {
        details.isProviderApproved = true;
    } else {
        details.isProviderApproved = false;
    }

    // Check if the order status indicates payment status
    if (orderStatus.includes('Paid')) {
        details.isPaid = true;
    } else {
        details.isPaid = false;
    }

    if (orderStatus.includes('Unpaid-1') || orderStatus.includes('Unpaid-2')) {
        details.isPaid = false;
        details.isFailedPayment = true;
    } else {
        details.isFailedPayment = false;
    }

    if (orderStatus.includes('Prescribed')) {
        details.isPrescribed = true;
    } else {
        details.isPrescribed = false;
    }

    return details;
}

export function getFinalReviewStartsDate() {
    return new Date(Date.now() + 61 * 24 * 60 * 60 * 1000);
}

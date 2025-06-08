export function getNextRenewalOrderId(
    original_order_id: string,
    old_renewal_order_id: string
) {
    const nextCount =
        getRenewalOrderCountFromRenewalOrderId(old_renewal_order_id);

    return `${original_order_id}-${Number(nextCount) + 1 || '100'}`;
}

export function getRenewalOrderCountFromRenewalOrderId(
    renewal_order_id: string
) {
    const parts = renewal_order_id.split('-');
    return parts.length > 1 ? parts[1] : null;
}

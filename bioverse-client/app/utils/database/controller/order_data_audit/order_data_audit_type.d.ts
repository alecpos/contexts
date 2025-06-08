interface OrderDataAuditType {
    id: string; //auto generated
    created_at: string; //auto generated
    order_id: number; //order ID
    renewal_order_id: string; // renewal order ID if applicable
    description: string; // Description in one sentence.
    action: string; // Action - will be changed to enum in future
    metadata: any; // metadata for engineer to read in the future
    payload_data: any; // the payload information of what happened during the transaction
}

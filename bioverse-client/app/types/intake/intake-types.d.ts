interface ProfileDataIntakeFlow {
    first_name: string;
    last_name: string;
    sex_at_birth?: string;
    phone_number: string;
    stripe_customer_id: string;
    intake_completed?: boolean;
    email?: string;
    text_opt_in: boolean;
    user_id?: string;
}

interface ProfileDataIntakeFlowCheckout {
    first_name: string;
    last_name: string;
    sex_at_birth: string;
    date_of_birth: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip: string;
    phone_number: string;
    stripe_customer_id: string;
    intake_completed?: boolean;
    email?: string;
    text_opt_in: boolean;
    user_id?: string;
}

interface CheckoutExistingOrderData {
    id: any;
    stripe_metadata: any;
    order_status: any;
    variant_index: any;
    subscription_type: any;
    address_line1: any;
    address_line2: any;
    city: any;
    state: any;
    zip: any;
}

interface ProductVariables {
    productName: string;
    variant: number;
    variantText: string;
    subscriptionType: string;
}

interface IntakeStateData {
    step: number;
    urlData: string;
}

/**
 * @author Nathan Cho
 * @description the fields and values in the order type
 */
interface Order {
    orderId?: number;
    customer_uid: string;
    product_href?: string;
    variant_index?: number;
    variant_text?: string;
    subscription_type?: string;
    price?: number;
    order_status?: string;
    stripe_metadata?: ClientStripeData;
    rxQuestionnaireAnswers?: any;
    price_id?: string;
    environment?: string;
    discount_id?: string[];
    assigned_pharmacy?: string;
    metadata?: any;
    source?: string;
}

interface ClientStripeData {
    clientSecret: string;
    setupIntentId: string;
    paymentMethodId: string;
}

interface ProductVariables {
    productName: string;
    variant: number;
    variantText: string;
    subscriptionType: string;
}

interface PaymentForm {
    name_on_card: string;
    card_number: string;
    expiration_date: string;
    cvc: string;
    zip: string;

    address_line1: string;
    addressline2: string;
    city: string;
    state: string;
}

interface Answer {
    question: string;
    answer: string;
    formData: string[];
}
interface AnswersState {
    [questionNumber: number]: Answer[];
}

interface AddressInterface {
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
}

interface ShippingInformation {
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    product_href?: string;
}

interface ProfileData {
    first_name: string;
    last_name: string;
    sex_at_birth?: string;
    phone_number: string;
    text_opt_in: boolean | null;
}

interface licenseSelfieUpdateObject {
    license_photo_url?: string;
    selfie_photo_url?: string;
}

import { USStates } from '../enums/master-enums';
import { UserRoles } from '../provider-portal/messages/message-types';

interface LatestMessage {
    thread_id_: number;
    message_id_: number;
    created_at: Date;
    sender_id: string;
    content: string;
}

interface ThreadMember {
    thread_id: number;
    first_name: string;
    last_name: string;
}

interface InitialThreadData {
    thread_id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    message: InitialMessage;
}

interface PreviewCardThreadData {
    thread_id: number;
    first_name: string;
    last_name: string;
    avatar: JSX.Element;
    product_name: string;
    message: InitialMessage;
}

interface CoordinatorThreadData {
    assigned_provider: string | null;
    created_at: Date | string;
    last_bioverse_message_time: Date | string;
    last_patient_message_time: Date | string;
    requires_lead: boolean;
    requires_provider: boolean;
    requires_coordinator: boolean;
    thread_id: number;
    patient_first_name: string;
    patient_last_name: string;
    product: string;
    last_message_time?: Date | string;
    content: string;
}

interface ProviderThreadData {
    assigned_provider: string | null;
    created_at: Date | string;
    last_bioverse_message_time: Date | string;
    last_patient_message_time: Date | string;
    last_provider_read_time: Date | string;
    requires_lead: boolean;
    requires_provider: boolean;
    requires_coordinator: boolean;
    thread_id: number;
    patient_first_name: string;
    patient_last_name: string;
    product: string;
    last_message_time?: Date | string;
    content: string;
    patient_id: string;
    providers: string[];
    patient_state: USStates;
}

interface AllThreadIndividualThread {
    thread_id: any;
    last_bioverse_message_time: any;
    last_patient_message_time: any;
    requires_provider: any;
    requires_lead: any;
    threads: {
        id: any;
        patient_id: any;
        product: any;
        patient: {
            first_name: any;
            last_name: any;
            email: any;
            state: any;
        };
    };
}

interface InitialMessage {
    message_id_: number;
    created_at: Date;
    sender_id: string;
    content: string;
    last_read_at: Date;
}

interface InitialMessageV2 {
    message_id_: number;
    created_at: Date;
    sender_id: string;
    content: string;
    last_read_at: Date;
    sender: {
        first_name: string;
        last_name: string;
        provider_data: { role?: UserRoles; profile_picture_url?: string };
    };
    attachment_urls?: string;
}

interface MessagePayload {
    sender_id: string;
    content: string;
    thread_id: number;
    contains_phi?: boolean;
    requires_provider?: boolean;
    requires_lead?: boolean;
    requires_coordinator?: boolean;
}

interface AvailableUser {
    user_id: string;
    first_name: string;
    last_name: string;
}

interface ChatMessageLogEntry {
    created_at: Date;
    sender_id: string;
    content: string;
    thread_id: number;
    first_name: string;
    last_name: string;
}

/**
 * Below are interfaces used in the patient portal.
 *
 * Thread : the message box that contains messages sent to a thread group.
 * Preview : the card that shows the latest message for a thread & the product name / last sent user's avatar.
 *
 */
interface ThreadAndPreviewMessage {
    id: number | string;
    message_preview: {
        id: number | string;
        content: string;
        created_at: string;
        sender: {
            first_name: string;
            last_name: string;
            provider_data: {
                role: UserRoles | null;
                profile_picture_url?: string;
            };
        };
        sender_id: string;
        thread_id: number | string;
    };
    product: string;
    product_data: {
        name: string;
    };
}

interface ThreadMessageObject {
    content: string;
    created_at: string | Date;
    id: number;
    sender: {
        first_name: string;
        last_name: string;
        provider_data: { role: UserRoles | null; profile_picture_url?: string };
    };
    sender_id: string;
    thread_id: number;
    attachment_urls: string;
}

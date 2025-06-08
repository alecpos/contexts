export enum AccessLevel {
    Denied = 'invalid',
    Patient = 'patient',
    Provider = 'provider',
    Developer = 'developer',
    Admin = 'admin',
    CustomerSupport = 'customer-support',
}

export interface UserMessage {
    first_name: string;
    last_name: string;
    email: string;
    user_id: string;
}

export interface Message {
    created_at: Date;
    sender_id: string;
    first_name: string;
    last_name: string;
    email: string;
    content: string;
    thread_id: number;
}

export interface ThreadMember {
    thread_id: number;
    first_name: string;
    last_name: string;
}

export interface GetUserThreadsResponse {
    messageData: Message[];
    threadMembers: ThreadMember[];
    success: boolean;
}

export interface GroupedMessages {
    [thread_id: number]: Message[];
}

export enum UserRoles {
    Provider = 'provider',
    Admin = 'admin',
    Coordinator = 'coordinator',
    LeadCoordinator = 'lead-coordinator',
    Developer = 'developer',
    Customer = 'customer',
    LeadProvider = 'lead-provider',
}

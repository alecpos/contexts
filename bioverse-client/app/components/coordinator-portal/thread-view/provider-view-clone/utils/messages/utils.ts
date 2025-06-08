import { UserRoles } from '@/app/types/provider-portal/messages/message-types';

export function displayUserTitle(role?: UserRoles | null) {
    if (!role) {
        return 'Patient';
    }

    switch (role) {
        case UserRoles.Coordinator:
            return 'Care Coordinator';
        case UserRoles.LeadCoordinator:
            return 'Lead Coordinator';
        case UserRoles.Provider:
            return 'Medical Provider';
        case UserRoles.Admin:
            return 'Admin';
        case UserRoles.Customer: // does nothing atm
            return 'Patient';
        case UserRoles.Developer: // Just in case
            return 'Developer';
        case UserRoles.LeadProvider:
            return 'Lead Provider';
        default:
            return 'Patient';
    }
}

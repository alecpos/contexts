import { StatusTagInfo } from '@/app/types/general/status-dropdown-types';
import { StatusTag } from '@/app/types/status-tags/status-types';

export const statusInfo: StatusTagInfo = {
    [StatusTag.AwaitingResponse]: {
        color: '#2E7D32',
        text: 'Awaiting Response',
    },
    [StatusTag.CoordinatorAwaitingResponse]: {
        color: '#2E7D32',
        text: 'Coordinator Awaiting Response',
    },
    [StatusTag.ProviderAwaitingResponse]: {
        color: '#2E7D32',
        text: 'Provider Awaiting Response',
    },
    [StatusTag.ProviderMessage]: {
        color: '#D32F2F',
        text: 'Provider - Message Patient',
    },
    [StatusTag.RegisteredNurseMessage]: {
        color: '#D32F2F',
        text: 'Registered Nurse - Message Patient',
    },
    [StatusTag.ReadPatientMessage]: {
        color: '#D32F2F',
        text: 'Read Patient Message',
    },
    [StatusTag.CancelOrderOrSubscription]: {
        color: '#D32F2F',
        text: 'Cancel Order or Subscription',
    },
    [StatusTag.Overdue]: {
        color: '#D32F2F',
        text: 'Overdue',
    },
    [StatusTag.NE]: {
        color: '#00000026',
        text: 'N/E',
    },
    [StatusTag.LeadProvider]: {
        color: '#286BA2',
        text: 'Lead Provider',
    },
    [StatusTag.Review]: {
        color: '#286BA2',
        text: 'Review',
    },
    [StatusTag.IDDocs]: {
        color: '#286BA2',
        text: 'ID/Docs',
    },
    [StatusTag.Engineer]: {
        color: '#EF6C00',
        text: 'Engineer',
    },
    [StatusTag.Coordinator]: {
        color: '#EF6C00',
        text: 'Coordinator',
    },
    [StatusTag.CoordinatorCreateOrder]: {
        color: '#38bf1d',
        text: 'Coordinator - Create New Order',
    },
    [StatusTag.CustomerIOFollowUp]: {
        color: '#EF6C00',
        text: 'Customer IO Follow Up',
    },
    [StatusTag.IDVerificationCustomerIOFollowUp]: {
        color: '#EF6C00',
        text: 'ID Verification Customer IO Follow Up',
    },
    [StatusTag.FollowUp]: {
        color: '#D32F2F',
        text: 'Follow Up',
    },
    [StatusTag.Resolved]: {
        color: '#EF6C00',
        text: 'Resolved',
    },
    [StatusTag.FinalReview]: {
        color: '#286BA2',
        text: 'Review',
    },
    [StatusTag.ReviewNoPrescribe]: {
        color: '#286BA2',
        text: "Review - Don't prescribe",
    },
    [StatusTag.OverdueNoPrescribe]: {
        color: '#D32F2F',
        text: 'Overdue',
    },
    [StatusTag.None]: {
        color: '#00000026',
        text: 'None',
    },
    [StatusTag.LeadCoordinator]: {
        color: '#B2AC88',
        text: 'Lead Coordinator',
    },
    [StatusTag.RNAwaitingResponse]: {
        color: '#0fb7d1',
        text: 'RN: Awaiting Response',
    },
    [StatusTag.LeadProviderAwaitingResponse]: {
        color: '#A45729',
        text: 'Lead Provider - Awaiting Response',
    },
    [StatusTag.UrgentRequiresProvider]: {
        color: '#D32F2F',
        text: 'Urgent: Message Patient',
    },
    [StatusTag.SupplementaryVialRequest]: {
        color: '#EF6C00',
        text: 'Supplementary Vial Request',
    },
    [StatusTag.CustomDosageRequest]: {
        color: '#EF6C00',
        text: 'Custom Dosage Request',
    },
};

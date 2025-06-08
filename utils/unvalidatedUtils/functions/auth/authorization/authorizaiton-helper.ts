import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

export function determineAccessByRoleName(
    access_level: BV_AUTH_TYPE | null,
    required_level: BV_AUTH_TYPE
): boolean {
    if (!access_level) {
        return false;
    }
    if (
        extractNumericFromAccessLevel(access_level) <
        extractNumericFromAccessLevel(required_level)
    ) {
        return false;
    } else return true;
}

function extractNumericFromAccessLevel(access_level: BV_AUTH_TYPE): number {
    switch (access_level) {
        case BV_AUTH_TYPE.COORDINATOR:
            return 2;
        case BV_AUTH_TYPE.REGISTERED_NURSE:
            return 3;
        case BV_AUTH_TYPE.PROVIDER:
            return 4;
        case BV_AUTH_TYPE.LEAD_PROVIDER:
            return 5;
        case BV_AUTH_TYPE.LEAD_COORDINATOR:
            return 6;
        case BV_AUTH_TYPE.DEVELOPER:
            return 7;
        case BV_AUTH_TYPE.ADMIN:
            return 999;
        default:
            return 0;
    }
}

interface BV_ROLE_VALUE_INTERFACE {
    [key: string]: number;
}
export const BV_ROLE_VALUE_MAP: BV_ROLE_VALUE_INTERFACE = {
    test: 1,
    coordinator: 2,
    'registered-nurse': 3,
    provider: 4,
    'lead-provider': 5,
    'lead-coordinator': 6,
    developer: 7,
    admin: 999,
};

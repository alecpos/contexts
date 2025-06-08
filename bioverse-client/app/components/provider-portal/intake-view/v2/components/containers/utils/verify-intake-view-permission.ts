'use server';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { USStates } from '@/app/types/enums/master-enums';
import { getCurrentEmployeeRole } from '@/app/utils/database/controller/employees/employees-api';
import { getProviderLicensedStates } from '@/app/utils/database/controller/providers/providers-api';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';

export async function verifyUserIntakePermission(
    us_state: USStates
): Promise<{ access: boolean; reason: string | null }> {
    try {
        const role = await getCurrentEmployeeRole();

        if (role === BV_AUTH_TYPE.DEVELOPER || role === BV_AUTH_TYPE.ADMIN) {
            return { access: true, reason: null };
        }

        //Check if the user is at least a provider.
        if (determineAccessByRoleName(role, BV_AUTH_TYPE.PROVIDER)) {
            const allowed_states = await getProviderLicensedStates();

            if (allowed_states?.includes(us_state)) {
                return { access: true, reason: null };
            } else return { access: true, reason: 'State Licensing' };
        } else {
            return {
                access: true,
                reason: 'Employee Authorization Not Cleared',
            };
        }
    } catch (error: any) {
        return {
            access: true,
            reason: error.message,
        };
    }
}

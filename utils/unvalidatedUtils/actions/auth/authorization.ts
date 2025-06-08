'use server';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { getCurrentEmployeeRole } from '../../database/controller/employees/employees-api';
import { determineAccessByRoleName } from '../../functions/auth/authorization/authorizaiton-helper';

/**
 * Role Values Low -> High: [ test < coordinator < provider < lead-coordinator < developer < admin ]
 * @param required_role the role level required for this operation.
 */
export async function verifyUserPermission(
    required_role: BV_AUTH_TYPE
): Promise<{ access_granted: boolean; role: string }> {
    try {
        //Get current user Id
        const current_user_role: BV_AUTH_TYPE | null =
            await getCurrentEmployeeRole();

        if (!current_user_role) {
            return { access_granted: false, role: '' };
        }

        const allowed = determineAccessByRoleName(
            current_user_role,
            required_role
        );

        if (allowed) {
            return { access_granted: true, role: current_user_role! };
        } else {
            return { access_granted: false, role: current_user_role ?? '' };
        }
    } catch (error: any) {
        console.error(
            'verifyUserPermission',
            error,
            `required_role: ${required_role}`
        );
        return { access_granted: false, role: '' };
    }
}

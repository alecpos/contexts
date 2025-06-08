'use server';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { Status } from '@/app/types/global/global-enumerators';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getCurrentEmployeeRole } from '@/app/utils/database/controller/employees/employees-api';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { updateRenewalOrderByRenewalOrderId } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

export async function assignCurrentProviderToOrder(
    order_id: string
): Promise<Status> {
    try {
        const user_id = (await readUserSession()).data.session?.user.id;
        const access_role: BV_AUTH_TYPE | null = await getCurrentEmployeeRole();

        if (!access_role) {
            return Status.Failure;
        }

        if (access_role === BV_AUTH_TYPE.COORDINATOR) {
            throw new Error();
            return Status.Failure;
        }

        if (
            access_role === BV_AUTH_TYPE.ADMIN ||
            access_role === BV_AUTH_TYPE.DEVELOPER ||
            access_role === BV_AUTH_TYPE.LEAD_COORDINATOR
        ) {
            //Writing in a bypass for admins and engineers to not get assigned here.
            return Status.Success;
        }

        //Processing the assignment to renewals vs orders
        if (
            typeof order_id === 'string' &&
            (order_id as string).includes('-')
        ) {
            const { data, status } = await updateRenewalOrderByRenewalOrderId(
                order_id,
                {
                    assigned_provider: user_id,
                }
            );
            if (status === Status.Failure) {
                throw new Error();
            }
        } else {
            console.log('-------------------', order_id);
            const status = await updateOrder(parseInt(order_id), {
                assigned_provider: user_id,
            });
            if (status === Status.Failure) {
                throw new Error();
            }
        }

        console.log('finished apparentlys');

        return Status.Success;
    } catch (error: any) {
        console.log(error);
        return Status.Failure;
    }
}

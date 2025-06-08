import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { BaseScriptHandler } from './BaseScriptHandler';
import { EmpowerScriptHandler } from './EmpowerScriptHandler';
import { HallandaleScriptHandler } from './HallandaleScriptHandler';
import { ScriptSource } from '@/app/types/orders/order-types';
import { BoothwynScriptHandler } from './BoothwynScriptHandler';
import { ReviveScriptHandler } from './ReviveScriptHandler';

export class ScriptHandlerFactory {
    static createHandler(
        renewalOrder: RenewalOrder,
        subscription: PrescriptionSubscription,
        source: ScriptSource,
        price: string = '',
        custom_order_id?: string, // to be passed in if need to overwrite script's order id (empower specifically)
        resending: boolean = false
    ): BaseScriptHandler {
        custom_order_id = custom_order_id ?? renewalOrder.renewal_order_id;
        switch (renewalOrder.assigned_pharmacy) {
            case PHARMACY.EMPOWER:
                return new EmpowerScriptHandler(
                    renewalOrder,
                    subscription,
                    source,
                    price,
                    custom_order_id,
                    resending
                );
            case PHARMACY.HALLANDALE:
                return new HallandaleScriptHandler(
                    renewalOrder,
                    subscription,
                    source,
                    price,
                    custom_order_id,
                    resending
                );
            case PHARMACY.BOOTHWYN:
                return new BoothwynScriptHandler(
                    renewalOrder,
                    subscription,
                    source,
                    price,
                    custom_order_id,
                    resending
                );
            case PHARMACY.REVIVE:
                return new ReviveScriptHandler(
                    renewalOrder,
                    subscription,
                    source,
                    price,
                    custom_order_id,
                    resending
                );
            default:
                throw new Error('Unknown pharmacy');
        }
    }
}

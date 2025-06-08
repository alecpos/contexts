'use client';

import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { Button } from '@mui/material';
import { useState } from 'react';

export default function OlivierDevPage() {
    const [resp, setResp] = useState<any>({});

    const handleClick = async () => {
        // need to update order shipping status and send delivered event
        // await handleCheckupCompletion(
        //     'tirzepatide-checkup-4',
        //     'cfedcbfe-07d8-4187-b6ad-e956f12223a8',
        // );
        // await createFirstTimeRenewalOrder('15113');
        // await testStripeStuff();
        // await updateStripeProduct(2874, 5, false);
        // await correctWronglyPaidOrders('9784-1', 4);
        // await createUpcomingRenewalOrderWithRenewalOrderId('6591-4');
        // const renewalOrder = await getRenewalOrder('9675-1');
        // if (renewalOrder) {
        //     const sub = await getPrescriptionSubscription(
        //         renewalOrder.subscription_id,
        //     );
        //     if (sub) {
        //         const handler = ScriptHandlerFactory.createHandler(
        //             renewalOrder,
        //             sub,
        //         );
        //         handler.regenerateAndSendScript();
        //     }
        // }
        // await triggerEvent(
        //     '087fa849-ce68-41aa-b049-beaea7a5d854',
        //     WL_MULTI_MONTH_CHECKIN,
        //     {
        //         checkin_url: `https://app.gobioverse.com/check-up/tirzepatide`,
        //         order_id: '45078',
        //     },
        // );
        // await refundCustomerAndSendScript();
        // await extendSubscriptionRenewalBy4Days(4312, PRODUCT_HREF.SEMAGLUTIDE);
        // await updateStripeProduct(4312, 14, false);
        // await someTest();
        // await updateStripeProduct(1366, 14, false);
        // await updateStripeProduct(2731, 14, false);
        // await createFirstTimeRenewalOrder('32346');
        await triggerEvent(
            '85d93975-d498-45a1-b3f1-8bf5ef6f448e',
            RudderstackEvent.WL_CHECKIN_RESEND,
            {
                checkin_url: `https://app.gobioverse.com/check-up/semaglutide`,
            }
        );
        // await handler.generateScript();
        // await createFirstTimeRenewalOrder('17584');
        // await triggerEvent(
        //     '3e20ba0c-505f-4b75-bebe-ba6292e2f931',
        //     PAYMENT_FAILED,
        //     {
        //         order_type: OrderType.RenewalOrder,
        //     },
        // );
        // await revenueAnalysis();
        // await changeSubscriptionRenewalDate(
        //     2603,
        //     'sub_1Po75VDyFtOu3ZuTjfg3ZeVq',
        //     1734298756,
        //     2,
        // );
        // await doCrazyStuff();
    };

    const loadHallandaleScript = async () => {};

    return (
        <main className='flex justify-center flex-col items-center space-y-8'>
            <Button variant='contained' onClick={handleClick}>
                Do stuff
            </Button>
            <Button variant='contained' onClick={loadHallandaleScript}>
                Load Hallandale Script for User
            </Button>
        </main>
    );
}

function DisplayObject({ obj }: any) {
    // Check if the input is an object and not null
    if (typeof obj === 'object' && obj !== null) {
        return (
            <div>
                {Object.keys(obj).map((key) => (
                    <div key={key}>
                        <strong>{key}:</strong>
                        {typeof obj[key] === 'object' && obj[key] !== null ? (
                            <DisplayObject obj={obj[key]} />
                        ) : (
                            obj[key].toString()
                        )}
                    </div>
                ))}
            </div>
        );
    } else {
        // If the input is not an object, return it directly
        return <>{obj.toString()}</>;
    }
}

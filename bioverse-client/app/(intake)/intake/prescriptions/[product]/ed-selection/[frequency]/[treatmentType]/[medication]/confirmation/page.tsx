'use server';

import EDConfirmationComponent from '@/app/components/intake-v2/ed/confirmation/ed-confirmation';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { BaseOrder } from '@/app/types/orders/order-types';

interface EDConfirmationPageProps {
    params: {
        frequency: string;
        treatmentType: string;
        medication: string;
        product: string;
    };
}

export default async function EDConfirmationPage({
    params,
}: EDConfirmationPageProps) {
    const userId = (await readUserSession()).data.session?.user.id;

    if (!userId) {
        return <></>;
    }

    let orderData: BaseOrder | null = null;

    if (params.product === 'ed-global') {
        orderData = await getOrderForProduct('ed-global', userId);
    } else {
        orderData = await getOrderForProduct(params.medication, userId);
    }

    if (!orderData) {
        return <>No order found</>;
    }

    return (
        <EDConfirmationComponent
            orderData={orderData}
            frequency={params.frequency}
            treatmentType={params.treatmentType}
            productHref={params.medication}
        />
    );
}

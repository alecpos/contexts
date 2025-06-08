'use server';

import EDPreIdScreen from '@/app/components/intake-v2/ed/ed-pre-id/ed-pre-id';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';

interface EDPreIdPageProps {
    params: {
        product: string;
    };
}

export default async function EDPreIdPage({ params }: EDPreIdPageProps) {
    const userId = (await readUserSession()).data.session?.user.id;

    if (!userId) {
        return <></>;
    }

    const orderData = await getOrderForProduct(params.product, userId);

    if (!orderData) {
        return <>no order found</>;
    }

    return (
        <EDPreIdScreen
            user_id={userId}
            edSelectionMetadata={orderData.metadata.edSelectionData}
        />
    );
}

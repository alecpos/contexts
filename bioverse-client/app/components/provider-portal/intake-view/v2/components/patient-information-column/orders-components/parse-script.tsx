import { itemList } from '@/app/services/pharmacy-integration/empower/empower-item-list';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { RenewalOrderTabs } from '@/app/types/renewal-orders/renewal-orders-types';
import { BOOTHWYN_SKU_NAME_MAP } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-variant-mapping';



const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function parseLastUsedScript(script: any, pharmacy: string, order_data: OrderTabOrder | RenewalOrderTabs) {

    if (!script) {
        return null;
    }
    // For sermorelin, always use Boothwyn format
    if (order_data.product_href === 'sermorelin') {
        try {
            return (
                <>
                    {script.script_json.prescriptions.map((prescription: any, index: number) => {
                        return (
                            <div key={index} className='provider-tabs-subtitle flex flex-col' >
                                <p>• Medication: <span className='provider-tabs-subtitle-weak'>{BOOTHWYN_SKU_NAME_MAP[prescription.sku]} - Quantity: {prescription.amount}</span></p>
                                <p className='ml-3'>• Sig: <span className='provider-tabs-subtitle-weak'>  {prescription.instructions}</span></p>
                            </div>
                        );
                    })}
                </>
            );
        } catch (error) {
            console.error('Error in script parsing: ', error);
            return <>Could not parse Boothwyn script. Was the script resent to a different pharmacy?</>;
        }
    }

    switch (pharmacy) {
        case 'empower':
            console.log('script in empower: ', script);
            try {
                const itemDesignatorId =
                    script.newRxs[0].medication.itemDesignatorId;

                // Find the item in the itemList that matches the itemDesignatorId
                const item = itemList.find(
                    (item) => item.itemDesignatorId === itemDesignatorId
                );

                return (
                    <>
                        {/* <BioType className='provider-tabs-subtitle'>
                            <p className='provider-tabs-subtitle'>• Pharmacy name: {' '}
                                <span className='provider-tabs-subtitle-weak '>Empower</span>
                            </p>
                        </BioType> */}

                        <BioType className='provider-tabs-subtitle'>
                            • Medication:{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {item?.drugDescription}
                            </span>
                        </BioType>

                        <BioType className='provider-tabs-subtitle'>
                            • Dosage:{' '}
                            <span className='provider-tabs-subtitle-weak'>{item?.dosage}</span>
                        </BioType>

                        <BioType className='provider-tabs-subtitle'>
                            • Vial Size:{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {item?.quantity}
                            </span>

                        </BioType>

                        <BioType className='provider-tabs-subtitle'>
                            • Sig:{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {script.newRxs.map(
                                    (medication: any, index: number) => {
                                        return (
                                            <div
                                                key={medication.sigText}
                                                className='ml-3'
                                            >
                                                •{' '}
                                                {
                                                    medication.medication
                                                        .sigText
                                                }
                                            </div>
                                        );
                                    }
                                )}
                            </span>

                        </BioType>

                    </>
                );
            } catch (error) {
                console.error('Error in script parsing: ', error);
                return <>Could not parse Empower script. Was the script resent to a different pharmacy?</>;
            }

        case 'hallandale':
            try {
                const rx_item_array = script.order.rxs;

                return (
                    <>
                        <p className='provider-tabs-subtitle'>
                        • Medication:
                        </p>
                        {rx_item_array.map((item: any, index: number) => {

                            return (
                                <div key={index} className='flex flex-col '>
                                
                                    <BioType className='provider-tabs-subtitle ml-4'>
                                
                                        <span className='provider-tabs-subtitle-weak'>
                                        • {item.drugName}
                                        </span>
                                    </BioType>

                                    <BioType className='provider-tabs-subtitle ml-8'>
                                        • Dosage:{' '}
                                        <span className='provider-tabs-subtitle-weak'>
                                            {item.drugStrength}
                                        </span>
                                    </BioType>

                                    <BioType className='provider-tabs-subtitle ml-8 '>
                                        • Quantity:{' '}

                                        <span className='provider-tabs-subtitle-weak'>
                                            {item.quantity}
                                        </span>
                                    </BioType>

                                    {item.internalSigDisplay && (
                                        <BioType className='provider-tabs-subtitle ml-8'>
                                            • Sig:{' '}
                                            {item.internalSigDisplay.map(
                                                (
                                                    sigItem: any,
                                                    index: number
                                                ) => {
                                                    return (
                                                        <div
                                                            className='provider-tabs-subtitle-weak ml-3'
                                                            key={index}
                                                        >
                                                            • {sigItem}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </BioType>
                                    )}
                                </div>
                            );
                        })}
                    </>
                );
            } catch (error) {
                console.error('Error in script parsing: ', error);
                return <>Could not parse Hallandale script. Was the script resent to a different pharmacy?</>;
            }

        case 'boothwyn':
            try {
                return (
                    <>
                        {/* <p className='provider-tabs-subtitle'>
                        • Pharmacy name: {' '}
                            <span className='provider-tabs-subtitle-weak '>Boothwyn</span>
                        </p> */}
                        {script.script_json.prescriptions.map((prescription: any, index: number) => {
                            return (
                                <div key={index} className='provider-tabs-subtitle flex flex-col' >
                                    <p>• Medication: <span className='provider-tabs-subtitle-weak'>{BOOTHWYN_SKU_NAME_MAP[prescription.sku]} - Quantity: {prescription.amount}</span></p>
                                    <p className='ml-3'>• Sig: <span className='provider-tabs-subtitle-weak'>  {prescription.instructions}</span></p>
                                </div>
                            );
                        })}
                    </>
                );
            } catch (error) {
                console.error('Error in script parsing: ', error);
                return <>Could not parse Boothwyn script. Was the script resent to a different pharmacy?</>;
            }

        case 'revive':
            try {
                return (
                    <>
                        {/* <p className='provider-tabs-subtitle'>
                        • Pharmacy name: {' '}
                            <span className='provider-tabs-subtitle-weak '>Revive</span>
                        </p> */}
                        {script.medication_requests.map((medication: any, index: number) => {
                            return (
                                <div key={index} className='provider-tabs-subtitle' >
                                    
                                    <p>• Medication: <span className='provider-tabs-subtitle-weak'>  {medication.medication}</span></p>
                                    <p className='ml-3'> • Sig: <span className='provider-tabs-subtitle-weak '>  {medication.sig}</span></p>
                                </div>
                            );
                        })}
                    </>
                )
            } catch (error) {
                console.error('Error in script parsing: ', error);
                return <>Could not parse Revive script. Was the script resent to a different pharmacy?</>;
            }

        default:
            return <p className='provider-tabs-subtitle'>Pharmacy name: 
                    <span className='provider-tabs-subtitle-weak ml-1'>{order_data.assigned_pharmacy ? capitalizeFirstLetter(order_data.assigned_pharmacy) : 'N/A'}</span>
            </p>;
    }
};
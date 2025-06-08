"use client";
import {
    Chip,
} from '@mui/material';
import {
    useState,
} from 'react';
import Dialog from '@mui/material/Dialog';
import ViewListIcon from '@mui/icons-material/ViewList';
import { getActiveSubscriptionInfobyPatientId } from '@/app/utils/actions/provider/active-subscriptions';
import { PRODUCT_NAME_HREF_MAP } from '@/app/types/global/product-enumerator';
import CloseIcon from '@mui/icons-material/Close';
import useSWR from 'swr';

type ActiveSubscription = {
    product_name: string;
    dosage: string;
}

export default function ActiveSubscriptionsPill({ patient_id, order_id, order_product_href}: { patient_id: string, order_id: string, order_product_href: string }) {

    const { data: subscriptionData, isLoading: fetchSubscriptionsLoading } = useSWR(
        `user-active-subscriptions-${patient_id}`,
        () => getActiveSubscriptionInfobyPatientId(patient_id),
    );
    const [open, setOpen] = useState<boolean>(false);

    /**
     * If they do have 1 active subscription with similar order id (e.g. 3322 and 3322-1), then we
     * use the third condition to check if the product href is the same. If it is, then we don't show
     */
    if (!subscriptionData?.data?.length || 
        (subscriptionData.data.length === 1 && subscriptionData.data[0].order_id === order_id) ||
        (subscriptionData.data.length === 1 && subscriptionData.data[0].product_href === order_product_href) 
    ) {
        return null;
    }
    
    let modalData: ActiveSubscription[] = subscriptionData.data.map((subscription) => {
        return {
            product_name: PRODUCT_NAME_HREF_MAP[subscription.product_href],
            dosage: subscription.orders?.assigned_dosage ? subscription.orders?.assigned_dosage : 'N/A'
        };
    });

    const handleClickOpen = async () => {
        setOpen(true);
    }; 

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>

            <Chip
                clickable
                onClick={() => {
                    handleClickOpen();
                }}
                label={
                    <div className='flex items-center gap-2 inter-basic text-[14px]'>
                        <span>Patient has other active subscriptions</span>
                        <ViewListIcon sx={{ fontSize: '24px' }} />
                    </div>
                }
                sx={{ borderColor: '#ef6c00', color: '#ef6c00',     borderRadius: '6px', }}
                variant='outlined'
                
            />

            <Dialog onClose={handleClose} open={open} >
                <div className='flex justify-between items-center text-white p-4'>
                    <div className='provider-intake-tab-title-secondary my-4 ml-3'>Active Subscriptions</div>
                    <button 
                        className=' bg-white text-xl itd-body my-4 mr-3 bg-none border-none cursor-pointer' 
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className='px-4 pb-4 itd-body  '>
                    <div className="flex flex-row  font-bold mb-3 px-4" >
                        <div className='w-1/2 provider-dropdown-title text-strong'>Medication Name</div>
                        <div className='provider-dropdown-title text-strong'>Prescribed Dosage</div>
                    </div>
                    <div className="min-w-[500px] mx-auto">
                        {modalData.map((subscription, index) => {
                            return (
                                <div key={index} className={`flex flex-row  provider-dropdown-title text-strong border-b border-gray-300 py-2  px-4 rounded-md ${
                                    index % 2 === 0 ? 'bg-blue-50' : ''
                                }`}>
                                    <div className='w-1/2'>{subscription.product_name}</div>
                                    <div>{!subscription.dosage ? 'N/A' : subscription.dosage}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Dialog>

        </>
    )

}

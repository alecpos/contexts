'use client';
import { Dispatch, SetStateAction } from 'react';
import ShippingInformationModalBodyFix from './components/shipping-information-modal-body-fix';
import ShippingInformationModalBodyCheck from './components/shipping-information-modal-body-check';

interface ShippingInformationModalBodyControllerProps {
    validationData: any;
    validationStatus: boolean;
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    stateAddress: string;
    zip: string;
    userId: string;
    pushToNextRoute: any;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    setErrors: any;
}

export default function ShippingInformationModalBodyController(
    props: ShippingInformationModalBodyControllerProps
) {
    const { validationStatus } = props;
    if (validationStatus) {
        return <ShippingInformationModalBodyCheck {...props} />;
    }
    return <ShippingInformationModalBodyFix {...props} />;
}

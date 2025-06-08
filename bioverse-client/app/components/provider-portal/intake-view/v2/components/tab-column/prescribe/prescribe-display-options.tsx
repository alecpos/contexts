import { OrderType } from '@/app/types/orders/order-types';
import { getPatientAllergyData } from '@/app/utils/database/controller/clinical_notes/clinical-notes';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import useSWR from 'swr';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface PrescribeDisplayOptionsProps {
    pharmacy: string;
    patient_data: DBPatientData;
    order_data: DBOrderData;
    orderType: OrderType;
    providerId: string;
    orderStatus: string;
}

const DynamicTailorMadeCompoundsInterface = dynamic(
    () => import('./prescribe-windows/tmc/tmc-window'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicEmpowerInterface = dynamic(
    () => import('./prescribe-windows/empower/empower-window-v2'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicBelmarInterface = dynamic(
    () => import('./prescribe-windows/belmar/belmar-prescribe-window'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicHallandaleInterface = dynamic(
    () => import('./prescribe-windows/hallandale/hallandale-prescribe-window'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicDoseSpotIframeContainer = dynamic(
    () => import('./prescribe-windows/dosespot/dose-spot-iframe-container'),
    {
        loading: () => <LoadingScreen />,
    }
);

const PrescribeDisplayOptions = ({
    pharmacy,
    patient_data,
    order_data,
    orderType,
    providerId,
    orderStatus,
}: PrescribeDisplayOptionsProps) => {
    const {
        data: allergy_data,
        error,
        isLoading,
    } = useSWR(`${patient_data.id}-allergy-data`, () =>
        getPatientAllergyData(patient_data.id, order_data.product_href)
    );

    if (isLoading || !allergy_data) {
        return <></>;
    }

    const allergyData = allergy_data.data;

    switch (pharmacy) {
        case 'curexa':
        case 'ggm':
            return (
                <DynamicDoseSpotIframeContainer
                    providerId={providerId}
                    patient_data_recently_updated={
                        patient_data.personal_data_recently_changed
                    }
                    patient_data={patient_data}
                    order_data={order_data}
                />
            );
        case 'tmc':
            return (
                <DynamicTailorMadeCompoundsInterface
                    patientData={patient_data}
                    orderData={order_data}
                    allergyData={
                        allergyData && allergyData.length > 0
                            ? allergyData[0].allergies
                            : 'nkda'
                    }
                />
            );

        case 'empower':
            return (
                <DynamicEmpowerInterface
                    patientData={patient_data}
                    orderData={order_data}
                    orderType={orderType}
                />
            );
        case 'belmar':
            return (
                <DynamicBelmarInterface
                    patientData={patient_data}
                    orderData={order_data}
                    orderType={orderType}
                    allergyData={
                        allergyData && allergyData.length > 0
                            ? allergyData[0].allergies
                            : 'nkda'
                    }
                />
            );
        case 'hallandale':
            return (
                <DynamicHallandaleInterface
                    patientData={patient_data}
                    orderData={order_data}
                    orderType={orderType}
                    allergyData={
                        allergyData && allergyData.length > 0
                            ? allergyData[0].allergies
                            : 'nkda'
                    }
                />
            );
        default:
            return (
                <div className='flex flex-col items-center justify-center'>
                    <BioType className='itd-body'>
                        Interface Not Implemented
                    </BioType>
                </div>
            );
    }
};

export default PrescribeDisplayOptions;

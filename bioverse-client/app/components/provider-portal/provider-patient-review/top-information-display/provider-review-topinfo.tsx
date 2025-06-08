'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import TaskActionInfoBar from '../../tasks/task-action-page/components/task-action-info-bar';
import StatusDropdown from '@/app/components/provider-coordinator-shared/order-charts/components/StatusDropdown';
import ActiveSubscriptionsPill from '@/app/components/provider-coordinator-shared/order-charts/components/ActiveSubscriptionsPill';
import { PillStatus } from '@/app/types/provider-portal/provider-portal-types';
import StatusPillV2 from '../../intake-view/v2/components/containers/components/StatusPillV2';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import InternalNoteAlert from './internal-note-alert';
import useSWR from 'swr';
import { getRegisteredNurseDashboardTasks } from '@/app/components/registered-nurse-portal/dashboard/utils/rn-dashboard-functions';

interface ProviderReviewTopInfoProps {
    orderId: string | number;
    source: 'task' | 'dashboard';
    taskId?: string;
    userId: string;
    canProceed: boolean;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    employeeAuthorization: BV_AUTH_TYPE | null;
    intakeFetchData: any;
    fetchLoading: boolean;
}

export default function ProviderReviewTopInfoComponent({
    source,
    orderId,
    userId,
    taskId,
    canProceed,
    setCanProceed,
    employeeAuthorization,
    intakeFetchData,
    fetchLoading,
}: ProviderReviewTopInfoProps) {
    /**
     * Code to make it such that on denial, a task is compelted.
     */
    useEffect(() => {
        if (
            intakeFetchData?.statusTag &&
            intakeFetchData.statusTag === 'N/E' &&
            setCanProceed
        ) {
            setCanProceed(true);
        }
    }, [intakeFetchData?.statusTag]);

    if (fetchLoading || !intakeFetchData) {
        return <></>;
    }

    const getDropdownType = () => {
        switch (employeeAuthorization) {
            case BV_AUTH_TYPE.REGISTERED_NURSE:
                return 'registered-nurse';
            case BV_AUTH_TYPE.ADMIN:
            case BV_AUTH_TYPE.LEAD_PROVIDER:
                return 'lead-provider';
            case BV_AUTH_TYPE.PROVIDER:
            default:
                return 'provider';
        }
    };

    const TASK_COLORS = {
        RED: '#ffbabb',
        BLUE: '#b3d9ff',
        GREEN: '#baffc9',
        YELLOW: '#faffb3',
    } as const;

    const taskNameBackgroundColor = () => {
        const taskName = intakeFetchData?.dashboardTitle.taskName;
        if (!taskName) return TASK_COLORS.YELLOW;

        if (
            taskName.includes('Refill request') ||
            taskName.includes('New Patient: Approve Request')
        ) {
            return TASK_COLORS.RED;
        }

        if (taskName.includes('No Approval Required')) {
            return taskName.includes('Provider Message Needed')
                ? TASK_COLORS.BLUE
                : TASK_COLORS.GREEN;
        }

        return TASK_COLORS.YELLOW;
    };

    return (
        <>
            <div className='flex flex-row items-start justify-start w-[98%] self-start mx-4 mt-4'>
                <div className='flex flex-col items-center gap-1 w-full  '>
                    <div className='flex items-start w-full '>
                        <Button
                            variant='text'
                            style={{
                                borderColor: 'black',
                                color: 'black',
                                height: '40px',
                                whiteSpace: 'nowrap', // Prevent line breaks
                            }}
                            size='small'
                            onClick={() => {
                                const url = `/provider/all-patients/${
                                    intakeFetchData?.patientData!.id
                                }`;
                                window.open(url, '_blank');
                            }}
                        >
                            <div className='flex flex-row items-center justify-center gap-2'>
                                <BioType className='intake-v3-form-label underline'>
                                    {intakeFetchData?.patientData!.last_name},{' '}
                                    {intakeFetchData?.patientData!.first_name}
                                </BioType>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 20 20'
                                    fill='none'
                                >
                                    <path
                                        d='M14 12.8173C13.2628 12.8173 12.6362 12.5592 12.1202 12.0433C11.6042 11.5273 11.3462 10.9007 11.3462 10.1635C11.3462 9.42633 11.6042 8.79975 12.1202 8.28375C12.6362 7.76775 13.2628 7.50975 14 7.50975C14.7372 7.50975 15.3638 7.76775 15.8798 8.28375C16.3958 8.79975 16.6538 9.42633 16.6538 10.1635C16.6538 10.9007 16.3958 11.5273 15.8798 12.0433C15.3638 12.5592 14.7372 12.8173 14 12.8173ZM14 11.3173C14.3218 11.3173 14.5946 11.2054 14.8182 10.9817C15.0419 10.7581 15.1538 10.4853 15.1538 10.1635C15.1538 9.84167 15.0419 9.56892 14.8182 9.34525C14.5946 9.12142 14.3218 9.0095 14 9.0095C13.6782 9.0095 13.4054 9.12142 13.1818 9.34525C12.9581 9.56892 12.8462 9.84167 12.8462 10.1635C12.8462 10.4853 12.9581 10.7581 13.1818 10.9817C13.4054 11.2054 13.6782 11.3173 14 11.3173ZM8.34625 19.2693V16.7153C8.34625 16.4257 8.41525 16.1535 8.55325 15.8985C8.69125 15.6435 8.88442 15.4402 9.13275 15.2885C9.63092 14.9913 10.1563 14.745 10.709 14.5495C11.2617 14.354 11.826 14.2093 12.402 14.1155L14 16.125L15.5885 14.1155C16.1677 14.2093 16.7312 14.354 17.279 14.5495C17.8267 14.745 18.351 14.9913 18.852 15.2885C19.1007 15.4397 19.2948 15.6423 19.4345 15.8962C19.5743 16.1501 19.6474 16.4199 19.6538 16.7057V19.2693H8.34625ZM9.82125 17.7693H13.3865L11.8348 15.7923C11.4814 15.8818 11.1379 15.998 10.8042 16.141C10.4706 16.2842 10.1429 16.4436 9.82125 16.6193V17.7693ZM14.6135 17.7693H18.1538V16.6193C17.8423 16.4333 17.5197 16.273 17.186 16.1385C16.8525 16.0038 16.5091 15.8917 16.1557 15.802L14.6135 17.7693ZM2.31225 17.5C1.81058 17.5 1.38308 17.323 1.02975 16.969C0.676583 16.615 0.5 16.1894 0.5 15.6923V2.30775C0.5 1.81058 0.677 1.385 1.031 1.031C1.385 0.677 1.81058 0.5 2.30775 0.5H15.6923C16.1894 0.5 16.615 0.677 16.969 1.031C17.323 1.385 17.5 1.81058 17.5 2.30775V6.65375C17.291 6.41658 17.0683 6.1945 16.8318 5.9875C16.5953 5.7805 16.318 5.63658 16 5.55575V2.30775C16 2.21792 15.9712 2.14417 15.9135 2.0865C15.8558 2.02883 15.7821 2 15.6923 2H2.30775C2.21792 2 2.14417 2.02883 2.0865 2.0865C2.02883 2.14417 2 2.21792 2 2.30775V15.6923C2 15.7821 2.02883 15.8558 2.0865 15.9135C2.14417 15.9712 2.21792 16 2.30775 16H6.05375C6.02308 16.1192 6 16.2384 5.9845 16.3577C5.96917 16.4769 5.9615 16.5961 5.9615 16.7153V17.5H2.31225ZM4.25 5.86525H11.4615C11.7987 5.62808 12.1631 5.45183 12.5548 5.3365C12.9464 5.22117 13.3448 5.15708 13.75 5.14425V4.3655H4.25V5.86525ZM4.25 9.75H9.0095C9.02233 9.48333 9.05825 9.22658 9.11725 8.97975C9.17625 8.73308 9.25317 8.48983 9.348 8.25H4.25V9.75ZM4.25 13.6345H7.373C7.55 13.491 7.73625 13.3593 7.93175 13.2395C8.12725 13.1195 8.32692 13.0127 8.53075 12.9192V12.1348H4.25V13.6345ZM2 16V2V5.5405V5.125V16Z'
                                        fill='black'
                                    />
                                </svg>
                            </div>
                        </Button>
                    </div>
                    <div
                        id='patient_product_name_container'
                        className='flex justify-between flex-col mx-2 w-full space-y-1  mt-1 '
                    >
                        {/* title (taskName) */}
                        <BioType className='inter-basic font-bold text-black text-[15px] leading-[22px] mb-2'>
                            <span
                                style={{
                                    backgroundColor: taskNameBackgroundColor(),
                                    display: 'inline',
                                    padding: '0.4em 0.7em',
                                    borderRadius: '20px',
                                }}
                            >
                                {intakeFetchData?.dashboardTitle.taskName}
                            </span>
                        </BioType>

                        <div className='flex flex-row gap-3 ml-2'>
                            {/* current order */}
                            <BioType className='provider-topinfo-strong-title '>
                                Current Order:{' '}
                                {intakeFetchData?.dashboardTitle.currentOrder}
                            </BioType>

                            {/* current dosage */}
                            {intakeFetchData.dashboardTitle.currentDosage && (
                                <BioType className='provider-topinfo-strong-title'>
                                    Current Dosage:{' '}
                                    {
                                        intakeFetchData?.dashboardTitle
                                            .currentDosage
                                    }
                                </BioType>
                            )}
                        </div>

                        <div className='flex flex-row gap-3 ml-2'>
                            {/* refill date (subscription renewal date) */}
                            {intakeFetchData.subscriptionRenewalDate && (
                                <div>
                                    <BioType className='provider-topinfo-strong-title '>
                                        Refill Date:{' '}
                                        {
                                            intakeFetchData.subscriptionRenewalDate
                                        }
                                    </BioType>
                                </div>
                            )}

                            {/* previous dosage */}
                            {intakeFetchData.dashboardTitle.previousDosage && (
                                <BioType className='provider-topinfo-strong-title text-weak'>
                                    Previous Dosage:{' '}
                                    {
                                        intakeFetchData?.dashboardTitle
                                            .previousDosage
                                    }
                                </BioType>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex w-fit min-w-[600px] flex-col items-end justify-between gap-2 flex-grow '>
                    <TaskActionInfoBar
                        user_id={userId}
                        task_id={taskId}
                        canProceed={canProceed}
                        source={source}
                        employeeAuthorization={employeeAuthorization}
                    />

                    <div className='flex flex-row gap-3'>
                        {/* status pills */}
                        <div className='flex flex-wrap justify-start gap-y-1 gap-x-2 flex-grow'>
                            <ActiveSubscriptionsPill
                                patient_id={intakeFetchData?.patientData!.id}
                                order_id={String(orderId)}
                                order_product_href={
                                    intakeFetchData?.orderData.product_href
                                }
                            />

                            <StatusDropdown
                                patient_id={intakeFetchData?.patientData!.id}
                                order_id={String(orderId)}
                                orderType={intakeFetchData?.orderType}
                                order_data={intakeFetchData?.orderData}
                                employee_type={getDropdownType()}
                                setCanProceed={setCanProceed}
                            />

                            <InternalNoteAlert
                                patient_id={intakeFetchData?.patientData!.id}
                                order_id={String(orderId)}
                            />

                            {intakeFetchData?.orderPillStatuses &&
                                intakeFetchData.orderPillStatuses.map(
                                    (pillStatus: PillStatus, index: number) => {
                                        return (
                                            <StatusPillV2
                                                status={pillStatus}
                                                key={index}
                                            />
                                        );
                                    }
                                )}

                            {Object.entries(intakeFetchData.glp1Statuses).map(
                                ([key, value]) => {
                                    if (value) {
                                        return (
                                            <StatusPillV2
                                                status={key as PillStatus}
                                                key={key}
                                            />
                                        );
                                    }
                                    return null;
                                }
                            )}

                            {/* To Do: Make sure this only says autoshipped if the last shipped order was autoshipped
                             * it should check if the PREVIOUS renewal order was autoshipped, not the current one
                             * UNLESS the current order has already been shipped, in which case it should say autoshipped (if it was autoshipped)
                             */}
                            {intakeFetchData.orderData.autoshipped && (
                                <StatusPillV2 status={PillStatus.Autoshipped} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

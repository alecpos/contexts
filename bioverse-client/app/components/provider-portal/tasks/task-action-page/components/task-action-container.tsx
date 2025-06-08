'use client';

interface TaskActionComponentProps {
    taskId: string;
    userId: string;
    authorization: string | null;
}

export default function TaskActionComponent({
    taskId,
    userId,
    authorization,
}: TaskActionComponentProps) {
    // const [canProceed, setCanProceed] = useState<boolean>(false);
    // const [storedUserId, setStoredUserId] = useState<string>(userId);

    // useEffect(() => {
    //     setStoredUserId(userId);
    // }, [userId]);

    // const {
    //     data: intakeFetchData,
    //     isLoading: fetchLoading,
    //     error: fetchError,
    //     mutate: mutateIntakeData,
    // } = useSWR(`intake-view-${order_id}`, () => intakeViewDataFetch(order_id));

    // const { data, error, isLoading, mutate } = useSWR(
    //     `task-order-id-${taskId}`,
    //     () => getTaskOrderIdFromTaskId(taskId)
    // );

    // console.log(
    //     'data line 36 task action container: ',
    //     userId,
    //     taskId,
    //     authorization
    // );

    // if (!userId) {
    //     return <LoadingScreen />;
    // }
    return (
        <div className='max-h-screen flex flex-col items-center justify-center'>
            {/* <div>
                    <div className='flex mb-[32px] items-center justify-between p-4'>
                        <div className='flex w-full bg-[#FAFAFA] h-full items-center justify-between px-[16px]'>
                            <div className='w-[25%]'>
                                <Link
                                    href={'/'}
                                    style={{ fontSize: 24, color: '#286BA2' }}
                                >
                                    Patient Last, Patient First
                                </Link>
                            </div>
                            <div className='flex w-full flex-col items-start justify-between'>
                        
                                <p>order status pills</p>
                            </div>
                        </div>
                    </div>
                    <IntakeViewTaskContainer
                        providerId={storedUserId}
                        setCanProceed={setCanProceed}
                        order_id={data!}
                        authorization={authorization}
                    />
                </div> */}
        </div>
    );
}

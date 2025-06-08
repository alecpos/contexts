'use client';
import { BaseOrder } from '@/app/types/orders/order-types';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import ContinueButtonV3 from '../../intake-v3/buttons/ContinueButtonV3';
import { useState } from 'react';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface BMISummaryComponentProps {
    orderData: BaseOrder;
    currentBMI: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
    goalBMI: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
}

export default function BMISummaryComponent({
    orderData,
    currentBMI,
    goalBMI,
}: BMISummaryComponentProps) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const router = useRouter();

    const pushToNextRoute = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(
            fullPath,
            orderData.product_href,
            search,
            false,
            'none',
            '',
        );

        router.push(
            `/intake/prescriptions/${orderData.product_href}/${nextRoute}?${search}`,
        );
    };

    function calculateOffsetValue(
        lower_bound_bmi: number,
        higher_bound_bmi: number,
        lower_bound_perc: number,
        higher_bound_perc: number,
        bmi: number,
    ) {
        const percentage_in_section =
            (bmi - lower_bound_bmi) / (higher_bound_bmi - lower_bound_bmi);
        const offset_value =
            percentage_in_section * (higher_bound_perc - lower_bound_perc) +
            lower_bound_perc;
        return offset_value;
    }
    function calculateBMITranslatePercentage() {
        const bmi = currentBMI.bmi;

        if (bmi < 18.5) {
            return 'left-[4%]';
        } else if (bmi == 18.5) {
            return 'left-[8%]';
        } else if (bmi < 25) {
            const value = calculateOffsetValue(18.5, 25, 8, 37, bmi);
            return `${value}%`;
        } else if (bmi == 25) {
            return '37%';
        } else if (bmi < 30) {
            const value = calculateOffsetValue(25, 30, 37, 65, bmi);
            return `${value}%`;
        } else if (bmi == 30) {
            return '65%';
        } else if (bmi < 40) {
            const value = calculateOffsetValue(30, 40, 65, 93, bmi);
            return `${value}%`;
        } else if (bmi == 40) {
            return '93%';
        } else {
            return '96.5%';
        }
    }

    function goalBMIHeight() {
        const ratio = goalBMI.bmi / currentBMI.bmi;

        return 100 * ratio;
    }

    return (
        <>
            <div className="flex flex-col mt-12 items-start gap-12">
                <BioType className="inter-h5-question-header">
                    Medication may be a good option based on what you&apos;ve
                    shared. Here&apos;s why:
                </BioType>
                {/* First tile */}
                <div className="flex flex-col p-8 self-stretch gap-8 rounded-[32px] bg-[#374429]">
                    <div className="flex flex-col self-stretch">
                        <BioType className="text-[#FAFAFA] inter-h5-question-header">
                            Your BMI
                        </BioType>
                        <BioType className="text-[#C5ED82] text-[120px] inter-h5-question-header leading-[120px]">
                            {Number(currentBMI.bmi).toFixed(0)}
                        </BioType>
                        <div className="flex gap-3">
                            {/* Weight */}
                            <div className="flex py-1 px-[11px] justify-center items-center gap-[10px] bg-[#4E5940] rounded-[20px]">
                                <BioType className="intake-subtitle text-[#C5ED82]">
                                    {currentBMI.weight_lbs} LBS
                                </BioType>
                            </div>
                            {/* Height */}
                            <div className="flex py-1 px-[11px] justify-center items-center gap-[10px] bg-[#4E5940] rounded-[20px]">
                                <BioType className="intake-subtitle text-[#C5ED82]">
                                    {currentBMI.height_feet}’{' '}
                                    {currentBMI.height_inches}”
                                </BioType>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 self-stretch">
                        <div className="flex flex-col gap-10 self-stretch">
                            <div className="flex flex-col items-center gap-[10px] self-stretch relative">
                                <div className="flex flex-col">
                                    <BioType className="intake-v3-form-label text-[#C5ED82]">
                                        Current BMI
                                    </BioType>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="14"
                                        viewBox="0 0 20 14"
                                        fill="none"
                                        style={{
                                            left: calculateBMITranslatePercentage(),
                                        }}
                                        className={`absolute top-[30px] transform -translate-x-1/2`}
                                    >
                                        <path
                                            d="M10 0.92814L19.4567 0.928139L10 13.3848L0.543297 0.928139L10 0.92814Z"
                                            fill="#C5ED82"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex self-stretch">
                                <div className="flex w-[161px] h-[27px] py-[12px] px-[24px] justify-center items-center gap-[10px] rounded-[999px] bg-[#333333bf]"></div>
                                <div className="flex px-[24px] md:-ml-[52px] -ml-[155px] py-[12px] justify-center items-center gap-[10px] self-stretch rounded-[999px] flex-1 shrink-0 basis-0 bg-[#CCFBB6]">
                                    <BioType className="intake-v3-form-label text-black">
                                        Medication Zone
                                    </BioType>
                                </div>
                            </div>
                        </div>
                        <div className="flex px-[21px] justify-between items-center self-stretch">
                            <BioType className="intake-v3-disclaimer-text text-white">
                                18.5
                            </BioType>
                            <BioType className="intake-v3-disclaimer-text text-white">
                                25
                            </BioType>
                            <BioType className="intake-v3-disclaimer-text text-white">
                                30
                            </BioType>
                            <BioType className="intake-v3-disclaimer-text text-white">
                                40
                            </BioType>
                        </div>
                    </div>

                    <div className="flex flex-col p-6 justify-center gap-[10px] self-stretch rounded-[18px] bg-[#333333bf]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            viewBox="0 0 35 35"
                            fill="none"
                        >
                            <circle
                                cx="17.0537"
                                cy="17.4385"
                                r="17.0537"
                                fill="#C5ED82"
                            />
                        </svg>
                        <BioType className="intake-v3-form-label text-[#FAFAFA] mt-1">
                            This falls within the range where doctors may
                            prescribe medication to help you return to a healthy
                            weight.
                        </BioType>
                    </div>
                </div>
                {/* Second Tile */}
                <div className="flex flex-col p-8 items-start gap-8 self-stretch rounded-[32px] bg-[#CCFBB6]">
                    <div className="flex flex-col items-center gap-8 self-stretch">
                        <div className="flex flex-col self-stretch">
                            <BioType className="inter-h5-question-header text-[#374429]">
                                Your Goal
                            </BioType>
                            <div className="flex items-center gap-2">
                                <BioType className="text-[#374429] text-[120px] inter-h5-question-header leading-[120px]">
                                    {goalBMI.weight_lbs}
                                </BioType>
                                <BioType className="text-[#374429] text-[45px] inter-h5-question-header-bold leading-[45px]">
                                    lbs
                                </BioType>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex flex-col justify-center items-center gap-6">
                                <div className="flex h-[100px] px-[52px] py-[35px] justify-center items-end gap-[10px] rounded-[19px] bg-[#374429]">
                                    <BioType className="intake-v3-form-label text-[#E2EAD8]">
                                        {Number(currentBMI.bmi).toFixed(0)}
                                    </BioType>
                                </div>
                                <BioType className="intake-v3-form-label text-[#374429] text-center">
                                    Current BMI
                                </BioType>
                            </div>
                            <div className="flex flex-col justify-end items-center gap-6">
                                <div
                                    className="flex px-[52px] py-[35px] justify-center items-end gap-[10px] rounded-[19px] bg-[#AFDBA1]"
                                    style={{ height: `${goalBMIHeight()}px` }}
                                >
                                    <BioType className="intake-v3-form-label text-[#374429] text-center">
                                        {Number(goalBMI.bmi).toFixed(0)}
                                    </BioType>
                                </div>
                                <BioType className="intake-v3-form-label text-[#374429] text-center">
                                    Goal BMI
                                </BioType>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-[10px] self-stretch">
                            <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                Why does BMI matter?
                            </BioType>
                            <BioType className="intake-v3-form-label text-[#374429] md:text-[20px] md:leading-[28px]">
                                Your provider uses this data point to evaluate
                                your overall health as well as any health risks.
                            </BioType>
                        </div>
                    </div>
                    <div className="flex p-6 items-center gap-8 self-stretch rounded-[32px] bg-[#F5FEF0]">
                        <Image
                            src={'/img/intake/wl/female-doctor-circular.png'}
                            width={55}
                            height={55}
                            alt={'Female doctor headshot'}
                        />
                        <BioType className="intake-v3-form-label text-[#374429] md:text-[20px] md:leading-[28px]">
                            A licensed provider will review your full profile to
                            ensure you&apos;re getting a customized treatment
                            plan.
                        </BioType>
                    </div>
                </div>
                {/* Third and Fourth Tile */}
                <div className="flex flex-col items-start gap-6 self-stretch mb-16 md:mb-0">
                    <BioType className="inter-h5-question-header text-black">
                        How medication helps
                    </BioType>
                    <div className="flex flex-col items-start gap-4 self-stretch">
                        <div className="flex flex-col p-8 items-start gap-8 self-stretch rounded-[32px] bg-[#CCFBB6]">
                            <div className="flex flex-col items-center gap-8 self-stretch">
                                <div className="flex flex-col items-start gap-2 self-stretch">
                                    <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                        Past experience
                                    </BioType>
                                    <BioType className="intake-v3-form-label text-[#374429] text-[20px] leading-[28px]">
                                        If you&apos;ve tried it all and found
                                        that nothing has worked
                                    </BioType>
                                </div>
                                <BioType className="intake-v3-form-label text-[#374429] md:text-[16px] self-start">
                                    Medication can help because it:
                                </BioType>
                                <div className="flex p-6 flex-col justify-center items-start gap-8 self-stretch rounded-[32px] bg-[#F5FEF0]">
                                    <div className="flex items-center gap-8">
                                        <div className="w-[10px] h-[31px] bg-[#C5ED82] flex-shrink-0"></div>
                                        <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                            Makes you feel full quicker and
                                            longer
                                        </BioType>
                                    </div>
                                    <div className="flex items-center gap-8 ">
                                        <div className="w-[10px] h-[31px] bg-[#C5ED82] flex-shrink-0"></div>
                                        <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                            Don&apos;t involve restrictive diets
                                        </BioType>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="w-[10px] h-[31px] bg-[#C5ED82] flex-shrink-0"></div>
                                        <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                            Is trusted and developed by doctors
                                            experienced in weight loss
                                        </BioType>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-4 self-stretch">
                        <div className="flex flex-col p-8 items-start gap-8 self-stretch rounded-[32px] bg-[#CCFBB6]">
                            <div className="flex flex-col items-center gap-8 self-stretch">
                                <div className="flex flex-col items-start gap-2 self-stretch">
                                    <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                        Eating habits
                                    </BioType>
                                    <BioType className="intake-v3-form-label text-[#374429] text-[20px] leading-[28px]">
                                        If you think about food often
                                    </BioType>
                                </div>
                                <BioType className="intake-v3-form-label text-[#374429] md:text-[16px] self-start">
                                    Medication can help because it:
                                </BioType>
                                <div className="flex p-6 flex-col justify-center items-start gap-8 self-stretch rounded-[32px] bg-[#F5FEF0]">
                                    <div className="flex items-center gap-8">
                                        <div className="w-[10px] h-[31px] bg-[#C5ED82] flex-shrink-0"></div>
                                        <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                            May reduce cravings and overeating
                                        </BioType>
                                    </div>
                                    <div className="flex items-center gap-8 ">
                                        <div className="w-[10px] h-[31px] bg-[#C5ED82] flex-shrink-0"></div>
                                        <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                            Quiets impulsive thoughts triggered
                                            by the brain&apos;s appetite center
                                        </BioType>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="w-[10px] h-[31px] bg-[#C5ED82] flex-shrink-0"></div>
                                        <BioType className="intake-v3-form-label text-[#374429] md:text-[16px]">
                                            Allows you to focus on building a
                                            healthier relationship with food on
                                            your terms
                                        </BioType>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ContinueButtonV3
                    onClick={pushToNextRoute}
                    buttonLoading={buttonLoading}
                />
            </div>
        </>
    );
}

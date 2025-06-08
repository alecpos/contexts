import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import styles from './health-step.module.css';

interface Props {
    stepNumber: number;
    title: string;
    descriptions: string[];
    isWeightLoss: boolean;
    isMobile: boolean;
    isHighlighted: boolean;
    id: string;
}

export default function HealthStep({
    stepNumber,
    title,
    descriptions,
    isHighlighted,
    id,
}: Props) {
    return (
        <div className='flex space-x-[24px] h-auto' id={id}>
            <div
                className={`w-2 rounded-xl border-4 ${
                    isHighlighted ? 'bg-[#286BA2]' : 'bg-[#D9D9D9]'
                }`}
            ></div>
            <div className='flex flex-col py-2'>
                <BioType className='body1 md:body1bold'>
                    Step {stepNumber}
                </BioType>
                <BioType className='body1bold md:subtitle1'>{title}</BioType>
                {isHighlighted && (
                    <div className='max-w-lg'>
                        {descriptions.map((description, index) => (
                            <BioType
                                key={index}
                                className={`body1 md:label1 ${styles['slide-down']}`}
                            >
                                {description}
                            </BioType>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

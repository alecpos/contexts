import { useEffect, useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HealthStep from './components/HealthStep';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import styles from '../../../../../styles/pdp/prescription-pdp.module.css';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ScrollingMarqueeBar from './scrollingMarqueeBar';

interface Props {
    data: any;
    isMobile: boolean;
}

interface Step {
    stepNumber: number;
    title: string;
    descriptions: string[];
}

const WEIGHT_LOSS_PRODUCTS = ['ozempic', 'tirzepatide', 'mounjaro', 'wegovy'];
const SELMAGLUTIDES = ['ozempic', 'wegovy'];
const TIRZEPATIDES = ['tirzepatide', 'mounjaro'];

const WeightLossSelmaglutidesSteps: Step[] = [
    {
        stepNumber: 1,
        title: 'Complete online questionnaire',
        descriptions: [
            '• No office visits. 100% online',
            '• Available anywhere',
        ],
    },
    {
        stepNumber: 2,
        title: 'Provider reviews your request',
        descriptions: [
            'No insurance required',
            'Vetted, US-licensed providers for every treatment',
            'Faster provider reviews',
        ],
    },
    {
        stepNumber: 3,
        title: 'Receive your medications, if appropriate',
        descriptions: ['FREE at-home delivery', 'Discreet packaging'],
    },
    {
        stepNumber: 4,
        title: 'Lose 15% of your body weight',
        descriptions: [
            'This estimate derives from the New England Journal of Medicine’s data on patients treated with semaglutide once a week. Patients received a 2.5 mg dose and made lifestyle changes for 68 weeks.',
        ],
    },
];

const WeightLossTirzepatideSteps: Step[] = [
    {
        stepNumber: 1,
        title: 'Complete online questionnaire',
        descriptions: ['No office visits. 100% online', 'Available anywhere'],
    },
    {
        stepNumber: 2,
        title: 'Provider reviews your request',
        descriptions: [
            'No insurance required',
            'Vetted, US-licensed providers for every treatment',
            'Faster provider reviews',
        ],
    },
    {
        stepNumber: 3,
        title: 'Receive your medications, if appropriate',
        descriptions: ['FREE at-home delivery', 'Discreet packaging'],
    },
    {
        stepNumber: 4,
        title: 'Lose 20% of your body weight*',
        descriptions: [
            'This estimate derives from the New England Journal of Medicine’s data on patients treated with tirzepatide once a week. Patients received a 15 mg dose and made lifestyle changes for 68 weeks.',
        ],
    },
];

const NonWeightLossSteps: Step[] = [
    {
        stepNumber: 1,
        title: 'Complete online questionnaire',
        descriptions: [
            '• No office visits. 100% online',
            '• Available anywhere',
        ],
    },
    {
        stepNumber: 2,
        title: 'Provider reviews your request',
        descriptions: [
            '• No insurance required',
            '• Vetted, US-licensed providers for every treatment',
            '• Faster provider reviews',
        ],
    },
    {
        stepNumber: 3,
        title: 'Receive your medications, if appropriate',
        descriptions: ['• FREE at-home delivery', '• Discreet packaging'],
    },
    {
        stepNumber: 4,
        title: 'Stay healthier with science-backed care',
        descriptions: [
            '• Science-backed treatments and personalized support for optimal health span',
        ],
    },
];

export default function HealthcareSteps({ data, isMobile }: Props) {
    const isWeightLossProduct = data.filter_metadata.some(
        (item: any) => item === 'weight-loss'
    );

    const [healthSteps, setHealthSteps] = useState<Step[]>([]);

    const [highlightedStep, setHighlightedStep] = useState<number | null>(null);
    useEffect(() => {
        const handleScroll = () => {
            let closest = null;
            let closestDistance = Infinity;

            healthSteps.forEach((step, index) => {
                const element = document.getElementById(`health-step-${index}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const distance = Math.abs(
                        window.innerHeight / 2 - (rect.top + rect.bottom) / 2
                    );
                    if (distance < closestDistance) {
                        closest = index;
                        closestDistance = distance;
                    }
                }
            });

            setHighlightedStep(closest);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [healthSteps]);

    useEffect(() => {
        if (isWeightLossProduct) {
            if (SELMAGLUTIDES.includes(data.href)) {
                setHealthSteps(WeightLossSelmaglutidesSteps);
            } else {
                setHealthSteps(WeightLossTirzepatideSteps);
            }
        } else {
            setHealthSteps(NonWeightLossSteps);
        }
    }, [data.href, isWeightLossProduct]);

    return (
        <div className='w-full max-w-[100vw]'>
            <div className='bg-[#F9F8FF] z-10 rounded-md mt-8 self-center p-2 text-center w-full mb-8 hidden md:flex'>
                <ScrollingMarqueeBar isMobile={false} type='health-steps' />
            </div>

            <div className='flex md:justify-between gap-6'>
                <div className='flex flex-col'>
                    <div className='hidden md:flex'>
                        <BioType
                            className='h6 md:h4 !text-[#286BA2] mb-2'
                            id='scientific-research-header'
                        >
                            How to Get {data.name} Online
                        </BioType>
                    </div>

                    <div className='max-w-[100vw] flex md:hidden'>
                        <div className='flex items-start mt-8 '>
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                width='100%'
                                height='auto'
                            >
                                {data.filter_metadata.includes(
                                    'weight-loss'
                                ) ? (
                                    <source src='/Weight_Loss_Video_Mobile.mp4' /> //yes weight loss
                                ) : (
                                    <source src='/bioversepdpvideo.mp4' /> //non weight-loss
                                )}{' '}
                            </video>
                        </div>
                    </div>

                    <div className='mt-8 flex-col gap-[1.67vw] mx-5 md:mx-0 flex md:hidden'>
                        <BioType
                            className='h6 md:h4 text-[#286BA2]'
                            id='scientific-research-header'
                        >
                            <BioType className={`${styles.pdpheaderMobile}`}>
                                How to Get {data.name} Online
                            </BioType>
                        </BioType>
                        <div className='flex md:flex-1 h-[1px] md:self-center w-[92vw]'>
                            <HorizontalDivider
                                backgroundColor={'#B1B1B1'}
                                height={1}
                            />
                        </div>
                    </div>

                    <div className='mt-6 sm:mt-0 space-y-6 flex-1 mx-5 md:mx-0'>
                        {healthSteps.map((item, index) => (
                            <HealthStep
                                stepNumber={item.stepNumber}
                                title={item.title}
                                descriptions={item.descriptions}
                                isWeightLoss={isWeightLossProduct}
                                isMobile={isMobile}
                                isHighlighted={
                                    highlightedStep !== null &&
                                    index <= highlightedStep
                                } // Update this line
                                key={index}
                                id={`health-step-${index}`}
                            />
                        ))}
                    </div>
                    <div className='flex md:hidden'>
                        <ScrollingMarqueeBar
                            isMobile={true}
                            type='health-steps'
                        />
                    </div>
                </div>

                <div className='hidden md:flex'>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        width='100%'
                        height='815'
                    >
                        {data.filter_metadata.includes('weight-loss') ? (
                            <source src='/Weight_Loss_Video_Mobile.mp4' />
                        ) : (
                            <source src='/bioversepdpvideo.mp4' />
                        )}
                    </video>
                </div>
            </div>
        </div>
    );
}

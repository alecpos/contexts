import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import FaqMenu from './faq-interactible/faq-menu';
import styles from '../../../styles/pdp/prescription-pdp.module.css';

interface Props {
    questions: QuestionAnswer[];
}

export interface QuestionAnswer {
    question: string;
    answer: string;
}

export default function FrequentlyAskedQuestions({ questions }: Props) {
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='flex flex-col w-full'>
                <BioType className='h6 md:h4 !text-[#286BA2]'>
                    <span className={`${styles.pdpheaderMobile}`}>
                        Frequently Asked Questions
                    </span>
                </BioType>
            </div>
            <div className='flex w-full flex-grow'>
                <FaqMenu questions={questions} />
            </div>
        </div>
    );
}

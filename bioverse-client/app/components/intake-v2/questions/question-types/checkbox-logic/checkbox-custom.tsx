import { SetStateAction } from 'react';
import CheckboxBloodWorkCustom from './custom-checkboxes/custom-bloodwork-upload';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    formInformation: string[];
    checkedBoxes: string[];
    setCheckedBoxes: (value: SetStateAction<string[]>) => void;
}

export default function CheckboxCustom({
    question,
    setFormInformation,
    setResponse,
    setAnswered,
    formInformation,
    checkedBoxes,
    setCheckedBoxes,
}: Props) {
    switch (question?.logicDetails.customName) {
        case 'bloodwork-upload':
            return (
                <>
                    <CheckboxBloodWorkCustom
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        checkedBoxes={checkedBoxes}
                        setCheckedBoxes={setCheckedBoxes}
                    />
                </>
            );

        default:
            return <>unhandled.</>;
    }
}

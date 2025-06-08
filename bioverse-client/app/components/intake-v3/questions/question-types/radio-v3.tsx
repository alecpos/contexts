import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    options: string[];
    formInformation: string[];
    radio_options: string[];
    // arrowBack: JSX.Element;
    // continueButton: () => React.ReactElement;
}

export default function RadioQuestionV3({
    question,
    options,
    radio_options,
    formInformation,
    // continueButton,
    // arrowBack,
    setFormInformation,
    setResponse,
    setAnswered,
}: Props) {
    const [values, setValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const initialValues = options.reduce<Record<string, string>>(
            (acc, field, index) => {
                const value =
                    radio_options.length > index ? radio_options[index] : '';
                acc[field] = value;
                return acc;
            },
            {},
        );

        setValues(initialValues);
        setFormInformation(options);
        setAnswered(options.every((option) => option !== ''));
    }, [options, radio_options, setFormInformation, setAnswered]);

    const handleChange =
        (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const updatedValues = { ...values, [field]: event.target.value };
            setValues(updatedValues);

            // Convert the updated values into the desired string format
            const responseString = Object.entries(updatedValues)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            setResponse(responseString);

            // Convert the updated values into the format expected by setFormInformation
            const formInformation = options.map(
                (field) => updatedValues[field] || '',
            );
            setFormInformation(formInformation);

            // Check if all questions have been answered
            setAnswered(formInformation.every((value) => value !== ''));
        };

    return (
        <div className="flex flex-col items-center justify-center w-full gap-[2.5vw] p-0">
            {/* {arrowBack} */}
            <div className="flex flex-col justify-center items-center bg-[#F7F9FE] gap-[16px] rounded-md border p-4">
                <BioType className="inter-h5-regular">{question.question}</BioType>
                <div className="w-full">
                    {/* Header labels in a grid with an invisible spacer */}
                    <div className="flex w-full mb-4">
                        <div className="w-1/3"></div> {/* Invisible spacer */}
                        <div className="grid grid-cols-5 w-2/3">
                            {radio_options.map((label) => (
                                <div
                                    key={label}
                                    className="text-center overflow-hidden"
                                >
                                    <span className="text-xs whitespace-nowrap overflow-ellipsis">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fields and radio buttons */}
                    {options.map((field) => (
                        <div
                            key={field}
                            className="flex items-center mb-4 w-full"
                        >
                            {/* Field name */}
                            <div className="w-1/3 text-right pr-4">{field}</div>
                            {/* Radio buttons in a grid */}
                            <RadioGroup
                                row
                                aria-label={field}
                                name={field}
                                value={values[field]}
                                onChange={handleChange(field)}
                                style={{
                                    width: '66.666667%', // Equivalent to w-2/3
                                    display: 'grid', // Set display to grid
                                    gridTemplateColumns: 'repeat(5, 1fr)', // Equivalent to grid-cols-5
                                }}
                            >
                                {radio_options.map((option) => (
                                    <FormControlLabel
                                        key={`${field}-${option}`}
                                        value={option.toLowerCase()}
                                        control={<Radio />}
                                        label="" // No label
                                        className="justify-center"
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </div>
                {/* {continueButton()} */}
            </div>
        </div>
    );
}

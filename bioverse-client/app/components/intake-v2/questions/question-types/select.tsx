import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    FormControl,
    Select,
    OutlinedInput,
    MenuItem,
    SelectChangeEvent,
    useMediaQuery,
} from '@mui/material';

interface Props {
    // arrowBack: JSX.Element;
    continueButton: () => React.ReactElement;
    question: any;
    response: string;
    handleSelectResponseChange: (event: SelectChangeEvent<string>) => void;
    MenuProps: {
        PaperProps: {
            style: {
                maxHeight: number;
                width: number;
            };
        };
    };
}

function evaluateStringLength(str: string) {
    if (str.length <= 50) {
        return 'body1';
    } else if (str.length > 50 && str.length <= 58) {
        return 'body2';
    } else {
        return 'body3';
    }
}

export default function SelectQuestion({
    // arrowBack,
    question,
    response,
    handleSelectResponseChange,
    MenuProps,
    continueButton,
}: Props) {
    const isNotMobile = useMediaQuery('(min-width:640px)');

    return (
        <div className='flex flex-col items-center justify-center w-full md:w-[51.5vw] gap-[2.5vw] p-0'>
            {/* {arrowBack} */}

            <div className='flex flex-col justify-center items-center bg-[#F7F9FE] gap-[16px] rounded-md border p-4'>
                <BioType className='hquestion'>{question.question}</BioType>

                <div className='w-full'>
                    <FormControl className='w-full'>
                        <Select
                            value={response}
                            onChange={handleSelectResponseChange}
                            input={
                                <OutlinedInput
                                    classes={{ input: 'truncate' }}
                                />
                            }
                            MenuProps={MenuProps}
                            inputProps={{ 'aria-label': 'Without label' }}
                            displayEmpty
                            className='truncate'
                            renderValue={(selectedValue) =>
                                selectedValue ? (
                                    <BioType className='body1 truncate pr-8'>
                                        {selectedValue}
                                    </BioType> // Adjust padding or margin as needed
                                ) : (
                                    <BioType className='bodyanswer text-gray-500'>
                                        {question.placeholder}
                                    </BioType>
                                )
                            }
                        >
                            {question.options.map((option: string) => (
                                <MenuItem key={option} value={option}>
                                    <BioType
                                        className={
                                            !isNotMobile
                                                ? evaluateStringLength(option)
                                                : 'body1'
                                        }
                                    >
                                        {option}
                                    </BioType>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                {continueButton()}
            </div>
        </div>
    );
}

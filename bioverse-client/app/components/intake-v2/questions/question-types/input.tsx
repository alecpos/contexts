import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    FormControl,
    InputAdornment,
    TextField,
    useMediaQuery,
} from '@mui/material';
import ContinueButton from '../../buttons/ContinueButton';
import {
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    QUESTION_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';

interface Props {
    question: any;
    formInformation: string[];
    handleInputResponseChange: (index: number, value: string) => void;
    isButtonLoading: boolean;
    handleContinueButton: any;
    isCheckup: boolean;
}

export default function InputQuestion({
    question,
    formInformation,
    handleInputResponseChange,
    isButtonLoading,
    handleContinueButton,
    isCheckup,
}: Props) {
    const isNotMobile = useMediaQuery('(min-width:640px)');
    const DESKTOP_ROWS = 4;
    const MOBILE_ROWS = 2;
    const numRows = isNotMobile ? DESKTOP_ROWS : MOBILE_ROWS;

    return (
        <div className='w-full flex flex-col h-full'>
            <div className='flex flex-col items-center justify-center w-full'>
                <div className='flex flex-col w-full gap-[16px] rounded-md border'>
                    <BioType className={`${QUESTION_HEADER_TAILWIND}`}>
                        {question.question}
                    </BioType>
                    {question.subtitle && (
                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            {question.subtitle}
                        </BioType>
                    )}
                    <div className='flex justify-center items-center flex-row gap-[12px]'>
                        <FormControl variant='outlined' fullWidth>
                            <div className='w-full'>
                                <div className='flex flex-col md:flex-row gap-4 w-full'>
                                    {question &&
                                        Array.from(
                                            { length: question.fieldCount },
                                            (_, index) => (
                                                <TextField
                                                    key={index}
                                                    fullWidth
                                                    value={
                                                        formInformation[
                                                            index
                                                        ] || ''
                                                    }
                                                    minRows={
                                                        question.multiline ===
                                                        true
                                                            ? numRows
                                                            : 1
                                                    }
                                                    multiline={
                                                        question.multiline ===
                                                        true
                                                    }
                                                    placeholder={
                                                        Array.isArray(
                                                            question.placeholder
                                                        )
                                                            ? question
                                                                  .placeholder[
                                                                  index
                                                              ]
                                                            : question.placeholder
                                                    }
                                                    sx={{
                                                        color: 'black',
                                                    }}
                                                    onChange={(e) =>
                                                        handleInputResponseChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    inputProps={{
                                                        style: {
                                                            textAlign: 'start',
                                                            color: 'black',
                                                            fontSize: '1.1em',
                                                            minHeight: '42px',
                                                        },
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='start'>
                                                                {question.label
                                                                    ? question
                                                                          .label[
                                                                          index
                                                                      ]
                                                                    : ''}
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )
                                        )}
                                </div>
                            </div>
                        </FormControl>
                    </div>
                </div>
            </div>
            {formInformation[0] && formInformation[0].trim().length > 0 && (
                <div className='mt-16 md:mt-4'>
                    <ContinueButton
                        onClick={handleContinueButton}
                        buttonLoading={isButtonLoading}
                    />
                </div>
            )}
        </div>
    );
}

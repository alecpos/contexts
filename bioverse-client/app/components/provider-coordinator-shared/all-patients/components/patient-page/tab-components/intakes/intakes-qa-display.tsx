import Divider from '@mui/material/Divider/Divider';
import InfoBox from './info-box';
import InfoBoxWithOption from './option-info-box';

interface Props {
    list: any;
    version: string;
}

const IntakeQAList = ({ list, version }: Props) => {
    if (version === 'old') {
        return list && list.length > 0
            ? list.map((e: any, i: number) => (
                  <div key={i}>
                      <Divider sx={{ margin: '1.25em 0' }} />
                      <div className="grid grid-cols-2 gap-[4vw]">
                          <InfoBox label="Question" data={e.question} />
                          <InfoBox label="Answer" data={e.answer} />
                      </div>
                  </div>
              ))
            : null;
    }

    return list && list.length > 0 ? (
        list.map((e: any, i: number) => (
            <div key={i}>
                <Divider sx={{ margin: '1.25em 0' }} />
                <div className="grid grid-cols-2 gap-[4vw]">
                    <InfoBoxWithOption
                        label="Question"
                        data={
                            e.question.steps
                                ? e.question.steps[0].question
                                : e.question.question
                        }
                        options={
                            e.question.steps
                                ? e.question.steps[0].options
                                : e.question.options
                        }
                    />
                    <InfoBox
                        label="Answer"
                        data={
                            e.answer
                                ? e.answer.answer
                                : 'There was no answer specified'
                        }
                    />
                </div>
            </div>
        ))
    ) : (
        <div className="mt-5 italic">
            This patient has not yet completed this intake questionnaire.
        </div>
    );
};

export default IntakeQAList;

import { Typography } from '@mui/material';
import SuggestionCard from './suggestion-card/suggestion-card';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';

import { SuggestionCardData } from './suggestion-card/suggestion-card';

interface Props {
    suggestionCardList: SuggestionCardData[];
}

export default function OptimizedSuggestions({ suggestionCardList }: Props) {
    return (
        <>
            <div className='flex p-0 flex-col items-center justify-center gap-[1.67vw]'>
                <div className='w-full flex items-center gap-[1.67vw] justify-start'>
                    <Typography className='h4'>Optimize Further</Typography>
                    <HorizontalDivider backgroundColor={'gray'} height={1} />
                </div>

                <div className='flex flex-row justify-between gap-[1.67vw]'>
                    {suggestionCardList.map(
                        (item: SuggestionCardData, index: number) => (
                            <div key={index}>
                                <SuggestionCard
                                    imageRef={item.imageRef}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    description={item.description}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

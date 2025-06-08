import { TRANSITION_SCREEN_NAMES } from '@/app/components/intake-v2/constants/constants';

export const isTransitionScreen = (question: any) => {
    if (question && question.custom_name) {
        return TRANSITION_SCREEN_NAMES.includes(question.custom_name);
    }
    return false;
};

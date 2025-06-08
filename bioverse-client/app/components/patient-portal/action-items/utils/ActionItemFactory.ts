import { ActionType } from '@/app/types/action-items/action-items-types';
import { PRODUCTS_WITH_ONE_HYPHEN } from '../constants/constants';

class ActionItemFactory {
    product_href: string;
    type: string;
    iteration: number;
    fullname: string;

    constructor(action_item_type: string) {
        const splitted = action_item_type.split('-');

        this.iteration = parseInt(splitted.at(-1) || '0');

        switch (action_item_type) {
            case ActionType.DosageSelection:
                this.type = ActionType.DosageSelection;
                break;
            case ActionType.IDVerification:
                this.type = ActionType.IDVerification;
                break;
            default:
                this.type = splitted.at(-2) || 'checkup';
        }

        this.product_href = splitted.slice(0, -2).join('-');
        this.fullname = action_item_type;
    }

    getProductHref(): string {
        return this.product_href;
    }

    getType(): string {
        return this.type;
    }

    getIteration(): number {
        return this.iteration;
    }

    getFullName(): string {
        return this.fullname;
    }
}

export default ActionItemFactory;

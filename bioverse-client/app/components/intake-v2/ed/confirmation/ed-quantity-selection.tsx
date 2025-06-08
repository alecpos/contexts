'use client';

import ConfirmApprovalAndScriptDialog from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-script-dialog';
import { useState } from 'react';
import ConfirmationCard from '../components/confirmation-card';
import { QUANTITY_SELECTION_MAP } from '../utils/ed-selection-index';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

type ConfirmationOption = {
    quantity: number;
    cost: string;
    mostPopular: boolean;
};

interface ConfirmationOptionsListProps {
    productHref: string;
    dosage: string | undefined;
    setQuantitySelection: (quantity: number) => void;
    selectedQuantity: number | undefined;
}

export default function QuantityConfirmationList({
    productHref,
    dosage,
    setQuantitySelection,
    selectedQuantity,
}: ConfirmationOptionsListProps) {
    if (!dosage) {
        return <>Error</>;
    }

    const options: ConfirmationOption[] =
        QUANTITY_SELECTION_MAP[productHref][dosage];

    return (
        <ul className="space-y-4">
            {options.length > 1 && (
                <BioType className="it-h1 md:itd-h1">Most popular</BioType>
            )}
            {options.map((option, idx) => {
                if (!option.mostPopular) {
                    return null;
                }
                return (
                    <li key={idx} className="list-none">
                        <ConfirmationCard
                            price={option.cost}
                            quantity={option.quantity}
                            isSelected={option.quantity === selectedQuantity}
                            onSelect={() =>
                                setQuantitySelection(option.quantity)
                            }
                        />
                    </li>
                );
            })}
            {options.length > 1 && (
                <BioType className="it-h1 md:itd-h1">Other options</BioType>
            )}
            {options.map((option, idx) => {
                if (option.mostPopular) {
                    return null;
                }
                return (
                    <li key={idx} className="list-none">
                        <ConfirmationCard
                            price={option.cost}
                            quantity={option.quantity}
                            isSelected={option.quantity === selectedQuantity}
                            onSelect={() =>
                                setQuantitySelection(option.quantity)
                            }
                        />
                    </li>
                );
            })}
        </ul>
    );
}

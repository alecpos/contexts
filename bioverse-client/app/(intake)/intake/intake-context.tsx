'use client';
import {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react';

export interface IntakeContextType {
    question_form?: any[];
    order_id?: string;
    variant_index?: number;
    subscription_cadence?: string;
    fetched_step?: number | null;
    client_step?: number | null;
    session_id?: string;
    product_href?: string;
    product_name?: string;
    discountable?: boolean;
    profile_data?: any;
    product_price_data?: any;
    product_information_data?: any;
    product_nanme?: string;
    is_weight_loss?: boolean;
    state_of_residence?: string;
    // Add a method for setting the intake data
    setIntake?: Dispatch<SetStateAction<IntakeContextType>>;
}

export const IntakeContext = createContext<IntakeContextType>({});

interface IntakeContextProviderProps {
    children: ReactNode;
}

export default function IntakeContextProvider({
    children,
}: IntakeContextProviderProps) {
    const [intake, setIntake] = useState<IntakeContextType>({});

    return (
        <IntakeContext.Provider value={{ ...intake, setIntake }}>
            {children}
        </IntakeContext.Provider>
    );
}

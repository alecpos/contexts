'use client';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import axios from 'axios';
import {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
} from 'react';
import { createSetupIntentServerCustomer } from '../services/stripe/setupIntent';

interface UpdatePMResponse {
    success: boolean;
    digits?: string;
}

interface StripeContextType {
    stripe: Stripe | null;
    createSetupIntentForCustomer: (customerId: string) => Promise<any>;
    updateCustomerDefaultPaymentMethod: (
        customerId: string,
    ) => Promise<UpdatePMResponse>;
    updateSubscriptionPaymentMethod: (
        customerId: string,
        subscriptionId: string,
    ) => Promise<UpdatePMResponse>;
    simulateWebhookEvent?: (eventType: string, data: any) => Promise<void>;
}

const StripeContext = createContext<StripeContextType | null>(null);

const getStripeConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isSandbox = process.env.STRIPE_ENVIRONMENT === 'sandbox';
    
    return {
        publishableKey: isProduction 
            ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
            : isSandbox 
                ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_SANDBOX
                : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
        apiVersion: '2023-10-16' as const,
    };
};

const isSandboxKey = (key: string) => {
    return key?.includes('_sandbox_');
};

export const StripeProvider = ({ children }: PropsWithChildren) => {
    const [stripe, setStripe] = useState<Stripe | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const config = getStripeConfig();
                const stripeInstance = await loadStripe(
                    config.publishableKey || '',
                    { apiVersion: config.apiVersion }
                );
                
                if (!stripeInstance) {
                    throw new Error('Stripe failed to load - check your publishable key');
                }
                
                setStripe(stripeInstance);
                
                // Log successful initialization in non-production
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Stripe initialized successfully in', 
                        process.env.STRIPE_ENVIRONMENT || 'test', 'mode');
                }
            } catch (err) {
                console.error('Failed to initialize Stripe', {
                    error: err,
                    environment: process.env.NODE_ENV,
                    stripeEnv: process.env.STRIPE_ENVIRONMENT,
                });
            }
        };
        init();
    }, []);

    const createSetupIntentForCustomer = async (customerId: string) => {
        try {
            return await createSetupIntentServerCustomer(customerId);
        } catch (err) {
            console.error('Failed to create setup intent', {
                error: err,
                customerId,
                environment: process.env.NODE_ENV,
            });
            throw err;
        }
    };

    const updateCustomerDefaultPaymentMethod = async (customerId: string) => {
        try {
            const response = await axios.post<UpdatePMResponse>(
                '/api/stripe/payment-method/default',
                { stripeCustomerId: customerId },
            );
            return response.data;
        } catch (err) {
            console.error('Failed to update default payment method', {
                error: err,
                customerId,
                environment: process.env.NODE_ENV,
            });
            throw err;
        }
    };

    const updateSubscriptionPaymentMethod = async (
        customerId: string,
        subscriptionId: string,
    ) => {
        try {
            const response = await axios.post<UpdatePMResponse>(
                '/api/stripe/payment-method/subscription',
                {
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subscriptionId,
                },
            );
            return response.data;
        } catch (err) {
            console.error('Failed to update subscription payment method', {
                error: err,
                customerId,
                subscriptionId,
                environment: process.env.NODE_ENV,
            });
            throw err;
        }
    };

    const simulateWebhookEvent = async (eventType: string, data: any): Promise<void> => {
        if (process.env.NODE_ENV === 'production') {
            console.warn('Webhook simulation not available in production');
            return;
        }
        
        try {
            await axios.post('/api/stripe/webhook/simulate', {
                type: eventType,
                data,
            });
        } catch (err) {
            console.error('Failed to simulate webhook event', {
                error: err,
                eventType,
                environment: process.env.NODE_ENV,
            });
            throw err;
        }
    };

    return (
        <StripeContext.Provider
            value={{
                stripe,
                createSetupIntentForCustomer,
                updateCustomerDefaultPaymentMethod,
                updateSubscriptionPaymentMethod,
                simulateWebhookEvent: process.env.NODE_ENV !== 'production' ? simulateWebhookEvent : undefined,
            }}
        >
            {children}
        </StripeContext.Provider>
    );
};

export const useStripeContext = () => {
    const context = useContext(StripeContext);
    if (!context) {
        throw new Error('useStripeContext must be used within StripeProvider');
    }
    return context;
};

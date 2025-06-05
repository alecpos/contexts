import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { StripeProvider, useStripeContext } from '../StripeProvider';
import { createSetupIntentServerCustomer } from '../../services/stripe/setupIntent';

// Mock all external dependencies
jest.mock('@stripe/stripe-js');
jest.mock('axios');
jest.mock('../../services/stripe/setupIntent');

const mockedLoadStripe = loadStripe as jest.MockedFunction<typeof loadStripe>;
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCreateSetupIntent = createSetupIntentServerCustomer as jest.Mock;

// Mock environment variables
const originalEnv = process.env;
beforeAll(() => {
    process.env = {
        ...originalEnv,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST: 'pk_test_123',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_SANDBOX: 'pk_test_sandbox_123',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE: 'pk_live_123',
    };
});

afterAll(() => {
    process.env = originalEnv;
});

describe('StripeProvider', () => {
    const mockStripeInstance = {
        elements: jest.fn(),
        confirmPayment: jest.fn(),
    };

// Add this to your test setup
beforeEach(() => {
    jest.clearAllMocks();
    
    // Suppress console.log in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock Stripe loading
    mockedLoadStripe.mockResolvedValue(mockStripeInstance as any);
    
    // Mock API responses
    mockedAxios.post.mockResolvedValue({
        data: { success: true, digits: '4242' },
    });
    
    mockedCreateSetupIntent.mockResolvedValue({ id: 'setup' });
});

afterEach(() => {
    // Restore console.log
    (console.log as jest.Mock).mockRestore();
});


    const waitForStripeInit = async () => {
        await act(async () => {
            // Wait for the next tick to allow useEffect to complete
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    };
    
    // Then use it in your tests:
    it('exposes createSetupIntentForCustomer', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <StripeProvider>{children}</StripeProvider>
        );
        const { result } = renderHook(() => useStripeContext(), { wrapper });
    
        // Wait for Stripe to initialize
        await waitForStripeInit();
    
        let res: any;
        await act(async () => {
            res = await result.current.createSetupIntentForCustomer('cus_123');
        });
    
        expect(mockedCreateSetupIntent).toHaveBeenCalledWith('cus_123');
        expect(res).toEqual({ id: 'setup' });
    });
    
    it('updates customer default payment method', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <StripeProvider>{children}</StripeProvider>
        );
        const { result } = renderHook(() => useStripeContext(), { wrapper });

        let res: any;
        await act(async () => {
            res = await result.current.updateCustomerDefaultPaymentMethod('cus_1');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/api/stripe/payment-method/default',
            { stripeCustomerId: 'cus_1' },
        );
        expect(res).toEqual({ success: true, digits: '4242' });
    });

    it('updates subscription payment method', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <StripeProvider>{children}</StripeProvider>
        );
        const { result } = renderHook(() => useStripeContext(), { wrapper });

        let res: any;
        await act(async () => {
            res = await result.current.updateSubscriptionPaymentMethod('cus_1', 'sub_1');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/api/stripe/payment-method/subscription',
            {
                stripeCustomerId: 'cus_1',
                stripeSubscriptionId: 'sub_1',
            }
        );
        expect(res).toEqual({ success: true, digits: '4242' });
    });

    describe('Environment Configuration', () => {
        it('uses test key in test environment', async () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <StripeProvider>{children}</StripeProvider>
            );
            renderHook(() => useStripeContext(), { wrapper });

            expect(mockedLoadStripe).toHaveBeenCalledWith(
                'pk_test_123',
                expect.any(Object)
            );
        });

        it('uses sandbox key in sandbox environment', async () => {
            const originalStripeEnv = process.env.STRIPE_ENVIRONMENT;
            process.env.STRIPE_ENVIRONMENT = 'sandbox';
            
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <StripeProvider>{children}</StripeProvider>
            );
            renderHook(() => useStripeContext(), { wrapper });

            expect(mockedLoadStripe).toHaveBeenCalledWith(
                'pk_test_sandbox_123',
                expect.any(Object)
            );

            process.env.STRIPE_ENVIRONMENT = originalStripeEnv;
        });
    });

    describe('Webhook Simulation', () => {
        it('simulates webhook events in non-production environment', async () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <StripeProvider>{children}</StripeProvider>
            );
            const { result } = renderHook(() => useStripeContext(), { wrapper });
        
            const eventData = {
                type: 'payment_intent.succeeded',
                data: {
                    id: 'pi_123',
                },
            };
        
            await act(async () => {
                await result.current.simulateWebhookEvent?.('payment_intent.succeeded', {
                    id: 'pi_123',
                });
            });
        
            // Fix the expected call structure
            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/stripe/webhook/simulate',
                eventData  // This should match what your implementation actually sends
            );
        });
        it('handles webhook simulation errors', async () => {
            const error = new Error('webhook simulation failed');
            mockedAxios.post.mockRejectedValueOnce(error);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <StripeProvider>{children}</StripeProvider>
            );
            const { result } = renderHook(() => useStripeContext(), { wrapper });

            await expect(
                result.current.simulateWebhookEvent?.('payment_intent.succeeded', {})
            ).rejects.toThrow('webhook simulation failed');

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to simulate webhook event',
                expect.objectContaining({
                    error,
                    eventType: 'payment_intent.succeeded',
                    environment: 'test'
                })
            );
            
            consoleSpy.mockRestore();
        });
    });
});

it('handles loadStripe failure gracefully', async () => {
    const error = new Error('stripe load fail');
    mockedLoadStripe.mockRejectedValueOnce(error);
    const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StripeProvider>{children}</StripeProvider>
    );
    const { result } = renderHook(() => useStripeContext(), { wrapper });

    await act(async () => {
        await Promise.resolve();
    });

    // Update this to match your new error logging format
    expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to initialize Stripe',
        {
            error: error,
            environment: 'test',
            stripeEnv: undefined,
        }
    );
    expect(result.current.stripe).toBeNull();
    consoleSpy.mockRestore();
});

it('throws when createSetupIntentForCustomer fails', async () => {
    const error = new Error('setup fail');
    mockedCreateSetupIntent.mockRejectedValueOnce(error);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StripeProvider>{children}</StripeProvider>
    );
    const { result } = renderHook(() => useStripeContext(), { wrapper });

    await expect(
        result.current.createSetupIntentForCustomer('cus_fail'),
    ).rejects.toThrow('setup fail');
});

it('throws when updating customer default payment method fails', async () => {
    const error = new Error('api fail');
    mockedAxios.post.mockRejectedValueOnce(error);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StripeProvider>{children}</StripeProvider>
    );
    const { result } = renderHook(() => useStripeContext(), { wrapper });

    await expect(
        result.current.updateCustomerDefaultPaymentMethod('cus_1'),
    ).rejects.toThrow('api fail');
});

it('throws when updating subscription payment method fails', async () => {
    const error = new Error('sub api fail');
    mockedAxios.post.mockRejectedValueOnce(error);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StripeProvider>{children}</StripeProvider>
    );
    const { result } = renderHook(() => useStripeContext(), { wrapper });

    await expect(
        result.current.updateSubscriptionPaymentMethod('cus_1', 'sub_1'),
    ).rejects.toThrow('sub api fail');
});

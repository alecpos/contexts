import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { createClient } from '@supabase/supabase-js';
import { SupabaseProvider, useSupabaseContext } from '../SupabaseProvider';

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            auth: {
                signInWithPassword: jest.fn(),
                signOut: jest.fn(),
            },
        })),
    };
});

const mockedCreateClient = createClient as jest.Mock;

const originalEnv = process.env;
beforeAll(() => {
    process.env = {
        ...originalEnv,
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon_key',
    };
});

afterAll(() => {
    process.env = originalEnv;
});

describe('SupabaseProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SupabaseProvider>{children}</SupabaseProvider>
    );

    it('initializes Supabase client with env vars', () => {
        const { result } = renderHook(() => useSupabaseContext(), { wrapper });
        expect(mockedCreateClient).toHaveBeenCalledWith(
            'https://example.supabase.co',
            'anon_key',
        );
        expect(result.current.supabase).toBeDefined();
    });

    it('exposes signIn and signOut methods', async () => {
        const { result } = renderHook(() => useSupabaseContext(), { wrapper });
        const client = mockedCreateClient.mock.results[0].value;

        await act(async () => {
            await result.current.signIn({ email: 'a@b.c', password: 'p' });
            await result.current.signOut();
        });

        expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'a@b.c',
            password: 'p',
        });
        expect(client.auth.signOut).toHaveBeenCalled();
    });

    it('logs errors when signIn fails', async () => {
        const error = new Error('login failed');
        const client = mockedCreateClient.mock.results[0].value;
        client.auth.signInWithPassword.mockRejectedValueOnce(error);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { result } = renderHook(() => useSupabaseContext(), { wrapper });
        await expect(
            result.current.signIn({ email: 'e@x.com', password: 'p' }),
        ).rejects.toThrow('login failed');

        expect(consoleSpy).toHaveBeenCalledWith('Failed to sign in', { error });
        consoleSpy.mockRestore();
    });

    it('logs errors when signOut fails', async () => {
        const error = new Error('logout failed');
        const client = mockedCreateClient.mock.results[0].value;
        client.auth.signOut.mockRejectedValueOnce(error);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { result } = renderHook(() => useSupabaseContext(), { wrapper });
        await expect(result.current.signOut()).rejects.toThrow('logout failed');

        expect(consoleSpy).toHaveBeenCalledWith('Failed to sign out', { error });
        consoleSpy.mockRestore();
    });

    it('handles createClient failure gracefully', () => {
        const err = new Error('init fail');
        mockedCreateClient.mockImplementationOnce(() => {
            throw err;
        });
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useSupabaseContext(), { wrapper })).not.toThrow();
        expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize Supabase', { error: err });

        consoleSpy.mockRestore();
    });
});

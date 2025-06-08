'use server';

import { createAIGenerationAudit } from '@/app/utils/database/controller/ai_generation_audit/ai_generation_audit_api';
import { getURL } from '@/app/utils/functions/utils';

export async function getAIInitialResponse(
    initialMessageArray: string[],
    providerId: string,
    employee_type: string
) {
    try {
        const api_site_url = await getURL();

        const response = await fetch(`${api_site_url}/api/openapi/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                type: 'initial-message',
                payload_content: initialMessageArray,
                employee_type: employee_type,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('OpenAI response:', data);

        await createAIGenerationAudit(
            providerId,
            initialMessageArray,
            'initial_generation',
            data
        );

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getRetryResponse(
    initialMessageArray: string[],
    previousResponse: string,
    providerId: string,
    employee_type: string
) {
    try {
        const messageArrayWithPreviousResponse = [
            ...initialMessageArray,
            `assistant: ${previousResponse}`,
        ];

        const api_site_url = await getURL();

        const response = await fetch(`${api_site_url}/api/openapi/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${process.env.BV_API_KEY}`, // Make sure this env variable is accessible on client
            },
            body: JSON.stringify({
                type: 'retry',
                payload_content: messageArrayWithPreviousResponse,
                employee_type: employee_type,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('OpenAI response:', data);

        await createAIGenerationAudit(
            providerId,
            initialMessageArray,
            'retry_generation',
            data,
            { previousResponse: previousResponse }
        );

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getRecreateResponse(
    initialMessageArray: string[],
    type: string,
    providerId: string,
    employee_type: string,
    customSpecification?: string
) {
    try {
        const messageArrayWithPreviousResponse = [...initialMessageArray];

        const api_site_url = await getURL();

        const response = await fetch(
            `${api_site_url}/api/openapi/message`,
            // `http://localhost:3000/api/openapi/message`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${process.env.BV_API_KEY}`, // Make sure this env variable is accessible on client
                },
                body: JSON.stringify({
                    type: type,
                    payload_content: messageArrayWithPreviousResponse,
                    employee_type: employee_type,
                    ...(customSpecification
                        ? { custom_text: customSpecification }
                        : {}),
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('OpenAI response:', data);

        await createAIGenerationAudit(
            providerId,
            initialMessageArray,
            'recreate_generation',
            data,
            {
                type: type,
                customSpecification: customSpecification,
            }
        );

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

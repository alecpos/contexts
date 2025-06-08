'use server';

import { NextRequest } from 'next/server';
import {
    COORDINATOR_SUPPORT_SYSTEM_MESSAGES,
    CUSTOM_DRAFT_SYSTEM_MESSAGES,
    DETAILED_DRAFT_SYSTEM_MESSAGES,
    EMPATHETIC_DRAFT_SYSTEM_MESSAGES,
    INITIAL_DRAFT_SYSTEM_MESSAGES,
    OpenAIMessageRecord,
    RETRY_DRAFT_SYSTEM_MESSAGES,
    SIMPLIFY_DRAFT_SYSTEM_MESSAGES,
} from './system-message-specifications';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return Response.json(
            { message: 'Authorization header missing' },
            { status: 401 }
        );
    }

    // Verify the token is in the Bearer format
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return Response.json(
            { message: 'Invalid Authorization Format' },
            { status: 401 }
        );
    }

    const key = process.env.BV_API_KEY;

    if (token !== key) {
        return Response.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { payload_content, type, custom_text, employee_type } =
        await req.json();

    console.log('3#################', employee_type);

    if (!payload_content) {
        return Response.json(
            { message: 'Payload content is required' },
            { status: 400 }
        );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    const data_values = createDataValuesFromType(
        type,
        payload_content,
        employee_type,
        custom_text
    );

    // console.log(
    //     '==========================================',
    //     'type: ',
    //     type,
    //     'values: ',
    //     data_values
    // );

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(data_values),
        });

        if (!response.ok) {
            console.log('request made got error back.');

            const error = await response.json();

            console.log('error logging: ', error);
            return Response.json(
                { message: 'OpenAI API error', error },
                { status: response.status }
            );
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

function createDataValuesFromType(
    type: string,
    content: string[],
    employee_type: string,
    customText?: string
) {
    /**
     * Switch to differentiate different data payloads sent to Open AI specialized & specified by type.
     */
    switch (type) {
        /**
         * Used for the initial generation of a drafted response for the provider.
         */
        case 'initial-message':
            const initial_user_role_messages: OpenAIMessageRecord[] =
                content.map((message) => ({
                    role: 'user',
                    content: message,
                }));

            const initialMessageData = {
                model: 'gpt-4o-mini',
                messages: [
                    ...INITIAL_DRAFT_SYSTEM_MESSAGES,
                    ...(employee_type === 'coordinator'
                        ? COORDINATOR_SUPPORT_SYSTEM_MESSAGES
                        : []),
                    ...initial_user_role_messages,
                ],
                temperature: 0.7,
            };
            return initialMessageData;

        case 'retry':
            const retry_user_role_messages: OpenAIMessageRecord[] = content.map(
                (message) => ({
                    role: 'user',
                    content: message,
                })
            );

            const retryMessageData = {
                model: 'gpt-4o-mini',
                messages: [
                    ...RETRY_DRAFT_SYSTEM_MESSAGES,
                    ...(employee_type === 'coordinator'
                        ? COORDINATOR_SUPPORT_SYSTEM_MESSAGES
                        : []),
                    ...retry_user_role_messages,
                ],
                temperature: 0.7,
            };
            return retryMessageData;

        case 'empathetic':
            const empathetic_user_role_messages: OpenAIMessageRecord[] =
                content.map((message) => ({
                    role: 'user',
                    content: message,
                }));

            const empatheticMessageData = {
                model: 'gpt-4o-mini',
                messages: [
                    ...EMPATHETIC_DRAFT_SYSTEM_MESSAGES,
                    ...(employee_type === 'coordinator'
                        ? COORDINATOR_SUPPORT_SYSTEM_MESSAGES
                        : []),
                    ...empathetic_user_role_messages,
                ],
                temperature: 0.7,
            };
            return empatheticMessageData;
        case 'detailed':
            const detailed_user_role_messages: OpenAIMessageRecord[] =
                content.map((message) => ({
                    role: 'user',
                    content: message,
                }));

            const detailedMessageData = {
                model: 'gpt-4o-mini',
                messages: [
                    ...DETAILED_DRAFT_SYSTEM_MESSAGES,
                    ...(employee_type === 'coordinator'
                        ? COORDINATOR_SUPPORT_SYSTEM_MESSAGES
                        : []),
                    ...detailed_user_role_messages,
                ],
                temperature: 0.7,
            };
            return detailedMessageData;

        case 'simplify':
            const simplify_user_role_messages: OpenAIMessageRecord[] =
                content.map((message) => ({
                    role: 'user',
                    content: message,
                }));

            const simplifyMessageData = {
                model: 'gpt-4o-mini',
                messages: [
                    ...SIMPLIFY_DRAFT_SYSTEM_MESSAGES,
                    ...(employee_type === 'coordinator'
                        ? COORDINATOR_SUPPORT_SYSTEM_MESSAGES
                        : []),
                    ...simplify_user_role_messages,
                ],
                temperature: 0.7,
            };
            return simplifyMessageData;

        case 'custom':
            const custom_user_role_messages: OpenAIMessageRecord[] =
                content.map((message) => ({
                    role: 'user',
                    content: message,
                }));

            const customMessageData = {
                model: 'gpt-4o-mini',
                messages: [
                    ...CUSTOM_DRAFT_SYSTEM_MESSAGES,
                    ...(employee_type === 'coordinator'
                        ? COORDINATOR_SUPPORT_SYSTEM_MESSAGES
                        : []),
                    {
                        role: 'system',
                        content:
                            'When generating the response, please take this input into serious consideration when generating the draft message such that it fulfills the following requirement: ' +
                            customText,
                    },
                    ...custom_user_role_messages,
                ],
                temperature: 0.7,
            };

            return customMessageData;

        default:
            return null;
    }
}

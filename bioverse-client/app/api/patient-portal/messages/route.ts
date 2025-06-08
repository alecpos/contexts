import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { NextRequest, NextResponse } from 'next/server';
import { generateChatLogHtml } from './_pdf-generation/generateChatLogHtml';
import jsPDF from 'jspdf';
import { ChatMessageLogEntry } from '@/app/types/messages/messages-types';

export async function POST(req: NextRequest) {
    const jsonData = await req.json();

    try {
        const supabase = createSupabaseServerComponentClient();

        // Fetch all thread ids for the user

        const { data, error } = await supabase
            .from('thread_members')
            .select('thread_id')
            .eq('user_id', jsonData.userId);

        if (!data || error) {
            console.log('/api/patient-portal/messages/route.ts');
            console.error(error, error.message);
        }
        const thread_ids = data?.map((thread) => thread.thread_id);

        // Fetch all messages for each thread for the user

        const { data: chatLogs, error: chatError } = await supabase.rpc(
            'get_chat_logs_for_thread_ids',
            { _thread_ids: thread_ids },
        );

        if (chatError) {
            return new NextResponse(
                JSON.stringify({ error: chatError.message }),
                {
                    status: 500, // Internal Server Error
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        const doc = new jsPDF();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        const pageMargins = { top: 20, bottom: 20, left: 20, right: 20 };
        let yPosition = pageMargins.top - 10;

        doc.setFontSize(12);
        var seenThreads: any = {};

        chatLogs.forEach((chat: ChatMessageLogEntry) => {
            var remainingSpace = pageHeight - yPosition - pageMargins.bottom;
            if (remainingSpace <= 10) {
                doc.addPage();
                yPosition = pageMargins.top; // Reset Y position for new page
            }
            if (!seenThreads[chat.thread_id]) {
                yPosition += 10;
                doc.setFontSize(20);
                doc.setFont('times', 'bold');
                doc.text(
                    `Chat #${chat.thread_id} - ${new Date(
                        chat.created_at,
                    ).toDateString()}`,
                    10,
                    yPosition,
                );
                yPosition += 14;
                seenThreads[chat.thread_id] = true;
            }
            doc.setFontSize(12);
            doc.setFont('times', 'normal');
            doc.text(
                `${chat.first_name} ${chat.last_name}: ${chat.content}`,
                10,
                yPosition,
            );
            yPosition += 10;
        });

        const pdfBytes = doc.output('arraybuffer');

        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=chat_logs.pdf`,
            },
        });
    } catch (error) {
        // Log the error and return an internal server error response
        console.error('An error occurred while generating the PDF:', error);
        return new NextResponse(
            JSON.stringify({
                error: 'Internal server error: Failed to generate the PDF.',
            }),
            {
                status: 500, // Internal Server Error
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}

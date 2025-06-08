import { ChatMessageLogEntry } from '@/app/types/messages/messages-types';

export function generateChatLogHtml(chatLogs: ChatMessageLogEntry[]) {
    let htmlContent = `<style>
  body {
    font-family: Arial, sans-serif; /* Choose your preferred font */
  }
  h3 {
    line-height:  0.8; /* Adjust this value as needed */
  }
  p {
    line-height:  0.7; /* Adjust this value as needed */
  }
</style>`;

    var seenThreads: any = {};

    chatLogs.forEach((chat) => {
        console.log(chat.thread_id);
        if (!seenThreads[chat.thread_id]) {
            htmlContent += `<h3>Chat #${chat.thread_id} - ${new Date(
                chat.created_at,
            ).toDateString()}</h3>`;

            seenThreads[chat.thread_id] = true;
        }
        htmlContent += `<p>${chat.first_name} ${chat.last_name}: ${chat.content}</p>`;
    });
    console.log(seenThreads);

    return htmlContent;
}

"use client"
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

function Chat() {
    useEffect(() => {
		createChat({
			webhookUrl: "https://youthful-shtern-h74t6oqro.liara.run/webhook/dcd11304-978b-4e82-9ea8-c61581fc53ef/chat",
            defaultLanguage: 'en',
	initialMessages: [
		'سلام! 👋',
		'من میرزا چت هستم. چطور میتونم کمکتون کنم؟'
	],
    i18n: {
		en: {
			title: 'سلام! 👋',
			subtitle: "شروع چت کنید. ما همیشه برای کمک به شما 24/7 هستیم.",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'سوال خود را اینجا بنویسید..',
			closeButtonTooltip: 'بستن چت'
		}
		}
		});
	}, []);
  return (
    <div>Chat</div>
  )
}

export default Chat
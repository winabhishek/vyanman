import { Message } from '../types';

// Mock delay function to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to detect language (very basic implementation)
const detectLanguage = (text: string): 'en' | 'hi' => {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
};

export const chatAPI = {
  // Get all messages for the current user
  getMessages: async (): Promise<Message[]> => {
    await delay(200);
    const storedMessages = localStorage.getItem('vyanamana-messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  },

  // Send a message and get a response
  sendMessage: async (content: string, language: string = 'en'): Promise<Message> => {
    const storedMessages = await chatAPI.getMessages();

    const messagesForModel = [
      {
        role: "system",
        content: `You are Vyānamana, an empathetic mental health companion. The following is a conversation between you and a user. Offer emotional support and avoid repeating the same lines.
        User: ${content}
        Vyānamana:`,
      },
      ...storedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: "user", content }
    ];

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 58396d7e93e515f76511c55eef999119c0aaa75cd41d721c62eadbcc7f4b3c1d",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  model: "meta-llama/Llama-3-8b-chat-hf",
  messages: [
    {
      role: "system",
      content: "You are Vyānamana, an empathetic mental health companion. Respond supportively and help the user feel heard. Avoid repeating replies."
    },
    {
      role: "user",
      content: content
    }
  ],
  max_tokens: 200,
  temperature: 0.7
}),

    });

    const data = await response.json();
    console.log("Together API Response:", data);

    const const botReply =
  data.choices?.[0]?.message?.content?.trim() ||
  data.choices?.[0]?.text?.trim() ||
  "I'm here for you.";

    const userMessage: Message = {
      id: `user-msg-${Date.now()}`,
      content: content,
      sender: 'user',
      timestamp: new Date(),
      sentiment: { score: 3, label: 'neutral' }
    };

    const botMessage: Message = {
      id: `bot-msg-${Date.now() + 1}`,
      content: botReply,
      sender: 'bot',
      timestamp: new Date(Date.now() + 1000)
    };

    const updatedMessages = [...storedMessages, userMessage, botMessage];
    localStorage.setItem('vyanamana-messages', JSON.stringify(updatedMessages));

    return botMessage;
  }
};


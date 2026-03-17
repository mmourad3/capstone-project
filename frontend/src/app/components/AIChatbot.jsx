import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

/**
 * AI Chatbot Component for UniMate
 * 
 * CURRENT STATE: Using mock responses for demonstration
 * 
 * TO INTEGRATE REAL AI (OpenAI, Anthropic, etc.):
 * 
 * 1. Install the AI SDK:
 *    npm install openai
 * 
 * 2. Create a backend API endpoint (in your Express server):
 *    POST /api/chat
 *    - Receives: { message: string, conversationHistory: array }
 *    - Returns: { response: string }
 * 
 * 3. Replace the generateBotResponse function with an API call:
 *    const response = await fetch('http://localhost:5000/api/chat', {
 *      method: 'POST',
 *      headers: { 'Content-Type': 'application/json' },
 *      body: JSON.stringify({
 *        message: inputMessage,
 *        conversationHistory: messages
 *      })
 *    });
 *    const data = await response.json();
 *    return data.response;
 * 
 * 4. Backend example (Express + OpenAI):
 *    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 *    
 *    app.post('/api/chat', async (req, res) => {
 *      const { message, conversationHistory } = req.body;
 *      const completion = await openai.chat.completions.create({
 *        model: "gpt-4",
 *        messages: [
 *          { role: "system", content: "You are UniMate AI, helping students find roommates and carpools..." },
 *          ...conversationHistory.map(msg => ({
 *            role: msg.sender === 'user' ? 'user' : 'assistant',
 *            content: msg.text
 *          })),
 *          { role: "user", content: message }
 *        ]
 *      });
 *      res.json({ response: completion.choices[0].message.content });
 *    });
 */

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm UniMate AI. I can help you find roommates, carpools, or answer questions about the platform. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle mobile keyboard appearing - scroll input into view
  const handleInputFocus = () => {
    // Small delay to let the keyboard appear first
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Mock AI responses - Replace with actual AI API call
  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('roommate') || input.includes('dorm')) {
      return "I can help you find the perfect roommate! You can browse available dorm listings, filter by preferences like budget and location, and our AI compatibility system will match you with students who share similar lifestyles. Would you like me to guide you through the process?";
    } else if (input.includes('carpool') || input.includes('ride')) {
      return "Looking for a carpool? You can create your own carpool or join existing ones. Just specify your route, timing preferences, and connect with fellow students heading the same way. Need help getting started?";
    } else if (input.includes('how') || input.includes('help')) {
      return "I'm here to help! You can ask me about:\n• Finding roommates and dorm listings\n• Creating or joining carpools\n• Using the compatibility matching system\n• Managing your profile and preferences\n\nWhat would you like to know more about?";
    } else if (input.includes('profile') || input.includes('account')) {
      return "You can manage your profile from the Profile page. Update your personal information, lifestyle preferences, and contact details. This helps our AI match you with compatible roommates!";
    } else if (input.includes('contact') || input.includes('whatsapp')) {
      return "All student communication on UniMate happens through WhatsApp integration. When you find a potential roommate or carpool match, you can connect with them directly via WhatsApp.";
    } else if (input.includes('compatibility') || input.includes('match')) {
      return "Our AI compatibility system analyzes your lifestyle questionnaire responses including sleep schedule, cleanliness habits, noise preferences, and more. It calculates compatibility scores to help you find the best roommate matches!";
    } else {
      return "That's a great question! I'm here to help you navigate UniMate. You can ask me about finding roommates, carpools, using the platform features, or anything else related to student housing and ride sharing.";
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group cursor-pointer"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-h-[75vh] sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-full">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold">UniMate AI</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-slate-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'bot'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 max-w-[85%] sm:max-w-[75%] break-words ${ 
                    message.sender === 'bot'
                      ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-sm'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-b-2xl">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                ref={inputRef}
                onFocus={handleInputFocus}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-500 text-white p-2 sm:p-2.5 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
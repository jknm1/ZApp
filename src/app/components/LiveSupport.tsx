import { useState } from "react";
import { X, Send, MessageCircle, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function LiveSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; isBot: boolean; id: number }[]
  >([
    {
      id: 1,
      text: "Hello! Welcome to Zynx Capital Support. How can we help you today?",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    "Funding Application Status",
    "Withdrawal Process",
    "Account Requirements",
    "Speak to Agent",
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Special handling for "Speak to Agent" - open email client
    if (message === "Speak to Agent") {
      window.location.href =
        "mailto:hello@zynxcorp.com?subject=Support Request - Live Agent&body=Hello, I would like to speak with a support agent regarding:";
      return;
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("funding") || lowerMessage.includes("application")) {
        botResponse =
          "Applications are typically reviewed within 72 hours. You can check your status in the dashboard. Would you like to speak with an agent for more details?";
      } else if (lowerMessage.includes("withdrawal") || lowerMessage.includes("withdraw")) {
        botResponse =
          "Withdrawals are processed within 1-3 business days. You can initiate a withdrawal from your Wallet page. Need help with the process?";
      } else if (lowerMessage.includes("account") || lowerMessage.includes("requirement")) {
        botResponse =
          "We offer funded accounts starting at $50,000. All funding is 100% free for qualified traders. Would you like more information?";
      } else if (lowerMessage.includes("agent") || lowerMessage.includes("human")) {
        botResponse =
          "Connecting you to a live agent... An agent will be with you shortly. Average wait time: 2-3 minutes.";
      } else {
        botResponse =
          "Thank you for your message. A support agent will assist you shortly. You can also email us at hello@zynxcorp.com for detailed inquiries.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: botResponse,
          isBot: true,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-full shadow-2xl shadow-pink-500/50 flex items-center justify-center text-white hover:shadow-pink-500/70 transition-shadow"
          >
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-950 animate-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Live Support</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    <p className="text-pink-100 text-xs">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 ${
                    message.isBot ? "" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isBot
                        ? "bg-pink-500/20"
                        : "bg-slate-700"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-pink-400" />
                    ) : (
                      <User className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      message.isBot
                        ? "bg-slate-800 text-slate-200"
                        : "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length <= 3 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-slate-400 mb-2">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleSendMessage(reply)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="p-4 border-t border-slate-800"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
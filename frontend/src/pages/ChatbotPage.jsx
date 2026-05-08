import { useState } from "react";
import api from "../services/api";
import "./ChatbotPage.css";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey there 👋\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");

    try {
      setLoading(true);

      const response = await api.post("/chat", {
        message: currentInput,
      });

      const botReply = {
        sender: "bot",
        text: response.data.reply,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong while contacting the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className={`chatbot-widget ${isOpen ? "open" : "closed"}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <img
              src="/chat-bot.png"
              alt="Bot"
              className="chatbot-logo"
            />

            <div>
              <h3>Chatbot</h3>
              <span>Supply Chain Assistant</span>
            </div>
          </div>

          <button
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "⌄" : "⌃"}
          </button>
        </div>

        {isOpen && (
          <>
            <div className="chatbot-body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-row ${
                    msg.sender === "user"
                      ? "user-row"
                      : "bot-row"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <img
                      src="/chat-bot.png"
                      alt="Bot"
                      className="message-avatar"
                    />
                  )}

                  <div
                    className={`message-bubble ${
                      msg.sender === "user"
                        ? "user-bubble"
                        : "bot-bubble"
                    }`}
                  >
                    <pre>{msg.text}</pre>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row bot-row">
                  <img
                    src="/chat-bot.png"
                    alt="Bot"
                    className="message-avatar"
                  />

                  <div className="message-bubble bot-bubble">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            <div className="chatbot-footer">
              <input
                type="text"
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
              />

              <button onClick={sendMessage}>➤</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import "../styles/Chatbot.css";
import chatbotImage from "../images/chatbot.png";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const startChat = () => {
    setChatStarted(true);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat((prevChat) => [...prevChat, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://192.168.0.106:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          prompt: message,
          stream: true,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        chunk.split("\n").forEach((line) => {
          if (line.trim()) {
            try {
              const jsonChunk = JSON.parse(line);
              fullResponse += jsonChunk.response;
            } catch (error) {
              console.error("Error parsing JSON chunk:", error);
            }
          }
        });
      }

      fullResponse = fullResponse.replace(/<think>.*?<\/think>/gs, "").trim();

      setChat((prevChat) => [...prevChat, { sender: "bot", text: fullResponse || "I couldn't process that. Try asking in a different way!" }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChat((prevChat) => [...prevChat, { sender: "bot", text: "Error processing request!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!chatStarted ? (
        <div className="welcome-screen">
          <img src={chatbotImage} alt="Chatbot" className="chatbot-image" />
          <h2>Welcome to<br /> <span className="name">AI-Copilot 👋</span></h2>
          <p>Start chatting with AI-Copilot now.<br /> You can ask anything.</p>
          <button onClick={startChat} className="start-chat-button">Start Chat</button>
        </div>
      ) : (
        <>
          <div className="chatbot-header">AI-Copilot</div>
          <div className="chatbox">
            {chat.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot">Thinking...</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
            />
            <IconButton onClick={sendMessage} color="primary" className="send-button">
              <SendIcon />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;

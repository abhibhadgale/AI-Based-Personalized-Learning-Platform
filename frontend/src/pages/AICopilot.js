import React, { useState } from "react";
import "../styles/AICopilot.css";
import { IconButton } from "@mui/material";
import { CloudUpload, Mic, Send } from "@mui/icons-material";

const AICopilot = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleHeight = () => {
    setExpanded(!expanded);
  };

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "This is a bot response", sender: "bot" }]);
      }, 1000);
    }
  };

  return (
    <div className="ai-copilot-container">
      <div className="content">
        <div className={`chat-section ${expanded ? "expanded" : ""}`} onClick={toggleHeight}>
          <p className="chat-text">What do you want to learn today?</p>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>{msg.text}</div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <div className="chat-icons">
              <IconButton>
                <CloudUpload />
              </IconButton>
              <IconButton>
                <Mic />
              </IconButton>
              <IconButton onClick={sendMessage}>
                <Send />
              </IconButton>
            </div>
          </div>
        </div>
        <div className={`recommendation-section ${expanded ? "collapsed" : ""}`}>Recommendations</div>
      </div>
      <div className="sidebar">AI Copilot Sidebar</div>
    </div>
  );
};

export default AICopilot;

import React, { useState, useEffect } from "react";
import "../styles/Chatbot.css";
import chatbotImage from "../images/chatbot.png";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { saveMessage, getChatHistory, clearChatHistory } from "../utils/api";

const Chatbot = ({ subjectId }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data } = await getChatHistory(subjectId);
        setChat(data || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setChat([]);
      }
    };
    fetchChatHistory();
  }, [subjectId]);
  
  const startChat = () => {
    setChatStarted(true);
  };

  const processResponse = (text) => {
    // Remove any <think> tags and their content
    let processedText = text.replace(/<think>.*?<\/think>/gs, "").trim();
    
    // Handle code blocks specifically (deepseek-r1 might format them differently)
    processedText = processedText.replace(/```(\w*)([\s\S]*?)```/g, (match, lang, code) => {
      return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
    });
    
    // Ensure proper line breaks for markdown
    processedText = processedText.replace(/\n/g, "  \n");
    
    return processedText;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const userMessage = { sender: "user", text: message, subjectId: subjectId };
    setChat((prevChat) => [...prevChat, userMessage]);
    setMessage("");
    setLoading(true);
  
    try {
      await saveMessage(userMessage);
  
      const response = await fetch("http://localhost:11434/api/generate", {
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
      let botMessageIndex = chat.length + 1; // Track the index for the bot message
  
      // Create a placeholder bot message immediately
      setChat(prevChat => [...prevChat, { sender: "bot", text: "", subjectId: subjectId }]);
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
  
        chunk.split("\n").forEach((line) => {
          if (line.trim()) {
            try {
              const jsonChunk = JSON.parse(line);
              fullResponse += jsonChunk.response;
              
              // Update the chat in real-time as chunks arrive
              setChat(prevChat => {
                const newChat = [...prevChat];
                newChat[botMessageIndex] = { 
                  sender: "bot", 
                  text: processResponse(fullResponse), 
                  subjectId: subjectId 
                };
                return newChat;
              });
            } catch (error) {
              console.error("Error parsing JSON chunk:", error);
            }
          }
        });
      }
  
      const finalResponse = processResponse(fullResponse);
      const botMessage = { 
        sender: "bot", 
        text: finalResponse || "I couldn't process that. Try asking in a different way!", 
        subjectId: subjectId 
      };
  
      await saveMessage(botMessage);
      
      // Final update to ensure all chunks are processed
      setChat(prevChat => {
        const newChat = [...prevChat];
        newChat[botMessageIndex] = botMessage;
        return newChat;
      });
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChat(prevChat => [...prevChat, { sender: "bot", text: "Error processing request!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChatHistory(subjectId);
      setChat([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
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
          <div className="chatbot-header">
            AI-Copilot
            <IconButton onClick={handleClearChat} className="clear-chat-button" title="Clear Chat">
              <ClearAllIcon />
            </IconButton>
          </div>
          
          <div className="chatbox">
            {chat.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "bot" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="code-block">
                            <div className="language-tag">{match[1]}</div>
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </div>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {loading && chat[chat.length - 1]?.sender !== "bot" && (
              <div className="message bot">Thinking...</div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
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
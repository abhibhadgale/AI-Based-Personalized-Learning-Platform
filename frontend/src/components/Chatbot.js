import React, { useState, useEffect } from "react";
import "../styles/Chatbot.css";
import chatbotImage from "../images/chatbot.png";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person'; // NEW ICON
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { saveMessage, getChatHistory, clearChatHistory } from "../utils/api";
import axios from 'axios'; // ADDED FOR STUDENT DATA FETCH


const Chatbot = ({ subjectId, studentId }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [subjectHierarchy, setSubjectHierarchy] = useState(null);
  const [useSyllabusContext, setUseSyllabusContext] = useState(false);
  const [useStudentContext, setUseStudentContext] = useState(false); // NEW STATE
  const [studentData, setStudentData] = useState(null); // NEW STATE

  console.log("Fetching student data for:", studentId);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data } = await getChatHistory(subjectId);
        setChat(data?.messages || []);
        setSubjectHierarchy(data?.subjectHierarchy || null);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setChat([]);
      }
    };
    fetchChatHistory();
  // NEW: Fetch student data when component mounts
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`/api/student/data?studentId=${studentId}`);
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    
    if (studentId) fetchStudentData();
  }, [subjectId, studentId]); // ADD studentId dependency


  

  const formatSubjectHierarchy = (hierarchy) => {
    if (!hierarchy) return "";
    
    let structure = `Subject: ${hierarchy.subject}\n`;
    
    hierarchy.units.forEach((unit) => {
      structure += `\nUnit ${unit.unitNumber}: ${unit.unitName}\n`;
      
      unit.topics.forEach((topic) => {
        structure += `  Topic: ${topic.topicName}\n`;
        
        topic.subtopics.forEach((subtopic) => {
          structure += `    Subtopic: ${subtopic.subtopicName}\n`;
        });
      });
    });
    
    return structure;
  };

  const startChat = () => {
    setChatStarted(true);
  };

  const processResponse = (text) => {
    let processedText = text.replace(/<think>.*?<\/think>/gs, "").trim();
    processedText = processedText.replace(/```(\w*)([\s\S]*?)```/g, (match, lang, code) => {
      return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
    });
    processedText = processedText.replace(/\n/g, "  \n");
    return processedText;
  };

  const createPrompt = (newMessage, chatHistory, includeSyllabus, includeStudent) => {
    const MAX_HISTORY = 10;
    const history = chatHistory.slice(-MAX_HISTORY);
    
    let context = "";
    
    if (includeSyllabus && subjectHierarchy) {
      context += `Subject Structure:\n${formatSubjectHierarchy(subjectHierarchy)}\n\n`;
    }

    
    
    context += history.map(msg => 
      `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
    ).join('\n');
    
    return `${context}\nUser: ${newMessage}\nAssistant:`;
  };

  // NEW: Format student data for prompt
  const formatStudentData = (data) => {
    let str = `Name: ${data.student.name}\n`;
    
    // Behavior data
    if (data.behaviour) {
      str += "\nBehavior:\n";
      const pre = data.behaviour.preLearning;
      str += `- Learning Styles: ${pre.preferredLearningStyles.join(', ') || 'None'}\n`;
      str += `- Productivity Times: ${pre.productivityTime.join(', ') || 'None'}\n`;
    }
    
    // Progress data
    if (data.progress && data.progress.progress.length > 0) {
      str += "\nRecent Progress:\n";
      data.progress.progress.slice(-3).forEach((p, i) => {
        str += `${i+1}. Unit: ${p.unitId}, Subtopic: ${p.subtopicId} (${new Date(p.startTime).toLocaleDateString()})\n`;
      });
    }
    
    // Quiz results
    if (data.quizResults && data.quizResults.length > 0) {
      str += "\nQuiz Results:\n";
      data.quizResults.slice(-3).forEach((quiz, i) => {
        str += `${i+1}. Score: ${quiz.score}/${quiz.totalQuestions} (${(quiz.score/quiz.totalQuestions*100).toFixed(1)}%)\n`;
      });
    }
    
    return str;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const userMessage = { sender: "user", text: message, subjectId: subjectId };
    setChat((prevChat) => [...prevChat, userMessage]);
    setMessage("");
    setLoading(true);
  
    try {
      await saveMessage(userMessage);
  
      // UPDATED: Include student context
      const fullPrompt = createPrompt(
        message, 
        chat, 
        useSyllabusContext,
        useStudentContext
      );
      setUseSyllabusContext(false); // Reset after use
      setUseStudentContext(false); // Reset after use


      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          prompt: fullPrompt,
          stream: true,
          options: { num_ctx: 4096 }
        }),
      });

      // ... rest of the streaming code remains the same ...
      if (!response.body) throw new Error("No response body");
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let botMessageIndex = chat.length + 1;

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

      setChat(prevChat => {
        const newChat = [...prevChat];
        newChat[botMessageIndex] = botMessage;
        return newChat;
      });
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChat(prevChat => [...prevChat, { 
        sender: "bot", 
        text: "Error processing student data request!" 
      }]);
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

  const toggleSyllabusContext = () => {
    setUseSyllabusContext(!useSyllabusContext);
  };

  // NEW: Toggle student context
  const toggleStudentContext = () => {
    if (!studentData) {
      setChat(prevChat => [...prevChat, {
        sender: "bot",
        text: "Student data not available. Please try again later."
      }]);
      return;
    }
    setUseStudentContext(!useStudentContext);
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
            <div className="header-buttons">
              
              <IconButton onClick={handleClearChat} className="clear-chat-button" title="Clear Chat">
                <ClearAllIcon />
              </IconButton>
            </div>
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
          <div className="context-options">
              <button 
                onClick={toggleSyllabusContext} 
                className={`syllabus-context-button ${useSyllabusContext ? 'active' : ''}`}
              >
                <MenuBookIcon fontSize="small" />
              </button>
              <button 
                onClick={toggleStudentContext} 
                className={`student-context-button ${useStudentContext ? 'active' : ''}`}
              >
                <PersonIcon fontSize="small" />
              </button>
              {(useSyllabusContext || useStudentContext) && (
              <span className="context-notice">
                {useSyllabusContext && "Syllabus "}
                {useSyllabusContext && useStudentContext && "and "}
                {useStudentContext && "Student Info "}
                will be referenced in this message
              </span>
            )}

            </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
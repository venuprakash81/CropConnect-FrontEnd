import React, { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Sparkles, Trash2 } from "lucide-react";
import "./CropConnectAI.css";

const AI_API = "http://localhost:8000";

function CropConnectAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text:
        "Hello! 👋 I am CropConnect AI. I can help you understand crops, farmers, buyers, bookings, transport, warehouses, payments, and other CropConnect features."
    }
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = async () => {
    const question = message.trim();

    if (!question || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: question
    };

    setMessages((previous) => [
      ...previous,
      userMessage
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${AI_API}/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: question
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          `AI server returned ${response.status}`
        );
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          data.answer ||
          "Sorry, I could not generate an answer.",
        sources: data.sources || []
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage
      ]);

    } catch (error) {

      console.error(
        "CropConnect AI error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            "I couldn't connect to CropConnect AI. Please make sure the Python AI server is running on http://localhost:8000."
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // =========================================================
  // QUICK QUESTIONS
  // =========================================================

  const quickQuestions = [
    "What is CropConnect?",
    "What can a farmer do?",
    "How does crop booking work?",
    "How does transport booking work?"
  ];

  const askQuickQuestion = (question) => {

    if (loading) {
      return;
    }

    setMessage(question);

    setTimeout(() => {
      sendMessageDirect(question);
    }, 50);
  };

  // =========================================================
  // DIRECT MESSAGE
  // =========================================================

  const sendMessageDirect = async (question) => {

    if (!question.trim() || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        role: "user",
        text: question
      }
    ]);

    setMessage("");
    setLoading(true);

    try {

      const response = await fetch(
        `${AI_API}/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: question
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          `AI server returned ${response.status}`
        );
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            data.answer ||
            "Sorry, I could not generate an answer.",
          sources: data.sources || []
        }
      ]);

    } catch (error) {

      console.error(
        "CropConnect AI error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            "Unable to connect to CropConnect AI. Please check whether the AI server is running on port 8000."
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // CLEAR CHAT
  // =========================================================

  const clearChat = () => {

    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text:
          "Hello! 👋 I am CropConnect AI. How can I help you?"
      }
    ]);

  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="cropconnect-ai-page">

      <div className="cropconnect-ai-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="cropconnect-ai-header">

          <div className="cropconnect-ai-brand">

            <div className="cropconnect-ai-icon">
              <Bot size={25} />
            </div>

            <div>
              <h1>CropConnect AI</h1>

              <div className="cropconnect-ai-status">
                <span className="status-dot"></span>
                AI Assistant Online
              </div>
            </div>

          </div>

          <button
            className="clear-chat-button"
            onClick={clearChat}
            title="Clear conversation"
          >
            <Trash2 size={18} />
          </button>

        </header>


        {/* =================================================
            CHAT BODY
        ================================================= */}

        <main className="cropconnect-ai-body">

          {/* WELCOME AREA */}

          {messages.length === 1 && (

            <div className="cropconnect-ai-welcome">

              <div className="welcome-icon">
                <Sparkles size={34} />
              </div>

              <h2>
                Welcome to CropConnect AI
              </h2>

              <p>
                Ask questions about the CropConnect
                agricultural platform.
              </p>

              <div className="quick-question-grid">

                {quickQuestions.map(
                  (question, index) => (

                    <button
                      key={index}
                      className="quick-question"
                      onClick={() =>
                        askQuickQuestion(question)
                      }
                    >
                      {question}
                    </button>

                  )
                )}

              </div>

            </div>

          )}


          {/* MESSAGES */}

          <div className="messages-list">

            {messages.map((item) => (

              <div
                key={item.id}
                className={`chat-row ${
                  item.role === "user"
                    ? "chat-row-user"
                    : "chat-row-assistant"
                }`}
              >

                <div
                  className={`chat-avatar ${
                    item.role === "user"
                      ? "user-avatar"
                      : "assistant-avatar"
                  }`}
                >

                  {item.role === "user" ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}

                </div>


                <div
                  className={`chat-bubble ${
                    item.role === "user"
                      ? "user-bubble"
                      : "assistant-bubble"
                  }`}
                >

                  <div className="message-role">

                    {item.role === "user"
                      ? "You"
                      : "CropConnect AI"}

                  </div>

                  <div className="message-content">
                    {item.text}
                  </div>


                  {item.sources &&
                    item.sources.length > 0 && (

                      <div className="source-section">

                        <div className="source-title">
                          Project sources
                        </div>

                        {item.sources
                          .slice(0, 5)
                          .map(
                            (source, index) => (

                              <div
                                className="source-item"
                                key={index}
                              >
                                {source}
                              </div>

                            )
                          )}

                      </div>

                    )}

                </div>

              </div>

            ))}


            {/* TYPING */}

            {loading && (

              <div className="chat-row chat-row-assistant">

                <div className="chat-avatar assistant-avatar">
                  <Bot size={18} />
                </div>

                <div className="chat-bubble assistant-bubble">

                  <div className="message-role">
                    CropConnect AI
                  </div>

                  <div className="typing-indicator">

                    <span></span>
                    <span></span>
                    <span></span>

                  </div>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

        </main>


        {/* =================================================
            INPUT
        ================================================= */}

        <footer className="cropconnect-ai-footer">

          <div className="ai-input-wrapper">

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask CropConnect AI..."
              rows={1}
              disabled={loading}
            />

            <button
              className="send-ai-button"
              onClick={sendMessage}
              disabled={
                loading ||
                !message.trim()
              }
              title="Send message"
            >
              <Send size={19} />
            </button>

          </div>

          <p className="ai-disclaimer">
            CropConnect AI uses your project knowledge
            to provide answers.
          </p>

        </footer>

      </div>

    </div>
  );
}

export default CropConnectAI;
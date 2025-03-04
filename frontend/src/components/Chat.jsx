import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Chat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage whenever the messages array updates
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userMessage) {
      alert("Please enter a message");
      return;
    }

    const newUserMessage = { role: "user", content: [userMessage] };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://3.12.248.21:6010/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.messages && data.messages.data.length > 0) {
        const latestAssistantMessage = data.messages.data
          .filter((message) => message.role === "assistant")
          .map((message) => ({
            role: message.role,
            content: message.content.map((item) => item.text?.value || "No content"),
          }))[0];

        if (latestAssistantMessage) {
          setMessages((prevMessages) => {
            const lastUserMessageIndex = prevMessages.length - 1;
            const newMessages = prevMessages.slice(0, lastUserMessageIndex + 1);
            return [...newMessages, latestAssistantMessage];
          });
        }
      } else {
        console.log("No messages received from the assistant.");
      }
    } catch (error) {
      console.error("Error occurred while fetching assistant's response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-2">
      <div className="container mx-auto px-12">
        <div className="bg-white rounded-lg p-4 h-[32rem] md:h-[40rem] lg:h-[45rem] overflow-y-auto mb-4 max-w-full">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-6 px-4 py-3 rounded-lg max-w-max ${
                  msg.role === "user"
                    ? "bg-gray-100 self-end text-xl text-right ml-auto rounded-2xl m-5 p-5"
                    : "bg-transparent self-start text-xl text-left mr-auto"
                }`}
              >
                <p>
                  {msg.content.map((text, idx) => (
                    <span key={idx}>{text}</span>
                  ))}
                </p>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-4xl text-gray-500">
                What can I help with?
              </p>
            </div>
          )}

          {loading && (
            <motion.div
              className="bg-transparent self-start text-left mr-auto p-2 rounded-lg max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Assistant is typing </span>
                <div className="dot-flashing"></div>
              </div>
            </motion.div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask Your Queries"
            className="flex-grow p-4 border border-gray-300 rounded-2xl mr-2 text-lg"
          />
          <button
            type="submit"
            className="bg-gray-100 text-black px-6 py-3 rounded-lg hover:bg-gray-200"
            disabled={loading} // Disable submit button during loading
          >
            {loading ? (
              <img src="/Pause.svg" alt="loading" className="bg-black rounded-full" />
            ) : (
              <img src="/ArrowUp.svg" alt="arrow" className="bg-black rounded-full" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

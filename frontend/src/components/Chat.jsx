import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Chat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResponseRendering, setIsResponseRendering] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    const newUserMessage = { role: "user", content: [userMessage] };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserMessage("");
    setLoading(true);
    setIsResponseRendering(true);

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
          let index = 0;
          const interval = setInterval(() => {
            if (index <= latestAssistantMessage.content[0].length) {
              setMessages((prevMessages) => {
                const updatedAssistantMessage = {
                  role: latestAssistantMessage.role,
                  content: [
                    latestAssistantMessage.content[0].slice(0, index),
                  ],
                };
                const newMessages = [...prevMessages];
                if (newMessages[newMessages.length - 1].role === "assistant") {
                  newMessages[newMessages.length - 1] = updatedAssistantMessage;
                } else {
                  newMessages.push(updatedAssistantMessage);
                }
                return newMessages;
              });
              index++;
            } else {
              clearInterval(interval);
              setIsResponseRendering(false);
            }
          }, 50);
        }
      }
    } catch (error) {
      console.error("Error occurred while fetching assistant's response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="container mx-auto px-12 flex flex-col flex-grow">
        {/* Chat messages container */}
        <div className="flex-grow bg-white rounded-lg p-4 overflow-y-auto max-w-full mb-4">
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
                <p>{msg.content}</p>
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
                <span>Assistant is typing</span>
                <div className="blinking-cursor">|</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input form fixed at the bottom */}
        <form onSubmit={handleSubmit} className="flex w-full sticky bottom-0 bg-white p-4">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask Your Queries"
            className="flex-grow p-4 border border-gray-300 rounded-2xl mr-2 text-lg"
            disabled={loading || isResponseRendering}
          />
          <button
            type="submit"
            className={`${
              loading || isResponseRendering
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-100 text-black hover:bg-gray-200"
            } px-6 py-3 rounded-lg`}
            disabled={loading || isResponseRendering}
          >
            {loading || isResponseRendering ? (
              <img
                src="/Pause.svg"
                alt="loading"
                className="bg-black rounded-full"
              />
            ) : (
              <img
                src="/ArrowUp.svg"
                alt="submit"
                className="bg-black rounded-full"
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

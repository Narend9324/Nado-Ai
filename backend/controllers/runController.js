const axios = require("axios");

const userThreads = {}; // In-memory store for user threads

// Handle user messages and reuse threads
exports.handleMessage = async (req, res) => {
    try {
      const userId = req.body.userId;
      const userMessage = req.body.userMessage;
  
      let threadId = userThreads[userId];
  
      if (!threadId) {
  
        const assistant = process.env.ASSISTANT_ID;
  
        if (!assistant) {
          throw new Error("No assistants found");
        }
  
        const assistantId = assistant;
  
        // Step 2: Create a new thread
        const threadResponse = await axios.post(
          "https://api.openai.com/v1/threads",
          {
            messages: [{ role: "user", content: userMessage }],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "OpenAI-Beta": "assistants=v2",
            },
          }
        );
  
        threadId = threadResponse.data.id;
        
  
        // Store the thread ID for this user
        userThreads[userId] = threadId;
  
        // Step 3: Run the assistant on the new thread
        await runAssistant(threadId, assistantId);
  
      } else {
  
        // Step 3: Send message to the existing thread
        const messageResponse = await axios.post(
          `https://api.openai.com/v1/threads/${threadId}/messages`,
          
            { role: "user", content: userMessage },
          
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "OpenAI-Beta": "assistants=v2",
            },
          }
        );
  
        const assistant = process.env.ASSISTANT_ID;
        await runAssistant(threadId, assistant);
      }
  
      // Step 5: Fetch updated messages after assistant run
      const messagesResponse = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );
  
      const messages = messagesResponse.data;
  
      res.json({ messages, threadId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Function to start the assistant run on a thread
  async function runAssistant(threadId, assistantId) {

    const runResponse = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      { assistant_id: assistantId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );
  
    const runId = runResponse.data.id;
  
    // Wait for the run to complete before proceeding
    await checkRunCompletion(threadId, runId);
  }
  
  // Function to check if the assistant run has completed
  async function checkRunCompletion(threadId, runId) {
    return new Promise((resolve, reject) => {
      let second = 1;
      let intervalId = setInterval(async () => {
        try {
          second +=1
          if(second <= 30) {
          const retrieveRun = await axios.get(
            `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2",
              },
            }
          );
  
          const runRetrieved = retrieveRun.data;
          if (runRetrieved.status === "completed") {
            clearInterval(intervalId);
            resolve(true);
          } else {
          }
        }else{
          clearInterval(intervalId);
          reject(false)
        }
        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      }, 1000);
    });
  }
const express = require("express");
const axios = require("axios");

const router = express.Router();
const userThreads = {}; // In-memory store for user threads

// Route to handle user messages and reuse threads
router.post("/", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userMessage = req.body.userMessage;

    let threadId = userThreads[userId];

    if (!threadId) {
      // Step 1: List Assistants
      // We can eliminate this step and put the assistance id in env
      const assistantsResponse = await axios.get(
        "https://api.openai.com/v1/assistants",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );

      const assistant = assistantsResponse.data.data[0];

      if (!assistant) {
        throw new Error("No assistants found");
      }

      const assistantId = assistant.id;

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

      // Step 4: Run the assistant after adding the message
      /// We can eliminate and get from env
      const assistantsResponse = await axios.get(
        "https://api.openai.com/v1/assistants",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );

      const assistant = assistantsResponse.data.data[0];
      await runAssistant(threadId, assistant.id);
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
});

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
    let intervalId = setInterval(async () => {
      try {
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
      } catch (error) {
        clearInterval(intervalId);
        reject(error);
      }
    }, 1000);
  });
}

module.exports = router;

const axios = require("axios");
const FormData = require("form-data");

// Upload file to OpenAI API
exports.uploadFile = async (req, res) => {
  const fs = require("fs");
  const axios = require("axios");

  try {
    const file = req.files.file;
    const form = new FormData();
    form.append("purpose", "assistants");
    form.append("file", file.data, file.name);

    const response = await axios.post("https://api.openai.com/v1/files", form, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
    });

    // Extract the file ID from the upload response
    const fileId = response.data.id;
    const vectorStoreId = process.env.VECTOR_STORE_ID;

    let data = {
      file_id: `${fileId}`,
    };
    try {
      const updateVectorStoreFile = await axios.post(
        `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`,
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List files from OpenAI API
exports.listFiles = async (req, res) => {
  try {
    const response = await axios.get("https://api.openai.com/v1/files", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete file by ID from OpenAI API
exports.deleteFile = async (req, res) => {
  const { id } = req.params; // Get the file ID from the request parameters

  try {
    const response = await axios.delete(
      `https://api.openai.com/v1/files/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const fileId = response.data.id;
    const vectorStoreId = process.env.VECTOR_STORE_ID;

    try {
      const deleteVectorStoreFile = await axios.delete(
        `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    res.json(response.data); // Respond with the deletion result
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const axios = require('axios');
const FormData = require('form-data');

// Upload file to OpenAI API
exports.uploadFile = async (req, res) => {
const fs = require('fs');
const axios = require('axios');

try {
    const file = req.files.file;
    const form = new FormData();
    form.append('purpose', 'assistants');
    form.append('file', file.data,file.name);

    const response = await axios.post(
        'https://api.openai.com/v1/files',
        form,
        {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                ...form.getHeaders()            },
        }
    );

    res.json(response.data);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};


// List files from OpenAI API
exports.listFiles = async (req, res) => {
    try {
        const response = await axios.get('https://api.openai.com/v1/files', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Upload file to OpenAI API
exports.uploadFile = async (req, res) => {
    try {
        const filePath = path.resolve(__dirname, '../uploads/your-file-name'); // Replace with the actual file path
        
        const form = new FormData();
        form.append('purpose', 'assistants');
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post(
            'https://api.openai.com/v1/files',
            form,
            {
                headers: {
                    
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    ...form.getHeaders(),
                },
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

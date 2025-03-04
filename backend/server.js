const express = require("express")
const cors = require("cors")
const fileRoutes = require('./routes/fileRoutes')
const runRoutes = require('./routes/runRoutes')

require('dotenv').config();

const app = express();


app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());



const port = process.env.PORT || 5000;


// use the file routes
app.use('/files', fileRoutes)


// use the run routes
app.use('/run',runRoutes)


// Basic route to test API
app.get('/', (req, res) => {
    res.send('Hello, this is your Express API!');
})
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require ('cors');

dotenv.config();
connectDB();

const app = express();
const corsOptions = 
{
    origin : 'http://greenmark.com',
    methods : ['GET', 'POST', 'PUT','DELETE'],

}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


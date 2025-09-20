import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './config/dbConfig.js';
import Note from './src/models/note.js';
import notesRoutes from './src/routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //allow express to parse incoming JSON data from req body

app.use('/api', notesRoutes);

app.listen(PORT, async () => {
    await connectDb();
    console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import { getNotes, getNotesById, createNote, updateNote, deleteNote } from '../controllers/notesController.js';

const router = express.Router();

router.get('/notes', getNotes);

router.get('/notes/:id', getNotesById);

router.post('/notes', createNote);

router.patch('/notes/:id', updateNote);

router.delete('/notes/:id', deleteNote);

export default router;
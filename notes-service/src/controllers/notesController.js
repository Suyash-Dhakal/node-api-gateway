import Note from "../models/note.js";

export const getNotes = async (req, res)=>{
    try {
        const notes = await Note.find({userId: req.headers['x-user-id']});
        if(!notes){
            return res.status(404).json({success: true, message: "No notes found"});
        }
        res.status(200).json({success: true, data: notes});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const getNotesById = async (req, res)=>{
    try {
        const note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({success: true, message: "No note found"});
        }
        res.status(200).json({success: true, data: note});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const createNote = async (req, res)=>{
    try {
        const {title, content} = req.body;
        if(!title){
            return res.status(400).json({success: false, message: "Title is required"});
        }
        
        const newNote = new Note({
            title,
            content,
            userId: req.headers['x-user-id']
        });
        await newNote.save();
        res.status(201).json({success: true, data: newNote});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error from here" });
    }
}

export const updateNote = async (req, res)=>{
    try {
        const {title, content} = req.body;
        const note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({success: true, message: "No note found"});
        }
        if(note.userId !== req.headers['x-user-id']){
            return res.status(403).json({success: false, message: "You are not authorized to update this note"});
        }
        if(title) note.title = title;
        if(content) note.content = content;
        await note.save();
        res.status(200).json({success: true, data: note});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteNote = async (req, res)=>{
    try {
        const note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({success: true, message: "No note found"});
        }
        if(note.userId.toString() !== req.headers['x-user-id']){
            return res.status(403).json({success: false, message: "You are not authorized to delete this note"});
        }
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({success: true, message: "Note deleted successfully"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
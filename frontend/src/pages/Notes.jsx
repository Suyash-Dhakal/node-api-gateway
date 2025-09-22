"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { notesAPI } from "../services/api"

function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingNote, setEditingNote] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const data = await notesAPI.getNotes()
      setNotes(data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load notes: " + error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setMessage({ type: "error", text: "Please fill in both title and content" })
      return
    }

    setCreateLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const createdNote = await notesAPI.createNote(newNote)
      setNotes([createdNote, ...notes])
      setNewNote({ title: "", content: "" })
      setMessage({ type: "success", text: "Note created successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create note: " + error.message })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleUpdateNote = async (id, updatedData) => {
    try {
      const updatedNote = await notesAPI.updateNote(id, updatedData)
      setNotes(notes.map((note) => (note._id === id ? updatedNote : note)))
      setEditingNote(null)
      setMessage({ type: "success", text: "Note updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update note: " + error.message })
    }
  }

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return
    }

    try {
      await notesAPI.deleteNote(id)
      setNotes(notes.filter((note) => note._id !== id))
      setMessage({ type: "success", text: "Note deleted successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete note: " + error.message })
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return <div className="loading">Loading your notes...</div>
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>My Notes</h1>
          <div className="navbar-actions">
            <span style={{ color: "#6b7280" }}>Welcome back!</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        {/* Create Note Form */}
        <div className="create-note-form">
          <h2>Create New Note</h2>
          <form onSubmit={handleCreateNote}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Enter note title"
                disabled={createLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note here..."
                disabled={createLoading}
              />
            </div>
            <button type="submit" className="btn btn-success" disabled={createLoading}>
              {createLoading ? "Creating..." : "Create Note"}
            </button>
          </form>
        </div>

        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <h3>No notes yet</h3>
            <p>Create your first note using the form above!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note._id} className="note-card">
                {editingNote === note._id ? (
                  <EditNoteForm
                    note={note}
                    onSave={(updatedData) => handleUpdateNote(note._id, updatedData)}
                    onCancel={() => setEditingNote(null)}
                  />
                ) : (
                  <>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <small style={{ color: "#9ca3af", display: "block", marginBottom: "12px" }}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </small>
                    <div className="note-actions">
                      <button
                        onClick={() => setEditingNote(note._id)}
                        className="btn btn-secondary"
                        style={{ fontSize: "14px", padding: "8px 16px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="btn btn-danger"
                        style={{ fontSize: "14px", padding: "8px 16px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EditNoteForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    await onSave({ title, content })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          style={{ marginBottom: "12px" }}
        />
      </div>
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          style={{ marginBottom: "12px", minHeight: "80px" }}
        />
      </div>
      <div className="note-actions">
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
          style={{ fontSize: "14px", padding: "8px 16px" }}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
          style={{ fontSize: "14px", padding: "8px 16px" }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default Notes

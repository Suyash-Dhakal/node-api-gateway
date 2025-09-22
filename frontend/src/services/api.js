import axios from "axios"

const BASE_URL = "http://localhost:3000"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Set to true if you need to send cookies
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 429) {
      throw new Error("You're sending requests too quickly. Please try again later.")
    }

    const message = error.response?.data?.message || error.message || "Something went wrong"
    throw new Error(message)
  },
)

export const authAPI = {
  async login(email, password) {
    return await apiClient.post("/login", { email, password })
  },

  async signup(name, email, password) {
    return await apiClient.post("/signup", { name, email, password })
  },

  async logout() {
    return await apiClient.post("/logout")
  },
}

export const notesAPI = {
  async getNotes() {
    const result = await apiClient.get("/notes")
    return result.data // Extract data array from response
  },

  async createNote(noteData) {
    const result = await apiClient.post("/notes", noteData)
    return result.data // Extract data from response
  },

  async updateNote(id, noteData) {
    const result = await apiClient.patch(`/notes/${id}`, noteData)
    return result.data // Extract data from response
  },

  async deleteNote(id) {
    return await apiClient.delete(`/notes/${id}`)
  },
}

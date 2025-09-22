"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if (token && userId) {
        // Restore user state with proper structure
        setUser({
          userId,
          token,
          // Add any other user properties you might have stored
        })
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      if (response.success) {
        const token = `user-${response.userId}` // Simple token format
        localStorage.setItem("token", token)
        localStorage.setItem("userId", response.userId)
        setUser({
          email,
          userId: response.userId,
          token,
        })
        return { success: true }
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup(name, email, password)
      if (response.success) {
        const token = `user-${response.userId}`
        localStorage.setItem("token", token)
        localStorage.setItem("userId", response.userId)
        setUser({
          name,
          email,
          userId: response.userId,
          token,
        })
        return { success: true }
      } else {
        throw new Error(response.message || "Signup failed")
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const result = await login(email, password)

    if (result.success) {
      setMessage({ type: "success", text: "Login successful! Redirecting..." })
    } else {
      setMessage({ type: "error", text: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="auth-container">
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#f1f5f9" }}>Login to Notes App</h2>

        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-link">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>

        {/* <div className="demo-info">
          <h4>Demo Account</h4>
          <p>
            <strong>Email:</strong> <code>ram@gmail.com</code>
          </p>
          <p>
            <strong>Password:</strong> <code>Ram123</code>
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default Login

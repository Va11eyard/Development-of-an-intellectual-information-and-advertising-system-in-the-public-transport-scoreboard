"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

export default function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDarkMode)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access_token)
        router.push("/users/page.tsx")
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Login failed")
        console.error("Login failed:", errorData)
      }
    } catch (error) {
      console.error("Error during login:", error)
      setError("An error occurred during login. Please try again.")
    }
  }

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h1 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
            }`}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
            }`}
          />
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white font-semibold ${
              isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } transition duration-300`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  role: string
}

export default function Edit() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDarkMode)

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setFormData({
            username: userData.username,
            email: userData.email,
            role: userData.role,
          })
        } else {
          console.error("Failed to fetch user")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    if (id) {
      fetchUser()
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/users")
      } else {
        console.error("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Edit User</h1>

      <form
        onSubmit={handleSubmit}
        className={`space-y-4 max-w-lg mx-auto ${
          isDarkMode ? "bg-gray-800 p-6 rounded-lg" : "bg-gray-100 p-6 rounded-lg"
        }`}
      >
        <div>
          <label
            htmlFor="username"
            className={`block text-sm font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "border-green-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-green-400 bg-white text-black placeholder-gray-600"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className={`block text-sm font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "border-green-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-green-400 bg-white text-black placeholder-gray-600"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className={`block text-sm font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}
          >
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? "border-green-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-green-400 bg-white text-black placeholder-gray-600"
            }`}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 mt-4 rounded-md text-white font-semibold transition duration-300 ${
            isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-500 hover:bg-green-400"
          }`}
        >
          Save
        </button>
      </form>
    </div>
  )
}


import sqlite3 from "sqlite3"

// Open the database
const db = new sqlite3.Database("test.db", (err) => {
  if (err) {
    console.error("Error opening database", err)
    return
  }
  console.log("Database opened successfully")
})

// Create the users table
db.run(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating users table", err)
    } else {
      console.log("Users table created successfully")
    }

    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error("Error closing database", err)
      } else {
        console.log("Database closed successfully")
      }
    })
  },
)


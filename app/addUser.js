import sqlite3 from "sqlite3"
import { pbkdf2Sync, randomBytes } from "crypto"

// Connect to the database
const db = new sqlite3.Database("./test.db")

// Function to hash password
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex")
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

// Add a user with hashed password
const username = "admin"
const email = "admin@example.com"
const role = "admin"
const password = "admin123" // This will be hashed
const hashedPassword = hashPassword(password)

const query = `
INSERT INTO users (username, email, role, hashed_password, is_active)
VALUES (?, ?, ?, ?, 1)
`

db.serialize(() => {
  db.run("BEGIN TRANSACTION")

  db.run(query, [username, email, role, hashedPassword], function (err) {
    if (err) {
      console.error("Error adding user:", err.message)
      db.run("ROLLBACK")
      return
    }
    console.log(`Added user with ID: ${this.lastID}`)
  })

  // Verify the user was added
  db.all("SELECT id, username, email, role, is_active FROM users", [], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err.message)
      db.run("ROLLBACK")
      return
    }
    console.log("\nUsers in database:")
    console.table(rows)

    db.run("COMMIT", (err) => {
      if (err) {
        console.error("Error committing transaction:", err.message)
      } else {
        console.log("Transaction committed successfully")
      }
      db.close((err) => {
        if (err) {
          console.error("Error closing database:", err.message)
        } else {
          console.log("Database closed successfully")
        }
      })
    })
  })
})


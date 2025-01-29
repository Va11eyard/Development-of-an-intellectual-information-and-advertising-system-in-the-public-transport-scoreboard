import sqlite3 from "sqlite3"

const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Error opening database:", err.message)
    return
  }
  console.log("Connected to the database.")

  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error("Error getting tables:", err.message)
      return
    }
    console.log("Tables in the database:")
    console.table(tables)

    if (tables.some((table) => table.name === "users")) {
      db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
          console.error("Error getting users:", err.message)
          return
        }
        console.log("Users in the database:")
        console.table(rows)

        db.close((err) => {
          if (err) {
            console.error("Error closing database:", err.message)
          } else {
            console.log("Database connection closed.")
          }
        })
      })
    } else {
      console.log("No users table found in the database.")
      db.close()
    }
  })
})


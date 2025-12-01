const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./preschool.db');

db.each("SELECT * FROM messages", (err, row) => {
    console.log(row.id + ": " + row.name + " - " + row.message);
});

db.close();
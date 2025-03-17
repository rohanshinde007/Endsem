// server.js (Node.js Backend)

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rohan007',
    database: 'userdb'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/register', (req, res) => {
    const { username, password, email, phone } = req.body;
    const sql = 'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, password, email, phone], (err, result) => {
        if (err) return res.send('Registration failed');
        res.redirect('http://127.0.0.1:5502/home.html');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.json({ success: false, message: 'Login failed' });
        if (results.length > 0) {
            // res.json({ success: true, message: 'Login successful' });
            res.redirect('http://127.0.0.1:5502/home.html');
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// SQL to create the 'users' table:
// CREATE DATABASE userdb;
// USE userdb;
// CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), email VARCHAR(255), phone VARCHAR(255));

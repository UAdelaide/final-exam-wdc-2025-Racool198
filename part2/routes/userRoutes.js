const express = require('express');
const router = express.Router();
const db = require('../models/db');

/* GET home page. */
router.get('/dogs', async function(req, res, next) {
  try {
    const rows = await db.execute(`
      SELECT
      
      name AS Name,
      size AS Size,
      (SELECT username FROM Users WHERE Users.user_id = Dogs.owner_id) AS owner_username
      FROM Dogs;`);
    res.json(rows[0]);
  } catch (err){
    res.status(404);
    res.send("Error Occured");
  }
});

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user_id);
});


// route to return the dogs that belong to the current session user
router.get('/myDogs', async (req, res) => {
  try {
    var user_id = req.session.user_id;

    const [result] = await db.query(`SELECT dog_id,name FROM Dogs WHERE owner_id = ?`, [user_id]);

    res.json(result);


  } catch (err) {
    // console.log("error");
    res.status(404);
    res.send("Error");
  }
});

// just deletes the session data
router.post('/logout', (req, res) => {

  req.session.destroy();
  // console.log("Logged out");
  res.send("Logged out");
});


// POST login (dummy version)
// Minor modification made to the login router to change email field to username and store role and user_id in the session and send the appropriate redirect based on role.
router.post('/login', async (req, res) => {
  // const data = req.body;
  const username = req.body.username;
  const password = req.body.password;


  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // console.log(rows[0].role);
    // console.log(rows[0].user_id);
    req.session.role = rows[0].role;
    req.session.user_id = rows[0].user_id;

    if (rows[0].role === "owner") {
      res.json({ message: 'Login successful', redirect: "/owner-dashboard.html"});
    } else if (rows[0].role === "walker") {
      res.json({ message: 'Login successful', redirect: "/walker-dashboard.html"});
    }


  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

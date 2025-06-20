var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');


let db;

(async () => {
  db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
  });
})();


/* GET home page. */
router.get('/api/dogs', async function(req, res, next) {
  const rows = await db.execute("SELECT name AS dog_name,size,(SELECT username FROM Users WHERE Users.user_id = Dogs.owner_id) AS owner_username FROM Dogs;");
  res.json(rows[0]);
});

router.get('/api/walkrequests/open', async function(req, res, next) {
  const rows = await db.execute(`SELECT
    request_id,
    (SELECT name FROM Dogs WHERE Dogs.dog_id = WalkRequests.dog_id) as dog_name,
    requested_time,
    duration_minutes,
    location,
    (SELECT username FROM Users WHERE Users.user_id = (SELECT owner_id FROM Dogs WHERE WalkRequests.dog_id = Dogs.dog_id)) AS owner_username
    FROM WalkRequests
    WHERE status = "open";`);
  res.json(rows[0]);
});

router.get('/api/walkers/summary', async function(req, res, next) {
  const rows = await db.execute(`SELECT username
    FROM Users;
    WHERE Users.role = "walker";`);
  res.json(rows[0]);
});



module.exports = router;

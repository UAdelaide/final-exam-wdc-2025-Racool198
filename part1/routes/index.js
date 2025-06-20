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
  try {
    const rows = await db.execute("SELECT name AS dog_name,size,(SELECT username FROM Users WHERE Users.user_id = Dogs.owner_id) AS owner_username FROM Dogs;");
    res.json(rows[0]);
  } catch (err){
    res.status(404);
    res.send("Error Occured");
  }
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
  var rows = await db.execute(`
    SELECT
    u.username AS walker_username,
    COUNT(wr.rating) AS total_ratings,
    AVG(wr.rating) AS average_rating,
    COUNT(
      CASE
        WHEN (
          SELECT status
          FROM WalkRequests
          WHERE request_id = wr.request_id
        ) = "completed" THEN wr.request_id
        ELSE NULL
      END
    ) AS completed_walks
    FROM Users u
    JOIN WalkRatings wr ON u.user_id = wr.walker_id
    WHERE u.role = "walker"
    GROUP BY u.user_id, u.username
    ;`);
  res.json(rows[0]);

});



module.exports = router;

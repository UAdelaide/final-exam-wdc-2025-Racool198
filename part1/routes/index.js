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



module.exports = router;

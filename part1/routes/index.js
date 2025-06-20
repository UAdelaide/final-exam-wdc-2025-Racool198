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
  await db.execute("SELECT * FROM Dogs;", ["name", "size"], (err, row) => {
    res.json(row);
  });
});



module.exports = router;

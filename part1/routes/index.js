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
  const [await db.execute("SELECT * FROM Dogs;");
});



module.exports = router;

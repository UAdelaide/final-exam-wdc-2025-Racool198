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
router.get('/api/dogs', function(req, res, next) {
  db.execute("SELECT * FROM Dogs;", (err, row) => {
    res.json(row);
  });
});



module.exports = router;

var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');


let db;

(async ())

await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });


/* GET home page. */
router.get('/api/dogs', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;

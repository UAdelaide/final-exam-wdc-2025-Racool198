var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');


/* GET home page. */
router.get('/api/dogs', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });


    await db.execute(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES
      ("alice123", "alice@example.com", "hashed123", "owner"),
      ("bobwalker", "bob@example.com", "hashed456", "walker"),
      ("carol123", "carol@example.com", "hashed789", "owner"),
      ("adamowner", "adam@example.com", "adam123", "owner"),
      ("billwalker", "bill@example.com", "bill321", "walker");
    `);

    await db.execute(`
      INSERT INTO Dogs (owner_id, name, size)
      VALUES
      ((SELECT user_id FROM Users WHERE username = "alice123"),"Max", "medium"),
      ((SELECT user_id FROM Users WHERE username = "carol123"),"Bella", "small"),
      ((SELECT user_id FROM Users WHERE username = "adamowner"),"Jake", "medium"),
      ((SELECT user_id FROM Users WHERE username = "alice123"),"Finn", "medium"),
      ((SELECT user_id FROM Users WHERE username = "carol123"),"Cat", "small");
    `);

    await db.execute(`
      INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
      VALUES
      ((SELECT dog_id FROM Dogs WHERE name = "Max"), "2025-06-10 08:00:00", "30", "Parklands", "open"),
      ((SELECT dog_id FROM Dogs WHERE name = "Bella"), "2025-06-10 09:30:00", "45", "Beachside Ave", "accepted"),
      ((SELECT dog_id FROM Dogs WHERE name = "Jake"), "2025-06-9 08:00:00", "30", "Adelaide", "completed"),
      ((SELECT dog_id FROM Dogs WHERE name = "Finn"), "2025-06-8 08:00:00", "12", "Klemzig", "completed"),
      ((SELECT dog_id FROM Dogs WHERE name = "Cat"), "2025-06-11 08:00:00", "55", "Greenpath", "cancelled");
    `);


    await db.execute(`
      INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments)
      VALUES
      (
          (SELECT request_id FROM WalkRequests WHERE dog_id = (SELECT dog_id FROM Dogs WHERE name = "Jake")),
          (SELECT user_id FROM Users WHERE username = "bobwalker"),
          (SELECT user_id FROM Users WHERE username = "adamowner"),
          5,
          "Dog walked"
      ),
      (
          (SELECT request_id FROM WalkRequests WHERE dog_id = (SELECT dog_id FROM Dogs WHERE name = "Finn")),
          (SELECT user_id FROM Users WHERE username = "bobwalker"),
          (SELECT user_id FROM Users WHERE username = "alice123"),
          3,
          "Dog walked"
      ),
      (
          (SELECT request_id FROM WalkRequests WHERE dog_id = (SELECT dog_id FROM Dogs WHERE name = "Max")),
          (SELECT user_id FROM Users WHERE username = "bobwalker"),
          (SELECT user_id FROM Users WHERE username = "alice123"),
          5,
          "Dog walked"
    );`);


  } catch (err) {
    console.log('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

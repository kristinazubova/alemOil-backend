const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const passport = require("./passport/setup");

const authRouter = require("./routes/auth");
const indexRouter = require('./routes/index');
const questionariesRouter = require('./routes/questionaries');
const pricesRouter = require('./routes/prices');

const app = express();

const { MONGO_URI } = require('./config');

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(console.log(`MongoDB connected ${MONGO_URI}`))
  .catch(err => console.log(err));

// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let mongoStore = new MongoStore({ mongooseConnection: mongoose.connection })

// Express Session
app.use(
  session({
    secret: "very secret this is",
    resave: false,
    saveUninitialized: true,
    store: mongoStore
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: 'http://www.alemoil.com', credentials: true }));

app.use('/api/auth', authRouter);
app.use('/api/', indexRouter);
app.use('/api/questionaries', questionariesRouter);
app.use('/api/prices', pricesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

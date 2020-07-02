const express = require('express');
const router = express.Router();
const passport = require('passport');

const fs = require('fs');

router.get('/', function (req, res, next) {

  let rawdata = fs.readFileSync(__dirname + '/../public/prices/prices.json');
  let prices = JSON.parse(rawdata);

  res.json(prices);
  res.status(200);
  res.end();
});

router.post('/', passport.authenticationMiddleware(), function (req, res, next) {
  let newPrices = {
    "petrol92": {
      "fromOilBase": req.body[0].priceOB,
      "fromOilStation": req.body[0].priceOS
    },
    "petrol95": {
      "fromOilBase": req.body[1].priceOB,
      "fromOilStation": req.body[1].priceOS
    },
    "dieselSummer": {
      "fromOilBase": req.body[2].priceOB,
      "fromOilStation": req.body[2].priceOS
    },
    "dieselWinter": {
      "fromOilBase": req.body[3].priceOB,
      "fromOilStation": req.body[3].priceOS
    }
  }

  let data = JSON.stringify(newPrices);
  fs.writeFileSync(__dirname + '/../public/prices/prices.json', data);

  res.status(200);
  res.end();
});

module.exports = router;
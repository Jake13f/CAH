var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

/* GET home page. */
router.get('/game', function (req, res, next) {
  var name = req.query.name;
  if (name === undefined || name === "" || name.length > 20 || name.length < 1)
    res.redirect("/");
  else
    res.render('game', { name: req.query.name });
});

module.exports = router;

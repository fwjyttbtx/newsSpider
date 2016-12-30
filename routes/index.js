var express = require('express');
var router = express.Router();
var Spider = require('../module/Spider');

/* GET home page. */
router.get('/', function(req, res, next) {
  var spider = new Spider();
    spider.newsCrawls();
  res.render('index', { title: 'Express' });
});

module.exports = router;

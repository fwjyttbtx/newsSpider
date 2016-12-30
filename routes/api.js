/**
 * Created by Administrator on 2016/12/29 0029.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/test.do', function(req, res, next) {
    res.json({success: true, requestParam: req.param("articles")});
});

module.exports = router;
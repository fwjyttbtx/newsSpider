/**
 * Created by Administrator on 2016/12/27.
 */
var Spider = require("./Spider");
var schedule = require('node-schedule');

var NewsSchedules = {

    /**
     * 启动定时任务
     */
    runTask: function() {
        console.log(">>>> 创建定时任务");
        // 6位corn依次为秒/分/时/月的天/月/周 0-7 0和7都表示周日
        schedule.scheduleJob('0 */2 * * *', function () {
            console.log(">>>> 这是一个定时任务，当前触发时间为：" + new Date());
        });
    }
};

module.exports = NewsSchedules;
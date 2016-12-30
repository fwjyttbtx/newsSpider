/**
 * Created by Administrator on 2016/12/27.
 */
var request = require("request");

var HttpUtil = {

    /**
     * 发送HTTP REQUEST请求
     * @param url 请求的url
     * @param callback 回调 传入response对象
     * @param data 处理请求入参
     */
    doRequest: function (url, callback, data) {
        console.log("Request to " + url + " started!");
        request(url, function (error, response, body) {
            if(error) {
                console.error("Http Request Error With : " + error);
                return;
            }
            if(response.statusCode !== 200) {
                console.error("Http Response Error, StatusCode is " + response.statusCode);
                console.error("Maybe Respones Redirect To > " + response.header("location"));
                return;
            }
            if(callback) {
                callback(response, data);
            }
        });
    },

    apiPost: function(url, options, callback) {
        request({
            url: url,
            method: "POST",
            json: true,
            body: options
        }, function (error, response, body) {
            if(error || response.statusCode != 200) {
                console.error("Http Request Error With : " + error);
                return;
            }
            console.log(body)
            if(callback) {
                callback(JSON.parse(body));
            }
        });
    }

}

module.exports = HttpUtil;
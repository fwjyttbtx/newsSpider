/**
 * Created by Administrator on 2016/12/28 0028.
 */
// 一个缓存对象 此对象缓存新闻抓取的规则 当规则改变时候更新key的内容
var cache = {};

/**
 * 缓存存放方法
 * @param k
 * @param v
 */
exports.put = function(k, v){
    cache[k] = new Buffer(JSON.stringify(v));
}

/**
 * 获取缓存数据的方法
 * @param k
 */
exports.get = function(k){
    return JSON.parse(cache[k].toString());
}
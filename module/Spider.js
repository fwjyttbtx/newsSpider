/**
 * Created by Administrator on 2016/12/27.
 */
var cheerio = require('cheerio');
var _ = require('underscore');
var async = require('async');
var HttpUtil = require('./HttpUtil');

var Spider = function() {};

/**
 * 解析文章的标题和标题内的跳转链接
 * @param resp
 */
function articlesParser(resp) {
    var body = resp.body;
    var host = getHost(resp);
    if(!host) return;
    var articleTitles = [];
    var $ = cheerio.load(body);
    // 黄山学院
    // var aticleEles = $("#wp_news_w24>ul div.fields.pr_fields>span.Article_Title>a");
    // 复旦大学
    var aticleEles = $("#main_l>div>ul a");
    _.each(aticleEles, function(ele){
        var $ele = $(ele);
        var title = $ele.attr("title") || $ele.text();
        var href = $ele.attr("href");
        href = getFixedUrl(host, href);
        var articleTitle = {
            title: title,
            href: href
        };
        articleTitles.push(articleTitle);
    });
    articleContetCrawls(articleTitles);
}

/**
 * 抓取文章的内容方法
 * @param articleTitles 传入的带有链接的对象
 */
function articleContetCrawls(articleTitles) {
    if(!articleTitles || articleTitles.length === 0) return;
    var idx = 0;
    var titleSize = articleTitles.length;
    // 顺序抓取
    async.whilst(function(){
        return idx < titleSize;
    }, function (callback) {
        var articleTitle = articleTitles[idx++];
        HttpUtil.doRequest(articleTitle.href, function(resp, data) {
            console.log("crawls article idx[" + idx + "] content ");
            contentParser(resp, data);
            callback(null, articleTitles);
        }, articleTitle);
    }, function (err, fullArticles) {
        if(err) {
            console.error("抓取文章页面出现异常：" + err);
            return;
        }
        // 得到完整的文章结果
        var fullArticlesStr = JSON.stringify(fullArticles);
        HttpUtil.apiPost("http://localhost:3000/api/test.do", {articles: fullArticlesStr})
    });
    return;
}

/**
 * 文章内容的解析方法
 * @param resp
 */
function contentParser(resp, data) {
    var body = resp.body;
    var host = getHost(resp);
    if(!host) return;
    var $ = cheerio.load(body);
    var context = $("#endtext").html();
    var publishDate = $("#content>h2>span>span").text();
    var author = $("#content>h2>span>span").text();
    var source = $("#content>h2>span>span").text();
    var imgArr = $(context).find("img");
    // 通过cheerio获得内容的src标签 并且加上域名替换原来的src
    _.each(imgArr, function (img) {
        var src = $(img).attr("src");
        var newSrc = getFixedUrl(host, src);
        // 重新替换src
        context = context.replace(src, newSrc);
    });
    data.author = author;
    data.source = source;
    data.publishDate = publishDate;
    data.context = context;
    //console.log(data)
}

/**
 * 获取修正后的链接 即添加当前host的链接地址
 * @param host
 * @param href
 * @returns {*}
 */
function getFixedUrl(host, href) {
    // 如果放的是全链接  则直接使用即可
    if(!href.startsWith("http")) {
        // 如果非全链接 判断是否有/开头 如果没有 则需要添加一下/
        if(href.startsWith("/")) {
            href = host + href;
        } else {
            href = host + '/' + href;
        }
    }
    return href;
}

/**
 * 得到当前response对象的HOST 此HOST以http://开头无/结尾
 * @param resp
 * @returns {*}
 */
function getHost(resp) {
    var host = resp.request.originalHost;
    if(!host) {
        console.error("无法获取到当前爬取页面的HOST，请检查配置是否出错。");
        return;
    }
    if(!host.startsWith("http")) {
        host = "http://" + host;
    }
    if(host.endsWith("/")) {
        host += host.substring(0, host.length - 1);
    }
    return host;
}

/**
 * 抓取新闻的方法
 */
Spider.prototype.newsCrawls = function() {
    // 黄山学院
    // HttpUtil.doRequest("http://www.hsu.edu.cn/17/list.htm", articlesParser);
    // 复旦大学
    HttpUtil.doRequest("http://news.fudan.edu.cn/news/xxyw", articlesParser);
};

module.exports = Spider;
/*
  批量获取需要爬取的url
*/

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var urlBase = 'http://sh.lianjia.com';
var urlXiaoqu = urlBase + '/xiaoqu';


function findALLURL($) {
  var hrefs = [];
  var url, urlFull;
  $('#filter-options').find('a').each(function(i, node) {
    url = $(node).attr('href');
    urlFull = urlBase +  url;
    hrefs.push(urlFull);
  });
  hrefs = filterUrl(hrefs);
  return hrefs;
}


function filterUrl(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    var url = arr[i];
    if (!url || url.indexOf('xiaoqu') === -1) continue;
    newArr.push(url);
  }
  return newArr;
}

function genURLs(arr) {
  var newArr = [];
  var url, newUrl;
  for (var i = 0; i <= arr.length; i++) {
    url = arr[i];
    if (!url) continue;
    for (var j = 0; j < 101; j++) { // 可能很多分类并没有101页，这个函数并无法保证一定存在页数
      newUrl = url + 'd' + j;
      newArr.push(newUrl);
    }
  }
  return newArr;
}

module.exports = function(cb) {
  request.get(urlXiaoqu, function(e, res, body) {
    if (!e && res.statusCode == 200) {
      var $ = cheerio.load(body);
      var urls = findALLURL($);
      urls = genURLs(urls);
      // console.log('!!!!!!!!!!');
      // console.log(urls.length);
      // for (var i = 0; i < urls.length; i++) {
      //   if (urls[i].substr(urls[i].length - 3) == '100') {
      //     console.log(urls[i]);
      //   }
      // };
      cb(urls);
    }
  });
};
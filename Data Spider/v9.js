/*
	爬虫运行入口
*/

var request = require('request');
var fs = require('fs');
var getURLs = require('./v9.urls');
var Pool = require('./v9.pool');


getURLs(function(urls){
  new Pool(urls).query();
});


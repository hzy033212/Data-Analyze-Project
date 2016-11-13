/*
 这个模块是专门处理“小区总用户数”和“小区楼盘数”这两个变量的。
*/

var Mongo = require('./mongo');
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');
var json2csv = require('json2csv');


function update(communityId, totalHouses, totalBuildings) {
  Mongo.community.findOneAndUpdate({community_id: communityId}, {$set:{total_houses:totalHouses, total_buildings:totalBuildings}},function(err, doc){
    if(err){
        console.log("数据库有问题！");
    } else {
       console.log("数据库更新插入成功");
    	 console.log(doc);
    }
   });
}

function genTwoDetailInformation() {
  Mongo.community.find({}, function(e, d) {
    if (e) {
      console.log('数据库有问题！');
    } else {
      for (var i = 0; i < d.length; i++) {
      	var curURL = 'http://sh.lianjia.com/xiaoqu/' + d[i]['community_id'] + '.html';
      	var curId = d[i]['community_id'];
    	  getInfoFromDetailPage(curURL, curId);
      }
  	}
  });
}

function getInfoFromDetailPage(url, id) {
	request.get(url, function(error, res, body){
    	if (error) {
    		console.log('URL网络连接有问题！');
    	} else {
    		var $ = cheerio.load(body);
    		var listNode = $('.wrapper'); // NO space allowed in '.className' !
    		var detailInfoArr = [];
    		listNode.find('ol').find('li').each(function(i, node){
    			node = $(node);
    			var curNode = node.find('.other');
    			var curText = curNode.text().trim();
    			detailInfoArr.push(curText);
    		});
    		var total_buildings = parseInt(detailInfoArr[5].substr(0,2));
    		var total_houses = parseInt(detailInfoArr[6].substr(0,4));
    		update(id, total_houses, total_buildings);
    	}
	});
}

// getInfoFromDetailPage('http://sh.lianjia.com/xiaoqu/5011000010208.html', 5011000010208);
genTwoDetailInformation();

// After all have been DONE!!!!! Then use folloing command line to export json file.
// To export Json file - 
// mongoexport --db community --collection communities --out communicates.json
// To export csv file with corresponding fields - 
// mongoexport --host localhost --db community --collection communities --csv --out communities_test.csv --fields community_id,mean_price,community_age,community_name,lng,lat,total_buildings,total_houses








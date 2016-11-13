/*
  请求返回后，所有的处理都在这里。
  因为这个内容也比较多，所以专门分了这个文件
*/

var Mongo = require('./mongo');
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');
var json2csv = require('json2csv');

function updateToMongod(obj) {
  Mongo.community.findOneAndUpdate({
    community_id: obj.community_id
  }, obj, {
    upsert: true
  }, function(e, d) {
    if (e) {
      console.log('数据库有问题！');
    } else {
      console.log('更新成功...');
      // console.log(d);
    }
  });
}

function saveToCSV(obj) {
  // console.log(obj);
  var csv = json2csv({ data: obj, fields: ['community_id', 'lat', 'lng', 'plate', 'district_name', 'community_name', 'community_age', 'mean_price', 'total_num_houses', 'detail_info_url']});
  var csv = csv.substring(133); // Remove header.
  fs.appendFileSync('./data/myOutput.csv',  csv, 'utf8'); // 以追加方式写入
}

function parser(e, res, body){
  var allResult = [];
  var $ = cheerio.load(body);
  var listNode = $('.list-wrap');
  listNode.find('li').each(function(i, node){
    node = $(node);

    // Get price and parse it
    var priceNode = node.find('.info-panel').find('.col-3').find('.price').find('.num');
    var curPrice = priceNode.text().trim(); // Prize parameter
    // Get build year and parse it
    var buildYearNode = node.find('.info-panel').find('.col-1').find('.other').find('.con');
    var rawBuildYear = buildYearNode.text().trim();
    var len = rawBuildYear.length;
    var buildYear = '';
    for (var i = 0; i < len; i++) {
        if (!isNaN(parseInt(rawBuildYear.substr(i, 1), 10))) {
          buildYear = buildYear + rawBuildYear.substr(i, 1);
        }
    }
    var age = 2016 - parseInt(buildYear); // Age parameter
    // Get total houses to sell
    var totalHouseNode = node.find('.info-panel').find('.col-2').find('.square').find('div').find('a').find('.num');
    var totalNumHouse = totalHouseNode.text(); // Total number of houses parameter
    // Jump link to find total live ins in community
    var detailInfoUrl = 'http://sh.lianjia.com' + node.find('.info-panel').find('a').attr('href');

    var infoNode = node.find('.actshowMap_list');
    var xiaoqu = infoNode.attr('xiaoqu');
    xiaoqu = xiaoqu.replace(/\'/g, '"');//展示的数据不是标准的json, 处理成标准的json，json要双引号 ['aa'] => ["aa"]
    xiaoqu = JSON.parse(xiaoqu);
    var lat = xiaoqu[1], lng = xiaoqu[0], communityName = xiaoqu[2];
    var districtName = infoNode.attr('districtname');
    var plateName = infoNode.attr('platename');
    var communityId = node.find('.pic-panel').find('a').attr('key');
    var result = {
      community_id: communityId,
      lat: lat,
      lng: lng,
      plate: plateName,
      community_id: communityId,
      district_name: districtName,
      community_name: communityName,
      community_age: age,
      mean_price: curPrice,
      total_num_houses: totalNumHouse,
      detail_info_url: detailInfoUrl
    };
    updateToMongod(result); // If you want to directly export all data only to csv file, comment this line.
    allResult.push(result);
  });
  saveToCSV(allResult);
  console.log('Successfully written to end of myOutput.csv!');
}

module.exports = parser;

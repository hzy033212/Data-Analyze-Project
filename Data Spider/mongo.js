// How to setup mongodb:
// 1) Install Mongodb;
// 2) killall -9 node;
// 3) Go to PWD of mongodb, for example if you use Mac and homebrew, it should be - 
// 		/usr/local/var/homebrew/linked/mongodb/bin
// 4) mongo 

var mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/community'); // 请先确认Mongodb可以访问

var Community = require('./models/community');

module.exports = {
  community: Community
};
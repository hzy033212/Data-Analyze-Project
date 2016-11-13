"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  Model = new Schema({
    address: String,
    lat: Number,
    lng: Number,
    community_name: String,
    plate: String,
    district_name: String,
    community_age: Number,
    mean_price: Number,
    total_num_houses: Number,
    detail_info_url: String,
    total_houses: Number,
    total_buildings: Number,
    community_id: {
      type: 'String',
      index: { unique: true }
    }
  });

Model.index({
  community_id: 1
});

module.exports = mongoose.model("community", Model);
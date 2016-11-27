var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
      lat: Number,
      lng: Number,
      name: String,
      uuid: String
});

module.exports = mongoose.model('roomGame', roomSchema);
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var rankingSchema = new Schema({
	playerName:  String,
	points: Number
});


module.exports = mongoose.model('ranking', rankingSchema);
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var gameSchema = new Schema({
});

module.exports = mongoose.model('games', gameSchema);
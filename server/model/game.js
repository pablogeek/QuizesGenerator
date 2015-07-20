var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var gameSchema = new Schema({
	playerName:  String,
	points: Number
});

gameSchema.statics.random = function(level,callback) {
        this.count({'game.level': level},function(err, count) {
            if (err) {
                return callback(err);
            }
            var rand = Math.floor(Math.random() * count);
            //console.log('count ' + count);
            this.findOne({'game.level':level}).skip(rand).exec(callback);
        }.bind(this));
    };

module.exports = mongoose.model('games', gameSchema);
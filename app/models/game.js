var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence');




var gameSchema = new Schema({

	title 	: 	{ type: String, trim:true,required:true }, 
	content : 	{ type: String, trim:true }, 
	Date 	: 	{ type: Date, default: Date.now },
	catgeory: 	{ type: String, trim:true, required:true},	 
	tags	:   { type: String, required:true},
	url		: 	{ type: String, required:true},
	img_name: 	{ type: String, trim:true},
	swf_name: 	{ type: String, trim:true},
	play_counter : { type: Number, default :0 },
	game_id : { type : Number }

});


 


gameSchema.plugin(AutoIncrement, {inc_field: 'game_id'});

//gameSchema.plugin(autoIncrement.mongoosePlugin);

module.exports = mongoose.model('game',gameSchema);




 
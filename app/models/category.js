var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence');


var categorySchema = new Schema({

	category_id:{type:Number},
	category_name : {type : String, index : {unique:true,dropDups: true}, trim:true}

});


categorySchema.plugin(AutoIncrement, {inc_field: 'category_id'});

module.exports = mongoose.model('categoery', categorySchema);
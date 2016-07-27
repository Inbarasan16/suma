var Game = require('../models/game');
var Category = require('../models/category');
var config = require('../../config');


module.exports = function(app,express){

	var client = express.Router();

	client.get('/loadgames',function(req,res){
		
		 Game.find({},function(err,data){
		 	if(err) return err;

		 	res.json({
		 		success : true,
		 		data : data
		 	});

		 });

	
	});


	return client;

}
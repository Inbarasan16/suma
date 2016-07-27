var User = require('../models/user');
var Game = require('../models/game');
var Category = require('../models/category');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');

var fileManager = require('easy-file-manager');
 



var secretKey = config.secretKey;

function createToken(user) {

    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
    }, secretKey, {
        //expiresIn: 1440
        expiresIn : "10h"
    })


    return token;

}



module.exports = function(app, express) {

    var admin = express.Router()

    admin.post('/signup', function(req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });

        var token = createToken(user);
        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created!',
                token: token

            });

        });
    });


    admin.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                res.json(err);
                return;
            }
            res.json(users);
        })

    });


    admin.post('/login', function(req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({
                    message: "User does not exit"
                });
            } else if (user) {

                var validPassword = user.comparePassword(req.body.password);

                console.log(validPassword);

                if (!validPassword) {
                    res.send({
                        message: "Invalid Password"
                    });
                } else {
                    var token = createToken(user);
                    res.send({
                        success: true,
                        message: "success full login",
                        token: token
                    });
                }
            }

        });
    });



   /* admin.post('/file', function(req, res) {

	fileManager.upload("../../public/uploads/image",  Date.now()+'_'+req.files.thumbnail.name, 
		req.files.thumbnail.data,
    	function(err) {
         if (err) return err;

        fileManager.upload("../../public/uploads/game", Date.now()+'_'+req.files.game.name, 
        	req.files.game.data, 
        	function(err) {
            if (err) return err;

            var game = new Game({
				title: req.body.title,
				content: req.body.content,
				catgeory:req.body.catgeory,
				tags:req.body.tags,
				url:req.body.url,
				img_name:req.files.thumbnail.name,
				swf_name:req.files.game.name
			});

			game.save(function(err, data) {
				if (err) {
				res.send(err);
				}
				res.json({
				success: true,
				message: "Game created successful",
				data: data
				});
			});


        });
     
     });
         
    });*/



    admin.use(function(req, res, next) {
        console.log('some one came to our App');

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        if (token) {
            jsonwebtoken.verify(token, secretKey, function(err, decoded) {
                if (err) {
                    res.status(403).send({ success: false, message: "Failed to authenticate user" });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            res.status(403).send({ success: false, message: "No Token provided" });
        }
    });



   admin.get('/me',function(req,res){

        res.send(req.decoded);
   }); 



    admin.route('/game')
        
    .get(function(req, res) {
            Game.find({}, function(err, data) {
                if (err) {
                    return err;
                }
                res.json(data);
            });
        })

    .post(function(req, res) {


        
        // res.json({"photo":req.files.thumbnail,
        //           "game":req.files.game,
        //           "title":req.body.title
        // });

        
        /*if( req.files.thumbnail.mimetype != 'image/jpeg' ||  
            req.files.game.mimetype != 'application/x-shockwave-flash'){

            res.json({message : 'Sorry unable to process your request'});
            

            }*/
        

     	if(req.files.thumbnail){

     		var thumbnail = Date.now()+'_'+req.files.thumbnail.name;     		     
     	}

        if(req.files.game)
        {
            if(req.files.game.name){
                var gamename  = Date.now()+'_'+req.files.game.name;
                var isswf = true;
            }
            else
            {
                 isswf = false;
            }

        }


     	if(!req.body.url){
            // req.body.url = req.headers.host+'/uploads/game/'+req.files.game.name;
            req.body.url = req.headers.host+'/uploads/game/'+gamename;
          }
           


     	 if(isswf)
     	{

				fileManager.upload("../../public/uploads/image",thumbnail, 
				req.files.thumbnail.data,
		    	function(err) {
		         if (err) return err;

		        fileManager.upload("../../public/uploads/game",gamename, 
		        	req.files.game.data, 
		        	function(err) {
		            if (err) return err;

		            var game = new Game({
						title: req.body.title,
						content: req.body.content,
						catgeory:req.body.catgeory,
						tags:req.body.tags,
						url:req.body.url,
						img_name:thumbnail,
						swf_name:gamename
					});

					game.save(function(err, data) {
						if (err) {
						res.send(err);
						}
						res.json({
						success: true,
						message: "Game created successful",
						data: data
						});
					});
		        });
		     
		     });

		}else
        {

             

            fileManager.upload("../../public/uploads/image",thumbnail, 
                req.files.thumbnail.data,
                function(err) {
                 if (err) return err;

                 var game = new Game({
                        title: req.body.title,
                        content: req.body.content,
                        catgeory:req.body.catgeory,
                        tags:req.body.tags,
                        url:req.body.url,
                        img_name:thumbnail,
                        swf_name:'empty'
                    });


                 game.save(function(err, data) {
                        if (err) {
                            res.send(err);
                        }
                        res.json({
                            success: true,
                            message: "Game created successful",
                            data: data
                        });
                });


             });



        }
         
    	});


    admin.route('/game/:id')


    .delete(function(req,res){

    	Game.findOne({ _id : req.params.id}, function (err, model) {
		    if (err) {
		        // res.json({message:err});
		        return err;
		         console.log(err);

		       
		    }else if(model==null){
		    	res.json({message:"current item not found"});
		    } 
		    else
		    {

		    	var deleteImage =function(){
		    	return new Promise(function(resolve,reject){
		    		fileManager.remove('../../public/uploads/image',model.img_name,function(err){
		    			if(err){
		    				//reject(err); 
		    				return err;
		    			}else
			    			{
			    				resolve();
			    			}
		    			})
		    		})
		    	}

		    	var deleteswf = function(){
		    	return new Promise(function(resolve,reject){
		    		fileManager.remove('../../public/uploads/game',model.swf_name,function(err){
		    			if(err){
		    				//reject(err);
		    				return err;
		    			}else
		    			{
		    				resolve();
		    			}
		    		})

		    		})
		    	}


		    	var deleteDbData = function(){
		    	return new Promise(function(resolve,reject){
		    	model.remove(function (err) {		         	
		         	if(err){
		         		//reject(err);
		         		return err;
		         	}else{		         		
		         		var sent = res.json({
							success : true,
							message : 'game Deleted successfull'    				 
						});	

						resolve(sent);	
		         	}

		    		});

		    		})
		    	}

		    	deleteImage()
		    	.then(deleteswf())		    	 
		    	.then(deleteDbData());
		    	 
		    } 
		});
    })


    .put(function(req,res){

    	  Game.findOne({ _id : req.params.id}, function (err, doc) {
			  if (err){
			  	return err;
			  }

			  if(doc!=null){  
	  			
	  			doc.title = req.body.title,
				doc.content= req.body.content,
				doc.catgeory=req.body.catgeory,
				doc.tags=req.body.tags		 

			  doc.save(function(err,data){
			  	if(err) return err;

			  		res.json({
			  			success : true,
			  			message : "succesfully update",
			  			data : doc
			  		})
			  });
			}else
			{
				res.json({
					success : false,
					message : "unable to find your id"
				})
			}

		  })


    });



     admin.route('/category')
     	.post(function(req,res){

     		var categery = new Category({
     			category_name : req.body.category
     		});

     		categery.save(function(err,data){
     			
     			if(err) return err;
     			  res.json({
     			  	success :true,
     			  	message :'category created !',
     			  	data : data
     			  })


     		});
     	})


     	.get(function(req,res){

     		Category.find({},function(err,data){

     			if(err) return err;

     			res.json({
     				success : true,
     				data : data
     			});

     		})

     	});


     	admin.route('/category/:id')

     		.delete(function(req,res){

     			Category.findOne({ _id : req.params.id},function(err,cate){

     				if(err) return err;

     					if(cate!=null){
     						cate.remove(function(err){
     							res.json({
     								success : true,
     								message : "Category deleted ! ",
     								data : data
     							})
     						})
     					}


     					res.json({
     						success : true,
     						message : "Category Not Found ! "
     					})
     			})
     		})


     		.put(function(req,res){

     			Category.findOne({ _id : req.params.id},function(err,cate){

     					if(err) return err;

     					if(cate!=null){

     						cate.category_name = req.body.category;

     						cate.save(function(err,data){
     							res.json({
     								success : true,
     								message : 'data update success full',
     								data : data
     							})
     						})

     					}

     			});


     		})








    return admin;
}

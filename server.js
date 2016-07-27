var express = require('express');
var app = express();
var multer  = require('multer'); 
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
var mongoose = require('mongoose');
var morgan = require('morgan');
var busboyBodyParser = require('busboy-body-parser');
var helmet = require('helmet');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));

// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


app.use(morgan('dev'));
app.use(express.static(__dirname+'/public'));
//app.use(express.static(__dirname+'/public/view/vendors'));
// app.use(express.static(__dirname+'/public/view/build'));
app.use(express.static(__dirname+'/public/view/admin'));
app.use(busboyBodyParser());
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));



mongoose.connect(config.database,function(err){
	if(err){
		 console.log("Database connection error " + err);
	}else{
		 console.log("Database connected success");
	}
})

var admin = require('./app/route/admin')(app,express);
app.use('/admin',admin);

var client = require('./app/route/client')(app,express);
app.use('/client',client);


app.get('/superuser',function(req,res){
	res.sendFile(__dirname+'/public/admin/index.html');
});

app.get('/',function(req,res){
	res.sendFile(__dirname+'/public/app/view/index.html');
});


/*app.get('*',function(req,res){
	res.sendFile(__dirname+'/public/app/view/index.html');
});
*/






app.listen(config.port,function(err){
	if(err) 
		 console.log(err);
	else
		 console.log('connection success !');
});
    
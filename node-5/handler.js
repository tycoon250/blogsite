let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let app = express();

const server = app.listen(6060,()=>{
		
		console.log("app was connected to port 6060");
	})
module.exports.server = server;
module.exports.app = app;
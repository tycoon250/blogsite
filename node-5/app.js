let express = require('express');
let mongoose = require('mongoose');
let {router} =  require('./router');
const swaggerUi= require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
let {app} = require('./handler')
let bodyParser = require('body-parser');
const path = require('path');
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
mongoose.set("strictQuery",true)
try{
	mongoose.connect('mongodb+srv://vidsiren:vidsiren@cluster0.kcpb03t.mongodb.net/myblogsite').then(()=>{
		console.log('connected to mongo server')	
	})
} catch{
	console.log(error)
}
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/api',router);

	



module.exports.app  =  app

		
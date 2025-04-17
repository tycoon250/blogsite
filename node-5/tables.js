let mongoose = require('mongoose');
let tablescheme =  mongoose.Schema({
	firstname: String,
	lastname: String,
	email: String,
	subject: String,
	message: String
})
module.exports = mongoose.model("queries",tablescheme);

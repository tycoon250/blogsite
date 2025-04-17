let express = require('express');
let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let secretkey = "myguy";
let router = express.Router();
let {server} = require('./handler')
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
// In server.js
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();


// In some other file where you need to use mysocket


let tableQueriesScheme =  mongoose.Schema({
	firstname: String,
	lastname: String,
	email: String,
	subject: String,
	message: String,
	status: String
})
let tableAdminScheme =  mongoose.Schema({
	username: String,
	password: String,
	email : String,
	status: String
})

let blogsTableScheme = mongoose.Schema({
	ownr_name : String,
	blog_type : String,
	description: String,
	title: String,
	image: String,
	lstatus: String,
	comments : [mongoose.Schema.Types.Mixed],
	likes : [mongoose.Schema.Types.Mixed]
})
let tableUsersScheme =  mongoose.Schema({
	firstname: String,
	lastname: String,
	email: String,
	password: String,
	subrole: String
	})
let queries = mongoose.model('queries', tableQueriesScheme);
let users = mongoose.model('users',tableUsersScheme);
let blogs = mongoose.model('blogs',blogsTableScheme);
let admin = mongoose.model('admin',tableAdminScheme);
let mysocket;
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('message', (data) => {
        console.log(`Received message: ${data}`);
		    socket.emit('acknowledge', 'Message received');
    });
    socket.on('newcommentdata', (comment) => {
		    io.emit('newcomment', comment);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

})  
			// ========================================================================= UPDATES ================

				router.get('/hello', async (req,res)=>{
					res.send('hi');
				})
				router.post('/editblog', async (req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											blogs.updateMany({_id: req.body.id},req.body,{new: true},(err,result)=>{
												if (err) res.send(err)
												if(result.modifiedCount > 0){
													res.send({success:true,message: "blog was sucessfully updated"});
												}else{
													res.send({success:false,message: "blog was not found"});
												}
											})	
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to update blogs"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
					})
				})
				router.post('/editquery', async(req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											 queries.updateMany({_id:req.body.id},req.body,{new : true},(err,result)=>{
												if (err) res.send(err)
													if (result.modifiedCount > 0) {
														res.send({success: true,message:"query upated sucessfully"})
													}else{
														res.send({success: false,message:"query was not found"})
													}
											});
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete queries"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
					})
					
					
				})


				router.post('/permituser', async(req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											users.updateMany({_id:req.body.id},{$set: {subrole: "_blogPOSTER_"}},(err,result)=>{
												if (err) res.send(err)
													if (result.modifiedCount > 0) {
														res.send({success:true,message:"permition granted sucessfully"})
													}else{
														res.send({success:false,message:"user was not found"})
													}
											});
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete queries"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
					})
				})

				// ============================================= DELETES ============================================


				router.post('/unpermituser', async(req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											users.updateMany({_id:req.body.id},{$set: {subrole: "user"}},(err,result)=>{
												if (err) res.send(err)
													if (result.modifiedCount > 0) {
														res.send({success:true,message:"permition revoked sucessfully"})
													}else{
														res.send({success:false,message:"user was not found"})
													}
											});
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete queries"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
					})
				})



				router.post('/deletequery', async(req,res)=>{
					 	authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											let results = queries.deleteOne({_id : req.body.id},(err,result)=>{
										 		if (err)  return res.send(err)
										 		if (result.deletedCount > 0) {
										 			res.send({success: true, message:"query deleted sucessfully"});
										 		}else{
										 			res.send({success: false, message: "query was not found"})
										 		}
										 	});
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete queries"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
						})
					 
				})

				router.post('/deleteblog', async(req,res)=>{
					 	
					 	authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											let results = blogs.deleteOne({_id : req.body.blogid},(err,result)=>{
										 		if (err)  return res.send(err)
										 		if (result.deletedCount > 0) {
													res.send({success: true, message: "blog deleted sucessfully"});
										 		}else{
													res.send({success: false, message: "the blog was not found"});
										 		}
										 	});
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete blogs"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
						})
					 

				})

				router.post('/deleteuser', async(req,res)=>{
					 	authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success: false, message:  error})
										if (result){
											users.deleteMany({_id : req.body.id},(err,result)=>{
									 		if (err)  return res.send(err)
									 			if (result.deletedCount > 0) {
									 				res.send({success:true, message:"the user was deleted sucessfully"});
									 			}else{
									 				res.send({success:false, message:"the user was not found"});
									 			}
									 		});
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete users"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
						})
				})

				router.post('/deletecomment', async (req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											blogs.findOne({_id: req.body.blogid},(error,result)=>{
												if (error) return res.send({success:false, message: error})
												if (result) {
												 	blogs.updateOne({_id: req.body.blogid}, {$pull: {comments: {id: req.body.commentid}}},(err,result)=>{
														if (err)  return res.send(err)
														if (result.modifiedCount > 0) {
															res.send({success:true,message:"the comment was deleted sucessfully"});
														}else{
															res.send({success:false,message:"the comment was not found"});
														}
													});
												}else{
													res.send({success: false, message: "blog not found"});
												}
											})
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete comments"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
						})
				})


				// ======================================== INSERTS ================================================


				router.post('/signup', async (req,res)=>{
					checkemail(req, res, (dec) => {
				  		if (!dec.success) {
							let request = new users({
											firstname : req.body.firstname,
											lastname : req.body.lastname,
											email : req.body.email,
											password : req.body.password,
											subrole : "user"
							})

							 request.save(err=>{
								if (err) return res.send(err) 
								res.send({ success: true, message: "your account was created successfully login to proceed 🙃" });
							});

				  		}else{
				  			res.send({success: false, message: 'looks like the entered email is in use try another one'})
				  		}
					});
				})
				router.post('/addblog', async (req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
						if (tokendata.success) {
							if(tokendata.message.role == '_admin_'){
								admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
									if (error) return res.send({success:false, message: error})
									if (result){
										let request = new blogs({
											ownr_name : "admin",
											blog_type : "_ADMIN_BLOG_",
											title : req.body.title,
											image: req.body.image,
											lstatus: "no",
											description: req.body.description,
											comments : [],
											likes : []
										})

										request.save(err=>{
											if (err) return res.send(err) 
											res.send({ success: true, message: "blog added successfully" });
										})
									}else{
										res.send({success: false, message: "admin not found"});
									}
								})
							}else if(tokendata.message.subrole == '_blogPOSTER_'){
								users.findOne({_id: tokendata.message.userid},(error,result)=>{
									if (error) return res.send({success:false, message: error})
									if (result){
										let request = new blogs({
											ownr_name : result.firstname+" "+result.lastname,
											blog_type : "_USER_BLOG_",
											title : req.body.title,
											image: req.body.image,
											lstatus: "no",
											description: req.body.description,
											comments : [],
											likes : []
										})

										request.save(err=>{
											if (err) return res.send({success: false, message: err}); 
											res.send({ success: true, message: "blog added successfully" });
										})
									}else{
										res.send({success: false, message: "admin not found"});
									}
								})
							}else{
								res.send({success: false, message: "only admins are allowed to post blogs"});
							}
						}else{
							res.send({success: false, message: tokendata.message});
						}
					})
				})
				router.post('/addadmin', async(req,res)=>{
						admin.find((error,result)=>{
							if (error) return res.send({success:false, message: error})
							if (result.length > 0) {
								res.send({success: false, message: "admin already exist"})
							}else{
								let request = new admin({
												username : req.body.username,
												password : req.body.password,
												email : req.body.email,
												status: "available"
											}) 
								 	request.save(err=>{
									if (err) return res.send(err)
									res.send({ data: true, message: "admin account created successfully" });
								});
							}
						})
				})
				router.post('/addquery', async(req,res)=>{
					let request = new queries({
									firstname : req.body.firstname,
									lastname : req.body.lastname,
									email : req.body.email,
									subject : req.body.subject,
									message : req.body.message,
									status: "new"
								}) 
					await request.save(err=>{
						if (err) return res.send(err)
						res.send({ success: true, message: "Query sent successfully i will reply you as soon as possible" });
					});
				})
				router.post('/addcomment', async (req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
						if (tokendata.success) {
							if(tokendata.message.role == '_user_'){
								users.findOne({_id: tokendata.message.userid},(error,resultuser)=>{
									if (error) return res.send({success:false, message: error})
									if (resultuser){
										blogs.findOne({_id: req.body.id},(error,resultblog)=>{
											if (error) return res.send({success:false, message: error})
											if (resultblog) {
												Object.assign(req.body.data,{userId: tokendata.message.userid});
												Object.assign(req.body.data,{id: generateUniqueId()});
												let results = blogs.findOneAndUpdate({_id: req.body.id}, {$push: {comments : req.body.data}},error=>{
													if (error) return res.send({success:false, message: error});
													res.send({ success: true, message: "comment added successfully" });
												})
											}else{
												res.send({success: false, message: "blog not found" });
											}
										})
									}else{
										return res.send({success: false , message:"user not found"});
									}
								})
							}else if(tokendata.message.role == '_admin_'){
								admin.findOne({_id: tokendata.message.adminid},(error,resultuser)=>{
									if (error) return res.send({success:false, message: error})
									if (resultuser){
										blogs.findOne({_id: req.body.id},(error,resultblog)=>{
											if (error) return res.send({success:false, message: error})
											if (resultblog) {
												Object.assign(req.body.data,{userId: tokendata.message.adminid});
												Object.assign(req.body.data,{id: generateUniqueId()});
												let results = blogs.findOneAndUpdate({_id: req.body.id}, {$push: {comments : req.body.data}},error=>{
													if (error) return res.send({success:false, message: error});
													res.send({ success: true, message: "comment added successfully" });
												})
											}else{
												res.send({success: false, message: "blog not found" });
											}
										})
									}else{
										 res.send({success: false , message:"user not found"});
									}
								})
							}else {
								res.send({success: false, message: "only users are alowed to comment"});
							}
						}else{
							res.send({success: false, message: "looks like you are not logged in"});	
						}
					})
				})
				router.post('/addlike', async (req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
						if (tokendata.success) {
							if(tokendata.message.role == '_user_'){
								users.findOne({_id: tokendata.message.userid},(error,result)=>{
									if (error) return res.send({success:false, message: error})
										if (result){
											blogs.findOne({_id: req.body.id},(error,result)=>{
												if (error) return res.send({success:false, message: error})
												if (result) {
													blogs.find({_id: req.body.id}, {likes: {$elemMatch: {userId: tokendata.message.userid}}},(error,result)=>{
														if (result[0].likes.length > 0) {
															removelike(req.body.id,tokendata.message.userid,callback=>{
																res.send({success: false, message: "you have already liked this post so the like was removed"});
															})					
														}else{
															Object.assign(req.body.data,{userId: tokendata.message.userid});
															let results = blogs.findOneAndUpdate({_id: req.body.id}, {$push: {likes : req.body.data}},error=>{
																if (error) return res.send({success:false, message: error});
																res.send({ success: true, message: "like added successfully" });
															})
														}
													})
												}else{
													res.send({ success: false, message: "blog not found" });
												}
											});
										}else{
											return res.send({success: false , message:"user not found"});
										}
								})
							}else if(tokendata.message.role == '_admin_'){
								admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
									if (error) return res.send({success:false, message: error})
										if (result){
											blogs.findOne({_id: req.body.id},(error,result)=>{
												if (error) return res.send({success:false, message: error})
												if (result) {
													blogs.find({_id: req.body.id}, {likes: {$elemMatch: {userId: tokendata.message.adminid}}},(error,result)=>{
														if (result[0].likes.length > 0) {
															removelike(req.body.id,tokendata.message.adminid,callback=>{
																res.send({success: false, message: "you have already liked this post so the like was removed"});
															})					
														}else{
															Object.assign(req.body.data,{userId: tokendata.message.adminid});
															let results = blogs.findOneAndUpdate({_id: req.body.id}, {$push: {likes : req.body.data}},error=>{
																if (error) return res.send({success:false, message: error});
																res.send({ success: true, message: "like added successfully" });
															})
														}
													})
												}else{
													res.send({ success: false, message: "blog not found" });
												}
											});
										}else{
											return res.send({success: false , message:"admin not found"});
										}
								})
							}else{
								res.send({success: false, message: "only users are alowed to like"});
							}
						}else{
							res.send({success: false, message: "looks like you are not logged in"});
						}
					})
				})


				// ============================================ CHECKS ============================================
				router.post('/login', (req,res)=>{
					const string = { email: req.body.email, password: req.body.password }
					let request =  users.findOne(string, (error,result)=> {
						if (error) return res.send({success:false, message: error})
						if (result){
							let letoken = addToken({userid :result._id, role: "_user_" ,subrole:result.subrole});
							return res.send({success: true,token: letoken,name: result.firstname+" "+result.lastname, uid: generateUniqueId()});	
						}else{
							return res.send({success: false,content:"incorrect email or password "});
						}
					});
				})
				router.post('/adminlogin', (req,res)=>{
					const string = { username: req.body.username, password: req.body.password }
					let request =  admin.findOne(string, (error,result)=> {
						if (error) return res.send({success:false, message: error})
						if (result){
							let letoken = addToken({adminid :result._id, role: "_admin_"});
							return res.send({success: true,message:"admin logged in successfully",token: letoken});	
						}else{
							return res.send({success: false,content:"incorrect email or password"});
						}
					});
				})
				router.post('/checkEmail', (req,res)=>{
					checkemail(req, res, (dec) => {
				  		res.send(dec);
					});
				})
				// ======================================== RETRIEVES ============================================
				router.post('/ftchnbrs', async(req,res)=>{
					authenticateToken(req.body.token, async (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid}, async(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
												let totusrs = await users.find();
												let totblogs = await blogs.find();
												let totqueries = await queries.find();
												let totuqueries = await queries.find({status: 'new'});	
												let response = { success: true, message: [{id:'users',total: totusrs.length},{id:'blogs',total: totblogs.length},{id:'queries',total: totqueries.length},{id:'nqueries',total: totuqueries.length}]}
												res.send(response);
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to fetch system numbers"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
					})
				})
				router.post('/viewblogs', async (req,res)=>{
					if (req.body.token != null) {
					 	authenticateToken(req.body.token, async (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_user_'){
									 blogs.find(async (error,result)=>{
										if (error) return res.send({success: false, message: error})
										if (result.length > 0) {
											result.forEach(ls=>{
												result[result.indexOf(ls)].lstatus = false
												for (const lks of ls.likes){
													if (lks.userId == tokendata.message.userid) {
												  		result[result.indexOf(ls)].lstatus = true
												  	}else{
												  		// result[result.indexOf(ls)].lstatus = false
												  	}
												}
											})
											res.send({success:true, message: result})
										}else{
											res.send({success:false, message: 'no blogs found!'})
										}
									});
								}
							}
						})
					}else{
						blogs.find(async (error,result)=>{
							if (error) return res.send({success: false, message: error})
							if (result) {
								result.forEach(ls=>{
									result[result.indexOf(ls)].lstatus = false
								})
								res.send({success:true, message: result})
							}else{
								res.send({success:false, message: 'no blogs found!'})
							}
						});
					 }
				})
				router.post('/ftchblgswthcndtn', async (req,res)=>{
					if (req.body.token != null) {
					 	authenticateToken(req.body.token, async (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,resultadmin)=>{
										if (error) return res.send({success: false, message: error})
										if (resultadmin) {
											console.log(req.body.condition)
											blogs.find({blog_type: req.body.condition},async (error,result)=>{
												if (error) return res.send({success: false, message: error})
												if (result.length > 0) {
													result.forEach(ls=>{
														result[result.indexOf(ls)].lstatus = false
														for (const lks of ls.likes){
															if (lks.userId == tokendata.message.userid) {
														  		result[result.indexOf(ls)].lstatus = true
														  	}else{
														  		// result[result.indexOf(ls)].lstatus = false
														  	}
														}
													})
													res.send({success:true, message: result})
												}else{
													res.send({success:false, message: 'no blogs found!'})
												}
											});		
										}else{
											res.send({success:false, message: 'Oops, admin not found!'})
										}
									})
								}
							}else{
								res.send({success:false, message: 'Oops, an error occured!'})

							}
						})
					}
				})
				router.post('/getblog', async (req,res)=>{
					 if (req.body.token != null) {
					 	authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_user_'){
									blogs.findOne({_id: req.body.blogid},async (error,result)=>{
										if (error) return res.send({success: false, message: error})
										if (result) {
											// if (result.blog_type == ) {}
											for (const lks of result.likes){
											  let theu = await users.findOne({_id: lks.userId});
												if (lks.userId == tokendata.message.userid) {
											  		result.lstatus = true;
											  	}
											}
											for (const rss of result.comments) {
											  let theu = await users.findOne({_id: rss.userId});
											  if (theu != null) {
													  if (rss.userId == tokendata.message.userid) {
													  	Object.assign(result.comments[result.comments.indexOf(rss)], {ownername: "me"});
													  }else{
													  	Object.assign(result.comments[result.comments.indexOf(rss)], {ownername: theu.firstname+" "+theu.lastname});
													  }
											  }else{
											  		let theu = await admin.findOne({_id: rss.userId});
														if (rss.userId == tokendata.message.adminid) {
													  	Object.assign(result.comments[result.comments.indexOf(rss)], {ownername: "me"});
													  }else{
													  	Object.assign(result.comments[result.comments.indexOf(rss)], {ownername:"admin"});
													  }
											  }
											}
											console.log(result.lstatus)
											res.send({success:true, message: result})
										}
									});
								}
							}
						})
					 }else{
						blogs.findOne({_id: req.body.blogid},async (error,result)=>{
							if (error) return res.send({success: false, message: error})
							if (result) {
								
								for (const rss of result.comments) {
								  let theu = await users.findOne({_id: rss.userId});
								  if (theu != null) {
								  	Object.assign(result.comments[result.comments.indexOf(rss)], {ownername: theu.firstname+" "+theu.lastname});
								  }else{
								  	let theu = await admin.findOne({_id: rss.userId});
								  	Object.assign(result.comments[result.comments.indexOf(rss)], {ownername:"admin"});

								  }
								}
								result.lstatus = false
								console.log(result.lstatus)
								res.send({success:true, message: result})
							}
						});
					 }
				})
				router.post('/viewqueries',  async(req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											 let request = queries.find((error,result)=>{
					 						 	res.send({success: true,message: "data fetched successfully",data:result});

											 });
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to delete users"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
						})
				})
				router.post('/viewusers',  async(req,res)=>{
					authenticateToken(req.body.token, (tokendata)=>{
							if (tokendata.success) {
								if(tokendata.message.role == '_admin_'){
									admin.findOne({_id: tokendata.message.adminid},(error,result)=>{
										if (error) return res.send({success:false, message: error})
										if (result){
											  users.find((error,result)=>{
					 						 	res.send({success: true,message: result});
											 });
										}else{
											res.send({success: false, message: "admin not found"});
										}
									})
								}else{
									res.send({success: false, message: "only admins are allowed to view users"});
								}
							}else{
								res.send({success: false, message: "Oops! an error occured"});
							}
						})
				})
				 
				//========================================= FUNCTIONS ==========================================
				function checkemail(req, res, callback) {
				  const string = { email: req.body.email };
				  users.findOne(string, (error, result) => {
				    if (error) return res.send({success:false, message: error});

				    let response;
				    if (result) {
				      response = {success: true, content: "email found"};
				    } else {
				      response = {success: false, content: "email is not available"};
				    }

				  	callback(response);
				  });
				  
				}
				 function authenticateToken(token,callback){
				  	jwt.verify(token, secretkey, (err, decoded) => {
				  	  let response;
					  if (err) {
					  	response = {success: false, message: err.message};
					  } else {
					  	response = {success : true,message: decoded};
					  }
					   callback(response);
					});
				}
				function addToken(userInfo) {
				  	const token = jwt.sign(userInfo, secretkey);
				  	return token;
				}
				function removelike(blogid,userids,callback) {
				  	let results = blogs.updateOne({_id: blogid}, {$pull: {likes: {userId: userids}}},(err)=>{
						if (err)  return callback(err)
						callback("the like was removed sucessfully");
					});
				}
				const generateUniqueId = () => {
				   return crypto.randomBytes(9).toString('hex');
				};
		

module.exports.router = router;
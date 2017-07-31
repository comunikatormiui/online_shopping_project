//Reference:
//https://github.com/expressjs/multer
var express = require('express');
var router = express.Router();
var multer = require('multer');
var Image = require('../models/image');


router.getImages = function(callback, limit) {
	Image.find(callback).limit(limit);
}
 
router.getImageById = function(id, callback) {
	Image.findById(id, callback);
}
 
router.addImage = function(image, callback) {
	Image.create(image, callback);
}
 
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'public/uploads/')  //upload file to this folder
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
		//cb(null, file.originalname + '-' + Date.now())
	}
});
 
var upload = multer({
	storage: storage
});
 
router.get('/', function(req, res, next) {
	res.render('imagefile');
});
 
router.post('/', upload.any(), function(req, res, next) {
	//res.send("File upload sucessfully.");
	res.send(req.files);
 
	/*req.files has the information regarding the file you are uploading from the total information
	just using the path and the imageName to store in the mongodb*/
	var path = req.files[0].path;
	var imageName = req.files[0].originalname;

	var imagepath = {};	//imagepath contains two objects, path and the imageName
	imagepath['path'] = path;
	imagepath['originalname'] = imageName;

	//we are passing two objects in the addImage method.. which is defined above..
	router.addImage(imagepath, function(err) {});
});
 
module.exports = router;
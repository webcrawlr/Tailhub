/*Updates:
Bryce Baker:
5/27
wrote:
	controller variable
	control structure for routing post data
5/29
    added 6 more entries to the control structure
 */


var express = require('express');
var router = express.Router();

var controller = require('../controller/database');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}


//post data routed to controller for processing
//router.post("/createProfile", controller.createProfile);

//router.post("/editProfile", controller.editProfile);

//router.post("/deleteProfile", controller.deleteProfile);

//router.post("/sendMessage", controller.sendMessage);

//router.post("/readMessage", controller.readMessage);

//router.post("/deleteMessage", controller.deleteMessage);

//router.post("/friendRequest", controller.friendRequest);

//router.post("/friendAccept", controller.friendAccept);

//router.post("/friendDecline", controller.friendDecline);

//router.post("/unfriend", controller.unFriend);

//router.post("/block", controller.block);

//router.post("/unblock", controller.unblock);

//router.post("/paw5", controller.paw5);

//router.post("/follow", controller.follow);

//router.post("/unfollow", controller.unfollow);

router.post("/newPost", controller.newPost);

//router.post("/comment", controller.comment);

//router.post("/share", controller.share);

//router.post("/getProfile", controller.getProfile);

//router.post("/getPosts", controller.getPosts);

//router.post("/getFriends", controller.getFriends);

//router.post("/getFollowers", controller.getFollowers);

//router.post("/getFollowing", controller.getFollowing);

//router.post("/getMessages", controller.getMessages);

//router.post("/getComments", controller.getComments);

module.exports = router;

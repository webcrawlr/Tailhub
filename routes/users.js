var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest: './uploads'});
var mongodb;
mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI||'mongodb://CSUEB_PETPICS:cs4310_SE@ds231070.mlab.com:31070/tailhub_db';

var User = require('../models/user');
var Post = require('../models/post');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.get('/contentpost', function(req, res, next) {
    res.render('contentpost', {title:'ContentPost'});
});

router.get('/post', function(req, res, next) {
    res.render('newPost', {title:'Create Post'});
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   res.redirect('/');
   res.send(req.user.username);
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));

router.post("/post", function (err, res, next) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //generate current date
        var date = new Date();
        var now = date.toUTCString();

        //create profile object for database submission
        var newPost = {
            username: req.body.username,
            postId: req.body.postId,
            rePost: req.body.rePost,
            oPoster: req.body.oPoster,
            text: req.body.text,
            media: req.body.media,

            paw5Counter: 0,
            paw5List: {},
            emailFlag: false,
            location: req.body.location,
            creationDate: now,
            groomFeedFlag: req.body.groomFeedFlag,
            shareCount: 0
        };

        //insert new database entry for the user
        db
            .collection('posts')
            .insertOne(
                newPost,
                function (err) {
                    if (err) throw err;
                }
            );

        //close connection
        db
            .close(function (err) {
                if (err) throw err;
            });

        var response = "this is a response";

        //respond
        res.write(response);
        res.end();

    });
});

router.post('/register', upload.single('profileImg'), function(req, res, next) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

  // Form Validator
  //req.checkBody('name','Name field is required').notEmpty();
  //req.checkBody('email','Email field is required').notEmpty();
  //req.checkBody('email','Email is not valid').isEmail();
  //req.checkBody('username','Username field is required').notEmpty();
  //req.checkBody('password','Password field is required').notEmpty();
  //req.checkBody('password2','Passwords do not match').equals(req.body.password);

  // Check Errors
  //var errors = req.validationErrors();

    /*
    if(req.file){
        console.log('Uploading File...');
        var path = req.file.path;
        var fileName = req.file.filename;

    } else {
        console.log('No File Uploaded...');
        var fileName = 'noimage.jpg';
        var path = 'n/a';
    };

    */

  //if(errors){
  	//res.render('register', {
  		//errors: errors
  	//});
  //} else{
  	var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    //req.flash('success', 'You are now registered and can login');

    //res.location('/');
    //res.redirect('/');
    res.write(name);
    res.write(username);
    res.write(email);
    res.end();
 // }

});



router.post('/contentpost', upload.single('media') ,function(req, res, next) {

  var text = req.body.text;
  var username = req.body.username;

  /*
    if(req.file){
        console.log('Uploading File...');
        var path = req.file.path;
        var fileName = req.file.filename;

    } else {
        console.log('No File Uploaded...');
        var fileName = 'noimage.jpg';
        var path = 'n/a';
    };

    //console.log(req.file);

    // Form Validator
    req.checkBody('postText','text for post is required').notEmpty();


    // Check Errors
    var errors = req.validationErrors();

    if(errors){
        res.render('index', {
            errors: errors
        });

    } else{

*/
        var newPost = new Post({
            username: username,
            text: text,
            date: (new Date).getTime()

        });


        Post.createPost(newPost, function(err, post){
            if(err) throw err;
            console.log(post);
        });


        //res.location('/users/contentpost');

        //var callback;

        /*
        Post.getPostByUsername(username, function(err, callback) {

            if(err) throw err;

               // res.render('image', {
                  //  results: callback
                //});

            res.contentType(callback.img.contentType);
            res.send(callback.img.data);
        });
*/

    //}

    res.write(text);
    res.end();


});


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;


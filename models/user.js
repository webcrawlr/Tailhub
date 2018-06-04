var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://steven:1234567890@ds231070.mlab.com:31070/tailhub_db');

var db = mongoose.connection;

var path = require('path');

var fs = require('fs');

// User Schema
var UserSchema = mongoose.Schema({

	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	species: {
		type: String
	},
	breed: {
		type: String
	},
	age: {
		type: Number
	},
    location: {
		type: String
	},
    email: {
        type: String
    },
	profileImg: {
        data: Buffer,
        contentType: String
    },


	paw5Counter: {
        type: Number
    },
    paw5List: [{
        type: String
    }],
    emailFlag: {
        type: Boolean
    },
    creationDate: {
        type: String
    },
    postCount: {
        type: Number
    },
    messageCount: {
        type: Number
    },

	friendRequests: [{
    	type: String
	}],

    blockList: [{
        type: String
    }]

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};

//query by username
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
};

//stores data to mongoDB and also encrypts password
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {

            newUser.password = hash;

            //newUser.img.data = fs.readFileSync(path);
            //newUser.img.contentType = 'image/png';
            //newUser.save();
            // fs.unlinkSync(path);

            newUser.save(callback);
        });
	});
};

module.exports.verifyPassword = function(password, callback) {
    callback(bcrypt.compareSync(password, this.password));
};
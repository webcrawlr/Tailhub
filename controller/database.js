/*Updates:
Bryce Baker:
wrote version 0.1
*/

//Version: 0.1

var mongodb;
mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI||'mongodb://CSUEB_PETPICS:cs4310_SE@ds231070.mlab.com:31070/tailhub_db';


//createProfile
module.exports.createProfile = function(req,res){
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function(err,db){
        if(err)throw err;

        //generate current date
        var date = new Date();
        var now = date.toUTCString();

        //create profile object for database submission
        var profile = {
            username:   req.body.username,
            password:   req.body.password,
            species:    req.body.species,
            breed:      req.body.breed,
            age:        req.body.age,
            location:   req.body.location,
            email:      req.body.email,

            paw5Counter:    0,
            paw5List:       {},
            emailFlag:      false,
            creationDate:   now,
            postCount:      0,
            messageCount:   0,
            friendRequests: {},
            blockList:      {}
        };

        //insert new database entry for the user
        db
            .collection('profiles')
            .insertOne(profile,function(err){if(err)throw err;});

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};


//editProfile
module.exports.editProfile=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get info from old database entry
        var profile = db
            .collection('profiles')
            .find({
                username: req.body.username
            });

        //update database entry
        db
            .collection('Profiles')
            .replaceOne(
                { username: req.body.username },
                {
                    username:   req.body.username,
                    password:   req.body.password,
                    species:    req.body.species,
                    breed:      req.body.breed,
                    age:        req.body.age,
                    location:   req.body.location,
                    email:      req.body.email,

                    paw5Counter:    profile.paw5Counter,
                    paw5List:       profile.paw5List,
                    emailFlag:      profile.emailFlag,
                    creationDate:   profile.creationDate,
                    postCount:      profile.postCount,
                    messageCount:   profile.messageCount,
                    friendRequests: profile.friendRequests,
                    blockList:      profile.blockList
            })
    })
};


//deleteProfile
module.exports.deleteProfile=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get username to delete
        var username = req.body.username;

        //search comments database & deletes entries by user
        db
            .collection('comments')
            .deleteMany({
                username: username
            });

        //search posts database & delete entries by user
        db
            .collection('posts')
            .deleteMany({
                username: username
            });

        //search messages database & delete entries sent to user
        db
            .collection('messages')
            .deleteMany({
                username: username
            });

        //search messages database & delete entries sent from user
        db
            .collection('messages')
            .deleteMany({
                sender: username
            });

        //search friends database & delete user entry
        db
            .collection('friends')
            .deleteOne({
                username: username
            });

        //search followers database and delete user's entry
        db
            .collection('followers')
            .deleteOne({
                username: username
            });

        //search following database and delete user's entry
        db
            .collection('following')
            .deleteOne({
                username: username
            });

        //search profiles database & delete entry
        db
            .collection('profiles')
            .deleteOne({
                username: username
            });

        //search friends database & delete entry from other user's lists
        //get users that are friends
        var users = db
            .collection('friends')
            .find(
                { list: username }
            );

        //update each user's list
        var user;
        for( user in users) {
            var i = 0;
            var u = 0;
            var length = user.list.length;
            var newList = [length - 1];

            //build new list from old list, without the deleted user's username
            for(i;i<length;i++) {
                if (user.list[i] != username) {
                    newList[u] = user.list[i];
                    u++;
                }
            }

            //update database entry
            db
                .collection('friends')
                .updateOne(
                    {username: user.username},
                    {
                        $set:
                            {list: newList}
                    }
                );
        }

        //search followers database & delete entry from other user's lists
        //get users that are followers
        users = db
            .collection('followers')
            .find(
                { list: username }
            );

        //update each user's list
        for( user in users) {
            var i = 0;
            var u = 0;
            var length = user.list.length;
            var newList = [length - 1];

            //build new list from old list, without the deleted user's username
            for(i;i<length;i++) {
                if (user.list[i] != username) {
                    newList[u] = user.list[i];
                    u++;
                }
            }


                //update database entry
            db
                .collection('followers')
                .updateOne(
                    {username: user.username},
                    {
                        $set:
                            {list: newList}
                    }
                );
        }


        //search following database & delete entry from other user's lists
        //get users that are following
        users = db
            .collection('following')
            .find(
                { list: username }
            );

        //update each user's list
        for( user in users) {
            var i = 0;
            var u = 0;
            var length = user.list.length;
            var newList = [length - 1];

            //build new list from old list, without the deleted user's username
            for (i; i < length; i++) {
                if (user.list[i] != username) {
                    newList[u] = user.list[i];
                    u++;
                }
            }

                //update database entry
                db
                    .collection('following')
                    .updateOne(
                        {username: user.username},
                        {
                            $set:
                                {list: newList}
                        }
                    );
        }
    })
};


//sendMessage
module.exports.sendMessage=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get username
        var username = req.body.username;

        //get user message count
        var count = db
            .collection('profiles')
            .find({ username: username })
            .project({
                messageCount: 1,
                _id: 0
            });

        //increment sender message count
        count++;

        //update sender message count
        db
            .collection('profiles')
            .updateOne(
                { username: username },
                { $set:
                    { messageCount: count }
                }
            );

        //generate current date
        var date = new Date();
        var now = date.toUTCString();

        //create a message object
        var message = {
            username: req.body.otherUser,
            sender: username,
            number: username + count,
            message: req.body.message,
            creationDate: now,
            readFlag : false
        };

        //insert new database entry into messages database
        db
            .collection('messages')
            .insertOne(message, function(err){if(err)throw err;});

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};


//readMessage


//deleteMessage


//friendRequest


//friendAccept


//friendDecline


//unFriend


//block


//unblock


//paw5


//follow


//unfollow


//post


//comment


//share


//getProfile


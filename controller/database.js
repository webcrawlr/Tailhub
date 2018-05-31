/*Updates:
Bryce Baker:
5/27
wrote:
    createProfile
    editProfile
    deleteProfile
    sendMessage
5/29
    added module connection, mongodb connection, & mongodb connection termination to all functions
wrote:
    friendRequest
    friendAccept
    friendDecline
    unfriend
    post
    getProfile
    getPosts (needs updating)
*/

//Version: 0.2

var mongodb;
mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI||'mongodb://Bryce:1lavalamp@ds231070.mlab.com:31070/tailhub_db';
var User = require('../models/user');



//createProfile
module.exports.createProfile = function(req,res){

    /********************************************************************************************************
     //                  createProfile has been seized by Steven Phan
     //
     //*******************************************************************************************************/
    /*
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
            .insertOne(
                profile,
                function(err){if(err)throw err;}
            );

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
    */

    var date = new Date();
    var now = date.toUTCString();

    //(new Date).getTime()

    var newUser = new User({

        username:   req.body.username,
        password:   req.body.password,
        species:    req.body.species,
        breed:      req.body.breed,
        age:        req.body.age,
        location:   req.body.location,
        email:      req.body.email,

        paw5Counter:    0,
        paw5List:       'n/a',
        emailFlag:      false,
        creationDate:   now,
        postCount:      0,
        messageCount:   0,
        friendRequests: 'n/a',
        blockList:      'n/a'
    });

    //Uses class function to write to mongoDB
    User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
    });

    var response = "this is a response";

    //respond
    res.write(response);
    res.end();

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
        count.messageCount++;

        //update sender message count
        db
            .collection('profiles')
            .updateOne(
                { username: username },
                { $set:
                    { messageCount: count.messageCount }
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
            .insertOne(message,function(err){if(err)throw err;});

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};


//readMessage
/*
module.exports.readMessage=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//deleteMessage
/*
module.exports.deleteMessage=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//friendRequest
module.exports.friendRequest=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get the other user's friend requests
        var requests = db
            .collection('profiles')
            .find(
                { username: req.body.otheruser }
            )
            .project(
                { friendRequests: 1, id_: 0 }
            );

        //append the user's name
        requests.friendRequests.push(req.body.username);

        //update otheruser's profiles database entry
        db
            .collection('profiles')
            .updateOne(
                { username: req.body.otheruser },
                { friendRequests: requests.friendRequests }
            );

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};


//friendAccept
module.exports.friendAccept=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get the user's friend requests
        var requests = db
            .collection('profiles')
            .find(
                { username: req.body.otheruser }
            )
            .project(
                { friendRequests: 1, id_: 0 }
            );

        //remove otherUser from user's friendRequests list
        var index = requests.friendRequests.indexOf(req.body.username);
        if(index > -1){
            requests.friendRequests.splice(index, 1);
        }

        //update user's profiles database entry
        db
            .collection('profiles')
            .updateOne(
                { username: req.body.username },
                { friendRequests: requests.friendRequests }
            );

        //get user's friends list
        var newList = db
            .collection('friends')
            .find(
                { username: req.body.username }
            )
            .project(
                { list: 1 }
            );

        //append otherUser's username
        newList.list.push(req.body.otherUser);

        //update user's friends database entry
        db
            .collection('friends')
            .updateOne(
                { username: req.body.username },
                { list: newList }
            );

        //get otherUser's friends list
        newList = db
            .collection('friends')
            .find(
                { username: req.body.otherUser }
            )
            .project(
                { list: 1 }
            );

        //append the user's username
        newList.list.push(req.body.username);

        //update the otherUser's friends database entry
        db
            .collection('friends')
            .updateOne(
                { username: req.body.otherUser },
                { list: newList }
            );

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};


//friendDecline
module.exports.friendDecline=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get the user's friend requests
        var requests = db
            .collection('profiles')
            .find(
                { username: req.body.otheruser }
            )
            .project(
                { friendRequests: 1, id_: 0 }
            );

        //remove otherUser from user's friendRequests list
        var index = requests.friendRequests.indexOf(req.body.username);
        if(index > -1){
            requests.friendRequests.splice(index, 1);
        }

        //update user's profiles database entry
        db
            .collection('profiles')
            .updateOne(
                { username: req.body.username },
                { friendRequests: requests.friendRequests }
            );

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};


//unfriend
module.exports.unfriend=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get user's friends list
        var newList = db
            .collection('friends')
            .find(
                { username: req.body.username }
            )
            .project(
                { list: 1 }
            );

        //remove otherUser from user's friends list
        var index = newList.list.indexOf(req.body.otherUser);
        if(index > -1){
            requests.list.splice(index, 1);
        }

        //update user's friends database entry
        db
            .collection('friends')
            .updateOne(
                { username: req.body.username },
                { list: newList }
            );

        //get otherUser's friends list
        newList = db
            .collection('friends')
            .find(
                { username: req.body.otherUser }
            )
            .project(
                { list: 1 }
            );

        //remove user from otherUser's friends list
        var index = requests.list.indexOf(req.body.username);
        if(index > -1){
            requests.list.splice(index, 1);
        }

        //update the otherUser's friends database entry
        db
            .collection('friends')
            .updateOne(
                { username: req.body.otherUser },
                { list: newList }
            );

        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};


//block
/*
module.exports.block=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//unblock
/*
module.exports.unblock=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//paw5
/*
module.exports.paw5=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//follow
/*
module.exports.follow=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//unfollow
/*
module.exports.unfollow=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//post
module.exports.newPost=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;
        var db = client.db('tailhub_db');
        var posts = db.collection('posts');

        //generate current date
        var date = new Date();
        var now = date.toUTCString();

        //insert new database entry for the user
        posts.insertOne({
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
        }, function(err,res){if(err) throw err;});

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        var text = req.body.text;
        var name = req.body.name;
        //respond
        res.write(name);
        res.end();
    })
};


//comment
/*
module.exports.comment=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//share
/*
module.exports.share=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//getProfile
module.exports.getProfile=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //search the profiles database to the specified profile
        var ret = db
            .collection('profiles')
            .find(
                { username: req.body.username }
            );
        var name ="GG";
        res.write(name);
        res.end();
    })
};


//getPosts
module.exports.getPosts=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //search the posts database for the user's posts
        var allPosts = db
            .collection('posts')
            .find(
                { username: req.body.username }
            )
            .project(
                { _id: 0 }
            );
/*
        var tenPosts;
        var post;
        var count = 0;
        for(post in allPosts){
            if(post.creationDate   ?????????   ){
                tenPosts.push(post);
            }
        }
        res.render(tenPosts);
*/
        res.render(allPosts);
    })
};


//getFriends
/*
module.exports.getFriends=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//getFollowers
/*
module.exports.getFollowers=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//getFollowing
/*
module.exports.getFollowing=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/

//getMessages
/*
module.exports.getMessages=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/


//getComments
/*
module.exports.getComments=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;



        //close connection
        db
            .close(function(err){if(err)throw err;});
    })
};*/

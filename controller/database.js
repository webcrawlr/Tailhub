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
5/30-6/3
updated/written but untested:
    deleteProfile (does not fulfil all functions)
    sendMessage
    editProfile
rewrote many times, tested, works:
    createProfile
    getProfile
    newPost
    getPosts
    getFriends
    getFollowers
    getFollowing
removed deprecated code from functions

RAYMOND MULLER:
5/31:
    Bugfixes for getProfile.
*/

//Version: 0.2

var mongodb;
mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI||'mongodb://Bryce:1lavalamp@ds231070.mlab.com:31070/tailhub_db';

//var User = require('../models/user');


//createProfile
module.exports.createProfile = function(req,res) {

    /********************************************************************************************************
     //                  createProfile has been seized by Steven Phan
     //
     //*******************************************************************************************************/
    /*
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;

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
    });
*/



    //===================================================================
    //re-hijacked by Bryce Baker
    //===================================================================

    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;

        //generate current date
        var date = new Date();
        var now = date.toUTCString();

        var db = client.db('tailhub_db');

        //insert new profiles database entry for the user
        var coll = db.collection('profiles');
        coll.insertOne({
                username:   req.body.username,
                password:   req.body.password,
                species:    req.body.species,
                breed:      req.body.breed,
                age:        req.body.age,
                location:   req.body.location,
                email:      req.body.email,

                paw5Counter:    0,
                paw5List:       [],
                emailFlag:      false,
                creationDate:   now,
                postCount:      0,
                messageCount:   0,
                friendRequests: [],
                blockList:      []
            },
            function (err, res) {
                if (err) throw err;
            }
        );

        //insert new friends database entry for the user
        coll = db.collection('friends');
        coll.insertOne({
            username: req.body.username,
            list: []
            },
            function (err, res) {
            if(err) throw err;
            }
        );

        //insert new followers database entry for the user
        coll = db.collection('followers');
        coll.insertOne({
            username: req.body.username,
            list: []
            },
            function (err, res) {
                if(err) throw err;
            }
        );

        //insert new following database entry for the user
        coll = db.collection('following');
        coll.insertOne({
            username: req.body.username,
            list: []
            },
            function (err, res) {
                if(err) throw err;
            }
        );

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        var response = "New profile created."

        //respond
        res.write(response);
        res.end();
    });
};


//editProfile
module.exports.editProfile=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;
        var db = client.db('tailhub_db');
        var profile = db.collection('Profiles');

        //get info from old database entry
        var cursor = db.collection('profiles');
        cursor.findOne({
            username: req.body.username
        });

        //update database entry
        cursor.replaceOne(
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
        },
            function (err, res) {
                if(err) throw err;
            }
        );

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        var response = "Profile edited."

        //respond
        res.write(response);
        res.end();
    });
};


//deleteProfile
module.exports.deleteProfile=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;
        var db = client.db('tailhub_db');
        var username = req.body.username;

        //search comments database & deletes entries by user
        var coll = db.collection('comments');
        coll.deleteMany({
                username: username
        });

        //search posts database & delete entries by user
        coll = db.collection('posts');
        coll.deleteMany({
                username: username
        });

        //search messages database & delete entries sent to or from user
        coll = db.collection('messages');
        coll.deleteMany({
                username: username,
                sender: username
        });

        //search friends database & delete user entry
        coll = db.collection('friends');
        coll.deleteOne({
                username: username
        });

        //search followers database and delete user's entry
        coll = db.collection('followers');
        coll.deleteOne({
                username: username
        });

        //search following database and delete user's entry
        coll = db.collection('following');
        coll.deleteOne({
                username: username
        });

        //search profiles database & delete entry
        coll = db.collection('profiles');
        coll.deleteOne({
                username: username
        });

 /*       //search friends database & delete entry from other user's lists
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
*/
        //close connection
        client.close(function(err) {
            if(err)throw err;
        });

        var response = "User " + req.body.username + " was purged.";

        //respond
        res.write(response);
        res.end();
    })
};


//sendMessage
module.exports.sendMessage=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, async function (err, client) {
        if (err) throw err;

        var username = req.body.username;
        var cou = 999999999;

        var date = new Date();
        var now = date.toUTCString();

        var db = client.db('tailhub_db');
        var coll = db.collection("profiles");
        var cursor = coll.findOne({
            username: username
        });

        while (await cursor.hasNext()){
            const doc = await cursor.next();
            //store incremented sender message count
            cou = doc.messageCount++;
        }

        //update sender message count
        coll.updateOne(
            { username: username },
            { $set:
                { messageCount: cou }
            }
        );

        //insert new database entry into messages database
        coll=db.collection("Messages");
        coll.insertOne({
            username:       req.body.otherUser,
            sender:         username,
            number:         username + cou,
            message:        req.body.message,
            creationDate:   now,
            readFlag :      false
            },
            function(err) {
                if(err)throw err;
            }
        );

        //close connection
        client.close(function(err) {
            if (err) throw err;
        });

        var response = "Message sent.";

        //respond
        res.write(response);
        res.end();
    })
};


//readMessage
/*
module.exports.readMessage=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });
    })
};*/


//deleteMessage
/*
module.exports.deleteMessage=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });
    })
};*/

/*
//friendRequest
module.exports.friendRequest=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
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
        client.close(function(err){
            if(err)throw err;
        });

        var response = "Friend request sent."

        //respond
        res.write(response);
        res.end();
    })
};


//friendAccept
module.exports.friendAccept=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
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
        client.close(function(err){
            if(err)throw err;
        });
        var response = "Friend request accepted."

        //respond
        res.write(response);
        res.end();
    })
};


//friendDecline
module.exports.friendDecline=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
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
        client.close(function(err){
            if(err)throw err;
        });

        var response = "Friend request declined.";

        //respond
        res.write(response);
        res.end();
    })
};


//unfriend
module.exports.unfriend=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
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
        client.close(function(err){
            if(err)throw err;
        });

        var response = "Friend unfriended.";

        //respond
        res.write(response);
        res.end();
    })
};
*/

//block
/*
module.exports.block=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });

        var response = "User blocked.";

        //respond
        res.write(response);
        res.end();
    })
};*/


//unblock
/*
module.exports.unblock=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });

        var response = "User unblocked.";

        //respond
        res.write(response);
        res.end();
    })
};*/


//paw5
/*
module.exports.paw5=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });

        var response = "Paw5-ed.";

        //respond
        res.write(response);
        res.end();
    })
};*/


//follow
/*
module.exports.follow=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });

        var response = req.body.otherUser + "now followed by " + req.body.username + "<br>";

        //respond
        res.write(response);
        res.end();
    })
};*/


//unfollow
/*
module.exports.unfollow=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });

        var response = req.body.otherUser + "is no longer followed by " + req.body.username + "<br>";

        //respond
        res.write(response);
        res.end();
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
            username:   req.body.username,
            postId:     req.body.postId,
            rePost:     req.body.rePost,
            oPoster:    req.body.oPoster,
            text:       req.body.text,
            media:      req.body.media,

            paw5Counter:    0,
            paw5List:       {},
            emailFlag:      false,
            location:       req.body.location,
            creationDate:   now,
            groomFeedFlag:  req.body.groomFeedFlag,
            shareCount:     0
            },
            function(err,res) {
                if(err) throw err;
            }
        );

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        var ret = "Post created.";

        //respond
        res.write(ret);
        res.end();
    })
};


//comment
/*
module.exports.comment=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });

        var ret = "Comment created.";

        //respond
        res.write(ret);
        res.end();
    })
};*/


//share
/*
module.exports.share=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err){
            if(err)throw err;
        });

        var ret = "Shared post created.";

        //respond
        res.write(ret);
        res.end();
    })
};*/


//getProfile
module.exports.getProfile=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, async function (err, client) {
        if (err) throw err;

        var db = client.db('tailhub_db');
        var coll = db.collection('profiles');
        var ret = "";

        //search the profiles database to the specified profile
        var cursor = coll.findOne({
            username: req.body.username
        });

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            ret = ret
                + doc.name
                + "<br><br>"
                + doc.species
                + "<br><br>"
                + doc.breed
                + "<br><br>"
                + doc.age
                + "<br><br>"
                + doc.location
                + "<br><br>";
        }

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        res.write(ret);
        res.end();
    })
};


//getPosts
module.exports.getPosts=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, async function (err, client) {
        if (err) throw err;

        var db = client.db('tailhub_db');
        var posts = db.collection('posts');
        var ret = "";

        //search the profiles database to the specified profile
        var cursor = posts.find({
            username: req.body.username
        });

        var i = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            ret = ret
                + doc.username
                + "<br><br>"
                + doc.text
                + "<br><br><br>";
            i++;
            if ( i >= 10){
                break;
            }
        }

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        res.write(ret);
        res.end();
    })
};


//getFriends
module.exports.getFriends=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, async function (err, client) {
        if (err) throw err;

        var db = client.db('tailhub_db');
        var coll = db.collection('friends');
        var ret = "";

        //search for the specified username
        var cursor = coll.find({
            list: req.body.username
        });

        //append the username of each follower to the response
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            ret = ret
                + doc.username
                + "<br>";
        }

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        res.write(ret);
        res.end();
    })
};


//getFollowers
module.exports.getFollowers=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, async function (err, client) {
        if (err) throw err;

        var db = client.db('tailhub_db');
        var coll = db.collection('followers');
        var ret = "";

        //search for the specified username
        var cursor = coll.find({
            list: req.body.username
        });

        //append the username of each follower to the response
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            ret = ret
                + doc.username
                + "<br>";
        }

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        res.write(ret);
        res.end();
    })
};


//getFollowing
module.exports.getFollowing=function(req,res) {
    mongodb.MongoClient.connect(mongoDBURI, async function (err, client) {
        if (err) throw err;

        var db = client.db('tailhub_db');
        var coll = db.collection('following');
        var ret = "";

        //search for the specified username
        var cursor = coll.find({
            list: req.body.username
        });

        //append the username of each followed user to the response
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            ret = ret
                + doc.username
                + "<br>";
        }

        //close connection
        client.close(function (err) {
            if (err) throw err;
        });

        res.write(ret);
        res.end();
    })
};


//getMessages
/*
module.exports.getMessages=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        db.close(function(err) {
            if(err)throw err;
        });

        //respond
        res.write(ret);
        res.end();
    })
};*/


//getComments
/*
module.exports.getComments=function(req,res) {
    //connect MongoDB
    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;



        //close connection
        client.close(function(err) {
            if(err)throw err;
        });

        //respond
        res.write(ret);
        res.end();
    })
};*/

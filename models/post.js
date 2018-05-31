var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://steven:1234567890@ds231070.mlab.com:31070/tailhub_db');
//var Grid = require('gridfs-stream');
var path = require('path');
//var GridFS = Grid(mongoose.connection.db, mongoose.mongo);
var fs = require('fs');
var conn = mongoose.connection;

//Grid.mongo = mongoose.mongo;


var PostSchema = mongoose.Schema({

    text: {
        type: String
    },

    date: {
        type: Number
    },

    username: {
        type: String
    },

    img: {
        data: Buffer,
        contentType: String
     },

    comments: {
         type: String
     },

    paw5: {
        userList: String,
        paw5Count: Number
    }

});


var Post = module.exports = mongoose.model('Post', PostSchema);

//stores
module.exports.createPost = function(newPost, path, callback) {

    //newPost.img.data = fs.readFileSync(path);
    //newPost.img.contentType = 'image/png';
    
    newPost.save(callback);

    //fs.unlinkSync(path)

    //GRIDFS Portion to store files larger than 16GB
    /*
    var videoPath = path.join(__dirname, '../uploads/'+file.file.filename);

    conn.once('open', function() {
       console.log('Connections open....');

       var gfs = Grid(conn.db);


       var writestream = gfs.createWriteStream({

          fileName: filename

       });

       fs.createReadStream(videoPath).pipe(writestream);

       writestream.on('close', function (file) {

           console.log(file.filename + 'written to mongoDB');

        });


    });
    */

    //newPost.save(callback);
}

/*
function putFile(path, name, callback) {
    var writestream = GridFS.createWriteStream({
        filename: name
    });
    writestream.on('close', function (file) {
        callback(null, file);
    });
    fs.createReadStream(path).pipe(writestream);

}

*/

module.exports.getPostById = function(id, callback){
    Post.findById(id, callback);
};

module.exports.getPostByUsername = function(username, callback){
    var query = {username: username};
    Post.findOne(query, callback);
    //console.log(callback.postText);

};







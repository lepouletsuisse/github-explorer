var MongoClient = require("mongodb").MongoClient;
var express = require("express"),
    router = express.Router();

router.post('/', function(req, res){
    var context = {};
    context.owner = req.query.owner;
    context.repo = req.query.repo;
    context.data = {"owner" : context.owner, "repo": context.repo};
    saveData(context).then(
        function(context){
            console.log("API: Success // " + JSON.stringify(context.data));
            res.send(context.data);
        } 
    ).catch(function(err){
        console.log("API: Error");
        console.log(err.stack);
        res.status(500).send(err);
    });
});

function saveData(context){
    context.db_url = "mongodb://192.168.99.100:27017/githubexplorer";
    return openDatabaseConnection(context)
        .then(save)
        .then(closeDatabaseConnection);
}

function openDatabaseConnection(context){
    console.log("Opening the connection to database...");
    return MongoClient.connect(context.db_url)
        .then(function(db){
            context.db = db
            console.log("Connection to database opened!");
            return context;
        });
}
function save(context){
    console.log("Saving data...");
    var collection = context.db.collection("repo");

    return collection.find({"owner": context.owner, "repo": context.repo}, function(err, items){
        console.log(items);
        return context;
    });
        /*collection.insert(context.data)
        .then(function(results){
            console.log("Data saved!");
            return context;
             });*/
}
function closeDatabaseConnection(context){
    console.log("Closing the connection to database...");
    return context.db.close()
        .then(function(){
            console.log("Connection to database closed!");
            return context;
        })
}

module.exports = router;
var MongoClient = require("mongodb").MongoClient;
var express = require("express"),
    app = express.createServer();

app.use(express.logger());

app.get('/', function(req, res){
    var context = {};
    context.data = {"owner" : req.query.owner, "repo": req.query.repo};
    context.owner = owner;
    context.repo = repo;
    saveData(context);
});

app.listen();
console.log('Express server started on port %s', app.address().port);

function saveData(context){
    
    context.db_url = "mongodb://192.168.99.100:27017/githubexplorer";
    return openDatabaseConnection(context)
        .then(saveData)
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
function saveData(context){
    console.log("Saving data...");
    var collection = context.db.collection("repo");
    return collection.insert(context.data)
        .then(function(results){
            console.log("Data saved!");
            return context;
        })
}
function closeDatabaseConnection(context){
    console.log("Closing the connection to database...");
    return context.db.close()
        .then(function(){
            console.log("Connection to database closed!");
            return context;
        })
}

saveData()
    .then(function(result){
        console.log("We are done");
        console.log(result);
    })
    .catch(function(error){
        console.log("Error");
        console.log(error); 
    });
var MongoClient = require("mongodb").MongoClient;
var express = require("express"),
    router = express.Router();
var request = require("request-promise");

router.get('/', function(req, res){
    var context = {};
    
    return openDatabaseConnection(context)
    .then(getCollection)
    .then(queryAllData)
    .then(closeDatabaseConnection)
    .then(function(){
        console.log("API: Success");
        res.send(context.queried);
    })
    .catch(function(err){
        console.log("API: Error");
        console.log(err.stack);
        res.status(500).send(err);
    });
});

router.post('/', function(req, res){
    var context = {};
    var OAuth = "9f696152f44e7ffb6d3d35b4bd232962426f9b14";
    context.owner = req.query.owner;
    context.repo = req.query.repo;
    context.apiOptions = {
        url: "https://api.github.com/repos/"+ context.owner +"/" + context.repo + "/commits", 
        method: "GET",
        headers: {
            'User-Agent': 'GitHub Explorer by Le Poulet Suisse',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + OAuth
        }
    };
    fetchAndSaveData(context)
    .then(function(context){
        console.log("API: Success");
        res.send(context.data);
    })
    .catch(function(err){
        console.log("API: Error");
        console.log(err.stack);
        res.status(500).send(err);
    });
});

function fetchAndSaveData(context){
    return openDatabaseConnection(context)
        .then(getCollection)
        .then(getDataInDB)
        .then(checkData)
        .then(fetchData)
        .then(updateData)
        .then(insertData)
        .then(closeDatabaseConnection);
}

function openDatabaseConnection(context){
    console.log("Opening the connection to database...");
    context.db_url = "mongodb://heroku_3vv2d8p3:7as5jokjvkf344292bfu55mbku@ds023455.mlab.com:23455/githubexplorer";
    //context.db_url = "mongodb://192.168.99.100:27017/githubexplorer";
    return MongoClient.connect(context.db_url)
        .then(function(db){
            context.db = db
            console.log("Connection to database opened!");
            return context;
        })
        .catch(function(err){
            console.log("Error while connecting! " + err);
        });
}

function getCollection(context){
    console.log("Getting and setting the collection 'repo'...");
    var collection = context.db.collection("repo");
    context.collection = collection;
    return context;
}

function fetchData(context){
    if(context.dataExist == true){
        return context;
    }
    console.log("Fetching data...");
    return request(context.apiOptions)
        .then(function(data){
            console.log("Data fetched!");
            context.data = data;
            return context;
        }).catch(function(err){
            console.log("Error while fetching! " + err);
            throw err;
        });
}

function insertData(context){
    if(context.dataExist == true){
        return context;
    }
    console.log("Saving data...");
    return context.collection.insert({
        'owner': context.owner,
        'repo': context.repo,
        'data': context.data,
        'count': context.count
    })
    .then(function(result){
        console.log("Data saved!");
        return context;
    });
}

function checkData(context){
    console.log("Checking data...");
    if(context.queried.length == 0){
        context.dataExist = false;
        context.count = 1;
        console.log("Data doesn't exist!");
    }else{
        context.dataExist = true;
        context.count = context.queried[0].count + 1;
        context.data = context.queried[0].data;
        console.log("Data already exist!");
    }
    return context;
}

function updateData(context){
    if(context.dataExist == false){
        return context;
    }
    console.log("Updating data...");
    return context.collection.updateOne({"owner": context.owner, "repo": context.repo},{$set: {"count": context.count}})
    .then(function(result){
        return context;
    });
}

function getDataInDB(context){
    return context.collection.find({"owner": context.owner, "repo": context.repo}).toArray()
    .then(function(result) {
        context.queried = result;
        return context;
    });
}

function queryAllData(context){
    return context.collection.find({},{"owner": 1, "repo": 1, "count": 1, "data": 1}).toArray()
    .then(function(result) {
        console.log("All data finded!");
        context.queried = result;
        return context;
    });
}

function closeDatabaseConnection(context){
    console.log("Closing the connection to database...");
    return context.db.close()
        .then(function(){
            console.log("Connection to database closed!");
            return context;
        })
        .catch(function(err){
            console.log("Error while closing DB! " + err);
            throw err;
        })
}

module.exports = router;
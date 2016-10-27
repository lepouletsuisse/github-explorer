var MongoClient = require("mongodb").MongoClient;
var express = require("express"),
    router = express.Router();
var request = require("request-promise");

/**
 * This is the API for GitHub Explorer. This API allow you to do 2 type of request: GET and POST. 
 */

/**
 * The GET request is simply a query in the DB to get all the old queries that has been made in the past.
 */
router.get('/', function(req, res){
    var context = {};
    context.status = 500;
    context.errMessage = "Unknow error occured!";

    return getAllData(context)
    .then(function(){
        console.log("API: Success");
        res.send(context.queried);
    })
    .catch(function(err){
        console.log("API: Error");
        console.log(err.stack);
        res.status(context.status).send(context.errMessage);
    });
});

/**
 * The POST request allow you to ask for precise data in a owner/repo. This will return all the data the API got on a specific request 
 * and do the request on GitHub API if it doesn't have any data about it.
 */
router.post('/', function(req, res){
    var context = {};
    context.status = 500;
    context.errMessage = "Unknow error occured!";
    var OAuth = process.env.GITHUB_OAUTH; //OAUTH2 authenticator on GitHub API
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
        res.status(context.status).send(context.errMessage);
    });
});

/**
 * The DELETE request allow you to delete all the data in the DB. In fact, we could say it's not secure or whatever.
 * But in this case, data in the DB are only informative and are not really usefull because we can re-query them on github.
 */
router.delete('/', function(req, res){
    var context = {};
    context.status = 500;
    context.errMessage = "Unknow error occured!";
    deleteOldData(context)
    .then(function(context){
        console.log("API: Success");
        res.send(context.data);
    })
    .catch(function(err){
        console.log("API: Error");
        console.log(err.stack);
        res.status(context.status).send(context.errMessage);
    });
});

/**
 * Delete all the data in the DB
 */
function deleteOldData(context){
    return openDatabaseConnection(context)
    .then(getCollection)
    .then(dropCollection)
    .then(closeDatabaseConnection);
}

/** 
 * Check if he got any data about a owner/repo in the DB and if not, query GitHub API to get some.
*/
function fetchAndSaveData(context){
    return openDatabaseConnection(context)
        .then(getCollection)
        .then(queryData)
        .then(checkData)
        .then(fetchData)
        .then(updateData)
        .then(insertData)
        .then(closeDatabaseConnection);
}

/**
 * Get all the old data in the DB
 */
function getAllData(context){
    return openDatabaseConnection(context)
        .then(getCollection)
        .then(queryAllData)
        .then(closeDatabaseConnection);
}

/**
 * Open a connection with the Mongo DB
 */
function openDatabaseConnection(context){
    console.log("Opening the connection to database...");
    context.db_url = process.env.MONGODB_URI;
    return MongoClient.connect(context.db_url)
        .then(function(db){
            context.db = db
            console.log("Connection to database opened!");
            return context;
        })
        .catch(function(err){
            console.log("Error while connecting! " + err);
            context.errMessage = "Internal server error!";
            throw err;
        });
}

/**
 * Drop the collection to delete all the data
 */
function dropCollection(context){
    console.log("Droping collection...");
    return context.collection.drop()
    .then(function(){
        console.log("Collection correctly dropped!");
        context.data = "All data has been deleted succesfully!";
        return context;
    })
    .catch(function(err){
        console.log("Error while dropping the collection! " + err);
        context.errMessage = "Couldn't delete the data!";
        throw err;
    });
}

/**
 * Get the collection in the DB. The name of the collection is set as a heroku env variable.
 */
function getCollection(context){
    var collectionName = process.env.COLLECTION_NAME;
    console.log("Getting and setting the collection '" + collectionName + "'...");
    var collection = context.db.collection(collectionName);
    if(collection == undefined){
        console.log("Error while connecting! " + err);
        context.errMessage = "Internal server error!";
        throw new Error("Unable to get collection " + collectionName + " from the DB!");
    }
    context.collection = collection;
    return context;
}

/**
 * Query GitHub API to get some data about a repo.
 */
function fetchData(context){
    if(context.dataExist == true){
        return context;
    }
    //The data doesn't exists in the DB
    console.log("Fetching data...");
    //Request on GitHub API
    return request(context.apiOptions)
        .then(function(data){
            console.log("Data fetched!");
            context.data = data;
            return context;
        }).catch(function(err){
            console.log("Error while fetching! " + err);
            context.errMessage = "The owner/repo couldn't be found on GitHub!";
            throw err;
        });
}

/**
 * Add the data fetched to the DB 
 */
function insertData(context){
    if(context.dataExist == true){
        return context;
    }
    //The data doesn't exist
    console.log("Saving data...");
    //Insert the data in the DB
    return context.collection.insert({
        'owner': context.owner,
        'repo': context.repo,
        'data': context.data,
        'count': context.count
    })
    .then(function(result){
        console.log("Data saved!");
        return context;
    })
    .catch(function(err){
        console.log("Error while inserting! " + err);
        context.errMessage = "Internal server error!";
        throw err;
    });
}

/**
 * Check if the data exists in the DB
 */
function checkData(context){
    console.log("Checking data...");
    if(context.queried.length == 0){
        //Doesn't exist
        context.dataExist = false;
        context.count = 1;
        console.log("Data doesn't exist!");
    }else{
        //Exist
        context.dataExist = true;
        context.count = context.queried[0].count + 1;
        context.data = context.queried[0].data;
        console.log("Data already exist!");
    }
    return context;
}

//Update the 'count' field in the DB if the data already exist.
function updateData(context){
    if(context.dataExist == false){
        return context;
    }
    //The data exist in the DB
    console.log("Updating data...");
    return context.collection.updateOne({"owner": context.owner, "repo": context.repo},{$set: {"count": context.count}})
    .then(function(result){
        return context;
    })
    .catch(function(err){
        console.log("Error while updating! " + err);
        context.errMessage = "Internal server error!";
        throw err;
    });
}

/**
 * Get the data in the DB using the owner and repo specified in the context
 */
function queryData(context){
    return context.collection.find({"owner": context.owner, "repo": context.repo}).toArray()
    .then(function(result) {
        context.queried = result;
        return context;
    })
    .catch(function(err){
        console.log("Error while trying to find the data in the DB! " + err);
        context.errMessage = "Internal server error!";
        throw err;
    });
}

/**
 * Get all the data in the DB
 */
function queryAllData(context){
    return context.collection.find({},{"owner": 1, "repo": 1, "count": 1, "data": 1}).toArray()
    .then(function(result) {
        console.log("All data finded!");
        context.queried = result;
        return context;
    })
    .catch(function(err){
        console.log("Error while trying to find the data in the DB! " + err);
        context.errMessage = "Internal server error!";
        throw err;
    });
}

/**
 * Close the connection to the DB
 */
function closeDatabaseConnection(context){
    console.log("Closing the connection to database...");
    return context.db.close()
        .then(function(){
            console.log("Connection to database closed!");
            return context;
        })
        .catch(function(err){
            console.log("Error while closing the DB! " + err);
            context.errMessage = "Internal server error!";
            throw err;
        })
}

module.exports = router;
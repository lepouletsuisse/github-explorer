(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:page2Ctrl
	* @description
	* # page2Ctrl
	* Controller of the app
	*/

  	angular
		.module('page2')
		.controller('Page2Ctrl', Page2);

		Page2.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Page2() {
			/*jshint validthis: true */
			var vm = this;

			var request = require("request-promise");
			var MongoClient = require("mongodb").MongoClient;



			/*function fetchAndSaveTVShows(){
				var context = {};
				context.db_url = "mongodb://192.168.99.100:27017/tvdemo";
				context.apiOptions = {
					url: "http://api.tvmaze.com/shows",
					json : true
				};
				return openDatabaseConnection(context)
					.then(fetchTVShows)
					.then(saveTVShows)
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
			function fetchTVShows(context){
				console.log("Fetching data...");
				return request(context.apiOptions)
					.then(function(shows){
						console.log("Data fetched!");
						context.shows = shows;
						return context;
					});
			}
			function saveTVShows(context){
				console.log("Saving data...");
				var collection = context.db.collection("tvshows");
				return collection.insertMany(context.shows)
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

			fetchAndSaveTVShows()
				.then(function(result){
					console.log("We are done");
					console.log(result);
				})
				.catch(function(error){
					console.log("Error");
					console.log(error); 
				});
			*/

			vm.labels = ["Pomme", "Banane", "Poire"];
			vm.data = [30, 25, 60];

		}

})();

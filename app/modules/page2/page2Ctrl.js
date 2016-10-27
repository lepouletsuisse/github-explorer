(function() {
	'use strict';

	/**
	* Controller for the Page 2
	*/

  	angular
		.module('page2')
		.controller('Page2Ctrl', Page2)
		//I had to use a custom directive for beeing able to inject some HTML code (The links of old data) in the HTML file. 
		//The default directive "ng-html-bind" didn't accept the ng tag "ng-click". 
		//Found on http://stackoverflow.com/questions/17417607/angular-ng-bind-html-and-directive-within-it
		//Used as found.
		.directive('compile', ['$compile', function ($compile) {
			return function(scope, element, attrs) {
				scope.$watch(
					function(scope) {
						// watch the 'compile' expression for changes
						return scope.$eval(attrs.compile);
					},
					function(value) {
						// when the 'compile' expression changes
						// assign it into the current DOM
						element.html(value);

						// compile the new DOM and link it to the current
						// scope.
						// NOTE: we only compile .childNodes so that
						// we don't get into infinite loop compiling ourselves
						$compile(element.contents())(scope);
            }
        );
    };
}])

		Page2.$inject = ['Page2Service'];

		function Page2(Page2Service) {
			/*jshint validthis: true */
			var vm = this;

			//initialisation of the base value
			vm.labels = [""];
			vm.data = [[0]];
			vm.series = [];
			vm.options = {};

			vm.owner = "";
			vm.repo = "";

			vm.result = "";
			vm.err = "";

			vm.oldDataDict = {}

			//Get old queries from the API
			vm.getOldQueries = function(){
				//Get the old queries
				Page2Service.getOldData()
				.then(function(data){
					vm.oldData = "";
					angular.forEach(data.data, function(entry){
						vm.oldData += "<a ng-click=\"vm.clickOldData('" + entry._id + "')\">Owner: " + entry.owner + " - Repo: " + entry.repo + " - Count: " + entry.count + "</a><br>";
						vm.oldDataDict[entry._id] = entry;
					});
				})
				.catch(function(err){
					vm.err = err.data;
				});
			}

			//Triggered when the user click on a old query
			vm.clickOldData = function(id){
				vm.result = JSON.parse(vm.oldDataDict[id].data);
				parseResultForChart();
			}

			//Triggered when the user click the Save button
			vm.submit = function(){
				vm.err = "";
				vm.data = [[0]];
				vm.labels = [""];
				if(vm.owner == "" || vm.repo == ""){
					vm.err = "Please specify a owner and a repo.";
					return;
				}
				//Get data from the API
				Page2Service.getDataOnGithub(vm.owner, vm.repo)
				.then(function(data){
					vm.result = data.data;
				})
				//Refresh chart
				.then(parseResultForChart)
				//Refresh old queries
				.then(vm.getOldQueries)
				.catch(function(err){
					vm.err = err.data;
				});
			}

			//Delete the old query in the API
			vm.deleteOldData = function(){
				Page2Service.deleteOldData()
				.then(function(res){
					vm.resultDelete = "<span ng-style=\"{'color': 'green'}\">" + res.data + "</span>";
				})
				.then(vm.getOldQueries)
				.catch(function(err){
					vm.resultDelete = "<span ng-style=\"{'color': 'orange'}\">" + err.data + "</span>";
				});
			}

			//Parse the vm.result field to fit to the graph chart
			function parseResultForChart(){
				var graphArray = {};
				angular.forEach(vm.result, function(value, key){
					var date = value.commit.committer.date.substring(0,10);
					if(graphArray[date] == undefined){
						graphArray[date] = 1;
					}else{
						graphArray[date] += 1;
					}
				});
				var tmpArraySort = [];
				angular.forEach(Object.keys(graphArray), function(key){
					tmpArraySort.push(key);
				});
				tmpArraySort.sort();
				vm.labels = [];
				vm.data = [[]];
				angular.forEach(tmpArraySort, function(key){
					vm.labels.push(key);
					vm.data[0].push(graphArray[key]);
				});
			}
		}

})();

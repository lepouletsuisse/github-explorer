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
		.controller('Page2Ctrl', Page2)
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

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Page2(Page2Service) {
			/*jshint validthis: true */
			var vm = this;

			//Just for test
			vm.owner = "lepouletsuisse";
			vm.repo = "Christophe-Samuel";

			vm.labels = [""];
			vm.data = [[0]];
			vm.series = [];
			vm.options = {};

			vm.result = "";
			vm.err = "";

			vm.oldDataDict = {}

			// Init the old data
			vm.initData = function(){
				Page2Service.getOldData()
				.then(function(data){
					var str = "";
					//TODO: Faire les liens cliquable
					angular.forEach(data, function(entry){
						str += "<a ng-click=\"vm.clickOldData('" + entry._id + "')\">Owner: " + entry.owner + " - Repo: " + entry.repo + " - Count: " + entry.count + "</a><br>";
						vm.oldDataDict[entry._id] = entry;
				});
					vm.oldData = str;
				});
			}

			vm.clickOldData = function(id){
				vm.result = JSON.parse(vm.oldDataDict[id].data);
				parseResultForChart();
			}

			vm.submit = function(){
				vm.err = "";
				vm.data = [[0]];
				vm.labels = [""];
				if(vm.owner == "" || vm.repo == ""){
					vm.err = "Please specify a owner and a repo.";
					return;
				}
				Page2Service.getDataOnGithub(vm.owner, vm.repo)
				.then(function(data){
					vm.result = data;
				})
				.then(parseResultForChart)
				.catch(function(err){
					vm.err = "A probleme occured while your querry! Your repo/owner is probably wrong!";
				})
				.then(function(){
					vm.initData();
				});
			}

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

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

			vm.submit = function(){
				vm.err = "";
				if(vm.owner == "" || vm.repo == ""){
					vm.err = "Please specify a owner and a repo.";
					return;
				}
				Page2Service.getDataOnGithub(vm.owner, vm.repo).then(function(data){
					vm.result = data;
				}).then(function(){
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
					Page2Service.sendData(vm.owner, vm.repo).then(function(data){
						vm.result = data;
					});
				}).catch(function(err){
					vm.err = "The combination owner/repo is not valid!";
				});
			}
		}

})();

(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:page2Service
	 * @description
	 * # page2Service
	 * Service of the app
	 */

  	angular
		.module('page2')
		.factory('Page2Service', Page2Service);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Page2Service.$inject = ['$http'];

		function Page2Service ($http) {
			return {
				sendData: function(owner, repo){
					return $http({url: "/api", method: "POST", params: {"owner": owner, "repo": repo}}).then(function(res){
						return res.data;
					});
				},
				getDataOnGithub: function(owner, repo){
					var OAuth = "9f696152f44e7ffb6d3d35b4bd232962426f9b14"
					$http.defaults.headers.common.Authorization = 'Basic ' + OAuth;
					return $http({
						url: "https://api.github.com/repos/"+ owner +"/" + repo + "/commits", 
						method: "GET"
					}).then(function(res){
						return res.data;
					}).catch(function(err){
						throw err;
					});
				}
			};
		}

})();

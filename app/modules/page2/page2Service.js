(function() {
	'use strict';

	/**
	 * Service for the Page 2
	 */

  	angular
		.module('page2')
		.factory('Page2Service', Page2Service);

		Page2Service.$inject = ['$http'];

		function Page2Service ($http) {
			return {
				//Query the API for a user
				getDataOnGithub: function(owner, repo){
					return $http({url: "/api", method: "POST", params: {"owner": owner, "repo": repo}})
					.success(function(res){
						return res[0];
					})
					.error(function(data){
						return data;				
					});
				},
				//Query the API to get all the user in the DB
				getOldData: function(){
					return $http({url: "/api", method: "GET"})
					.success(function(res){
						return res[0];
					})
					.error(function(data){
						return data;
					});
				},
				//Query the API to delete all the data it store
				deleteOldData: function(){
					return $http({url: "/api", method: "DELETE"})
					.success(function(res){
						return res[0];
					})
					.error(function(data){
						return data;
					});
				}

			};
		}

})();

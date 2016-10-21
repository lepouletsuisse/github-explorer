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
				getData: function(owner, repo){
					return $http({url: "/api", method: "POST", params: {"owner": owner, "repo": repo}}).then(function(res){
						console.log(res.data);
						return res.data;
					});
				}
			};
		}

})();

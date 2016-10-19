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

			vm.labels = ["Pomme", "Banane", "Poire"];
			vm.data = [30, 25, 60];

			vm.owner = "NULL";
			vm.repo = "NULL";

			vm.result = "";

			function submit() {
				consol.log("test");
				vm.result = "Owner: " + vm.owner + " // Repo: " + vm.repo;
			}
		}

})();

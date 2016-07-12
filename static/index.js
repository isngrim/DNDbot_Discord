
(function () {
	'use strict';
	var app = angular.module("DND_App", []);
	
	function GameListController($scope, $http, $interval, $sce) {
		$scope.games = {}
		$scope.loadGames = function() {
			$http.get("/bot_game_data.json").then(function success(response) {
				$scope.games = response.data;
				console.log("GOT");
			});
		}
		$scope.saveGames = function() {
			var req = {
			 method: 'POST',
				url: '/bot_game_data.json',
				headers: {
					'Content-Type': 'application/json'
				},
				data: $scope.games
			}

			$http(req).then(function success(response) {
				console.log("SENT")
			});
		}
		$scope.loadGames();
	}
	GameListController.$inject = ['$scope', '$http', '$interval', '$sce'];

	app.controller('GameListController', GameListController)
}());


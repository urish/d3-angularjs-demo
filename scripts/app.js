/* D3.js+Angular.JS Demo. Copyright (c) 2014 Uri Shaked, MIT Licence. */

'use strict';

var app = angular.module('D3Demo', []);

app.controller('MainCtrl', function ($scope, $timeout, $interval, $http) {

	$scope.checkins = [];

	function updateCheckins() {
		if ($scope.hotSpots.length) {
			$scope.checkins.push(angular.extend($scope.hotSpots.pop(), {
				size: Math.random(),
				ratio: Math.random()
			}));
		}

		for (var i = 0; i < $scope.checkins.length; i++) {
			var spot = $scope.checkins[i];

			spot.size += (Math.random() - 0.5);
			spot.ratio = Math.max(0.05, Math.min(0.95, spot.ratio + (Math.random() - 0.5) / 10.0));

			if (spot.size > 5) {
				spot.size = 5;
			}
			if (spot.size <= 0.3) {
				$scope.checkins.splice(i, 1);
				addSpotAfterDelay(spot, Math.round(Math.random() * 5000));
			}
		}

		$scope.checkins.sort(function(spot1, spot2) {
			return spot1.y - spot2.y;
		});

	}

	function addSpotAfterDelay(spot, delay) {
		$timeout(function () {
			$scope.hotSpots.push(spot);
		}, delay);
	}

	$http.get('mapSpots.json').success(function (result) {
		$scope.hotSpots = result.hotSpots;
		$interval(updateCheckins, 250);
	});
});

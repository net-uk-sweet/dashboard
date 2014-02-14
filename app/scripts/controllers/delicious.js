/* global _ */
'use strict';

angular.module('dashboardApp')
	.controller('DeliciousCtrl', function ($scope, $http) {

		var total = 30; // number of bookmarks to show

		$scope.url = 'http://feeds.delicious.com/v2/json/tags/net.uk.sweet?callback=JSON_CALLBACK';
		//$scope.url = '/data/delicious.json';
		$scope.bookmarks = [];

		// Probably makes this easier to update as we can call it via $scope
		$scope.getData = function() {
			$http.jsonp($scope.url).then(function(result) {
			//$http.get($scope.url).then(function(result) {
				$scope.bookmarks = normalise(massageData(result.data));
			});
		};

		$scope.getData();

		function normalise(arr) {

			// Calculate the range between min and max count
			var max = _.max(arr, function(val) { return val.count; }).count;
			var min = _.min(arr, function(val) { return val.count; }).count;

			var range = max - min;

			return _.map(arr, function(val) {
				return {
					label: val.label,
					// Normalise the count to a value between 1 and 10
					count: Math.round(((val.count - min) / range) * 9) + 1
				};
			});
		}

		function massageData(data) {
			data = convertToArray(data);
			// Get the top n tags and shuffle them
			return _.shuffle(_.sortBy(data, function(val) {
				return val.count;
			}).reverse().slice(0, total));
		}

		// delicious feed returns a dictionary style object where the
		// bookmark name is the key and the count is the value. We want
		// to convert into an array of objects : {label: key, count: val}
		function convertToArray(data) {
			var arr = [];
			for (var key in data) {
				arr.push({ label: key, count: data[key] });
			}
			return arr;
		}
	});

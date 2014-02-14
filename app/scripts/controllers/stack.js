/* global _ */
'use strict';

angular.module('dashboardApp')
	.controller('StackCtrl', function ($scope, $http) {

		var total = 5; // number of answers to show

		// URLs for API calls
		var base = 'http://api.stackexchange.com';
		var reputation = base + '/2.1/users/1289388/reputation?site=stackoverflow&filter=!9j_cPdECh&callback=JSON_CALLBACK';

		$scope.answers = [];

		// Probably makes this easier to update as we can call it via $scope
		$scope.getData = function() {

			$http.jsonp(reputation)
				.then(function(result) {
					// Filter recent reputation changes
					$scope.answers = filter(result.data.items);

					var url = base +
						'/2.1/answers/' +
						getIds($scope.answers) +
						'?order=desc&site=stackoverflow&callback=JSON_CALLBACK';

					// Get answers related to recent reputation changes	
					return $http.jsonp(url);
				})
				// Now merge props we're interested in from the answers
				.then(function(result) {
					$scope.answers = merge($scope.answers, result.data.items);
				});
		};

		$scope.getData();


		function filter(arr) {
			return removeDoubles(getPositives(arr)).slice(0, total);
		}

		function removeDoubles(arr) {
			// Remove repeats
			return _.uniq(arr, function(val) { return val.post_id; });
		}

		function getPositives(arr) {
			// We only want answers w/ positive rep change
			return _.filter(arr, function(val) {
				return val.post_type === 'answer' &&
					(val.vote_type === 'up_votes' || val.vote_type === 'accepts');
			});
		}

		// Add the question names to the list of answers
		function merge(changes, answers) {

			return _.map(changes, function(change) {

				var answer = _.find(answers, function(answer) {
					return change.post_id === answer.answer_id;
				});

				return _.extend(change, {
					score: answer.score,
					is_accepted: answer.is_accepted 
				});
			});
		}

		// Get semi-colon separated answer ids to build query 
		function getIds(arr) {
			return _.pluck(arr, 'post_id').join(';');
		}
	});

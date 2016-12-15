app.controller('url-shrt-controller', function($scope, $http, $location) {
	$scope.urlOutStyle = {
		'display': 'inline-block',
		'text-align': 'center'
	}
	$scope.urlOutHref = '#';
	$scope.urlOutput = '';
	$scope.sendURL = function() {
		$http({
			url: "/url",
			method: "POST",
			data:
				{
					'url': $scope.urlInput,
					days: $scope.daysInput,
					hours: $scope.hoursInput,
					minutes: $scope.minutesInput
				}
		})
		.then(function(response) {
			// Handle success
			if (response.status == 200) {
				if (response.data.status == 'success') {
					// Display sucess message
					var link = response.data.message;
					$scope.urlOutHref = $location.protocol() + '://' + location.host + '/' + link;
					$scope.urlOutput = $location.protocol() + '://' + location.host + '/' + link;
				} else {
					// Display error message
					var errMsg = response.data.message;
					$scope.urlOutHref = '#';
					$scope.urlOutput = errMsg;
				}
			}
		}, function(response) {
			// Handle network error
			$scope.urlOutHref = '#';
			$scope.urlOutput = 'Network error, try again later';
		});
	}
});

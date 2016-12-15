app.controller('url-shrt-controller', function($scope, $http) {
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
				if (response.data.error) {
					// Display error message
					console.log('error message')
				} else {
					// Display other message
					console.log('other message')
				}
			}
		}, function(response) {
			// Handle network error
			console.log('network error')
		});
	}
});

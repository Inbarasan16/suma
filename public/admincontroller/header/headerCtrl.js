app.controller('headerCtrl', ['$scope','Auth','$location', function($scope,Auth,$location){
	
	if(!Auth.isloggedIn()){
		$location.path('/login');
	}

	Auth.getUser().then(function(user){
		$scope.username = user.data.username;
	})


	$scope.logout = function(){
		Auth.logout();
		$location.path('/login');
	}



}])
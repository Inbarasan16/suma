app.controller('loginCtrl', ['$scope', '$http', 'Auth','$location',

    function($scope, $http, Auth,$location) {


        $scope.user;

        $scope.doLogin = function() {
            $scope.processing = true;
            $scope.error = "";
            Auth.login($scope.username, $scope.password).success(function(data) {
                $scope.processing = false;

                // Auth.getUser().then(function(data) {
                //     $scope.user = data;
                // })

                if (data.success) {
                    $location.path('/home');
                } else {
                    $scope.error = data.message;
                }

            });

            console.log(Auth.isloggedIn());

        }


        $scope.loggout = function() {
            Auth.loggout();
            $location.path('/login');
        }








    }
])
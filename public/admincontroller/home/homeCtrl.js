app.controller('homeCtrl', ['$scope', '$rootScope', 'Auth', '$location', '$http','fileUpload',
        function($scope, $rootScope, Auth, $location, $http,fileUpload) {


                $scope.gameData = {};
                $scope.enable = true;          

                $scope.reset=function(){
                	$scope.gameData.catgeory = "";
                	$scope.gameForm.$setPristine();
                }   



                $scope.sendGame = function() {

                	 var photo = $scope.gameData.thumbnail;
                	 var data = $scope.gameData.game;
                	 var fd = new FormData(gameForm);
                	 
                	 fd.append('thumbnail',photo);
                	 fd.append('game', data);                	 
        			 var uploadUrl = "/admin/game";
        			 fileUpload.uploadFileToUrl(fd, uploadUrl,function(fileinfo){
        			 	 console.log(fileinfo);
        			 },function(errorinfo){
        			 	 console.log(errorinfo);
        			 });

                }


            }
])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])

.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl,callback,errcallback){
        $http.post(uploadUrl, file, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
        	 //console.log(data);
        	 callback(data)
        })
        .error(function(errordata){
        	errcallback(errordata)
        });
    }
}])
    


     
     


 
 
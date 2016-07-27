app.factory('Auth', ['$http', '$q', 'AuthToken',
    function($http, $q, AuthToken) {

        var authFactory = {};

        authFactory.login = function(username, password) {

            return $http.post('/admin/login', {
                username: username,
                password: password
            }).success(function(data) {
                AuthToken.setToken(data.token);
                return data;
            })

        }

        authFactory.logout = function() {
            AuthToken.setToken();
        }


        authFactory.isloggedIn = function() {

            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }

        }


        authFactory.getUser = function() {

            if (AuthToken.getToken()) {
                return $http.get('/admin/me');
            } else {
                return $q.reject({
                    message: "Authentication error occurred"
                });
            }


        }



        return authFactory;

    }
])



.factory('AuthToken', ['$window',
    function($window) {

        var authTokenFactory = {};

        authTokenFactory.setToken = function(token) {
            if (token) {
                return $window.localStorage.setItem('token', token);

            } else {
                return $window.localStorage.removeItem('token');
            }

        }


        authTokenFactory.getToken = function() {
            return $window.localStorage.getItem('token');
        }




        return authTokenFactory;

    }
])


.factory('AuthInterceptor', function($q, $location, AuthToken) {

    var interceptorFactory = {};


    interceptorFactory.request = function(config) {
        var token = AuthToken.getToken();

        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;

    };

    return interceptorFactory;
})

.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }
]);
var app = angular.module('p2gameAdmin', ['ui.router','ngMessages'])

.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");

        $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'admincontroller/login/login.html',
            controller: 'loginCtrl'

        })

        .state('home', {
            url: '/home',

            views: {
                'header@home': {
                    templateUrl: 'admincontroller/header/header.html',
                    controller: 'headerCtrl'
                },

                '@': {
                    templateUrl:'admincontroller/home/home.html',
                    controller: 'homeCtrl'
                }
            }

        })



    }
])
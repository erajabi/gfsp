/*
* Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/


/*Define ng-app module*/
var listing = angular.module('akListing',['ngRoute', 'ui.bootstrap']);
/* var listing = angular.module('akListing',['ngRoute','mainController','listingController']); */

/* $locationProvider Configuration */
listing.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}]);

/* Shared Properties Service */
listing.service('sharedProperties',
	function () {
	    var total = 0;
	    var activeFacets = [];
	    var inactiveFacets = [];

	    return {
	        getTotal: function () {
	            return total;
	        },

	        setTotal: function(value) {
	            total = value;
	        },
	    };
	});


/*Routing*/
listing.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			//training
			when('/training/search/', {
				templateUrl: 'ui/akif_train_search.html',
				controller: 'listingController'
			}).
			when('/training/search/:search_param', {
				templateUrl: 'ui/akif_train_search.html',
				controller: 'listingController'
			}).
			//educational resources
			when('/educational/search/', {
				templateUrl: 'ui/akif_edu_search.html',
				controller: 'listingController'
			}).
			when('/educational/search/:search_param', {
				templateUrl: 'ui/akif_edu_search.html',
				controller: 'listingController'
			}).
			//research publications
			when('/publications/search/', {
				templateUrl: 'ui/agrif_search.html',
				controller: 'listingController'
			}).
			when('/publications/search/:search_param', {
				templateUrl: 'ui/agrif_search.html',
				controller: 'listingController'
			}).
			//general
			when('/search', {
				templateUrl: 'ui/search.html',
				controller: 'listingController'
			}).
			when('/item', {
				templateUrl: 'ui/item.html',
				controller: 'viewItemController'
			}).
			when('/item/:itemId', {
				templateUrl: 'ui/item.html',
				controller: 'viewItemController'
			}).
			when('/', {
				templateUrl: 'ui/main.html',
				controller: 'mainController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);



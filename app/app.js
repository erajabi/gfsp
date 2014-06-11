/*
* Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/




//Define ng-app module
//---
// define the module `akListing` wth the specific services we want to import.
// `ngroute` is needed for routing and `ui.bootstrap` for the bootstrap directives

var listing = angular.module('akListing',['ngRoute', 'ui.bootstrap']);


// Shared Properties Service
//------
// services are scope-irrelevant and can be used everywhere in the app.
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


// Routing
//--------
// The app's routing. We are having different templates and configuration files
// for each type we want to show.
listing.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			//AKIF
			// - training
			when('/training/search/', {
				templateUrl: 'templates/akif_train_search.html',
				controller: 'listingController'
			}).
			when('/training/search/:search_param', {
				templateUrl: 'templates/akif_train_search.html',
				controller: 'listingController'
			}).
			// - educational resources
			when('/educational/search/', {
				templateUrl: 'templates/akif_edu_search.html',
				controller: 'listingController'
			}).
			when('/educational/search/:search_param', {
				templateUrl: 'templates/akif_edu_search.html',
				controller: 'listingController'
			}).
			// - view-item
			when('/item', {
				templateUrl: 'templates/akif_item.html',
				controller: 'viewItemController'
			}).
			when('/item/:itemId', {
				templateUrl: 'templates/akif_item.html',
				controller: 'viewItemController'
			}).

			//AGRIF
			// - research publications
			when('/publications/search/', {
				templateUrl: 'templates/agrif_search.html',
				controller: 'listingController'
			}).
			when('/publications/search/:search_param', {
				templateUrl: 'templates/agrif_search.html',
				controller: 'listingController'
			}).
			when('/publication-item', {
				templateUrl: 'templates/agrif_item.html',
				controller: 'agris-viewItemController'
			}).
			when('/publication-item/:itemId', {
				templateUrl: 'templates/agrif_item.html',
				controller: 'agris-viewItemController'
			}).

			//General
			when('/', {
				templateUrl: 'templates/main.html',
				controller: 'mainController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);



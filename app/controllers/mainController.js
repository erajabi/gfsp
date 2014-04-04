/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define mainController controller in 'app' */
listing.controller("mainController", function($rootScope, $scope, $http, $location, $modal, $log, sharedProperties){

	$scope.conf_file = 'config/conf.json';
	var mappings_file = 'config/facets_mappings.json';

	//variable to show and hide elements in ui
	$scope.show_hide = [];
	$scope.show_hide[true]="hide";
	$scope.show_hide[false]="show";

	$rootScope.currentPage = 1;

	//get properties from conf.json
	$http.get($scope.conf_file)
	.success(function(data) {
	/*-----------------------------------FINDER SETTINGS FROM CONFIG FILE-----------------------------------*/
		//$scope.limit_facets = data.limit_facets;
		$scope.api_path = data.baseUrl;
		$scope.enablePaginationTop = data.enablePaginationTop;
		$scope.enablePaginationBottom = data.enablePaginationBottom;

		//IF "LOAD MORE" is enabled > PAGINATION auto-disabled
		if(data.enableLoadMore == true) {
			$scope.enablePaginationTop = false;
			$scope.enablePaginationBottom = false;
			$scope.enableLoadMore = data.enableLoadMore;
		}


		$scope.limitPagination = data.limitPagination;
		$scope.pageSize = data.pageSize;
		$scope.selectedLanguage = data.selectedLanguage;
		$scope.enableFacets = data.enableFacets;
		/* 		$scope.facets = data.facets; */
		$scope.snippetElements = data.snippetElements;
		$scope.maxTextLength = data.maxTextLength;
		$scope.limit_facets_number = data.limit_facets_number;
		$scope.findElements(true);
    })
	.error(function(err){
		//console.log(err);
	/*-----------------------------------DEFAULT FINDER SETTINGS-----------------------------------*/
		//API URL
		$scope.api_path = 'http://api.greenlearningnetwork.com:8080/search-api/v1/';
		//SCHEMA : AKIF of AGRIF
		$scope.schema = 'akif';

		//--PAGINATION
		//Enables top pagination : true/false
		$scope.enablePaginationTop = true;
		//Enables bottom pagination : true/false
		$scope.enablePaginationBottom = true;
		//Enable Load More
		$scope.enableLoadMore = false;
		//Limit Number of Pages in Pagination
		$scope.limitPagination = 10;
		//Page Size defines the number of results per page
		$scope.pageSize = 15;
		//Selected Language
		$scope.selectedLanguage='en';
		//FACETS
		//Enables the facets : true/false
		$scope.enableFacets = true;
		//Defines which facets we want to add
		$scope.facets = ['set','language','contexts'];
		$scope.limit_facets = {}; //{"set":["oeintute","prodinraagro"], "language":["en","fr"]}; // limit facets
		$scope.limit_facets_number = 10; // limits the number of the facets in facets list

		//SNIPPETS
		//Components inside snippet
		$scope.snippetElements = ['title','description'];
		$scope.maxTextLength = 500;

	});


	/*-----------------------------------VARIOUS VARIABLES in the scope-----------------------------------*/

	//this is the variable that created in the search box.
	//at Initialization searches '*' see:listingController > if(init)
	$rootScope.query = "";


	//Holds the results each time
	$scope.results = [];
	//Holds the pages for pagination
	$scope.pages = [];

	//Inactive facets
	$scope.inactiveFacets = [];
	//Active facets
	$scope.activeFacets = [];

	//Total results
	$scope.total = 0;

	//Mappings
	$scope.mapping = {};

	/*-----------------------------------FUNCTIONS-----------------------------------*/
	//Initialize Finder's mappings
	$scope.init_finder = function(schema, facets_type) {

		switch(facets_type) {
			case 'training' :
				$scope.facets = ['organization','languageBlocks.en.coverage','language', 'endUserRoles'];
				$scope.limit_facets = {"set":["aglrgfsp"]};
				mappings_file = 'config/training_facets_mappings.json';
				break;
			case 'educational' :
				$scope.facets = ['set','learningResourceTypes','contexts','endUserRoles','language'];
				$scope.limit_facets = {"set":["aglrfoodsafety","faocapacityportal","opunesco","aglrfaocdx","oeintute","oeorganiceprints","aglrfskn","aglrgfsp"]};
				mappings_file = 'config/educational_facets_mappings.json';
				break;
			case 'publications' :
				$scope.facets = ['expressions.citation.title','citationNumber','language','citationChronology','controlled.classification.CCL'];
				//$scope.limit_facets = data.limit_facets;
				mappings_file = 'config/publications_facets_mappings.json';
				break;
			default:
			    $scope.facets = ['set','language','contexts'];
		}

		//akif or agrif
		if( schema!='akif' && schema!='agrif') {
			$scope.schema = 'akif';
		} else {
			$scope.schema = schema;
		}



		//store the mapping for human reading languages
		$http.get(mappings_file).success(function(data) {
		        for(i in data) { // i = providers, languages, etc...
					$scope.mapping[i] = [];
		        	for(j in data[i]) {
		        		$scope.mapping[i][data[i][j].machine] = data[i][j].human;
		        	}
		        }
		    });
	};

	//Function for query submission
	$scope.submit = function() {
		if (this.search_query) {
		  $rootScope.query = "q=" + this.search_query;
		  $location.search('q',this.search_query);
		  this.search_query = '';

		  $rootScope.currentPage = 1;

		  $scope.findElements(false);
		  //change query in location

		}
		else{
			 alert('Type something to search!!');
		}

	};

	//Function for general update
	$scope.update = function() {
		$scope.total = sharedProperties.getTotal();
	}

	//reset $location
	$scope.resetLocation = function() {
		console.log("--reset--");
		for(i in $scope.facets) {
			$location.search($scope.facets[i],null);
		}

		$rootScope.query = "";
		$location.search('q',null);
		$scope.activeFacets = [];
		$scope.findElements(true);
	}

	//function for line break removal
	//@param text : text to sanitize
	$scope.sanitize = function(text) {
		text = text.replace(/(\r\n|\n|\r)/gm," ");
		return text;
	}

	//function for truncate long texts (i.e. description in listing)
	$scope.truncate = function(str, maxLength, suffix) {
	    if(str.length > maxLength) {
	        str = str.substring(0, maxLength + 1);
	        str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
	        str = str + suffix;
	    }
	    return str;
	}

	//SCROLL TO TOP
		$scope.scrollToTop = function () {
		var element = document.body;
		var to = 0;
		var duration = 550;

	    var start = element.scrollTop,
	        change = to - start,
	        currentTime = 0,
	        increment = 20;

	    var animateScroll = function(){
	        currentTime += increment;
	        var val = Math.easeInOutQuad(currentTime, start, change, duration);
	        element.scrollTop = val;
	        if(currentTime < duration) {
	            setTimeout(animateScroll, increment);
	        }
	    };
	    animateScroll();
	}

		//t = current time, b = start value, c = change in value, d = duration
		Math.easeInOutQuad = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	};


});



/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
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
		/* $scope.snippetElements = data.snippetElements; */
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

	/*
	* @function init_finder(schema, facets_type) : Initialize Finder
	* @param schema {string} : defines the schema of the finder - options: 'akif', 'agrif'
	* @param facets_type {string} : defines what facets we want in every case
	*/
	$scope.init_finder = function(schema, facets_type) {

		// When defining the facet_type we want to use, we also can limit everyone of these facets and define a specific mapping file for facets.
		// For now we have 'training', 'educational', 'publications'.
		// We can easily add more just by adding a new case in the following switch, and also add other options related to facets_type
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
				$scope.facets = ['language', 'controlled.type', 'controlled.classification.CCL', 'publisher.date'];
				//$scope.limit_facets = data.limit_facets;
				mappings_file = 'config/publications_facets_mappings.json';
				break;
			default:
			    $scope.facets = ['set','language','contexts'];
		}

		// In every schema we define the specific elements we want to have in the snippets.
		// Here can be added more schemas and also other options related to it.
		switch(schema) {
			case 'akif' :
				$scope.snippetElements = [ "title", "description", "keywords" ]
				break;
			case 'agrif' :
				$scope.snippetElements = [ "title", "abstract", "keywords" ]
				break;
			default:
			    $scope.facets = ['set','language','contexts'];
		}

		//Check for selected schema. If nothing is selected we use as default the 'akif'.
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

	/*
	* @function submit() : function for query submission
	*/
	$scope.submit = function() {
		if (this.search_query) {
		  $rootScope.query = "q=" + this.search_query;
		  $location.search('q',this.search_query);
		  this.search_query = '';

		  $rootScope.currentPage = 1;

		  $scope.findElements(false);

		}
		else{
			 alert('Type something to search!!');
		}

	};


	/*
	* @function update() : function for general update
	*/
	$scope.update = function() {
		$scope.total = sharedProperties.getTotal();
	}


	/*
	* @function resetLocation() : function for cleaning up the location
	*/
	$scope.resetLocation = function() {
		//console.log("--reset--");
		for(i in $scope.facets) {
			$location.search($scope.facets[i],null);
		}

		$rootScope.query = "";
		$location.search('q',null);
		$scope.activeFacets = [];
		$scope.findElements(true);
	}

	/*
	* @function sanitize() : function for line break removal
	* @param text {string}: text to sanitize
	*/
	$scope.sanitize = function(text) {
		text = text.replace(/(\r\n|\n|\r)/gm," ");
		return text;
	}

	/*
	* @function truncate() : function for truncate long texts (i.e. description in listing)
	* @param text {string}: text to sanitize
	*/
	$scope.truncate = function(str, maxLength, suffix) {
	    if(str.length > maxLength) {
	        str = str.substring(0, maxLength + 1);
	        str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
	        str = str + suffix;
	    }
	    return str;
	}

	/*
	* @function scrollToTop() : function for scrolling to top of the page
	* helpful when we have infinite vertical scroll
	*/
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

		/*
		* add function in Math for use it with scrollToTop
		* @function easeInOutQuad(t, b, c, d)
		* @param t = current time
		* @param b = start value
		* @param c = change in value
		* @param d = duration
		*/
		Math.easeInOutQuad = function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		};


});



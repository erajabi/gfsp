/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

//Define viewItemController controller in 'app'
//-----
listing.controller("viewItemController", function($scope, $http, $location, $routeParams) {

	//- GENERAL
	var language_mapping=[], audience_mapping=[];
	language_mapping['en'] = "English";

	//AKIF URL
	$scope.akif = 'http://api.greenlearningnetwork.com/search-api/v1/akif/';
	/* $scope.item_resource_id = ''; */
	$scope.item_resource_url = '';

	$scope.item_number_of_visitors = 0;
	$scope.item_average_rating = 'no rating available yet';
	$scope.item_tags = ['No tags available yet.'];
	$scope.enable_rating_1 = true;
	$scope.enable_rating_2 = true;
	$scope.enable_rating_3 = true;

	//Elements default values
	$scope.item_title = "No title available";
	$scope.item_description = "No description";

	//FUNCTIONS

	//- function `getItem`:
	// this functions runs on init, reads url parameters and make the specific call to our API
	$scope.getItem = function() {
		/* console.log($routeParams); */
		//we split the parameter from URL (i.e /item/35701_AGLRGFSP) and get the item id and the set
		var item_identifier = $routeParams.itemId.split('_')[0];
		var item_set = $routeParams.itemId.split('_')[1];

		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};


		$http({
			method : 'GET',
			url : $scope.akif + item_set + '/' + item_identifier, //..akif/ILUMINA/18169
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			//parse array and create a JS Object Array
			//every item is a JSON
			// we need only one item from the response, thus we add it in a variable use it easier
			var thisJson = data.results[0];

			//WE USE ONLY 'EN' FOR NOW
			if (thisJson.languageBlocks.en !== undefined) {

				//we take the languageBlock for 'en' from the specific json and add it in a variable.
				languageBlock = thisJson.languageBlocks['en'];
				//title
				languageBlock.title !== undefined ? $scope.item_title = languageBlock.title : $scope.item_title = '-';
				//description - we split it in '||' to take some extra info and return an array in order to render it more properly. (ask Effie Tsiflidou or Nikos Manolis)
				languageBlock.description !== undefined ? $scope.item_description = languageBlock.description.split("||") : $scope.item_description ='-';
				//keywords
				languageBlock.keywords !== undefined ? $scope.item_keywords = languageBlock.keywords : $scope.item_keywords = '-';
				//coverage
				languageBlock.coverage !== undefined ? $scope.item_coverage = languageBlock.coverage : $scope.item_coverage = '-';

			}

			//Organization
			thisJson.contributors[0].organization !== undefined ? $scope.item_organization = thisJson.contributors[0].organization : $scope.item_organization = '-';

			//language
			thisJson.expressions[0].language !== undefined ? $scope.item_language = language_mapping[thisJson.expressions[0].language] : $scope.item_language = '-';

			//Age Range
			thisJson.tokenBlock.ageRange !== undefined ? $scope.item_age_range = thisJson.tokenBlock.ageRange : $scope.item_age_range = '-';

			//Key audience
			$scope.item_roles = [];
			if(thisJson.tokenBlock.endUserRoles !== undefined) {
				for(i in thisJson.tokenBlock.endUserRoles) {
					$scope.item_roles.push(thisJson.tokenBlock.endUserRoles[i]);
				}
			} else {
				$scope.item_roles = '-';
			}

			//Contexts
			$scope.item_context = [];
			if(thisJson.tokenBlock.contexts !== undefined) {
				for(i in thisJson.tokenBlock.contexts) {
					$scope.item_context.push(thisJson.tokenBlock.contexts[i]);
				}
			} else {
				$scope.item_context = '-';
			}

			//Learning Resource Type
			$scope.item_resource_types = [];
			if(thisJson.tokenBlock.learningResourceTypes !== undefined) {
				for(i in thisJson.tokenBlock.learningResourceTypes) {
					$scope.item_resource_types.push(thisJson.tokenBlock.learningResourceTypes[i]);
				}
			} else {
				$scope.item_resource_types = '-';
			}



			/*

			if (thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology'] !== undefined) {
				console.log(thisJson.tokenBlock.taxonPaths);
				$scope.item_classification =[];

				for(i in thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology']) {
					urls = thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology'][i].split('::');
					for(j in urls) {
						$scope.item_classification.push(urls[j].split("#")[1]);
					}
				}
			} else {
				$scope.item_classification = '-';
			}
			*/

			//item url
			if(thisJson.expressions[0].manifestations[0].items[0].url!=undefined) {
				$scope.item_resource_url = thisJson.expressions[0].manifestations[0].items[0].url;

			}

		})

	};

});



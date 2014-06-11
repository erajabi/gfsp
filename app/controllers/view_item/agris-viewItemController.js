/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

//Define agris-ViewItemController controller in 'app'
//----
// variation of view item based on special needs of Agris.
// We need to show different things here than akif view item

listing.controller("agris-viewItemController", function($scope, $http, $location, $routeParams) {


	//GENERAL
	var language_mapping=[], audience_mapping=[];
	language_mapping['en'] = "English";

	//path to file with the specific mappings needed
	var classif_mapping_file = '../config/classification_mapping_min.json';
	$scope.classif_mapping = []; // contains all the code mappings

	$http.get(classif_mapping_file).success(function(data) {
		var classification = data['classification'];
    	for(j in classification) {
    		$scope.classif_mapping[classification[j].code] = classification[j].value;
    	}
    });

	//AKIF URL
	$scope.api_path = 'http://api.greenlearningnetwork.com/search-api/v1/agrif/';
	/* $scope.item_resource_id = ''; */
	$scope.item_resource_url = '';

	//Elements default values
	$scope.item_title = "No title available";
	$scope.item_description = "No description";

	/// FUNCTIONS

	//- function `getItem`:
	// this functions runs on init, reads url parameters and make the specific call to our API
	$scope.getItem = function() {
		//../ID_SET (maybe id contains '_' so we need to find which one is ID and which is the set
		//- hack to solve problem with AGRIS ids.
		var id_set = $routeParams.itemId.split('_');
		var item_identifier = '';
		for( var i=0, length=id_set.length; i<length-1; i++ ) {
			console.log(i, id_set[i]);
			if( i==0 ) {
				item_identifier = id_set[i];
			} else {
				item_identifier = item_identifier + '_' + id_set[i];
			}
		}
		var item_set = id_set[id_set.length-1];; //item SET
		$scope.item_resource_url = '';


		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};

		$http({
			method : 'GET',
			url : $scope.api_path + item_set + '/' + item_identifier, //..agrif/CAAS/asd56a4sa7fs4a5sf4
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			//parse array and create an JS Object Array
			//every item is a JSON
			// we need only one item from the response, thus we add it in a variable use it easier
			var thisJson = data.results[0];
			console.log(thisJson);

			//WE USE ONLY 'EN' FOR NOW
			if ( thisJson.languageBlocks.en !== undefined ) {
				//we take the languageBlock for 'en' from the specific json and add it in a variable.
				languageBlock = thisJson.languageBlocks['en'];

				//title
				languageBlock.title !== undefined ? $scope.item_title = languageBlock.title : $scope.item_title = '-';

				//abstract
				languageBlock.abstract !== undefined ? $scope.item_abstract = languageBlock.abstract : $scope.item_abstract ='-';

				//keywords
				if(languageBlock.keywords !== undefined) {
					var keywords = languageBlock.keywords[0].split(';');
					$scope.item_keywords = keywords;
				} else {
					$scope.item_keywords = '-';
				}

			}

			//citation
			if( thisJson.expressions[0] && thisJson.expressions[0].citation && thisJson.expressions[0].citation[0] ) {
				$scope.item_citation = '';
				console.log(thisJson.expressions[0].citation[0]);

				thisJson.expressions[0].citation[0].title ? $scope.item_citation += thisJson.expressions[0].citation[0].title[0]+', ' : $scope.item_citation +='';
				thisJson.expressions[0].citation[0].ISSN ? $scope.item_citation += thisJson.expressions[0].citation[0].ISSN[0]+', ' : $scope.item_citation +='';
				thisJson.expressions[0].citation[0].citationNumber ? $scope.item_citation += thisJson.expressions[0].citation[0].citationNumber[0]+', ' : $scope.item_citation +='';
				thisJson.expressions[0].citation[0].citationChronology ? $scope.item_citation += thisJson.expressions[0].citation[0].citationChronology[0] : $scope.item_citation +='';


			} else {
				$scope.item_citation = '-';
			}

			//language
			thisJson.expressions[0].language !== undefined ? $scope.item_language = language_mapping[thisJson.expressions[0].language] : $scope.item_language = '-';

			//pages
			thisJson.expressions[0].manifestations[0].size !== undefined ? $scope.item_pages = thisJson.expressions[0].manifestations[0].size : $scope.item_pages = '-';
			console.log(thisJson.expressions[0].manifestations[0]);

			//creator
			if( thisJson.creators ) {
				$scope.item_creators = '';
				for( i in thisJson.creators) {
					$scope.item_creators += thisJson.creators[i].name;
					if(i != thisJson.creators.length-1) {
						$scope.item_creators += ', ';
					}
				}
			} else {
				$scope.item_creators = '-';
			}

			//classification
			if(thisJson.controlled && thisJson.controlled.classification && thisJson.controlled.classification.CCL) {
				$scope.item_classification = thisJson.controlled.classification.CCL.split(',');
			} else {
				$scope.item_classification = '-';
			}

		})

	};

});



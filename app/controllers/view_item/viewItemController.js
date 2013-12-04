/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define viewItemController controller in 'app' */
listing.controller("viewItemController", function($scope, $http, $location) {

	/*****************************************************************************************************************/
	/*							  	GENERAL												  						     */
	/*****************************************************************************************************************/
	/*AKIF URL*/
	$scope.akif = 'http://54.228.180.124:8080/search-api/v1/akif/';
	//$scope.item_resource_id = '';
	$scope.item_resource_url = '';
	$scope.user_id = 23;
	$scope.domain = 'http://greenlearningnetwork.org';
	$scope.ip = '83.212.100.142';


	$scope.item_number_of_visitors = 0;
	$scope.item_average_rating = 'no rating available yet';
	$scope.item_tags = ['No tags available yet.'];
	$scope.enable_rating_1 = true;
	$scope.enable_rating_2 = true;
	$scope.enable_rating_3 = true;

	//Elements default values
	$scope.item_title = "No title available for this language";
	$scope.item_description = "No description available for this language";

	/*****************************************************************************************************************/
	/*							  	FUNCTIONS												  						 */
	/*****************************************************************************************************************/

	/************************************************** GET ITEM *****************************/
	$scope.getItem = function() {

		var item_identifier = $location.search().id.split('_')[0]; //SET_ID
		var item_set = $location.search().id.split('_')[1];

		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};

		$http({
			method : 'GET',
			url : $scope.akif + item_set + '/' + item_identifier, //..akif/ILUMINA/18169
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			//parse array and create an JS Object Array
			//every item is a JSON
			//console.log(data);
			var thisJson = data.results[0];

			//WE USE ONLY 'EN' FOR NOW
			if (thisJson.languageBlocks.en !== undefined) {

				languageBlock = thisJson.languageBlocks['en'];

				languageBlock.title !== undefined ? $scope.item_title = languageBlock.title : $scope.item_title = '-';

				languageBlock.description !== undefined ? $scope.item_description = languageBlock.description : $scope.item_description ='-';

				languageBlock.keywords !== undefined ? $scope.item_keywords = languageBlock.keywords : $scope.item_keywords = '-';

				languageBlock.coverage !== undefined ? $scope.item_coverage = languageBlock.coverage : $scope.item_coverage = '-';

			}

			thisJson.contributors[0].organization !== undefined ? $scope.item_organization = thisJson.contributors[0].organization : $scope.item_organization = '-';

			thisJson.expressions[0].language !== undefined ? $scope.item_language = thisJson.expressions[0].language : $scope.item_language = '-';

			$scope.item_roles = [];
			if(thisJson.tokenBlock.endUserRoles !== undefined) {
				for(i in thisJson.tokenBlock.endUserRoles) {
					$scope.item_roles.push(thisJson.tokenBlock.endUserRoles[i]);
				}
			} else {
				$scope.item_roles = '-';
			}

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

			if(thisJson.expressions[0].manifestations[0].items[0].url!=undefined) {
				$scope.item_resource_url = thisJson.expressions[0].manifestations[0].items[0].url;

			}

		})

	};

});



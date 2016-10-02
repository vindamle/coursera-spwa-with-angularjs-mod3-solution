(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.directive('foundItems', FoundItemsDirective)
.service('MenuSearchService', MenuSearchService)
.constant('MenuServiceApiBasePath', 'https://davids-restaurant.herokuapp.com')
.controller('NarrowItDownController', NarrowItDownController)
;

function FoundItemsDirective() {

  var ddo = {
    templateUrl: 'foundList.html',
    scope: {
      found: '<',
      onRemove: '&',
      searchResultTitle: '<'
    },
    controller: FoundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true
  };

  return ddo;

}

  function FoundItemsDirectiveController() {
    var list = this;
  }


  NarrowItDownController.$inject = ['MenuSearchService'];

  function NarrowItDownController(MenuSearchService) {

    var search = this;

    search.found = [];
    search.resultTitle = "";
    search.getMatchedMenuItems = function functionName() {

      search.found = [];
      var promise = MenuSearchService.getMatchedMenuItems(search.searchTerm);

      promise.then(function (response) {
        search.found = response;
        search.resultTitle = search.searchTerm;
      })
      .catch(function (error) {
      });


    }

    search.removeItem = function(index) {
      search.found.splice(index, 1);
    }

  }

  MenuSearchService.$inject = ['$q', '$http', 'MenuServiceApiBasePath'];
  function MenuSearchService($q, $http, MenuServiceApiBasePath) {
    var menuSearchService = this;

    menuSearchService.getMatchedMenuItems = function functionName(searchTerm) {

      var foundItems = $q.defer();
      var data = [];
      $http({
            method: "GET",
            url: (MenuServiceApiBasePath + "/menu_items.json"),
          }).then(function (response) {
             response.data.menu_items.forEach(function(item, index) {
               if ((searchTerm) && 
                   (searchTerm.trim().length > 0 ) &&
                   (item.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
                 data.push(item);
               }
             });
             foundItems.resolve(data);
          })
          .catch(function (error) {
            foundItems.reject(data);
      });
      return foundItems.promise;

    }

  }

})();

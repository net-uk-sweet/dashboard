'use strict';

var app = angular.module('dashboardApp', ['ngRoute', 'ngRoute'])
  // Configuration blocks - get executed during the provider registrations and 
  // configuration phase. Only providers and constants can be injected into 
  // configuration blocks. 
  // 
  // Run blocks are the closest thing in Angular to the main method. A run block 
  // is the code which needs to run to kickstart the application. It is executed 
  // after all of the service have been configured and the injector has been created. 
  // Run blocks typically contain code which is hard to unit-test, and for this 
  // reason should be declared in isolated modules, so that they can be ignored in 
  // the unit-tests.
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/app.html'
        // controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  // A custom behaviour (should abstract this into a separate file)
  app.directive('cloud', function($timeout) {
    return {
      restrict: 'A', // Restrict scope to attribute
      link: function(scope, element, attrs) {
        // Need to wait for data to load before instantiating plug-in
        scope.$watch('bookmarks', function(val) {
          // And we need to wait for Angular to render the data
          $timeout(function() {
            $(element).find('a').tagcloud(scope.$eval(attrs.cloud));
          });
        });
      }
    }
  });

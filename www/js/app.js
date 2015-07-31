angular.module('math', ['ionic', 'timer'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "templates/home.html"
    }).state('level', {
      url: "/level/:type",
      controller: "LevelCtrl",
      templateUrl: "templates/level.html"
    }).state('practice', {
      url: "/practice/:type/:level",
      controller: "PracticeCtrl",
      templateUrl: "templates/practice.html"
    }).state('kids', {
      url: "/kids/:type/:level",
      controller: "KidsCtrl",
      templateUrl: "templates/kids.html"
    }).state('teen', {
      url: "/teen/:type/:level",
      controller: "TeenCtrl",
      templateUrl: "templates/teen.html"
    }).state('pro', {
      url: "/pro/:type/:level",
      controller: "ProCtrl",
      templateUrl: "templates/pro.html"
    }).state('score', {
      url: "/score/:type/:controller/:level/:score",
      controller: "ScoreCtrl",
      templateUrl: "templates/score.html",
      params: {
        'time': null
      }
    });

   $urlRouterProvider.otherwise("/");

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory('API', function() {
  return {
    random: function (limit) {
      return Math.floor((Math.random() * limit));
    },
    colors: function () {
      return [
        "stable",
        "positive",
        "calm",
        "balanced",
        "energized",
        "assertive",
        "royal"
      ];
    },
    icons: function () {
      return [
        "ion-home",
        "ion-flag",
        "ion-star",
        "ion-heart",
        "ion-wrench",
        "ion-edit",
        "ion-trash-b",
        "ion-scissors",
        "ion-funnel",
        "ion-paper-airplane",
        "ion-person",
        "ion-woman",
        "ion-man",
        "ion-fork",
        "ion-knife",
        "ion-spoon",
        "ion-beer",
        "ion-wineglass",
        "ion-coffee",
        "ion-icecream",
        "ion-pizza",
        "ion-mouse",
        "ion-paintbrush",
        "ion-bug"
      ];
    },
    randomIcon: function() {
      return this.icons()[this.random(this.icons().length-1)];
    },
    randomColor: function() {
      return this.colors()[this.random(this.colors().length-1)];
    },
    randomItem: function(limit) {
      return {
        color: this.randomColor(),
        icon: this.randomIcon(),
        size: this.random(limit)+1
      }
    },
    randomResults: function (size, limit, result) {
      var results = [];
      var resultExist = false;

      for(var i=0;i<size;i++){
        var value = this.random(limit)+1;
        if(value == result) resultExist = true;
        results.push(value);
      }

      if (!resultExist){
        results[this.random(size)] = result;
      }

      return results
    }
  };
})
.controller('LevelCtrl', function($stateParams, $timeout, $scope, $state){
  $scope.type = $stateParams.type;
  $scope.back = function () {
    $state.go('home');
  };
})
.controller('PracticeCtrl', function($stateParams, $timeout, $scope, API, $state){
  var maxCounter = 10;
  var startTime = new Date().getTime();

  $scope.range = function(n) {
    return new Array(n);
  };

  var build = function () {
    $scope.first = API.randomItem(5);
    $scope.second = API.randomItem(5);
    $scope.result = $scope.first.size + $scope.second.size;
    $scope.results = API.randomResults(2, 10, $scope.result);
  }

  $scope.type = $stateParams.type;
  
  $scope.score = 0;
  $scope.counter = 0;

  $scope.back = function () {
    $state.go('level', { 
      'type':$scope.type
    });
  };

  $scope.validate = function (result) {
    if($scope.result == result){
      $scope.score++;
    }
    $scope.counter++;
    if($scope.counter == maxCounter){
      $state.go('score', { 
        'type':$scope.type,
        'controller':"practice",
        'level':1,
        'score':$scope.score,
        'time':startTime
      });
    }else{
      build();
    }
  }
  build();
})
.controller('KidsCtrl', function($stateParams, $timeout, $scope){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
})
.controller('TeenCtrl', function($stateParams, $timeout, $scope){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
})
.controller('ProCtrl', function($stateParams, $timeout, $scope){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
})
.controller('ScoreCtrl', function($stateParams, $timeout, $scope, $state){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
  $scope.score = $stateParams.score;
  $scope.controller = $stateParams.controller;
  $scope.startTime = $stateParams.time;

  $scope.repeat = function () {
    $state.go($scope.controller, {
      type:$scope.type,
      level:$scope.level
    },{
      reload: true 
    });
  }
});
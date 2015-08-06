angular.module('math', ['ionic', 'timer', 'LocalStorageModule'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('math');
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "templates/home.html"
    })
    .state('level', {
      url: "/level/:type",
      controller: "LevelCtrl",
      templateUrl: "templates/level.html"
    })
    .state('multiply-teen-level', {
      url: "/teen/multiply/:level",
      controller: "MultiplyKeyboardCtrl",
      templateUrl: "templates/multiply-keyboard.html",
      params: {
        'controller': "multiply-teen-level",
        'type': 'multiply',
        'counter': 20
      }
    })
    .state('level-multiply', {
      url: "/:type/multiply/:level",
      controller: "LevelMultiplyCtrl",
      templateUrl: "templates/level-multiply.html",
      params: {
        'controller': "level-multiply"
      }
    })
    .state('kids-divide', {
      url: "/practice/divide/:level",
      controller: "DivideKidsCtrl",
      templateUrl: "templates/divide-kids.html",
      params: {
        'type': 'divide',
        'controller': "kids-divide",
        'counter':10,
        'max':10,
        'results':2,
        'rows':2
      }
    })
    .state('practice', {
      url: "/practice/:type/:level",
      controller: "AddCtrl",
      templateUrl: "templates/practice.html",
      params: {
        'controller': "practice",
        'counter':10,
        'max':6,
        'results':2,
        'rows':2
      }
    })
    .state('kids-1', {
      url: "/kids/:type/1",
      controller: "AddCtrl",
      templateUrl: "templates/kids.html",
      params: {
        'controller': "kids-1",
        'counter': 10,
        'max': 5,
        'results': 2,
        'level': 1,
        'rows':2
      }
    })
    .state('kids-2', {
      url: "/kids/:type/2",
      controller: "AddCtrl",
      templateUrl: "templates/kids.html",
      params: {
        'controller': "kids-2",
        'counter':15,
        'max':10,
        'results':3,
        'level':2,
        'rows':2
      }
    })
    .state('teen-1', {
      url: "/teen/:type/1",
      controller: "AddCtrl",
      templateUrl: "templates/teen.html",
      params: {
        'controller': "teen-1",
        'counter':20,
        'max':200,
        'results':4,
        'level':1,
        'rows':2
      }
    })
    .state('teen-2', {
      url: "/teen/:type/2",
      controller: "AddCtrl",
      templateUrl: "templates/teen.html",
      params: {
        'controller': "teen-2",
        'counter':20,
        'max':320,
        'results':4,
        'level':2,
        'rows':3
      }
    })
    .state('multiply-kids-1', {
      url: "/kids/multiply/play/1",
      controller: "MultiplyCtrl",
      templateUrl: "templates/multiply.html",
      params: {
        'controller': "multiply-kids-1",
        'type':'multiply',
        'results': 4,
        'counter':15
      }
    })
    .state('multiply-kids-2', {
      url: "/kids/multiply/play/2",
      controller: "MultiplyKeyboardCtrl",
      templateUrl: "templates/multiply-keyboard.html",
      params: {
        'controller': "multiply-kids-2",
        'type':'multiply',
        'results': 4,
        'counter':20
      }
    })
    .state('multiply', {
      url: "/:mode/multiply/play/:level",
      controller: "MultiplyCtrl",
      templateUrl: "templates/multiply.html",
      params: {
        'type':'multiply',
        'controller': "multiply",
        'results': 2,
        'counter':10
      }
    })
    .state('pro', {
      url: "/pro/:type/:level",
      controller: "ProCtrl",
      templateUrl: "templates/pro.html"
    })
    .state('score', {
      url: "/score",
      controller: "ScoreCtrl",
      templateUrl: "templates/score.html",
      params: {
        'score': 0,
        'level': 1,
        'controller': "",
        'type':"",
        'time': null,
        'max':0
      }
    });

   $urlRouterProvider.otherwise("/");

})
.run(function($ionicPlatform, $rootScope, MediaSrv) {
  var play = {
    play : function () {
    }
  };
  $rootScope.successSound = play;
  $rootScope.errorSound = play;
  $rootScope.finishSound = play;

  MediaSrv.loadMedia('sound/success.wav').then(function(media){
    $rootScope.successSound = media;
  });

  MediaSrv.loadMedia('sound/error.wav').then(function(media){
    $rootScope.errorSound = media;
  });

  MediaSrv.loadMedia('sound/finish.wav').then(function(media){
    $rootScope.finishSound = media;
  });
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory('MediaSrv', function($q, $ionicPlatform, $window){
  var service = {
    loadMedia: loadMedia,
    getStatusMessage: getStatusMessage,
    getErrorMessage: getErrorMessage
  };

  function loadMedia(src, onStop, onError, onStatus){
    var defer = $q.defer();
    $ionicPlatform.ready(function(){
      var mediaStatus = {
        code: 0,
        text: getStatusMessage(0)
      };
      var mediaSuccess = function(){
        mediaStatus.code = 4;
        mediaStatus.text = getStatusMessage(4);
        if(onStop){onStop();}
      };
      var mediaError = function(err){
        _logError(src, err);
        if(onError){onError(err);}
      };
      var mediaStatus = function(status){
        mediaStatus.code = status;
        mediaStatus.text = getStatusMessage(status);
        if(onStatus){onStatus(status);}
      };

      if($ionicPlatform.is('android')){src = '/android_asset/www/' + src;}

      var media = new $window.Media(src, mediaSuccess, mediaError, mediaStatus);
      media.status = mediaStatus;
      defer.resolve(media);
    });
    return defer.promise;
  }

  function _logError(src, err){
    alert(err.code);
    alert(getErrorMessage(err.code));
    console.error('MediaSrv error', {
      code: err.code,
      text: getErrorMessage(err.code)
    });
  }

  function getStatusMessage(status){
    if(status === 0){return 'Media.MEDIA_NONE';}
    else if(status === 1){return 'Media.MEDIA_STARTING';}
    else if(status === 2){return 'Media.MEDIA_RUNNING';}
    else if(status === 3){return 'Media.MEDIA_PAUSED';}
    else if(status === 4){return 'Media.MEDIA_STOPPED';}
    else {return 'Unknown status <'+status+'>';}
  }

  function getErrorMessage(code){
    if(code === 1){return 'MediaError.MEDIA_ERR_ABORTED';}
    else if(code === 2){return 'MediaError.MEDIA_ERR_NETWORK';}
    else if(code === 3){return 'MediaError.MEDIA_ERR_DECODE';}
    else if(code === 4){return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';}
    else {return 'Unknown code <'+code+'>';}
  }

  return service;
})
.factory('API', function(localStorageService, $filter) {
  return {
    random: function (limit) {
      return Math.floor((Math.random() * limit));
    },
    randomRange: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
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
    randomItem: function(min, max) {
      return {
        color: this.randomColor(),
        icon: this.randomIcon(),
        size: this.randomRange(min, max),
        number: this.random(2)
      }
    },
    randomResults: function (size, min, max, result) {
      var results = [];
      var resultExist = false;

      for(var i=0;i<size;i++){
        var value = this.randomRange(min, max)+1;
        if (results.indexOf(value)>=0){
          i--;
        }else{
          if(value == result) resultExist = true;
          results.push(value);
        }
      }

      if (!resultExist){
        results[this.random(size)] = result;
      }

      return results
    },
    times: function() {
      var times = localStorageService.get("times");
      if (times === null){
        return [
          {
            number: 0,
            selected: true,
          },
          {
            number: 1,
            selected: true,
          },{
            number: 2,
            selected: true,
          },{
            number: 3,
            selected: false,
          },{
            number: 4,
            selected: false,
          },{
            number: 5,
            selected: false,
          },{
            number: 6,
            selected: false,
          },{
            number: 7,
            selected: false,
          },{
            number: 8,
            selected: false,
          },{
            number: 9,
            selected: false,
          },{
            number: 10,
            selected: true
          }
        ];
      }else{
        return times;
      }
    },
    timesSelected: function () {
      var times = this.times();
      var timesSelected = [];
      for(var i=0;i<times.length;i++){
        if(times[i].selected){
          timesSelected.push(times[i].number);
        }
      }
      return timesSelected;
    }
  };
})
.controller('LevelCtrl', function($stateParams, $timeout, $scope, $state){
  $scope.type = $stateParams.type;
  $scope.back = function () {
    $state.go('home');
  };
})
.controller('AddCtrl', function($stateParams, $timeout, $scope, API, $state, $rootScope){
  var maxCounter = $stateParams.counter;
  var startTime = new Date().getTime();

  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
  $scope.rows = $stateParams.rows;

  $scope.range = function(n) {
    return new Array(n);
  };

  var minResult = 0;

  var build = function () {
    if ($scope.type == "add"){
      $scope.first = API.randomItem(1, $stateParams.max);
      $scope.second = API.randomItem(1, $stateParams.max);
      $scope.sign = "+";
      if ($scope.rows >= 3){
        $scope.third = API.randomItem(1, $stateParams.max);
        $scope.result = $scope.first.size + $scope.second.size + $scope.third.size;
      }else{
        $scope.result = $scope.first.size + $scope.second.size;
      }
      $scope.results = API.randomResults($stateParams.results, minResult, $stateParams.max*$scope.rows, $scope.result);

    }else if($scope.type == "substract"){
      $scope.first = API.randomItem(1, $stateParams.max);
      $scope.second = API.randomItem(1, $scope.first.size);
      $scope.sign = "-";
      if ($scope.rows >= 3){
        $scope.third = API.randomItem(1, $stateParams.max);
        $scope.result = $scope.first.size - $scope.second.size - $scope.third.size;
        minResult = $scope.result;
      }else{
        $scope.result = $scope.first.size - $scope.second.size;
        minResult = 0;
      }

      $scope.results = API.randomResults($stateParams.results, minResult, $stateParams.max, $scope.result);
    }
  }
  
  $scope.score = 0;
  $scope.counter = 0;

  $scope.back = function () {
    $state.go('level', { 
      'type':$scope.type
    });
  };

  $scope.validate = function (result) {
    if($scope.result == result){
      $rootScope.successSound.play();
      $scope.score++;
    }else{
      $rootScope.errorSound.play();
    }

    $scope.counter++;
    if($scope.counter == maxCounter){
      $state.go('score', { 
        'type': $scope.type,
        'controller': $stateParams.controller,
        'level': $stateParams.level,
        'score': $scope.score,
        'time': startTime,
        'max': $stateParams.counter
      });
    }else{
      build();
    }
  }
  build();
})
.controller('DivideKidsCtrl', function($stateParams, $timeout, $scope, API, $state, $rootScope){
  var maxCounter = $stateParams.counter;
  var startTime = new Date().getTime();

  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
  $scope.rows = $stateParams.rows;

  $scope.range = function(n) {
    return new Array(n);
  };

  var minResult = 0;

  var build = function () {
    $scope.first = API.randomItem(1, $stateParams.max);
    $scope.second = API.randomItem(1, $scope.first.size);
    $scope.result = $scope.first.size + $scope.second.size;
    $scope.results = API.randomResults($stateParams.results, minResult, $stateParams.max*$scope.rows, $scope.result);
  }
  
  $scope.score = 0;
  $scope.counter = 0;

  $scope.back = function () {
    $state.go('level', { 
      'type':$scope.type
    });
  };

  $scope.validate = function (result) {
    if($scope.result == result){
      $rootScope.successSound.play();
      $scope.score++;
    }else{
      $rootScope.errorSound.play();
    }

    $scope.counter++;
    if($scope.counter == maxCounter){
      $state.go('score', { 
        'type': $scope.type,
        'controller': $stateParams.controller,
        'level': $stateParams.level,
        'score': $scope.score,
        'time': startTime,
        'max': $stateParams.counter
      });
    }else{
      build();
    }
  }

  build();
})
.controller('TeenCtrl', function($stateParams, $timeout, $scope){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
})
.controller('ProCtrl', function($stateParams, $timeout, $scope){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
})
.controller('LevelMultiplyCtrl', function($stateParams, $timeout, $scope, $state, API, localStorageService){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
  $scope.times = API.times();

  $scope.play = function ($event) {
    localStorageService.set("times", $scope.times);
    if (API.timesSelected().length === 0){
      $event.preventDefault();
      alert("Please select a table.");
    }
  }
})
.controller('MultiplyCtrl', function($stateParams, $timeout, $scope, API, localStorageService, $rootScope, $state){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
  $scope.rows = $stateParams.rows;
  var maxCounter = $stateParams.counter;
  $scope.sign = "x";
  $scope.score = 0;
  $scope.counter = 0;
  var startTime = new Date().getTime();

  var times = API.timesSelected();

  var build = function () {
    $scope.first = times[API.random(times.length)];
    $scope.second = API.random(10);
    $scope.result = $scope.first*$scope.second;
    $scope.results = API.randomResults($stateParams.results, 0, times[times.length-1], $scope.result);
  };

  $scope.validate = function (result) {
    if($scope.result == result){
      $rootScope.successSound.play();
      $scope.score++;
    }else{
      $rootScope.errorSound.play();
    }

    $scope.counter++;
    if($scope.counter == maxCounter){
      $state.go('score', { 
        'type': $scope.type,
        'controller': $stateParams.controller,
        'level': $stateParams.level,
        'score': $scope.score,
        'time': startTime,
        'max': $stateParams.counter
      });
    }else{
      build();
    }
  }

  build();
})
.controller('MultiplyKeyboardCtrl', function($stateParams, $timeout, $scope, API, localStorageService, $rootScope, $state){
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
  $scope.rows = $stateParams.rows;

  var maxCounter = $stateParams.counter;
  $scope.sign = "x";
  $scope.score = 0;
  $scope.counter = 0;
  $scope.result = "";
  var startTime = new Date().getTime();

  var times = API.timesSelected();

  var build = function () {
    if ($scope.type == "teen"){
      $scope.first = API.random(50*$scope.level);
      $scope.second = API.random(50*$scope.level);
    }else{
      $scope.first = times[API.random(times.length)];
      $scope.second = API.random(10);
    }
  };

  $scope.keyboard = function (key) {
    if ($scope.result.length < 5){
      $scope.result += key;
    }
  };

  $scope.delete = function () {
    $scope.result = $scope.result.substring(0, $scope.result.length - 1);
  };

  $scope.validate = function () {
    var result = $scope.first * $scope.second;

    if($scope.result == result){
      $rootScope.successSound.play();
      $scope.score++;
    }else{
      $rootScope.errorSound.play();
    }
    $scope.result = "";
    $scope.counter++;
    if($scope.counter == maxCounter){
      $state.go('score', {
        'type': $scope.type,
        'controller': $stateParams.controller,
        'level': $stateParams.level,
        'score': $scope.score,
        'time': startTime,
        'max': $stateParams.counter
      });
    }else{
      build();
    }
  }

  build();
})
.controller('ScoreCtrl', function($stateParams, $timeout, $scope, $state, $rootScope){
  $rootScope.finishSound.play();
  $scope.type = $stateParams.type;
  $scope.level = $stateParams.level;
  $scope.score = $stateParams.score;
  $scope.controller = $stateParams.controller;
  $scope.startTime = $stateParams.time;
  $scope.max = $stateParams.max;

  $scope.repeat = function () {
    $state.go($scope.controller, {
      type:$scope.type,
      level:$scope.level
    },{
      reload: true 
    });
  }
});
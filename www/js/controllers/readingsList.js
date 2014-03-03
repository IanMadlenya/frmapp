frmControllers.controller('FRMAppReadingsListCtrl', ['$scope','$timeout', 'scheduleBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, $timeout, scheduleBarSharedService, remoteDataService, readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

    if(scheduleBarSharedService.lessonIndex == 'all') {
      $scope.currentLesson = {id:'all', title:'All Readings'};
      $scope.readings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
      //$scope.readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });
    } else {    
      $scope.currentLesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
      $scope.readings = $scope.currentLesson.readings
    }

    $scope.$on('handleTopicSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {

          $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

          if($scope.lessonIndex == 'all') {
            $scope.currentLesson = {id:'all', title:'All Readings'};
            $scope.readings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
            //$scope.readings = _.reject(allReadings, function(ar){ return typeof ar.id === "undefined"; });

          } else {
            var lesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
            if(lesson !== null && typeof lesson !== "undefined") {          
              $scope.currentLesson = lesson;
              $scope.readings = lesson.readings;
            }            
          }
      }
    });

    // Readings List
    $scope.itemClicked = function (id, type) {
      readlingListSharedService.setReadingIndex(id);
      remoteDataService.toggelReadingAttribute(id, type);
    };
  
    $scope.isItemClicked = function (id, type) { 

      var foundItem = remoteDataService.getReadingByID(id);
      if(foundItem === null || typeof foundItem === "undefined") {
        return false;
      } else {
        return foundItem[type];
      }

    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheduleBarSharedService.lessonIndex;
    }

    $scope.getNumberOfNotes = function(id) {

      var foundItem = remoteDataService.getReadingByID(id);
      if(foundItem !== null && typeof foundItem !== "undefined" &&
        foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
        return foundItem.notes.length;
      } else {
        return 0;
      }
    }

    $scope.criteriaMatch = function(value) {
      return function( item ) {

        // New Queue  
        var foundItem = _.findWhere(remoteDataService.userMeta, {id: item.id});        

        if(foundItem !== null && typeof foundItem !== "undefined") {

          if(readlingListSharedService.filters.flagged && readlingListSharedService.filters.checked) {
            return (foundItem.flagged === true && foundItem.checked === true);
          } else if(readlingListSharedService.filters.flagged) {
            return foundItem.flagged === true;
          } else if(readlingListSharedService.filters.checked) {
            return foundItem.checked === true;
          } else {
            return 1;  
          }
        } else {
          if(readlingListSharedService.filters.flagged || readlingListSharedService.filters.checked) {
            return false;
          } else {
            return 1;  
          }
          
        }
        
      }
    }   

  }
]);
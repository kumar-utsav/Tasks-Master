app.controller('BrowseController', function($scope, $routeParams, toaster, Task, Auth, Comment, Offer){
  $scope.searchTask = '';
  $scope.tasks = Task.all;
  $scope.signedIn = Auth.signedIn;
  $scope.listMode = true;

  $scope.user = Auth.user;

  if($routeParams.taskId){
    var task = Task.getTask($routeParams.taskId).$asObject();
    $scope.listMode = false;
    setSelectedTask(task);
  }

  function setSelectedTask(task){
    $scope.selectedTask = task;

    if($scope.signedIn()){

      $scope.isTaskCreator = Task.isCreator;
      $scope.isOpen = Task.isOpen;

      Offer.isOffered(task.$id).then(function(data){
          $scope.alreadyOffered = data;
      });

    }

    $scope.comments = Comment.comments(task.$id);

    $scope.offers = Offer.offers(task.$id);

    $scope.block = false;

    $scope.isOfferMaker = Offer.isMaker;

    $scope.isAsignee = Task.isAsignee;

    $scope.isCompleted = Task.isCompleted;
};

  $scope.cancelTask =  function(taskId){
    Task.cancelTask(taskId).then(function(){
      toaster.pop('success', 'This task is cancelled successfully');
    });
};

  $scope.addComment = function(){
      var comment = {
        content: $scope.content,
        name: $scope.user.profile.name,
        gravatar: $scope.user.profile.gravatar
      };

      Comment.addComment($scope.selectedTask.$id, comment).then(function() {
          $scope.content = '';
      });
  };

  $scope.makeOffer = function(){
      var offer = {
        total: $scope.total,
        uid: $scope.user.uid,
        name: $scope.user.profile.name,
        gravatar: $scope.user.profile.gravatar
      };

      Offer.makeOffer($scope.selectedTask.$id, offer).then(function(){
          toaster.pop('Success', 'Your offer has been successfully placed.')
          $scope.total = '';
          $scope.block = true;
          $scope.alreadyOffered = true;
      });
  };

  $scope.cancelOffer = function(offerId){
    Offer.cancelOffer($scope.selectedTask.$id, offerId).then(function(){
        toaster.pop('Success', 'Your offer is cancelled.');
        $scope.alreadyOffered = false;
        $scope.block = false;
    });
  };

  $scope.acceptOffer = function(offerId, runnerId){
      Offer.acceptOffer($scope.selectedTask.$id, offerId, runnerId).then(function(){
          toaster.pop('Success', 'Offer is accepted.')
      });
  };

  $scope.completeTask = function(taskId){
    Task.completeTask(taskId).then(function(){
        toaster.pop('Success', 'Your task is completed');
    });
  };

});

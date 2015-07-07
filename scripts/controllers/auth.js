app.controller('AuthController', function($scope, $location, Auth, toaster, FURL, $firebase){

  var ref = new Firebase(FURL);

  $scope.register = function(user){
    Auth.register(user).then(function(){
      toaster.pop('success', "Registered successfully");
      $location.path('/');
    }, function(err){
      toaster.pop('error', 'Oops..something went wrong!');
    });
  };

  $scope.login = function(user){
    Auth.login(user)
      .then(function(){
        toaster.pop('success', 'Logged in successfully!');
        $location.path('/');
      },
      function(err){
        toaster.pop('error', 'Oops..something went wrong!');
      });
  };

  $scope.changePassword = function(user){
    Auth.changePassword(user)
      .then(function(){
        $scope.user.email = '';
        $scope.user.oldPass = '';
        $scope.user.newPass = '';
        toaster.pop('success', 'Password changed successfully!');
      }, function(err){
        toaster.pop('error', 'Oops..something went wrong!');
      });
  };

  $scope.loginWithGoogle = function(){
    return ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        toaster.pop('error', 'Oops..something went wrong!');
      } else {
        toaster.pop('success', "Login successfull!");
        $location.path('/');
      }
    });
  };

  $scope.registerWithGoogle = function(){
    return ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        toaster.pop('error', 'Oops..something went wrong!');
      } else {
        var profile = {
          name: authData.google.displayName,
          gravatar: authData.google.profileImageURL
        };

        var profileRef = $firebase(ref.child('profile'));
        profileRef.$set(authData.uid, profile);
        toaster.pop('success', "Registered successfully");
        $location.path('/');
      }
    });
  };

});

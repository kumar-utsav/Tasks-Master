app.factory('Task', function(FURL, $firebase, Auth){

  var ref = new Firebase(FURL);
  var user = Auth.user;
  var tasks = $firebase(ref.child('tasks')).$asArray();

  var Task = {

    all: tasks,

    getTask: function(taskId){
      return $firebase(ref.child('tasks').child(taskId));
    },

    createTask: function(task){
      task.datetime = Firebase.ServerValue.TIMESTAMP;
      return tasks.$add(task);
    },

    editTask: function(task){
      var t = this.getTask(task.$id);
      return t.$update({title: task.title, desc: task.desc, amount: task.amount});
    },

    cancelTask: function(task){
      var t = this.getTask(task.$id);
      return t.$update({status: "cancelled"});
    },

    isCreator: function(task){
      return (user && user.provider && user.uid === task.poster);
    },

    isOpen: function(task){
      return task.status === "open";
    }

  };

  return Task;

});

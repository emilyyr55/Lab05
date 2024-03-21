var app = angular.module('bloggerApp', ['ngRoute', 'ui.router']);

//*** Router Provider ***
app.config( function($stateProvider) {
  $stateProvider
      .when('/', {
          templateUrl: 'pages/home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
          })

      .when('/blog-list', {
          templateUrl: 'pages/blog-list.html',
          controller : 'ListController',
          controllerAs: 'vm'
          })
      .when('/blog-add', {
	      templateUrl: 'pages/blog-add.html',
		  controller: 'AddController',
		  controllerAs: 'vm'
		  })
      .when('/blog-edit/:id', {
            templateUrl: 'pages/blog-edit.html',
            controller: 'EditController',
            controllerAs: 'vm'
            })  
      .when('/blog-delete/:id', {
            templateUrl: 'pages/blog-delete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    });


//*** Controllers ***
app.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "My Blog"
    };
    vm.message = "Welcome to my blog site!";
});

//*** REST Web API functions ***
function getAllBlogs($http) {
    return $http.get('/api/blogs');
}

function getBlogById($http, id) {
    return $http.get('/api/blogs/' + id);
}

function updateBlogById($http, id, data) {
    return $http.put('/api/blogs/' + id, data);
}

function createBlog($http, data) {
    return $http.post('/api/blogs', data);
}

function deleteBlog($http, id) {
    return $http.delete('/api/blogs/' + id);
}

//*** Controllers ***
app.controller('ListController', function ListController($http) {
    var vm = this;
    vm.pageHeader = {
        title: 'Blog List'
    };
    
    getAllBlogs($http)
    .then(function (response){
        vm.blogs = response.data;
        vm.message = "Blog data found!";
    },function (error){
        vm.message = "Could not get list of blogs";
    });
});



app.controller('EditController', [ '$http', '$routeParams', '$state', function EditController($http, $routeParams, $state) {
    var vm = this;
    console.log(vm);
    vm.blog = {};       // Start with a blank blog
    console.log($routeParams);
    vm.id = $routeParams.id;    // Get id from $routParams which must be injected and passed into controller
    vm.pageHeader = {
        title: 'Blog Edit'
    };
    
    // Get blog data so it may be displayed on edit page
    getBlogById($http, vm.id)
        .then(function (response){
            console.log(response.data);
            vm.blog = response.data;
        vm.message = "Blog data found!";
        },function (error){
            vm.message = "Could not get blog given id of " + vm.id;
        });
    
    // Submit function attached to ViewModel for use in form
    vm.submit = function() {
        var data = vm.blog;
        data.blogTitle = userForm.blogTitle.value;
        data.blogText = userForm.blogText.value;
               
        updateBlogById($http, vm.id, data)
          .then(function(response) {
            vm.message = "Blog data updated!";
            
            $state.go('blog-list');   // Refer to blog for info on StateProvder
            
          },function (error) {
            vm.message = "Could not update blog given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
          });
    }
}]);

app.controller('AddController', [ '$http', '$state', function EditController($http, $state) {
    var vm = this;
    vm.blog = {};       // Start with a blank blog
    vm.pageHeader = {
        title: 'Blog Add'
    };
    
    // Submit function attached to ViewModel for use in form
    vm.submit = function() {
        var data = vm.blog;
        data.blogTitle = userForm.blogTitle.value;
        data.blogText = userForm.blogText.value;
               
        createBlog($http, data)
          .then(function(response) {
            vm.message = "Blog data posted!";
            $state.go('blog-list', {}, {reload: true});   // Refer to blog for info on StateProvder
          },function (error) {
            vm.message = "Could not post blog" ;
          });
    }
}]);

app.controller('DeleteController', [ '$http', '$routeParams', '$state', function EditController($http, $routeParams, $state) {
    var vm = this;   
    console.log($routeParams);
    vm.id = $routeParams.id;    // Get id from $routParams which must be injected and passed into controller
    vm.pageHeader = {
        title: 'Delete Blog'
    };
    
    // Submit function attached to ViewModel for use in form
    vm.submit = function() {
               
        deleteBlog($http, vm.id)
          .then(function(response) {
            vm.message = "Blog data deleted!";
            $state.go('blog-list', {}, {reload: true});   // Refer to blog for info on StateProvder
          },function (error) {
            vm.message = "Blog was unable to be deleted";
          });
    }
}]);


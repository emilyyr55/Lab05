var request = require('request');
var apiOptions = {
  server : "http://localhost"  
}; 

const _showError = (req, res, status) => {
    let title = '';
    let content = '';
  
    if (status === 404) {
      title = '404, page not found';
      content = 'Oh dear, Looks like we can\'t find this page. Sorry';
    } else {
      title = `${status}, something's gone wrong`;
      content = 'Something, somewhere, has gone just a little bit wrong.';
    }
    res.status(status);
    res.render('generic-text', {
      title,
      content
    });
  };

/* GET 'Blog List' page */
module.exports.blogList = async function (req, res) {
  var requestOptions, path;
    path = '/api/blogs';
    requestOptions = { 
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {} 
        };
    request(
        requestOptions,
        function(err, response, body) {
            renderListPage(req, res, body);
        }
    );
}

/* Helper function to render the blog list page */
var renderListPage = function(req, res, responseBody){
  res.render('blog-list', {
      title: 'Blog List',
      blogs: responseBody
  });
}; 


/* GET 'Add review' page */
module.exports.addBlog = function(req, res){
    res.render('add-blog', { title : 'Add Blog',});
};

/* Book Add Post */
module.exports.saveAddBlog = function(req, res){
    var requestOptions, path, postdata;
    path = '/api/blogs/';

    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    }; 

    requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata
    };
    
    request(
      requestOptions,
      function(err, response, body) {
         if (response.statusCode === 201) {
              res.redirect('/blog');
         } else {
              _showError(req, res, response.statusCode);
         } 
      }
    ); 
};                      
  

module.exports.editBlog = function(req, res){
  var requestOptions, path;
  path = "/api/blogs/" + req.params.id;
  requestOptions = {
     url : apiOptions.server + path,
      method : "GET",
      json : {}
  }; 
  request(
      requestOptions,
      function(err, response, body) {
             renderShowPage(req, res, body);
	    }
  );
};

/* Render the blog show page */
var renderShowPage = function(req, res, responseBody){
  res.render('edit-blog', {
      title: 'Edit Blog',
      blog: responseBody
  });
}; 

/* Book Edit Post */
module.exports.saveEditBlog = function(req, res){
  var requestOptions, path, postdata;
  var id = req.params.id;
  path = '/api/blogs/' + id;

  postdata = {
      blogTitle: req.body.blogTitle,
      blogText: req.body.blogText
  };

  requestOptions = {
      url : apiOptions.server + path,
      method : "PUT",
      json : postdata
  };

  request(
requestOptions,
      function(err, response, body) {
          if (response.statusCode === 201) {
              res.redirect('/blog');
          } else {
              _showError(req, res, response.statusCode);
          }
      }
  );
};

/* Blog Delete */
module.exports.deleteBlog = function(req, res) {
    var requestOptions, path;
    path = "/api/blogs/" + req.params.id;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
	requestOptions,
        function(err, response, body) {
            renderDeletePage(req, res, body);
        }
    );
};

/* Render the blog delete page */
var renderDeletePage = function(req, res, responseBody){
        res.render('delete-blog', {
        title: 'Delete Blog',
        blog: responseBody
    });
};

/* Book Delete Post */
module.exports.saveDeleteBlog = function(req, res){
    var requestOptions, path, postdata;
    var id = req.params.id;
    path = '/api/blogs/' + id;

    requestOptions = {
	url : apiOptions.server + path,
        method : "DELETE",
        json : {}
    };

    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/blog');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};        
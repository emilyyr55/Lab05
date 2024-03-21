var express = require('express');
var router = express.Router();
var ctrlBlogs = require('../controllers/blog');
var ctrlOthers = require('../controllers/home');

/* Location pages */
router.get('/', ctrlOthers.home);
router.get('/blog', ctrlBlogs.blogList);
router.get('/blog-add', ctrlBlogs.addBlog);
router.post('/blog-add', ctrlBlogs.saveAddBlog);
router.get('/blog-edit/:id', ctrlBlogs.editBlog);
router.post('/blog-edit/:id', ctrlBlogs.saveEditBlog)
router.get('/blog-delete/:id', ctrlBlogs.deleteBlog);
router.post('/blog-delete/:id', ctrlBlogs.saveDeleteBlog)

module.exports = router;

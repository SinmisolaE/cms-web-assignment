const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const {hasPermission} = require('../middleware/permissionMiddleware');
const {verifyToken} = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/create', hasPermission('create_article'), articleController.createArticle);

router.get('/all', hasPermission('view_all_articles'), articleController.getAllArticles);

router.get('/my-articles', hasPermission('edit_article'), articleController.getMyArticles);

router.get('/articles', hasPermission('view_published_only'), articleController.getPublishedArticles);

router.get('/:id', articleController.getArticleById);

router.put('/:id', hasPermission('edit_article'), articleController.updateArticleTitleAndBody);

router.post('/status', hasPermission('publish_article'), articleController.publishAndUnpublishArticle);

router.delete('/:id', hasPermission('delete_article'), articleController.deleteArticle);

module.exports = router;
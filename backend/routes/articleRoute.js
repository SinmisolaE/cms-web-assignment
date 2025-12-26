const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');

router.post('/create', articleController.createArticle);

router.get('/all', articleController.getAllArticles);

router.get('/my-articles', articleController.getMyArticles);

router.get('/articles', articleController.getPublishedArticles);

router.put('/:id', articleController.updateArticleTitleAndBody);

router.post('/status', articleController.publishAndUnpublishArticle);

router.delete('/:id', articleController.deleteArticle);

module.exports = router;
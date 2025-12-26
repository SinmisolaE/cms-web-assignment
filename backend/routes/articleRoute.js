const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');

router.post('/create', articleController.createArticle);

router.get('/my-articles', articleController.getMyArticles);

router.get('/articles', articleController.getPublishedArticles);

router.put('/:id', articleController.updateArticleTitleAndBody);

router.put('/status:id', articleController.publishAndUnpublishArticle);

router.delete('/:id', articleController.deleteArticle);
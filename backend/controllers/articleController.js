const Article = require('../models/Article');
const User = require('../models/User');

// Create a new article
const createArticle = async (req, res) => {
    try {
        console.log(req.body);
        console.log(`User id ${req.user._id}`);
        const { title, body} = req.body;

        if (title === null || body === null 
            || title === "" || body === ""
        )
        {
            return res.status(400).json({
                success: false,
                error: "Provide required inputs"
            });
        }

        const article = new Article({
            title,
            body,
            author: req.user._id
        });

        await article.save();
        await article.populate('author', 'firstName lastName email');

        return res.status(201).json({
            success: true,
            message: "Article created successfully",
            article: {
                _id: article._id,
                title: article.title,
                body: article.body,
                author: {
                    _id: article.author._id,
                    firstName: article.author.firstName,
                    lastName: article.author.lastName,
                    email: article.author.email
                },
                isPublished: article.isPublished,
                createdAt: article.createdAt
            }
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Get all articles - both published and unpublished
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'firstName lastName email');

        return res.status(200).json({
            success: true,
            articles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Get all articles of a specific user
const getMyArticles = async (req, res) => {
    try {
        const author = req.user._id;
        const articles = await Article.find({ author });

        return res.status(200).json({
            success: true,
            articles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Get all published articles
const getPublishedArticles = async (req, res) => {
    try {
        const articles = await Article.find({ isPublished: true })
            .populate('author', 'firstName lastName email');

        return res.status(200).json({
            success: true,
            articles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Get article by ID
const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id).populate('author', 'firstName lastName email');

        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        return res.status(200).json({
            success: true,
            article
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Update an existing article
const updateArticleTitleAndBody = async (req, res) => {
    try {
        const {title, body} = req.body;
        const id = req.params.id;

        console.log(`Article id: ${id}`);

        const userId = req.user._id;

        console.log(`User id: ${userId}`);

        if (!id || ((!title) && !body)) {
            return res.status(400).json({
                success: false,
                error: 'Provide required credentials'
            });
        }

        // Find the article
        const userArticle = await Article.findById(id);
        if (!userArticle) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        // Ensure user is the author of the article
        if (userArticle.author.toString() !== userId.toString()) {
            return res.status(401).json({
                success: false,
                error: 'You can only edit your own article'
            });
        }

        const article = await Article.findByIdAndUpdate(id, {title, body});

        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Article updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

const publishAndUnpublishArticle = async (req, res) => {
    try {
        const {id, publish} = req.body;

        // Ensure inputs are passed
        if (id === null || publish === null || id === "") {
            return res.status(400).json({
                success: false,
                error: "Provide required input"
            });
        }

        const article = await Article.findById({_id: id});
        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found"
            });
        }

        // Publish or UnPublish article and set time if published
        article.isPublished = publish;
        if (article.isPublished) {
            article.publishedAt = Date.now();
        } else {
            article.publishedAt = null;
        }
        await article.save();
        await article.populate('author', 'firstName lastName email');

        return res.status(200).json({
            success: true,
            message: "Article published successfully",
            isPublished: article.isPublished,
            publishedAt: article.publishedAt
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occured - ${error}`
        });
    }
}

const deleteArticle = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user._id;

        if (id === null) {
            return res.status(400).json({
                success: false,
                error: 'Provide required credentials'
            });
        }

        // Get article
        const findArticle = await Article.findById(id);
        if (!findArticle) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        // users can only delete their articles
        if (findArticle.author.toString() !== userId.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Cannot delete this article'
            });
        }

        const article = await Article.findByIdAndDelete(findArticle._id);
        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

module.exports = {
    createArticle,
    getAllArticles,
    getMyArticles,
    getArticleById,
    getPublishedArticles,
    updateArticleTitleAndBody,
    publishAndUnpublishArticle,
    deleteArticle
}
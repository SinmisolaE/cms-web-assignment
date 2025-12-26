const Article = require('../models/Article');

// Create a new article
const createArticle = async (req, res) => {
    try {
        const {title, body} = req.body;

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

        return res.status(201).json({
            success: true,
            message: "Article created successfully",
            article: {
                id: article._id,
                title: article.title,
                author: article.author,
                createdAt: article.createdAt
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}


// Get all articles
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', ('firstName, lastName, email'));

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
        const articles = await Article.find({ isPublished: true });

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

// Update an existing article
const updateArticleTitleAndBody = async (req, res) => {
    try {
        const {title, body} = req.body;
        const id = req.params.id;

        const userId = req.user._id;

        if (id == null || ((title == null) && body == null)) {
            return res.status(400).json({
                success: false,
                error: 'Provide required credentials'
            });
        }

        const userArticle = await Article.findById(id);
        if (!userArticle) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        if (userArticle.article.toString() !== userId.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Cannot update this article'
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

        const article = await Article.findById({ id });
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

        return res.status(200).json({
            success: true,
            message: "Article published successfully"
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

        // Get article and compare author id
        const userArticle = await Article.findById(id);
        if (!userArticle) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        // users could only delete their articles
        if (userArticle.article.toString() !== userId.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Cannot delete this article'
            });
        }

        const article = await Article.findByIdAndDelete(id);
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
    getPublishedArticles,
    updateArticleTitleAndBody,
    publishAndUnpublishArticle,
    deleteArticle
}
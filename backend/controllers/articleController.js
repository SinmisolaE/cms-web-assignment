const Article = require('../models/Article');

// Create a new article
const createArticle = async (req, res) => {
    try {
        const {title, body, author} = req.body;

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
            author
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
        const articles = await Article.find();

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

        if (id == null || ((title == null) && body == null)) {
            return res.status(400).json({
                success: false,
                error: 'Provide required credentials'
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

const deleteArticle = async (req, res) => {
    try {
        const id = req.params.id;

        if (id === null) {
            return res.status(400).json({
                success: false,
                error: 'Provide required credentials'
            });
        }

        const article = await Article.findByIdAndDelete(id);
        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        if (article.author !== userId) {
            return res.status(401).json({
                success: false,
                error: 'You cannot delete this article'
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
    updateArticleTitleAndBody,
    deleteArticle
}
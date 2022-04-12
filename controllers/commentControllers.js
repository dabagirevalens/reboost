const Comment = require('../models/commentModel');
const Blog = require('../models/blogModel');

exports.newComment = async (req, res) => {
    try {

        const { message, blog } = req.body

        const comment = await Comment.create({
            message,
            blog,
            auth: req.user.id,
            name: req.user.name
        });


        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Unable to comment"
            })
        }


        //find blog and add comment to it
        const _blog = await Blog.findById(blog);

        let blogNumOfComments = _blog.numOfComments;
        blogNumOfComments++

        _blog.numOfComments = blogNumOfComments;

        await _blog.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            comment
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.deleteCommentAdmin = async (req, res) => {
    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "comment not found!"
            })
        }

        //is admin
        const isAdmin = req.user.role === 'owner';

        if (!isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Not allowed to access this content"
            })
        }

        await comment.remove();

        return res.status(200).json({
            success: true,
            message: 'You have successfully deleted comment.'
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "comment not found!"
            })
        }

        //delete the comment if the user is the auth
        if (comment.auth.toString() === req.user.id.toString()) {

            //find blog and remove comment to it
            const _blog = await Blog.findById(comment.blog);
            let blogNumOfComments = _blog.numberOfComments;
            blogNumOfComments--
            _blog.numberOfComments = blogNumOfComments;
            await _blog.save({ validateBeforeSave: false });

            //delete a comment
            await comment.remove();

            return res.status(200).json({
                success: true,
                message: 'You have successfully deleted your comment.'
            })

        } else {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete other\'s comments.'
            })
        }

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.updateComment = async (req, res) => {

    try {

        const { message } = req.body;

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "comment not found!"
            })
        }

        //check if current user is the auth of the comment
        if (comment.auth.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to edit other\'s comments.'
            })

        } else {
            if (message) {
                comment.message = message
            }

            await comment.save({ runValidators: true });

            return res.status(200).json({
                success: true,
                message: 'Comment was updated!',
                comment
            })
        }

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}


exports.getCommentsByBlog = async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId })
        if (!comments) {
            return res.status(404).json({
                success: false,
                message: "No comments found!"
            })
        }

        return res.status(200).json({
            success: true,
            numberOfComments: comments.length,
            comments
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
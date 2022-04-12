const Blog = require('../models/blogModel');
const cloudinary = require('../config/cloudinary')

exports.newBlog = async (req, res) => {
    try {

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "reboost/blogs",
            crop: "scale",
        });

        req.body.image = result.secure_url
        req.body.auth = req.user.id


        const blog = await Blog.create(req.body);

        if (!blog) {
            return res.status(400).json({
                success: false,
                message: "Unable to create new blog"
            })
        }

        return res.status(200).json({
            success: true,
            blog
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.singleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "blog not found!"
            })
        }
        return res.status(200).json({
            success: true,
            blog
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.allBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: "blogs not found!"
            })
        }
        return res.status(200).json({
            success: true,
            number: blogs.length,
            blogs
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteBlog = async (req, res) => {

    try {
        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "blog not found!"
            })
        }

        if (blog.auth.toString() === req.user.id.toString()) {
            //delete a comment
            await blog.remove();

            return res.status(200).json({
                success: true,
                message: 'You have successfully deleted blog.'
            })

        } else {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete other\'s comments.'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.updateBlog = async (req, res) => {

    try {

        const { content, title } = req.body;

        const blog = await Blog.findById(req.params.blogId);

        if (req.file.path !== "") {
            const image_id = blog.image;
            await cloudinary.uploader.destroy(image_id);

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "reboost/blogs",
                crop: "scale",
            });

            blog.image = result.secure_url
        }

        blog.title = title,
            blog.content = content;

        await blog.save({ validateBeforeSave: true });

        return res.status(200).json({
            success: true,
            message: 'blog was updated!',
            // blog
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}
